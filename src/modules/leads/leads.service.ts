import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { EmailService } from '../email/email.service';
import axios from 'axios';
import { CreateLeadOnlineDto } from './dto/create-lead-online';

@Injectable()
export class LeadsService {
  constructor(private readonly emailService: EmailService) {}

  //Function para crear item en tablero principal
  async createInMonday(dto: CreateLeadDto) {
    const apiToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyOTM2NDAwNywiYWFpIjoxMSwidWlkIjoyMjc4MDczOCwiaWFkIjoiMjAyNC0wMy0wNlQxMTo0ODowMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2NzAyMSwicmduIjoidXNlMSJ9.LUVRzuV-inO6CRETAgBi1Pc9Df-OGJ45IqsaSB4uG_Y'; // Sustituir por tu token de Monday
    const boardId = '8092377643';

    const phoneLead = dto.phone.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito

    // Crear el objeto columnValues de manera condicional
    const columnValues: any = {
      tel_fono_mkkdc9jb: phoneLead,
      texto_mkmfr7kn: dto.nameCourse,
      estado_mkmeav8r: { label: dto.categoryCourse },
      estado_mkkdmfc5: { label: 'WEB' },
    };

    // Solo agregar el correo si está presente
    if (dto.email) {
      console.log(dto.email);
      columnValues.text_mkpygnws = dto.email;
    }

    // Convertir el objeto columnValues a JSON
    const columnValuesString = JSON.stringify(columnValues);

    const query = `
      mutation {
        create_item (
          board_id: ${boardId}, 
          item_name: "${dto.name}", 
          group_id: "grupo_nuevo_mkkda4fg",
          column_values: "${columnValuesString.replace(/"/g, '\\"')}"
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
            Authorization: apiToken,
          },
        },
      );
      console.log('Item creado en Monday:', response.data);
    } catch (error) {
      console.error(
        'Error al crear ítem en Monday:',
        error.response?.data || error.message,
      );
      throw new Error('No se pudo crear el ítem en Monday');
    }
  }

  //Function para crear item en tablero onlineF
  async createInMondayOnline(dto: CreateLeadOnlineDto) {
    const apiToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyOTM2NDAwNywiYWFpIjoxMSwidWlkIjoyMjc4MDczOCwiaWFkIjoiMjAyNC0wMy0wNlQxMTo0ODowMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2NzAyMSwicmduIjoidXNlMSJ9.LUVRzuV-inO6CRETAgBi1Pc9Df-OGJ45IqsaSB4uG_Y'; // Sustituir por tu token de Monday
    const boardIdCursosOnline = '18387297742';

    const phoneLead = dto.phone.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito

    const columnValues: any = {
      tel_fono_mkkdc9jb: phoneLead,
      texto_mkmfr7kn: dto.nameCourse,
      estado_mkmeav8r: { label: dto.categoryCourse },
      estado_mkkdmfc5: { label: 'WEB' },
    };
    // Solo agregar el correo si está presente
    if (dto.email) {
      console.log(dto.email);
      columnValues.text_mkpygnws = dto.email;
    }

    // Convertir el objeto columnValues a JSON
    const columnValuesString = JSON.stringify(columnValues);

    const query = `
  mutation {
    create_item (
      board_id: ${boardIdCursosOnline}, 
      item_name: "${dto.name}", 
      group_id: "grupo_nuevo_mkkda4fg",
      column_values: "${columnValuesString.replace(/"/g, '\\"')}"
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
            Authorization: apiToken,
          },
        },
      );
      console.log('Item creado en Monday:', response.data);
    } catch (error) {
      console.error(
        'Error al crear ítem en Monday:',
        error.response?.data || error.message,
      );
      throw new Error('No se pudo crear el ítem en Monday');
    }
  }

  async create(createLeadDto: CreateLeadDto) {
    await this.createInMonday(createLeadDto);
    this.sendEmails(createLeadDto);

    return {
      message: 'ok',
    };
  }
  async createOnline(createLeadDto: CreateLeadOnlineDto) {
    await this.createInMondayOnline(createLeadDto);
    this.sendEmails(createLeadDto);

    return {
      message: 'ok',
    };
  }

  private async sendEmails(dto: CreateLeadDto) {
    const { name, phone, email, nameCourse } = dto;

    // a) Correo para el lead (si dejó email)
    // if (email) {
    //   await this.emailService.sendLeadThankYouEmail(email, name, nameCourse);
    // }

    await this.emailService.sendNewLeadNotificationToAdmin(
      name,
      phone,
      email,
      nameCourse,
    );
  }

  async validateItem(itemId: string): Promise<{
    exists: boolean;
    item: any | null;
    boardId: string | null;
    statusColumnId: string | null;
  }> {
    // 1️⃣ Fetch the item and its board
    const itemQuery = `
      query {
        items(ids: ${itemId}) {
          id
          name
          board {
            id
            name
          }
          created_at
          updated_at
        }
      }
    `;

    try {
      const itemResponse = await axios.post(
        'https://api.monday.com/v2',
        { query: itemQuery },
        {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyOTM2NDAwNywiYWFpIjoxMSwidWlkIjoyMjc4MDczOCwiaWFkIjoiMjAyNC0wMy0wNlQxMTo0ODowMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2NzAyMSwicmduIjoidXNlMSJ9.LUVRzuV-inO6CRETAgBi1Pc9Df-OGJ45IqsaSB4uG_Y',
            'Content-Type': 'application/json',
          },
        },
      );

      const items = itemResponse.data?.data?.items || [];
      const item = items.length > 0 ? items[0] : null;

      if (!item) {
        return {
          exists: false,
          item: null,
          boardId: null,
          statusColumnId: null,
        };
      }

      const boardId = item.board?.id ?? null;

      // 2️⃣ Fetch board columns to get the "ESTADO" column id
      let statusColumnId: string | null = null;

      if (boardId) {
        const columnsQuery = `
          query {
            boards(ids: ${boardId}) {
              columns {
                id
                title
                type
              }
            }
          }
        `;

        const columnsResponse = await axios.post(
          'https://api.monday.com/v2',
          { query: columnsQuery },
          {
            headers: {
              Authorization:
                'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyOTM2NDAwNywiYWFpIjoxMSwidWlkIjoyMjc4MDczOCwiaWFkIjoiMjAyNC0wMy0wNlQxMTo0ODowMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTI2NzAyMSwicmduIjoidXNlMSJ9.LUVRzuV-inO6CRETAgBi1Pc9Df-OGJ45IqsaSB4uG_Y',
              'Content-Type': 'application/json',
            },
          },
        );

        const columns = columnsResponse.data?.data?.boards[0]?.columns || [];
        const statusColumn = columns.find((col: any) => col.title === 'ESTADO');
        statusColumnId = statusColumn?.id ?? null;
      }

      return {
        exists: true,
        item,
        boardId,
        statusColumnId,
      };
    } catch (error: any) {
      console.error(
        '⚠️ Error fetching from Monday:',
        error.response?.data || error.message,
      );
      return { exists: false, item: null, boardId: null, statusColumnId: null };
    }
  }
}
