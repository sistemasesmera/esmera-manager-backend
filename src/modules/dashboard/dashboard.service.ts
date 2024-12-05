import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateCommonGoalDto } from './dto/update-common.goal.dto';

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
  private setCommonGoal(newGoal: UpdateCommonGoalDto): void {
    const data = { commonGoal: newGoal };
    try {
      fs.writeFileSync(
        this.commonGoalPath,
        JSON.stringify(data.commonGoal, null, 2),
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

      return {
        nameComercial: userContracts.nameComercial,
        numberContracts: userContracts.numberContracts,
        amountTotal: userContracts.amountTotal,
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

  // Método para actualizar el objetivo común
  async updateCommonGoal(newGoal: UpdateCommonGoalDto) {
    this.setCommonGoal(newGoal);
    return { message: 'Objetivo común actualizado correctamente' };
  }
}
