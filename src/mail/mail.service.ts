import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationCodeEmail(to: string, code: string) {
    const html =
      '<p>Hola,</p>' +
      '<p>Alguien ha solicitado una nueva contraseña para la cuenta asociada a este correo.</p>' +
      '<p>No se ha hecho ningun cambio aún.</p>' +
      '<p>Si has sido tú, ingresa este código de verificación en la aplicación:</p>' +
      '<p>' +
      code +
      '</p>' +
      '<br><br><br>' +
      '<p>Este correo se encuentra desatendido.<p/>' +
      '<p>Saludos desde el equipo de seguridad de Qr.</p>';

    const { data, error } = await this.resend.emails.send({
      from: 'forget-password-qr-kitchen@socialsinergy.store',
      to: to,
      subject: 'Restauración de contraseña',
      html: html,
    });

    if (error) {
      throw new InternalServerErrorException({
        message: ['Error al enviar el correo electrónico.'],
        error: 'Internal Server Error',
        statusCode: 500
      });
    }

    return data;
  }
}
