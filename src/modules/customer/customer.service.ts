import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomerMessageInterface } from './interfaces/customer-message.interface';
import { CustomerRepositoryInterface } from './interfaces/customer-repository.interface';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CustomerRepositoryInterface)
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject(CustomerMessageInterface)
    private readonly customerMessage: CustomerMessageInterface,
  ) {}

  async create(customerDTO: CreateCustomerDto) {
    const customer = new Customer(
      customerDTO.name,
      customerDTO.username,
      customerDTO.password,
      customerDTO.phone,
      customerDTO.email,
    );
    await customer.hashPassword();
    const userExists = await this.customerRepository.userAlreadyExists(
      customer,
    );
    if (userExists)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    await this.customerRepository.createCustomer(customer);
    await this.createActivationCode(customer.id);
    return;
  }

  async createActivationCode(customer_id: string) {
    const code = randomUUID();
    await this.customerRepository.createActivationCode(customer_id, code);
    const customer = await this.customerRepository.findUser(customer_id);
    await this.customerMessage.sendCreateUserMessage(
      customer.name,
      customer.email,
      code,
    );
  }

  async activateUser(code: string) {
    const customer = await this.customerRepository.findUserByActivationCode(
      code,
    );
    customer.activeCustomer();
    await this.customerRepository.updateCustomer(customer);
    await this.customerRepository.removeCode(code);
    await this.customerMessage.sendUserActivatedMessage(
      customer.name,
      customer.email,
    );
  }
}
