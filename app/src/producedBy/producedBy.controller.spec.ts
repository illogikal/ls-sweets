import { Test, TestingModule } from '@nestjs/testing';
import { ProducedByController } from './producedBy.controller';
import { ProducedByService } from './producedBy.service';
import { Neo4jModule } from 'nest-neo4j';

describe('ProducedByController', () => {
  let controller: ProducedByController;

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
      controllers: [ProducedByController],
      providers: [ProducedByService],
    }).compile();

    controller = module.get<ProducedByController>(ProducedByController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
