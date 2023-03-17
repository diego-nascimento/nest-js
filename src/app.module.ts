import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    CustomerModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
