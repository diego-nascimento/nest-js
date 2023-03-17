import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/database/prisma.service';
import { Customer } from '../entities/customer.entity';
import { CustomerRepositoryInterface } from '../interfaces/customer-repository.interface';

@Injectable()
export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async removeCode(code: string): Promise<void> {
    const data = await this.prisma.activecustomer.findFirst({
      where: {
        code,
      },
    });
    await this.prisma.activecustomer.delete({
      where: {
        id: data.id,
      },
    });
  }

  async updateCustomer(customer: Customer): Promise<void> {
    await this.prisma.customer.update({
      data: {
        active: customer.active,
        email: customer.email,
        id: customer.id,
        name: customer.name,
        password: customer.password,
        phone: customer.phone,
        username: customer.username,
      },
      where: {
        id: customer.id,
      },
    });
  }

  async findUserByActivationCode(code: string): Promise<Customer> {
    const data = await this.prisma.activecustomer.findFirst({
      where: {
        code,
      },
      include: {
        customer: true,
      },
    });
    const customer = new Customer(
      data.customer.name,
      data.customer.username,
      data.customer.password,
      data.customer.phone,
      data.customer.email,
      data.customer.active,
      data.customer.id,
    );
    return customer;
  }

  async findUser(customer_id: string): Promise<Customer> {
    const customerFound = await this.prisma.customer.findFirst({
      where: {
        id: customer_id,
      },
    });
    const customer = new Customer(
      customerFound.name,
      customerFound.username,
      customerFound.password,
      customerFound.phone,
      customerFound.email,
      customerFound.active,
      customerFound.id,
    );
    return customer;
  }

  async createActivationCode(customer_id: string, code: string): Promise<void> {
    await this.prisma.activecustomer.create({
      data: {
        id: randomUUID(),
        code,
        customerId: customer_id,
      },
    });
    return;
  }

  async userAlreadyExists(customer: Customer): Promise<boolean> {
    try {
      const userFound = await this.prisma.customer.findMany({
        where: {
          username: customer.username,
          email: customer.email,
        },
      });
      return userFound.length > 0;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createCustomer(customer: Customer): Promise<void> {
    try {
      await this.prisma.customer.create({
        data: {
          active: customer.active,
          id: customer.id,
          name: customer.name,
          username: customer.username,
          password: customer.password,
          phone: customer.phone,
          email: customer.email,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return;
  }
}
