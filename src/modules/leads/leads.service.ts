import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { EmailService } from '../email/email.service';
import axios from 'axios';

@Injectable()
export class LeadsService {
  constructor(private readonly emailService: EmailService) {}

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

  async create(createLeadDto: CreateLeadDto) {
    await this.createInMonday(createLeadDto);
    this.sendEmails(createLeadDto);

    return 'This action adds a new lead';
  }

  private async sendEmails(dto: CreateLeadDto) {
    const { name, phone, email, nameCourse } = dto;

    const textoInterno = nameCourse
      ? `${name} ha mostrado interés en el curso ${nameCourse}.\nTel: ${phone}\nEmail: ${email || 'No proporcionado'}`
      : `${name} ha solicitado contacto o información general.\nTel: ${phone}\nEmail: ${email || 'No proporcionado'}`;

    // a) Correo para el lead (si dejó email)
    if (email) {
      await this.emailService.sendEmail(email, 'Gracias', 'Gracias subject');
    }

    // b) Correos internos
    const internos = ['sistemas@esmeraschool.com', 'lol@esmeraschool'];

    for (const to of internos) {
      await this.emailService.sendEmail(to, 'Nuevo LEAD', textoInterno);
    }
  }
}
