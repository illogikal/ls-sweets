import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { cypherUpdateObject } from '../util';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class MachineService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createMachineDto: CreateMachineDto): Promise<any> {
    const res = await this.neo4jService.write(
      `CREATE (machine:Machine {
        machineId: $machineId,
        type: $type,
        capacity: $capacity,
        status: $status
      })
      RETURN machine;`,
      createMachineDto,
    );
    return res.records[0].get('machine').properties;
  }

  async findAll(): Promise<any> {
    const res = await this.neo4jService.read(
      `MATCH (machine:Machine)
      RETURN machine;`,
    );
    return res.records.map((r) => r.get('machine').properties);
  }

  async findOne(machineId: string): Promise<any> {
    const res = await this.neo4jService.read(
      `MATCH (machine:Machine { machineId: $machineId })
      RETURN machine;`,
      { machineId },
    );
    if (res.records.length > 0) {
      return res.records[0].get('machine').properties;
    } else {
      return null;
    }
  }

  async update(
    machineId: string,
    updateMachineDto: UpdateMachineDto,
  ): Promise<any> {
    const res = await this.neo4jService.write(
      `MATCH (machine:Machine { machineId: $machineId })
      SET ${cypherUpdateObject('machine', updateMachineDto)}
      RETURN machine;`,
      {
        machineId,
      },
    );
    if (res.records.length > 0) {
      return res.records[0].get('machine').properties;
    } else {
      return null;
    }
  }

  async remove(machineId: string): Promise<any> {
    const res = await this.neo4jService.write(
      `MATCH (machine:Machine { machineId: $machineId })
      RETURN machine;`,
      {
        machineId,
      },
    );
    return null;
  }
}
