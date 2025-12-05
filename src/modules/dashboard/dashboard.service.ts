import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateCommonGoalDto } from './dto/update-common.goal.dto';
import { GoalsService } from '../goals/goals.service';
import { OnlineSaleCourseService } from '../online-sale-course/online-sale-course.service';

@Injectable()
export class DashboardService {
  private readonly commonGoalPath = path.join(
    __dirname,
    '..',
    '..',
    'assets',
    'commonGoal.json',
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly contractsService: ContractsService,
    private readonly goalsService: GoalsService,
    private readonly onlineSaleCourseService: OnlineSaleCourseService,
  ) {}

  // Leer el archivo JSON y devolver el objetivo común
  private getCommonGoal(): {
    commonGoalAmount: number;
    commonGoalContracts: number;
  } {
    try {
      const data = fs.readFileSync(this.commonGoalPath, 'utf-8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.error('Error al leer el archivo commonGoal.json', error);
      return {
        commonGoalAmount: 0,
        commonGoalContracts: 0,
      }; // Valor por defecto si ocurre un error
    }
  }

  // Actualizar el objetivo común en el archivo JSON
  private setCommonGoal(commonGoal: UpdateCommonGoalDto): void {
    const data = {
      commonGoalAmount: commonGoal.commonGoalAmount,
      commonGoalContracts: commonGoal.commonGoalContracts,
    };
    try {
      fs.writeFileSync(
        this.commonGoalPath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Error al escribir en el archivo commonGoal.json', error);
    }
  }

  // Método para obtener las métricas del dashboard
  async findAll() {
    const today = new Date();

    // Obtener el objetivo común
    const commonGoal = this.getCommonGoal();

    // Obtener los comerciales activos
    const users = await this.usersService.getUsersActiveForMonth();

    // Obtener todos los contratos del mes actual
    const contracts = await this.contractsService.getContractsForCurrentMonth();

    // Agrupar contratos por comercial
    const groupedContracts = contracts.reduce((acc, contract) => {
      const userId = contract.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          nameComercial: contract.user.firstName + ' ' + contract.user.lastName,
          numberContracts: 0,
          amountTotal: 0,
          branch: contract.user.branch,
        };
      }
      acc[userId].numberContracts += 1;
      acc[userId].amountTotal += contract.coursePrice;
      return acc;
    }, {});

    // Calcular el total de ventas
    let totalAmountSold = 0;

    // Calcular el total de contratos
    let totalContractsSold = 0;

    const numberOfUsers = users.length; // Número de comerciales activos
    const commonGoalPersonalAmount = Math.round(
      commonGoal.commonGoalAmount / numberOfUsers,
    ); // Objetivo personal de monto por comercial

    const commonGoalPersonalContracts = Math.round(
      commonGoal.commonGoalContracts / numberOfUsers,
    ); // Objetivo personal de contratos por comercial

    // Calcular las métricas para cada comercial
    const metrics = users.map((user) => {
      const userContracts = groupedContracts[user.id] || {
        nameComercial: user.firstName + ' ' + user.lastName,
        numberContracts: 0,
        amountTotal: 0,
        branch: user.branch,
      };

      totalAmountSold += userContracts.amountTotal; // Sumamos al total general de ventas

      totalContractsSold += userContracts.numberContracts; // Sumamos al total general de contratos

      // Calcular el objetivo restante de montos para este comercial
      const commonGoalRemainingAmount = Math.max(
        0,
        commonGoalPersonalAmount - userContracts.amountTotal,
      );

      // Calcular el objetivo restante de contratos para este comercial
      const commonGoalRemainingContracts = Math.max(
        0,
        commonGoalPersonalContracts - userContracts.numberContracts,
      );

      console.log(`${user.firstName} + ${user.branch.name}`);
      return {
        nameComercial: userContracts.nameComercial,
        numberContracts: userContracts.numberContracts,
        amountTotal: userContracts.amountTotal,
        branch: userContracts.branch,
        commonGoalPersonalAmount, // Objetivo personal de montos para cada comercial
        commonGoalRemainingAmount, // Objetivo restante de montos para cada comercial
        commonGoalPersonalContracts, // Objetivo personal de contratos para cada comercial
        commonGoalRemainingContracts, // Objetivo restante de contratos para cada comercial
      };
    });

    // Ordenar las métricas por amountTotal de mayor a menor
    metrics.sort((a, b) => b.amountTotal - a.amountTotal);

    // Calcular el monto total de ventas para todos los comerciales
    const commonGoalRemainingAmountTotal = Math.max(
      0,
      commonGoal.commonGoalAmount - totalAmountSold,
    );

    // Calcular el monto total restante de contratos de comerciales
    const commonGoalRemainingContractsTotal = Math.max(
      0,
      commonGoal.commonGoalContracts - totalContractsSold,
    );

    // Devolver la respuesta con las métricas, el total de ventas y el objetivo común
    return {
      today: today.toISOString().split('T')[0],
      metrics,
      totalAmountSold,
      commonGoalAmount: commonGoal.commonGoalAmount, // Objetivo común de montos
      commonGoalRemainingAmountTotal, // Objetivo restante total de montos
      commonGoalContracts: commonGoal.commonGoalContracts, // Objetivo común de contratos
      commonGoalRemainingContractsTotal, // Objetivo restante total de contratos
    };
  }

  async getDashboardData() {
    const today = new Date();

    // Comerciales activos
    const users = await this.usersService.getUsersActiveForMonth();

    // Contratos del mes actual
    const contracts = await this.contractsService.getContractsForCurrentMonth();

    // Ventas Online
    const salesOnline =
      await this.onlineSaleCourseService.getOnlineSalesForCurrentMonth();

    // Agrupar contratos por comercial
    const groupedContracts = contracts.reduce((acc, contract) => {
      const userId = contract.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          nameComercial: `${contract.user.firstName} ${contract.user.lastName}`,
          numberContracts: 0,
          amountTotal: 0,
          branch: contract.user.branch,
        };
      }
      acc[userId].numberContracts += 1;
      acc[userId].amountTotal += contract.coursePrice;
      return acc;
    }, {});

    // Crear métricas por comercial
    const metrics = users.map((user) => {
      const userContracts = groupedContracts[user.id] || {
        nameComercial: `${user.firstName} ${user.lastName}`,
        numberContracts: 0,
        amountTotal: 0,
        branch: user.branch,
      };

      return {
        nameComercial: userContracts.nameComercial,
        numberContracts: userContracts.numberContracts,
        amountTotal: userContracts.amountTotal,
        branch: userContracts.branch,
      };
    });

    // Dividir por sede
    let metricsMadrid = metrics.filter((m) => m.branch?.name === 'Madrid');
    let metricsLogroño = metrics.filter((m) => m.branch?.name === 'La Rioja');

    // Ordenar: primero el que más vende
    metricsMadrid = metricsMadrid.sort((a, b) => b.amountTotal - a.amountTotal);
    metricsLogroño = metricsLogroño.sort(
      (a, b) => b.amountTotal - a.amountTotal,
    );

    // Totales por sede
    const totalMadrid = metricsMadrid.reduce(
      (acc, m) => ({
        totalAmount: acc.totalAmount + m.amountTotal,
        totalContracts: acc.totalContracts + m.numberContracts,
      }),
      { totalAmount: 0, totalContracts: 0 },
    );

    const totalLogroño = metricsLogroño.reduce(
      (acc, m) => ({
        totalAmount: acc.totalAmount + m.amountTotal,
        totalContracts: acc.totalContracts + m.numberContracts,
      }),
      { totalAmount: 0, totalContracts: 0 },
    );

    // Total general
    const totalGeneral = {
      totalAmount: totalMadrid.totalAmount + totalLogroño.totalAmount,
      totalContracts: totalMadrid.totalContracts + totalLogroño.totalContracts,
    };
    // ---------------------------
    // AGRUPAR VENTAS ONLINE POR COMMERCIAL_ID (usar commercial_id de la tabla)
    // ---------------------------
    // groupedOnline: key = commercial_id (string) OR 'null' for no commercial
    const groupedOnline: Record<
      string,
      {
        nameComercial: string | null;
        numberContracts: number;
        amountTotal: number;
        branch?: any;
      }
    > = {};

    for (const s of salesOnline) {
      // usa commercial_id directamente (asegúrate que tu repo trae commercial_id)
      const commercialIdRaw =
        (s as any).commercial_id ?? (s as any).commercial?.id ?? null;
      const key =
        commercialIdRaw !== null && commercialIdRaw !== undefined
          ? String(commercialIdRaw)
          : 'null';

      if (!groupedOnline[key]) {
        // si la venta trae relación commercial, intenta sacar nombre, si no lo dejarás null y lo resolveremos al unir con users
        const commercialRel = (s as any).commercial;
        groupedOnline[key] = {
          nameComercial:
            key === 'null'
              ? null
              : commercialRel
                ? `${commercialRel.firstName ?? ''} ${commercialRel.lastName ?? ''}`.trim() ||
                  (commercialRel.username ?? null)
                : null,
          numberContracts: 0,
          amountTotal: 0,
          branch: commercialRel?.branch ?? undefined,
        };
      }

      groupedOnline[key].numberContracts += 1;
      groupedOnline[key].amountTotal += Number((s as any).amount ?? 0);
    }

    // Convertir groupedOnline a array (guardando keyStr)
    const onlineMetricsFromSales = Object.entries(groupedOnline).map(
      ([key, val]) => ({
        keyStr: key, // 'null' o id as string
        commercialId: key === 'null' ? null : Number(key),
        nameComercial: val.nameComercial,
        numberContracts: val.numberContracts,
        amountTotal: val.amountTotal,
        branch: val.branch,
      }),
    );

    // Map<string, any> con claves string normalizadas
    const onlineMetricsMap = new Map<string, any>();
    for (const row of onlineMetricsFromSales) {
      onlineMetricsMap.set(row.keyStr, row);
    }

    // Resultado final agrupado
    const onlineMetrics: {
      nameComercial: string | null;
      numberContracts: number;
      amountTotal: number;
      branch?: any;
    }[] = [];

    // 1) Añadir siempre 'Sin Comercial' como primer elemento (con 0s)
    onlineMetrics.push({
      nameComercial: null, // frontend deberá mostrar "Sin Comercial"
      numberContracts: onlineMetricsMap.get('null')?.numberContracts ?? 0,
      amountTotal: onlineMetricsMap.get('null')?.amountTotal ?? 0,
      branch: null,
    });
    // Si existía la entrada 'null' en el map, la borramos porque ya la incorporamos
    if (onlineMetricsMap.has('null')) onlineMetricsMap.delete('null');

    // 2) Añadir comerciales activos (users) — usar id comparando con commercial_id
    for (const user of users) {
      const key = String(user.id);
      const existing = onlineMetricsMap.get(key);

      if (existing) {
        onlineMetrics.push({
          nameComercial:
            existing.nameComercial ?? `${user.firstName} ${user.lastName}`,
          numberContracts: existing.numberContracts,
          amountTotal: existing.amountTotal,
          branch: existing.branch ?? user.branch,
        });
        onlineMetricsMap.delete(key);
      } else {
        // comercial activo sin ventas online
        onlineMetrics.push({
          nameComercial: `${user.firstName} ${user.lastName}`,
          numberContracts: 0,
          amountTotal: 0,
          branch: user.branch,
        });
      }
    }

    // 3) Añadir comerciales no activos que igual vendieron (quedan en onlineMetricsMap)
    for (const [k, v] of onlineMetricsMap.entries()) {
      // k es string de id (no 'null', ya borrada)
      onlineMetrics.push({
        nameComercial: v.nameComercial ?? `Comercial ${k}`,
        numberContracts: v.numberContracts,
        amountTotal: v.amountTotal,
        branch: v.branch,
      });
    }

    // 4) Ordenar: mantenemos la primera fila ("Sin Comercial") fija, ordenamos el resto por amount desc
    const sinComercial = onlineMetrics.length > 0 ? onlineMetrics[0] : null;
    const rest = onlineMetrics.slice(1);
    rest.sort((a, b) => b.amountTotal - a.amountTotal);
    const finalOnlineMetrics = sinComercial ? [sinComercial, ...rest] : rest;

    // Totales online
    const onlineTotal = salesOnline.reduce(
      (s, x) => s + Number((x as any).amount ?? 0),
      0,
    );
    const onlineCount = salesOnline.length;

    // Respuesta final organizada
    return {
      today: today.toISOString().split('T')[0],
      ventas: {
        general: totalGeneral,
        madrid: { ...totalMadrid, metrics: metricsMadrid },
        logroño: { ...totalLogroño, metrics: metricsLogroño },
        online: {
          data: salesOnline, // raw list (si quieres quitarla puedes eliminarla)
          total: onlineTotal,
          count: onlineCount,
          metrics: finalOnlineMetrics.map((m) => ({
            nameComercial: m.nameComercial,
            amountTotal: m.amountTotal,
            numberContracts: m.numberContracts,
            branch: m.branch,
          })),
        },
      },
    };
  }

  // Método para actualizar el objetivo común
  async updateCommonGoal(newGoal: UpdateCommonGoalDto) {
    this.setCommonGoal(newGoal);
    return { message: 'Objetivo común actualizado correctamente' };
  }

  // Metodos nuevos.
  async getDataDashboard() {
    const today = new Date();
    const yearMonth =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1).toString().padStart(2, '0');

    // Obtener los datos de las metas del mes
    const monthGoalsData = await this.goalsService.getGoal(yearMonth);

    // Inicializar holidays como array vacío si es null
    const holidays = monthGoalsData.holidays || [];

    // Verificar si el día actual es un día festivo
    const todayFormatted = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    if (holidays.includes(todayFormatted)) {
      throw new BadRequestException(
        `${todayFormatted}. Es un día no laborable, por lo tanto no hay datos disponibles.`,
      );
    }

    // Obtener los comerciales activos
    const users = await this.usersService.getUsersActiveForMonth();

    // Obtener todos los contratos del mes actual
    const contracts = await this.contractsService.getContractsForCurrentMonth();

    // Filtrar los contratos realizados hoy
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0); // Establecer a las 00:00:00

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999); // Establecer a las 23:59:59

    // Filtramos los contratos del día actual utilizando el rango
    const todayContracts = contracts.filter((contract) => {
      const contractDate = new Date(contract.createdAt); // Asegúrate de que `createdAt` sea una fecha válida
      return contractDate >= todayStart && contractDate <= todayEnd;
    });

    // Agrupar contratos por comercial
    const groupedContracts = contracts.reduce((acc, contract) => {
      const userId = contract.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          nameComercial: contract.user.firstName + ' ' + contract.user.lastName,
          numberContracts: 0,
          amountTotal: 0,
        };
      }
      acc[userId].numberContracts += 1;
      acc[userId].amountTotal += contract.coursePrice;
      return acc;
    }, {});

    // Calcular totales
    let totalMonthAmountSold = 0;
    let totalMonthContractsSold = 0;

    // Calcular el número de comerciales
    const numberOfCommercials = users.length;

    // Calcular el objetivo mensual para cada comercial y redondear a entero
    const sharedMonthlyGoal = Math.floor(
      monthGoalsData.common_goal / numberOfCommercials,
    );

    // Calcular el objetivo de contratos mensual para cada comercial y redondear a entero
    const sharedContractsGoal = Math.floor(
      monthGoalsData.contracts_goal / numberOfCommercials,
    );

    // Variables para totales diarios
    let totalDailyAmountGoal = 0;
    let totalDailyAmount = 0;
    let totalDailyResultAmount = 0;
    let totalDailyContractsGoal = 0;
    let totalDailyContracts = 0;
    let totalDailyResultContracts = 0;

    // Calcular las métricas para cada comercial
    const metrics = users.map((user) => {
      const userContracts = groupedContracts[user.id] || {
        nameComercial: user.firstName + ' ' + user.lastName,
        numberContracts: 0,
        amountTotal: 0,
      };

      totalMonthAmountSold += userContracts.amountTotal; // Sumamos al total general de ventas
      totalMonthContractsSold += userContracts.numberContracts; // Sumamos al total general de contratos

      // Calcular la meta diaria en euros
      const dailyAmountGoal = Math.floor(
        sharedMonthlyGoal / monthGoalsData.days_in_month,
      );

      // Calcular la meta diaria en contratos
      const dailyContractsGoal = Math.floor(
        sharedContractsGoal / monthGoalsData.days_in_month,
      );

      // Calcular los días laborales hasta hoy
      const daysPassed = this.calculateWorkingDaysUntilToday(today, holidays);

      // Calcular lo que debería haber vendido hasta hoy
      const accumulatedAmountGoal = -(daysPassed * dailyAmountGoal);

      // Calcular el número de contratos que debería haber cerrado hasta hoy
      const accumulatedContractsGoal = -(daysPassed * dailyContractsGoal);

      // Calcular lo que ha vendido el comercial hoy
      const dailyAmount = todayContracts
        .filter((contract) => contract.user.id === user.id)
        .reduce((sum, contract) => sum + contract.coursePrice, 0);

      // Calcular los contratos que ha cerrado el comercial hoy
      const dailyContracts = todayContracts.filter(
        (contract) => contract.user.id === user.id,
      ).length;

      // Calcular la diferencia en ventas acumuladas
      const resultAmount = accumulatedAmountGoal + userContracts.amountTotal;

      // Calcular la diferencia en contratos acumulados
      const resultContracts =
        accumulatedContractsGoal + userContracts.numberContracts;

      // Acumular los totales diarios
      totalDailyAmountGoal += dailyAmountGoal;
      totalDailyAmount += dailyAmount;
      totalDailyResultAmount += resultAmount;
      totalDailyContractsGoal += dailyContractsGoal;
      totalDailyContracts += dailyContracts;
      totalDailyResultContracts += resultContracts;

      return {
        nameComercial: userContracts.nameComercial,
        dailyAmountGoal,
        dailyContractsGoal,
        dailyAmount, // Ventas realizadas hoy
        dailyContracts, // Contratos cerrados hoy
        resultAmount,
        resultContracts,
        monthAmount: userContracts.amountTotal,
        monthContracts: userContracts.numberContracts,
        monthAmountGoal: sharedMonthlyGoal,
        monthContractsGoal: sharedContractsGoal,
      };
    });

    // Ordenar las métricas por monthAmount de mayor a menor
    metrics.sort((a, b) => b.monthAmount - a.monthAmount);

    // Devolver la respuesta con las métricas, el total de ventas y los objetivos
    return {
      today: today,
      metrics,
      total: {
        totalMonthAmountSold,
        totalMonthContractsSold,
        totalMonthAmountGoal: monthGoalsData.common_goal,
        totalMonthContractsGoal: monthGoalsData.contracts_goal,
        totalDailyAmountGoal,
        totalDailyAmount,
        totalDailyResultAmount,
        totalDailyContractsGoal,
        totalDailyContracts,
        totalDailyResultContracts,
      },
      holidays: monthGoalsData.holidays,
      days_in_month: monthGoalsData.days_in_month,
    };
  }

  // Función para calcular los días laborales hasta hoy (descontando los días festivos)
  calculateWorkingDaysUntilToday(today: Date, holidays: string[]): number {
    holidays = holidays || []; // Asegurarse de que holidays no sea null
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let workingDays = 0;

    // Iterar desde el 1 hasta el día de hoy
    for (let day = startOfMonth; day <= today; day.setDate(day.getDate() + 1)) {
      const formattedDate = day.toISOString().split('T')[0];

      // Solo contar como día laborable si el día no está en los feriados
      if (!holidays.includes(formattedDate)) {
        workingDays++;
      }
    }

    return workingDays;
  }
}
