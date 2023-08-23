import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { MachineModule } from './machine/machine.module';
import { OrderModule } from './order/order.module';
import { SweetModule } from './sweet/sweet.module';
import { ProducedByModule } from './producedBy/producedBy.module';
import { OrderContainsModule } from './orderContains/orderContains.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Neo4jModule.forRoot({
      scheme: 'bolt',
      host: process.env.NEO4J_HOST || 'localhost',
      port: process.env.NEO4J_PORT || 7687,
      username: process.env.NEO4J_USERNAME || 'neo4j',
      password: process.env.NEO4J_PASSWORD || 'your_password',
      config: {
        disableLosslessIntegers: true,
      },
    }),
    MachineModule,
    SweetModule,
    OrderModule,
    ProducedByModule,
    OrderContainsModule,
  ],
})
export class AppModule {}
