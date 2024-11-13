import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContractsService } from '../contracts/contracts.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly contractsService: ContractsService,
  ) {}

  async findAll() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // 1. Obtener los comerciales (usuarios) con contratos en el mes actual
    const users = await this.usersService.getUsersWithContracts(
      currentMonth,
      currentYear,
    );

    // 2. Obtener todos los contratos del mes actual
    const contracts = await this.contractsService.getContractsForCurrentMonth();

    // 3. Agrupar contratos por comercial
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

    // 4. Calcular el total de ventas (superAmountTotal)
    let totalAmountSold = 0;
    const metrics = users.map((user) => {
      const userContracts = groupedContracts[user.id] || {
        nameComercial: user.firstName + ' ' + user.lastName,
        numberContracts: 0,
        amountTotal: 0,
      };
      totalAmountSold += userContracts.amountTotal; // Sumamos al total general de ventas

      return {
        nameComercial: userContracts.nameComercial,
        numberContracts: userContracts.numberContracts,
        amountTotal: userContracts.amountTotal,
      };
    });

    // 5. Devolver la respuesta con las métricas y el total de ventas
    return {
      today: today.toISOString().split('T')[0],
      metrics,
      totalAmountSold, // Incluimos el total de ventas
    };
  }
}
