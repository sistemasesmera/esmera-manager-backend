import { Controller, Post, Request, Body } from '@nestjs/common';
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
    const phoneLead = request.body.phone;
    const emailLead = request.body.email;
    const campaignLead = request.body.list_name;

    console.log({ nameLead, phoneLead, emailLead, campaignLead });

    // Llamar a Monday para crear un nuevo elemento
    const newItem = await this.createMondayItem(
      nameLead,
      phoneLead,
      emailLead,
      campaignLead,
    );

    return {
      message: 'Webhook received and data sent to Monday',
      mondayResponse: newItem,
    };
  }

  private async createMondayItem(
    name: string,
    phone: string,
    email: string,
    campaign: string,
  ) {
    const query = `
      mutation {
        create_item (
          board_id: ${this.boardId}, 
          item_name: "${name}", 
          column_values: "{ 
            \\"phone\\": \\"${phone}\\",
            \\"email\\": \\"${email}\\",
            \\"campaign\\": \\"${campaign}\\"
          }"
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
      console.error(
        'Error creating item in Monday:',
        error.response?.data || error.message,
      );
      return { error: error.message };
    }
  }
}
