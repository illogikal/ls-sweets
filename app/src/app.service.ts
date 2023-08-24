import { Injectable, OnModuleInit } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  async onModuleInit() {
    await this.runMigrations();
  }

  async runMigrations(): Promise<void> {
    await this.neo4jService.write(
      `CREATE CONSTRAINT sweet_name IF NOT EXISTS FOR (sweet:Sweet) REQUIRE sweet.name IS NODE UNIQUE`,
    );
    await this.neo4jService.write(
      `CREATE CONSTRAINT order_id IF NOT EXISTS FOR (order:Order) REQUIRE order.orderId IS NODE UNIQUE`,
    );
    await this.neo4jService.write(
      `CREATE CONSTRAINT machine_id IF NOT EXISTS FOR (machine:Machine) REQUIRE machine.machineId IS NODE UNIQUE`,
    );
  }
}
