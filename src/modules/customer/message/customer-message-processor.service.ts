import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  createCustomerMessageType,
  activatedCustomerMessageType,
} from './customer-message-producer.service';

@Processor('sendMail')
export class SendMailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('customerActivatedMessage')
  async sendCustomerActivatedMessage(job: Job<activatedCustomerMessageType>) {
    const customer = job.data;
    await this.mailerService.sendMail({
      to: customer.customer_email,
      from: 'Teste do Diego <diego.ca.nascimento@gmail.com>',
      subject: 'Customer ativado',
      text: `Customer ${customer.customer_name} foi ativado, pode mandar brasa`,
    });
  }

  @Process('createCustomerMessage')
  async sendCreateCustomerMessage(job: Job<createCustomerMessageType>) {
    const customer = job.data;
    await this.mailerService.sendMail({
      to: customer.customer_email,
      from: 'Teste do Diego <diego.ca.nascimento@gmail.com>',
      subject: 'Criando customer',
      text: `${customer.customer_name}, Seja bem vindo seu puto do carai! Ta aqui seu codigo ${customer.code}`,
    });
  }
}
