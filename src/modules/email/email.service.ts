// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
interface CouponDetails {
  name: string;
  email: string;
  coupon: string;
  expirationDate: Date;
  discount: number;
  courseName: string;
}
@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = {
      to,
      from: this.configService.get<string>('FROM_EMAIL'),
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async sendVerificationCode(code: string, email: string): Promise<void> {
    try {
      await sgMail.send({
        to: email,
        from: this.configService.get<string>('FROM_EMAIL'),
        subject: 'Esmera School - Código de Verificación de Registro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <!-- Logo y Encabezado -->
            <div style="text-align: center; padding: 20px;">
              <img src="https://www.esmeraschool.com/cdn/shop/files/4_1_88f724f6-e7d0-4b83-ad30-adc974fad44f.png?v=1706281740&width=195" alt="Esmera School Logo" style="width: 120px; margin-bottom: 10px;" />
              <h2 style="color: #006eae; font-size: 24px; margin-bottom: 5px;">Esmera School</h2>
              <p style="color: #379545; font-size: 18px; margin: 0;">Código de Verificación de Registro</p>
            </div>
  
            <!-- Mensaje al estudiante -->
            <p style="font-size: 16px; color: #333;">Estimado(a) alumno,</p>
            <p style="font-size: 16px; color: #333;">Para continuar con tu registro en Esmera School, por favor proporciona el siguiente código de verificación a tu representante o comercial encargado del proceso de matriculaciòn:</p>
            
            <!-- Código de verificación -->
            <div style="text-align: center; padding: 20px;">
              <p style="font-size: 24px; font-weight: bold; color: #006eae; margin: 0;">${code}</p>
            </div>
  
            <!-- Advertencia -->
            <p style="font-size: 16px; color: #333;">Si no solicitaste este registro o crees que se trata de un error, puedes ignorar este correo.</p>
  
            <!-- Botón de CTA -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://esmeraschool.com" style="text-decoration: none; color: white; background-color: #379545; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
                Ir a Esmera School
              </a>
            </div>
  
            <!-- Pie de página -->
            <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
              ¡Gracias por ser parte de la comunidad de Esmera School!
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} Esmera School. Todos los derechos reservados.
            </p>
          </div>
        `,
      });
      console.log('Email enviado exitosamente a: ' + email);
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async sendCouponEmail(couponDetails: CouponDetails): Promise<void> {
    try {
      const couponImage =
        couponDetails.discount === 200
          ? 'https://i.ibb.co/j539fPg/cuponesmera200.png'
          : couponDetails.discount === 150
            ? 'https://i.ibb.co/XsqyJVb/cuponesmera150.png'
            : couponDetails.discount === 100
              ? 'https://i.ibb.co/bH2SLgy/cuponesmera100.png'
              : 'https://i.ibb.co/bH2SLgy/cuponesmera100.png';

      await sgMail.send({
        to: couponDetails.email,
        from: this.configService.get<string>('FROM_EMAIL'),
        subject: '🎉 ¡Tu cupón de descuento de Esmera School está aquí!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <!-- Header -->
            <h2 style="text-align: center; color: #333; margin-bottom: 20px;">🎉 ¡Has recibido tu cupón de descuento!</h2>
            
            <!-- Imagen del Cupón -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${couponImage}" 
                   alt="Cupón Esmera" 
                   style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);" />
            </div>
            
            <!-- Detalles del Cupón -->
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #dcdcdc;">
              <h3 style="color: #4A90E2; margin-bottom: 20px;">¡Tu cupón está listo para usar!</h3>
              <p style="font-size: 24px; font-weight: bold; color: #4A90E2; margin: 10px 0;">Código: ${couponDetails.coupon}</p>
              <p style="font-size: 16px; color: #888; margin: 5px 0;">Válido hasta: <span style="font-weight: bold; color: #333;">${new Date(
                couponDetails.expirationDate,
              ).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</span></p>
              <p style="font-size: 18px; color: #27AE60; font-weight: bold; margin: 10px 0;">Descuento: ${couponDetails.discount}€</p>
            </div>
            
            <!-- Mensaje adicional -->
            <p style="text-align: center; color: #555; font-size: 16px; margin-top: 20px;">
              Usa este cupón para obtener un <span style="font-weight: bold; color: #333;">descuento exclusivo</span> en el curso de <span style="font-weight: bold; color: #333;">${couponDetails.courseName}</span>.
            </p>
  
            <!-- Pie de página -->
            <p style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">
              Si tienes preguntas o necesitas más información, no dudes en contactarnos.
            </p>
            
            <footer style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">
              © ${new Date().getFullYear()} Esmera School. Todos los derechos reservados.
            </footer>
          </div>
        `,
      });

      console.log('Email enviado exitosamente a: ' + couponDetails.email);
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
