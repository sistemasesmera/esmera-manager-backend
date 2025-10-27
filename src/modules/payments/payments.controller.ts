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

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly emailService: EmailService,
  ) {}

  //crear checkout de pago
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
    body: {
      priceId: string;
      name: string;
      lastname: string;
      email: string;
      phone: string;
      modality: string;
      courseName: string;
    },
  ) {
    const { priceId, name, lastname, email, phone, modality, courseName } =
      body;

    const url = await this.paymentsService.createCheckoutSession({
      priceId,
      metadata: {
        name,
        lastname,
        phone,
        email,
        modality,
        courseName,
      },
    });

    return { url };
  }

  //webhook de pagos  @Post('webhook')
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
      console.error('Webhook Error:', message);

      // ⚠️ Notificar a control de estudios si falla la verificación del webhook
      await this.emailService.sendWebhookErrorNotificationToControl(
        {
          name: req.body?.metadata?.name,
          lastname: req.body?.metadata?.lastname,
          email: req.body?.metadata?.email,
          phone: req.body?.metadata?.phone,
          courseName: req.body?.metadata?.courseName,
          modality: req.body?.metadata?.modality,
          priceId: req.body?.metadata?.priceId,
        },
        message,
      );

      throw new HttpException(`Webhook Error: ${message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // 1️⃣ Extraer datos de la sesión
        const metadata = session.metadata || {};
        const alumn = {
          name: metadata.name,
          lastname: metadata.lastname,
          email: metadata.email,
          phone: metadata.phone,
          courseName: metadata.courseName,
          modality: metadata.modality,
        };

        // 2️⃣ Guardar alumno en la BD

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
