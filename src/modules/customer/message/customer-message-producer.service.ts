import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { CustomerMessageInterface } from '../interfaces/customer-message.interface';

export interface createCustomerMessageType {
  customer_name: string;
  customer_email: string;
  code: string;
}

export interface activatedCustomerMessageType {
  customer_name: string;
  customer_email: string;
}

export class CustomerMessageProducer implements CustomerMessageInterface {
  constructor(@InjectQueue('sendMail') private readonly queue: Queue) {}

  async sendUserActivatedMessage(
    customer_name: string,
    customer_email: string,
  ): Promise<void> {
    await this.queue.add('customerActivatedMessage', {
      customer_name,
      customer_email,
    });
  }

  async sendCreateUserMessage(
    customer_name: string,
    customer_email: string,
    code: string,
  ): Promise<void> {
    await this.queue.add('createCustomerMessage', {
      customer_name,
      code,
      customer_email,
    });
  }
}
