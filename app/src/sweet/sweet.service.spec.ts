import { Test, TestingModule } from '@nestjs/testing';
import { SweetService } from './sweet.service';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jService } from 'nest-neo4j';

describe('SweetService', () => {
  let service: SweetService;
  let neo4jService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
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
      ],
      providers: [SweetService],
    }).compile();
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await neo4jService.write(
      `MATCH (n)
      DETACH DELETE n;`,
    );
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
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
      ],
      providers: [SweetService],
    }).compile();

    service = module.get<SweetService>(SweetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const result = await service.create({
      name: 'Chocolate Cake',
      ingredients: ['chocolate', 'flour', 'sugar'],
      price: 1099,
      quantityInStock: 50,
    });
    expect(result).toStrictEqual({
      ingredients: ['chocolate', 'flour', 'sugar'],
      name: 'Chocolate Cake',
      price: 1099,
      quantityInStock: 50,
    });
  });

  it('findAll', async () => {
    const result = await service.findAll();
    expect(result[0]).toStrictEqual({
      ingredients: ['chocolate', 'flour', 'sugar'],
      name: 'Chocolate Cake',
      price: 1099,
      quantityInStock: 50,
    });
  });

  it('findOne', async () => {
    const result = await service.findOne('Chocolate Cake');
    expect(result).toStrictEqual({
      ingredients: ['chocolate', 'flour', 'sugar'],
      name: 'Chocolate Cake',
      price: 1099,
      quantityInStock: 50,
    });
  });

  it('update', async () => {
    const result = await service.update('Chocolate Cake', {
      price: 1399,
      quantityInStock: 60,
    });
    expect(result).toStrictEqual({
      ingredients: ['chocolate', 'flour', 'sugar'],
      name: 'Chocolate Cake',
      price: 1399,
      quantityInStock: 60,
    });
  });

  it('remove', async () => {
    const result = await service.remove('Chocolate Cake');
    expect(result).toEqual(null);
  });
});
