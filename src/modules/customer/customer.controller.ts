import { Controller, Post, Body, Query, Inject, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { Producer } from 'kafkajs';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly kafkaProducer: Producer,
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
  ) {}

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

  @Get('/veio')
  async veio() {
    console.log('veio aqui');
    await this.kafkaProducer.send({
      topic: 'topico-exemplo',
      messages: [
        {
          key: 'teste',
          value: JSON.stringify({ message: 'Diego' }),
        },
      ],
    });
  }

  @MessagePattern('topico-exemplo')
  consumer(@Payload() message: KafkaMessage) {
    console.log(message);
  }
}
