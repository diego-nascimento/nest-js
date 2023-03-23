import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './repository/customer-repository.service';
import { CustomerRepositoryInterface } from './interfaces/customer-repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { CustomerMessageInterface } from './interfaces/customer-message.interface';
import { CustomerMessageProducer } from './message/customer-message-producer.service';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { SendMailProcessor } from './message/customer-message-processor.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail',
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'christophe.wuckert63@ethereal.email',
          pass: 'AepbCtHjYp9X3UspSQ',
        },
      },
    }),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerMessageProducer,
    SendMailProcessor,
    {
      provide: CustomerRepositoryInterface,
      useClass: CustomerRepository,
    },
    {
      provide: PrismaService,
      useClass: PrismaService,
    },
    {
      provide: CustomerMessageInterface,
      useClass: CustomerMessageProducer,
    },
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: async (kafkaService: ClientKafka) => {
        return kafkaService.connect();
      },
      inject: ['KAFKA_SERVICE'],
    },
  ],
})
export class CustomerModule {
  constructor(@InjectQueue('sendMail') private readonly queue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.queue)]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
