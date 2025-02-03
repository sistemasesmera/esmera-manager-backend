import { Controller, Post, Request, Body } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post('/builderall-embudo-maquillaje-peluqueria')
  test(@Request() request, @Body() body) {
    console.log('Headers:', request.headers);
    console.log('Body:', body); // Aquí ves el contenido JSON enviado por Builderall
    console.log('Query Params:', request.query); // Si hay parámetros en la URL

    return { message: 'Webhook received', data: body };
  }
}
