import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  HttpException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';
import { EmailService } from '../email/email.service';
import { OnlineSaleCourseService } from '../online-sale-course/online-sale-course.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly emailService: EmailService,
    private readonly onlineSaleCourseService: OnlineSaleCourseService,
  ) {}

  //crear checkout de pago
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
    body: {
      priceId: string; // id del price (sacado de stripe)
      name: string;
      lastname: string;
      email: string;
      phone: string;
      courseName: string; // Nombre del curso
      modality: string; // modalidad: Online - Presencial
      practiceMode: string; //con-practicas o sin-practicas
      ref_code?: string; //codigo de referido para asociar con comercial (o no)
    },
  ) {
    const {
      priceId,
      name,
      lastname,
      email,
      phone,
      modality,
      courseName,
      practiceMode,
      ref_code,
    } = body;

    const url = await this.paymentsService.createCheckoutSession({
      priceId,
      metadata: {
        name,
        lastname,
        phone,
        email,
        modality,
        courseName,
        practiceMode,
        ref_code,
      },
    });

    return { url };
  }

  //webhook de pagos  (configurado desde stripe... )
  @Post('webhook')
  @HttpCode(200) // Stripe espera 2xx
  async webhook(@Req() req: any) {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      // Convertir a Buffer si es necesario
      const rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.from(await (req.rawBody as any).arrayBuffer());

      event = this.paymentsService.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // En el caso que el backend no pueda procesar el Webhook entra a este bloque

      // Notificar a control de estudios si falla la verificación del webhook
      await this.emailService.sendWebhookErrorNotificationToControl(
        {
          priceId: req.body?.metadata?.priceId,
        },
        message,
      );

      throw new HttpException(`Webhook Error: ${message}`, 400);
    }

    //bloque donde procesa el pago.
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id; // si es objeto, toma su id

      try {
        // 1️⃣ Extraer datos de la sesión
        const metadata = session.metadata || {};

        const alumn = {
          name: metadata.name,
          lastname: metadata.lastname,
          email: metadata.email,
          phone: metadata.phone,
          courseName: metadata.courseName,
          modality: metadata.modality, //Online o Presencial
          practiceMode: metadata.practiceMode, // Con Practicas / Sin Prácticas
        };

        // 2️⃣ Guardar alumno y venta en la BD
        await this.onlineSaleCourseService.create({
          name: metadata.name,
          lastName: metadata.lastname,
          email: metadata.email,
          amount: session.amount_total / 100,
          nameCourse: metadata.courseName,
          phone: metadata.phone,
          practiceMode: metadata.practiceMode,
          modality: metadata.modality,
          paymentReference: paymentIntentId,
          ref_code: metadata.ref_code || null,
        });

        // 3️⃣ Enviar correo al alumno
        await this.emailService.sendPaymentConfirmationToStudent(alumn);

        // 4️⃣ Enviar correo a control de estudios
        await this.emailService.sendPaymentNotificationToAdmin({
          name: alumn.name,
          lastname: alumn.lastname,
          email: alumn.email,
          phone: alumn.phone,
          courseName: alumn.courseName,
          modality: alumn.modality,
          practiceMode: session?.metadata?.practiceMode,
          totalPaid: session?.amount_total / 100,
        });
      } catch (error) {
        console.error('Error procesando checkout.session.completed', error);

        // ⚠ Notificar a control de estudios si algo falla
        await this.emailService.sendPaymentErrorNotificationToAdmin(
          {
            name: session?.metadata?.name,
            lastname: session?.metadata?.lastname,
            email: session?.metadata?.email,
            phone: session?.metadata?.phone,
            courseName: session?.metadata?.courseName,
            modality: session?.metadata?.modality,
            practiceMode: session?.metadata?.practiceMode,
          },
          error.message,
        );
      }
    } else {
      console.warn(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
