import { Injectable } from '@nestjs/common';
import { CreateProducedByDto } from './dto/create-producedBy.dto';
import { Neo4jService } from 'nest-neo4j';
import { FindAllProducedByDto } from './dto/find-all-producedBy.dto';
import { FindOneProducedByDto } from './dto/find-one-producedBy.dto';
import { ProducedByEntity } from './entities/producedBy.entity';

@Injectable()
export class ProducedByService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    createProducedByDto: CreateProducedByDto,
  ): Promise<ProducedByEntity> {
    const res = await this.neo4jService.write(
      `MATCH (sweet:Sweet { name: $sweetName })
      MATCH (machine:Machine { machineId: $machineId })
      CREATE (sweet)-[:PRODUCED_BY]->(machine)
      RETURN sweet.name as sweetName, machine.machineId as machineId;`,
      createProducedByDto,
    );
    const sweetName = res.records[0].get('sweetName');
    const machineId = res.records[0].get('machineId');
    return {
      machineId,
      sweetName,
    };
  }

  async findAll(
    findAllProducedByDto: FindAllProducedByDto,
  ): Promise<ProducedByEntity[]> {
    let res;
    if (findAllProducedByDto.machineId) {
      res = await this.neo4jService.read(
        `MATCH (sweet:Sweet)-[:PRODUCED_BY]->(machine:Machine { machineId: $machineId })
        RETURN sweet.name as sweetName, machine.machineId as machineId;`,
        findAllProducedByDto,
      );
    } else if (findAllProducedByDto.sweetName) {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet {name: $sweetName})-[:PRODUCED_BY]->(machine:Machine)
        RETURN sweet.name as sweetName, machine.machineId as machineId;`,
        findAllProducedByDto,
      );
    } else {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet)-[:PRODUCED_BY]->(machine:Machine)
        RETURN sweet.name as sweetName, machine.machineId as machineId;`,
        findAllProducedByDto,
      );
    }
    return res.records.map((rec) => {
      const sweetName = rec.get('sweetName');
      const machineId = rec.get('machineId');
      return {
        machineId,
        sweetName,
      };
    });
  }

  async findOne(
    findOneProducedByDto: FindOneProducedByDto,
  ): Promise<ProducedByEntity> {
    const res = await this.neo4jService.read(
      `MATCH (sweet: Sweet {name: $sweetName})-[:PRODUCED_BY]->(machine:Machine { machineId: $machineId })
      RETURN sweet.name as sweetName, machine.machineId as machineId;`,
      findOneProducedByDto,
    );
    if (res.records[0] == undefined) {
      return null;
    }
    const sweetName = res.records[0].get('sweetName');
    const machineId = res.records[0].get('machineId');
    return {
      machineId,
      sweetName,
    };
  }

  async remove({ sweetName, machineId }): Promise<void> {
    await this.neo4jService.write(
      `MATCH (sweet: Sweet {name: $sweetName})-[producedBy:PRODUCED_BY]->(:Machine { machineId: $machineId })
      DELETE producedBy;`,
      {
        sweetName,
        machineId,
      },
    );
    return null;
  }
}
