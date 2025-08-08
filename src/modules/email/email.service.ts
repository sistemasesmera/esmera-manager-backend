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
                      © ${new Date().getFullYear()} Esmera School. Todos los derechos reservados. | Dirección física: Paseo Santa Maria De La Cabeza, 10 
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

  async sendLeadThankYouEmail(
    email: string,
    name: string,
    nameCourse?: string,
  ): Promise<void> {
    try {
      // Definir el asunto y el cuerpo del correo dependiendo de si el curso está especificado
      const subject = 'Gracias por tu interés en nuestros cursos';
      const body = nameCourse
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <!-- Logo y Encabezado -->
            <div style="text-align: center; padding: 20px;">
              <img src="https://www.esmeraschool.com/cdn/shop/files/4_1_88f724f6-e7d0-4b83-ad30-adc974fad44f.png?v=1706281740&width=195" alt="Esmera School Logo" style="width: 120px; margin-bottom: 10px;" />
              <h2 style="color: #006eae; font-size: 24px; margin-bottom: 5px;">Esmera School</h2>
              <p style="color: #379545; font-size: 18px; margin: 0;">Gracias por tu interés en nuestro curso</p>
            </div>

            <!-- Mensaje al estudiante -->
            <p style="font-size: 16px; color: #333;">Estimado/a ${name},</p>
            <p style="font-size: 16px; color: #333;">Gracias por tu interés en nuestro curso: ${nameCourse}.</p>
            <p style="font-size: 16px; color: #333;">Un Asesor Educativo se contactará contigo pronto para proporcionarte toda la información que necesitas y ayudarte a tomar la mejor decisión.</p>
            <p style="font-size: 16px; color: #333;">Si tienes alguna duda o inquietud, no dudes en ponerte en contacto con nosotros.</p>
            
            <!-- Botón de CTA -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://esmeraschool.com" style="text-decoration: none; color: white; background-color: #379545; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
                Ir a Esmera School
              </a>
            </div>

            <!-- Pie de página -->
            <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
              ¡Estamos emocionados de acompañarte en este camino de aprendizaje!
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} Esmera School. Todos los derechos reservados.
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <!-- Logo y Encabezado -->
            <div style="text-align: center; padding: 20px;">
              <img src="https://www.esmeraschool.com/cdn/shop/files/4_1_88f724f6-e7d0-4b83-ad30-adc974fad44f.png?v=1706281740&width=195" alt="Esmera School Logo" style="width: 120px; margin-bottom: 10px;" />
              <h2 style="color: #006eae; font-size: 24px; margin-bottom: 5px;">Esmera School</h2>
              <p style="color: #379545; font-size: 18px; margin: 0;">Gracias por tu interés en recibir más información</p>
            </div>

            <!-- Mensaje al estudiante -->
            <p style="font-size: 16px; color: #333;">Estimado/a ${name},</p>
            <p style="font-size: 16px; color: #333;">Gracias por tu interés en recibir más información sobre nuestros cursos.</p>
            <p style="font-size: 16px; color: #333;">Un Asesor Educativo se pondrá en contacto contigo pronto para proporcionarte toda la información que necesitas y ayudarte a elegir el curso adecuado.</p>
            <p style="font-size: 16px; color: #333;">Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.</p>

            <!-- Botón de CTA -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://esmeraschool.com" style="text-decoration: none; color: white; background-color: #379545; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
                Ir a Esmera School
              </a>
            </div>

            <!-- Pie de página -->
            <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
              ¡Estamos aquí para ayudarte a dar el siguiente paso en tu formación!
            </p>
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} Esmera School. Todos los derechos reservados.
            </p>
          </div>
        `;

      // Enviar el correo
      await sgMail.send({
        to: email,
        from: this.configService.get<string>('FROM_EMAIL'),
        subject,
        html: body,
      });

      console.log('Email enviado exitosamente a: ' + email);
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async sendNewLeadNotificationToAdmin(
    name: string,
    phone: string,
    email: string,
    nameCourse?: string,
  ): Promise<void> {
    try {
      // Definir el asunto del correo
      const subject = '¡Nuevo Lead Proveniente de la WEB!';

      // Cuerpo del correo para los administradores
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <!-- Logo y Encabezado -->
          <div style="text-align: center; padding: 20px;">
            <img src="https://www.esmeraschool.com/cdn/shop/files/4_1_88f724f6-e7d0-4b83-ad30-adc974fad44f.png?v=1706281740&width=195" alt="Esmera School Logo" style="width: 120px; margin-bottom: 10px;" />
            <h2 style="color: #006eae; font-size: 24px; margin-bottom: 5px;">Esmera School</h2>
            <p style="color: #379545; font-size: 18px; margin: 0;">Nuevo Lead desde la Web</p>
          </div>

          <!-- Detalles del lead -->
          <p style="font-size: 16px; color: #333;">¡Tenemos un nuevo lead!</p>
          <p style="font-size: 16px; color: #333;"><strong>Nombre:</strong> ${name}</p>
          <p style="font-size: 16px; color: #333;"><strong>Teléfono:</strong> ${phone}</p>
          <p style="font-size: 16px; color: #333;"><strong>Email:</strong> ${email ? email : 'Email no especificado'}</p>
          <p style="font-size: 16px; color: #333;"><strong>Curso:</strong> ${nameCourse || 'No especificado'}</p>

          <!-- Pie de página -->
          <p style="font-size: 16px; color: #333; text-align: center; margin-top: 30px;">
            Este es un aviso automático, por favor, proceda a contactar al lead.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 10px;">
            &copy; ${new Date().getFullYear()} Esmera School. Todos los derechos reservados.
          </p>
        </div>
      `;

      // Enviar el correo a los administradores
      const adminEmails = [
        'sistemas@esmeraschool.com',
        'admin@esmeraschool.com',
      ]; // Cambiar con las direcciones reales de los administradores
      for (const adminEmail of adminEmails) {
        await sgMail.send({
          to: adminEmail,
          from: this.configService.get<string>('FROM_EMAIL'),
          subject,
          html: body,
        });
      }

      console.log(
        'Email enviado exitosamente a los administradores: ' +
          adminEmails.join(', '),
      );
    } catch (error) {
      console.error('Error al enviar el email', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
