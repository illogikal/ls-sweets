import { Injectable } from '@nestjs/common';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { cypherUpdateObject } from '../util';
import { Neo4jService } from 'nest-neo4j';
import { FindAllSweetDto } from './dto/find-all-sweet.dto';
import { SweetEntity } from './entities/sweet.entity';

@Injectable()
export class SweetService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(createSweetDto: CreateSweetDto): Promise<SweetEntity> {
    const res = await this.neo4jService.write(
      `CREATE (sweet:Sweet {
        name: $name,
        ingredients: $ingredients,
        price: $price,
        quantityInStock: $quantityInStock
      })
      RETURN sweet;`,
      createSweetDto,
    );
    return res.records[0].get('sweet').properties;
  }

  async findAll(findAllSweetDto: FindAllSweetDto): Promise<SweetEntity[]> {
    let res;
    if (findAllSweetDto.machineId) {
      res = await this.neo4jService.read(
        `MATCH (sweet:Sweet)-[:PRODUCED_BY]->(machine:Machine { machineId: $machineId })
        RETURN sweet;`,
        findAllSweetDto,
      );
    } else if (findAllSweetDto.name) {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet {name: $name})
        RETURN sweet;`,
        findAllSweetDto,
      );
    } else if (findAllSweetDto.quantityLt) {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet WHERE sweet.quantityInStock < $quantityLt)
        RETURN sweet;`,
        findAllSweetDto,
      );
    } else {
      res = await this.neo4jService.read(
        `MATCH (sweet: Sweet)
        RETURN sweet;`,
        findAllSweetDto,
      );
    }
    return res.records.map((r) => r.get('sweet').properties);
  }

  async findOne(name: string): Promise<SweetEntity> {
    const res = await this.neo4jService.read(
      `MATCH (sweet: Sweet { name: $name })
      RETURN sweet;`,
      { name },
    );
    return res.records[0].get('sweet').properties;
  }

  async update(
    name: string,
    updateSweetDto: UpdateSweetDto,
  ): Promise<SweetEntity> {
    const res = await this.neo4jService.write(
      `MATCH (sweet:Sweet { name: $name })
      SET ${cypherUpdateObject('sweet', updateSweetDto)}
      RETURN sweet;`,
      { name },
    );
    return res.records[0].get('sweet').properties;
  }

  async remove(name: string): Promise<SweetEntity> {
    await this.neo4jService.write(
      `MATCH (sweet:Sweet { name: $name })
      RETURN sweet;`,
      {
        name,
      },
    );
    return null;
  }
}
