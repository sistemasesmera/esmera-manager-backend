import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { EmailService } from '../email/email.service';
import axios from 'axios';
import { CreateLeadOnlineDto } from './dto/create-lead-online';
import { CreateLeadManualDto } from './dto/create-lead-manual.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { ChangeLeadStatusDto } from './dto/change-status.dto';
import { FilterLeadDto } from './dto/filter-lead.dto';
import { StatsLeadDto } from './dto/stats-lead.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { Lead } from './entities/lead.entity';
import { LeadCourseCategory, LeadSource, LeadStatus } from './entities/lead-enums';
import { Branch } from '../branch/entities/branch.entity';
import { User } from '../users/entities/user.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { AlumnService } from '../alumn/alumn.service';
import { UserRoles } from 'src/constants/Roles.enum';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class LeadsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly alumnService: AlumnService,
    private readonly auditLogService: AuditLogService,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Alumn)
    private readonly alumnRepository: Repository<Alumn>,
  ) {}

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
    await this.persistLead(createLeadDto, LeadSource.WEB);

    return {
      message: 'ok',
    };
  }

  async createOnline(createLeadDto: CreateLeadOnlineDto) {
    await this.createInMondayOnline(createLeadDto);
    this.sendEmails(createLeadDto);
    await this.persistLead(createLeadDto, LeadSource.WEB_ONLINE);

    return {
      message: 'ok',
    };
  }

  // Guarda el lead en nuestra BD para alimentar el CRM. No debe romper el flujo
  // web -> Monday + email si algo falla aquí.
  private async persistLead(
    dto: CreateLeadDto | CreateLeadOnlineDto,
    source: LeadSource,
  ) {
    try {
      const lead = this.leadRepository.create({
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        nameCourse: dto.nameCourse,
        categoryCourse: dto.categoryCourse as LeadCourseCategory,
        source,
        status: LeadStatus.NUEVO,
      });
      await this.leadRepository.save(lead);
    } catch (error) {
      console.error('Error al guardar el lead en la base de datos:', error);
    }
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

  // Crea un lead manualmente desde el CRM (comercial/admin)
  async createManual(dto: CreateLeadManualDto, user: AuthenticatedUser) {
    let assignedTo: User | undefined;
    let branch: Branch | undefined;

    if (dto.assignedToId) {
      assignedTo = await this.userRepository.findOne({
        where: { id: dto.assignedToId },
      });
      if (!assignedTo) {
        throw new NotFoundException('Comercial no encontrado');
      }
    }

    if (dto.branchId) {
      branch = await this.branchRepository.findOne({
        where: { id: dto.branchId },
      });
      if (!branch) {
        throw new NotFoundException('Sede no encontrada');
      }
    } else if (assignedTo?.branch) {
      branch = assignedTo.branch;
    }

    const lead = this.leadRepository.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      nameCourse: dto.nameCourse,
      categoryCourse: dto.categoryCourse,
      notes: dto.notes,
      source: LeadSource.MANUAL,
      status: LeadStatus.NUEVO,
      branch,
      assignedTo,
      assignedAt: assignedTo ? new Date() : undefined,
    });

    const savedLead = await this.leadRepository.save(lead);

    void this.auditLogService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LEAD_CREADO',
      entityType: 'Lead',
      entityId: savedLead.id,
      details: { name: savedLead.name, phone: savedLead.phone, source: savedLead.source },
    });

    return savedLead;
  }

  // Listado de leads con filtros y scoping por rol
  async findAll(filter: FilterLeadDto, user: AuthenticatedUser) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      branchId,
      assignedToId,
      source,
      unassigned,
    } = filter;

    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.branch', 'branch')
      .leftJoinAndSelect('lead.assignedTo', 'assignedTo')
      .leftJoinAndSelect('lead.convertedAlumn', 'convertedAlumn');

    if (user.role === UserRoles.COMMERCIAL) {
      // Un comercial solo ve los leads que tiene asignados
      queryBuilder.andWhere('lead.assigned_to_id = :userId', {
        userId: user.id,
      });
    } else {
      if (assignedToId) {
        queryBuilder.andWhere('lead.assigned_to_id = :assignedToId', {
          assignedToId,
        });
      }
      if (unassigned) {
        queryBuilder.andWhere('lead.assigned_to_id IS NULL');
      }
      if (branchId) {
        queryBuilder.andWhere('lead.branch_id = :branchId', { branchId });
      }
    }

    if (search) {
      queryBuilder.andWhere(
        '(lead.name ILIKE :search OR lead.phone ILIKE :search OR lead.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('lead.status = :status', { status });
    }

    if (source) {
      queryBuilder.andWhere('lead.source = :source', { source });
    }

    queryBuilder.orderBy('lead.createdAt', 'DESC');

    const [result, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      count: total,
      page,
      limit,
      data: result,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Estadísticas del pipeline para el dashboard CRM (mismo scoping por rol que findAll)
  async getStats(filter: StatsLeadDto, user: AuthenticatedUser) {
    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .select(['lead.id', 'lead.status', 'lead.source', 'lead.createdAt']);

    if (user.role === UserRoles.COMMERCIAL) {
      queryBuilder.andWhere('lead.assigned_to_id = :userId', {
        userId: user.id,
      });
    } else {
      if (filter.assignedToId) {
        queryBuilder.andWhere('lead.assigned_to_id = :assignedToId', {
          assignedToId: filter.assignedToId,
        });
      }
      if (filter.branchId) {
        queryBuilder.andWhere('lead.branch_id = :branchId', {
          branchId: filter.branchId,
        });
      }
    }

    const leads = await queryBuilder.getMany();

    const byStatus = Object.values(LeadStatus).reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<LeadStatus, number>,
    );
    const bySource = Object.values(LeadSource).reduce(
      (acc, source) => ({ ...acc, [source]: 0 }),
      {} as Record<LeadSource, number>,
    );

    const now = new Date();
    let newThisMonth = 0;

    for (const lead of leads) {
      byStatus[lead.status]++;
      bySource[lead.source]++;
      if (
        lead.createdAt.getMonth() === now.getMonth() &&
        lead.createdAt.getFullYear() === now.getFullYear()
      ) {
        newThisMonth++;
      }
    }

    const total = leads.length;
    const conversionRate =
      total > 0 ? (byStatus[LeadStatus.MATRICULADO] / total) * 100 : 0;

    return { total, byStatus, bySource, conversionRate, newThisMonth };
  }

  async findOne(id: string) {
    const lead = await this.leadRepository.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead con ID ${id} no encontrado`);
    }
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, user: AuthenticatedUser) {
    const lead = await this.findOne(id);

    if (dto.branchId !== undefined) {
      const branch = await this.branchRepository.findOne({
        where: { id: dto.branchId },
      });
      if (!branch) {
        throw new NotFoundException('Sede no encontrada');
      }
      lead.branch = branch;
    }

    const { branchId, ...rest } = dto;
    Object.assign(lead, rest);

    const saved = await this.leadRepository.save(lead);

    void this.auditLogService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LEAD_NOTAS_ACTUALIZADAS',
      entityType: 'Lead',
      entityId: lead.id,
      details: { leadName: lead.name },
    });

    return saved;
  }

  // Asigna un lead a un comercial (ADMIN / COMMERCIAL_PLUS)
  async assign(id: string, dto: AssignLeadDto, user: AuthenticatedUser) {
    const lead = await this.findOne(id);

    const assignedTo = await this.userRepository.findOne({
      where: { id: dto.assignedToId },
    });
    if (!assignedTo) {
      throw new NotFoundException('Comercial no encontrado');
    }

    lead.assignedTo = assignedTo;
    lead.assignedAt = new Date();

    if (!lead.branch && assignedTo.branch) {
      lead.branch = assignedTo.branch;
    }

    const saved = await this.leadRepository.save(lead);

    void this.auditLogService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LEAD_ASIGNADO',
      entityType: 'Lead',
      entityId: lead.id,
      details: {
        leadName: lead.name,
        assignedToId: dto.assignedToId,
        assignedToEmail: assignedTo.email,
      },
    });

    return saved;
  }

  // Cambia el estado del lead en el pipeline
  async changeStatus(id: string, dto: ChangeLeadStatusDto, user: AuthenticatedUser) {
    const lead = await this.findOne(id);
    const fromStatus = lead.status;

    if (dto.status === LeadStatus.DESCARTADO && !dto.discardReason) {
      throw new BadRequestException(
        'Debes indicar un motivo de descarte para pasar el lead a Descartado',
      );
    }

    if (
      dto.status === LeadStatus.CONTACTADO &&
      !lead.contactedAt &&
      lead.status !== LeadStatus.CONTACTADO
    ) {
      lead.contactedAt = new Date();
    }

    lead.status = dto.status;

    if (dto.status === LeadStatus.DESCARTADO) {
      lead.discardReason = dto.discardReason;
      lead.discardReasonOther = dto.discardReasonOther;
    } else {
      lead.discardReason = null;
      lead.discardReasonOther = null;
    }

    const saved = await this.leadRepository.save(lead);

    void this.auditLogService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LEAD_ESTADO_CAMBIADO',
      entityType: 'Lead',
      entityId: lead.id,
      details: { leadName: lead.name, fromStatus, toStatus: dto.status },
    });

    return saved;
  }

  // Convierte un lead en Alumno (ADMIN / COMMERCIAL_PLUS / COMMERCIAL)
  async convert(id: string, dto: ConvertLeadDto, user: AuthenticatedUser) {
    const lead = await this.findOne(id);

    let alumn: Alumn;
    try {
      alumn = await this.alumnService.create(dto);
    } catch (error) {
      if (error instanceof ConflictException) {
        // Ya existe un alumno con ese documento: lo reutilizamos en vez de bloquear la conversión
        alumn = await this.alumnRepository.findOne({
          where: { documentNumber: dto.documentNumber },
        });
        if (!alumn) {
          throw error;
        }
      } else {
        throw error;
      }
    }

    lead.convertedAlumn = alumn;
    lead.status = LeadStatus.MATRICULADO;
    await this.leadRepository.save(lead);

    void this.auditLogService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'LEAD_CONVERTIDO_A_ALUMNO',
      entityType: 'Lead',
      entityId: lead.id,
      details: { leadName: lead.name, alumnId: alumn.id },
    });

    return { lead, alumn };
  }
}
