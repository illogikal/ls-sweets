import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getHello(): Promise<string> {
    const res = await this.neo4jService.write(
      `CREATE (sweet:Sweet {
        name: 'Chocolate Cake',
        ingredients: ['chocolate', 'flour', 'sugar'],
        price: 10.99,
        quantityInStock: 50
      })
      RETURN sweet;`,
    );
    return `There are ${JSON.stringify(res)} nodes in the database`;
  }
}
