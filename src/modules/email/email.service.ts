// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

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
      console.log('Email enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
