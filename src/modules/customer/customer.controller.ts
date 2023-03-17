import { Controller, Post, Body, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Post('/activate')
  async active(@Query('code') code: string) {
    return this.customerService.activateUser(code);
  }

  @Post('/sendcode')
  async sendcode(@Query('customer_id') customer_id: string) {
    return this.customerService.createActivationCode(customer_id);
  }
}
