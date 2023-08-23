import { Test, TestingModule } from '@nestjs/testing';
import { MachineService } from './machine.service';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4jService } from 'nest-neo4j';
import { MachineStatus } from './entities/machine.entity';

describe('MachineService', () => {
  let service: MachineService;
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
      providers: [MachineService],
    }).compile();
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await neo4jService.write(
      `MATCH (n)
      DETACH DELETE n;`,
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      providers: [MachineService],
    }).compile();

    service = module.get<MachineService>(MachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const result = await service.create({
      machineId: '123',
      type: 'Chocolate',
      capacity: 1000,
      status: MachineStatus.ACTIVE,
    });
    expect(result).toStrictEqual({
      machineId: '123',
      type: 'Chocolate',
      capacity: 1000,
      status: MachineStatus.ACTIVE,
    });
  });

  it('findAll', async () => {
    const result = await service.findAll();
    expect(result[0]).toStrictEqual({
      machineId: '123',
      type: 'Chocolate',
      capacity: 1000,
      status: MachineStatus.ACTIVE,
    });
  });

  it('findOne existing', async () => {
    const result = await service.findOne('123');
    expect(result).toStrictEqual({
      machineId: '123',
      type: 'Chocolate',
      capacity: 1000,
      status: MachineStatus.ACTIVE,
    });
  });

  it('findOne non existing', async () => {
    const result = await service.findOne('234');
    expect(result).toStrictEqual(null);
  });

  it('update', async () => {
    const result = await service.update('123', {
      type: 'Hard Candy',
      capacity: 2000,
      status: MachineStatus.INACTIVE,
    });
    expect(result).toStrictEqual({
      machineId: '123',
      type: 'Hard Candy',
      capacity: 2000,
      status: MachineStatus.INACTIVE,
    });
  });

  it('remove', async () => {
    const result = await service.remove('123');
    expect(result).toEqual(null);
  });
});
