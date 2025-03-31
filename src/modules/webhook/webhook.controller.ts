import { Controller, Post, Request, Body, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('webhook')
export class WebhookController {
  private mondayApiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyOTM2NDAwNywiYWFpIjoxMSwidWlkIjoyMjc4MDczOCwiaWFkIjoiMjAyNC0wMy0wNlQxMTo0ODowMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2NzAyMSwicmduIjoidXNlMSJ9.LUVRzuV-inO6CRETAgBi1Pc9Df-OGJ45IqsaSB4uG_Y'; // Reemplaza con tu API Key
  private boardId = 8384546919;

  @Post('/builderall-embudo-maquillaje-peluqueria')
  async test(@Request() request, @Body() body) {
    console.log('Headers:', request.headers);
    console.log('Body:', body);
    const nameLead = request.body.fname;
    const phoneLeadfCleanner = request.body.phone;
    const emailLead = request.body.email;

    // Normalizar el número de teléfono
    const phoneLead = phoneLeadfCleanner.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito

    console.log({ nameLead, phoneLead, emailLead });

    // Llamar a Monday para crear un nuevo elemento
    const newItem = await this.createMondayItem(nameLead, phoneLead, emailLead);

    return {
      message: 'Webhook received and data sent to Monday',
      mondayResponse: newItem,
    };
  }

  @Get('test')
  async sendVerificationCode(@Body() test: any) {
    console.log(test);

    // Llamar a Monday para crear un nuevo elemento
    const newItem = await this.createMondayItem(
      test.name,
      test.phone,
      test.email,
    );

    return {
      message: 'Webhook received and data sent to Monday',
      mondayResponse: newItem,
    };
  }

  private async createMondayItem(name: string, phone: string, email: string) {
    console.log(name);
    console.log(phone);
    console.log(email);

    console.log(typeof name);
    console.log(typeof phone);
    console.log(typeof email);
    console.log('- - - - - - - -  - - ');
    const columnValues = JSON.stringify({
      telefono_mkmydsv5: phone,
      email_mkmtz198: email,
      estado_mkkddsry: { label: 'MAQ-PELUQ-EMBUDO' },
    });

    const query = `
      mutation {
        create_item (
          board_id: ${this.boardId}, 
          item_name: "${name}", 
          column_values: "${columnValues.replace(/"/g, '\\"')}"
        ) {
          id
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://api.monday.com/v2',
        { query },
        {
          headers: {
            Authorization: this.mondayApiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Monday API Response:', response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      console.error(
        'Error creating item in Monday:',
        error.response?.data || error.message,
      );
      return { error: error.message };
    }
  }
}
