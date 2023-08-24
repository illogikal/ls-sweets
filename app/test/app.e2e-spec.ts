import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Neo4jModule, Neo4jService } from 'nest-neo4j';
import { OrderStatus } from './../src/order/entities/order.entity';
import { MachineStatus } from './../src/machine/entities/machine.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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
    }).compile();
    const neo4jService = module.get<Neo4jService>(Neo4jService);
    await neo4jService.write(
      `MATCH (n)
      DETACH DELETE n;`,
    );
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/sweet (POST) Chocolate Cake', async () => {
    await request(app.getHttpServer())
      .post('/sweet')
      .send({
        quantityInStock: 60,
        price: 1399,
        name: 'Chocolate Cake',
        ingredients: ['chocolate', 'flour', 'sugar'],
      })
      .expect(201)
      .expect({
        quantityInStock: 60,
        price: 1399,
        name: 'Chocolate Cake',
        ingredients: ['chocolate', 'flour', 'sugar'],
      });
    await request(app.getHttpServer())
      .post('/sweet')
      .send({
        quantityInStock: 30,
        price: 399,
        name: 'Licorice',
        ingredients: ['black', 'aniseed'],
      })
      .expect(201)
      .expect({
        quantityInStock: 30,
        price: 399,
        name: 'Licorice',
        ingredients: ['black', 'aniseed'],
      });
  });

  it('/sweet (GET) index', () => {
    return request(app.getHttpServer())
      .get('/sweet')
      .expect(200)
      .expect([
        {
          quantityInStock: 60,
          price: 1399,
          name: 'Chocolate Cake',
          ingredients: ['chocolate', 'flour', 'sugar'],
        },
        {
          quantityInStock: 30,
          price: 399,
          name: 'Licorice',
          ingredients: ['black', 'aniseed'],
        },
      ]);
  });

  it('/sweet (GET) Licorice', () => {
    return request(app.getHttpServer())
      .get('/sweet')
      .query({ name: 'Licorice' })
      .expect(200)
      .expect([
        {
          quantityInStock: 30,
          price: 399,
          name: 'Licorice',
          ingredients: ['black', 'aniseed'],
        },
      ]);
  });

  it('/order (POST)', async () => {
    await request(app.getHttpServer())
      .post('/order')
      .send({
        orderId: '123',
        customerName: 'John Doe',
        status: OrderStatus.OPEN,
      })
      .expect(201)
      .expect({
        orderId: '123',
        customerName: 'John Doe',
        status: OrderStatus.OPEN,
      });
    await request(app.getHttpServer())
      .post('/order')
      .send({
        orderId: '345',
        customerName: 'James Doe',
        status: OrderStatus.OPEN,
      })
      .expect(201)
      .expect({
        orderId: '345',
        customerName: 'James Doe',
        status: OrderStatus.OPEN,
      });
  });

  it('/order (GET)', () => {
    return request(app.getHttpServer())
      .get('/order')
      .expect(200)
      .expect([
        {
          orderId: '123',
          customerName: 'John Doe',
          status: OrderStatus.OPEN,
        },
        { orderId: '345', customerName: 'James Doe', status: 'open' },
      ]);
  });

  it('/machine (POST) Chocolate', () => {
    return request(app.getHttpServer())
      .post('/machine')
      .send({
        machineId: '123',
        type: 'Chocolate',
        capacity: 1000,
        status: MachineStatus.ACTIVE,
      })
      .expect(201)
      .expect({
        machineId: '123',
        type: 'Chocolate',
        capacity: 1000,
        status: MachineStatus.ACTIVE,
      });
  });

  it('/machine (POST) Licorice', () => {
    return request(app.getHttpServer())
      .post('/machine')
      .send({
        machineId: '234',
        type: 'Licorice',
        capacity: 1000,
        status: MachineStatus.ACTIVE,
      })
      .expect(201)
      .expect({
        machineId: '234',
        type: 'Licorice',
        capacity: 1000,
        status: MachineStatus.ACTIVE,
      });
  });

  it('/machine (GET)', () => {
    return request(app.getHttpServer())
      .get('/machine')
      .expect(200)
      .expect([
        {
          machineId: '123',
          type: 'Chocolate',
          capacity: 1000,
          status: MachineStatus.ACTIVE,
        },
        {
          machineId: '234',
          type: 'Licorice',
          capacity: 1000,
          status: MachineStatus.ACTIVE,
        },
      ]);
  });

  it('/producedBy (POST)', async () => {
    await request(app.getHttpServer())
      .post('/producedBy')
      .send({
        machineId: '234',
        sweetName: 'Licorice',
      })
      .expect(201)
      .expect({
        machineId: '234',
        sweetName: 'Licorice',
      });
    await request(app.getHttpServer())
      .post('/producedBy')
      .send({
        machineId: '123',
        sweetName: 'Chocolate Cake',
      })
      .expect(201)
      .expect({
        machineId: '123',
        sweetName: 'Chocolate Cake',
      });
  });

  it('/producedBy (GET)', () => {
    return request(app.getHttpServer())
      .get('/producedBy')
      .expect(200)
      .expect([
        {
          machineId: '234',
          sweetName: 'Licorice',
        },
        {
          machineId: '123',
          sweetName: 'Chocolate Cake',
        },
      ]);
  });

  it('/orderContains (POST)', () => {
    return request(app.getHttpServer())
      .post('/orderContains')
      .send({
        orderId: '123',
        sweetName: 'Chocolate Cake',
        amount: 100,
      })
      .expect(201)
      .expect({
        orderId: '123',
        sweetName: 'Chocolate Cake',
        amount: 100,
      });
  });

  it('/orderContains (POST)', () => {
    return request(app.getHttpServer())
      .post('/orderContains')
      .send({
        orderId: '345',
        sweetName: 'Licorice',
        amount: 100,
      })
      .expect(201)
      .expect({
        orderId: '345',
        sweetName: 'Licorice',
        amount: 100,
      });
  });

  it('/orderContains (GET)', () => {
    return request(app.getHttpServer())
      .get('/orderContains')
      .expect(200)
      .expect([
        {
          orderId: '345',
          sweetName: 'Licorice',
          amount: 100,
        },
        {
          orderId: '123',
          sweetName: 'Chocolate Cake',
          amount: 100,
        },
      ]);
  });

  it('/order (GET) query chocolate cake', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({ sweetName: 'Chocolate Cake' })
      .expect(200)
      .expect([{ orderId: '123', customerName: 'John Doe', status: 'open' }]);
  });

  it('/order (GET) query pending', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({ status: 'pending' })
      .expect(200)
      .expect([]);
  });

  it('/order (GET) query open', () => {
    return request(app.getHttpServer())
      .get('/order')
      .query({ status: 'open' })
      .expect(200)
      .expect([
        { orderId: '123', customerName: 'John Doe', status: 'open' },
        { orderId: '345', customerName: 'James Doe', status: 'open' },
      ]);
  });

  it('/sweet (GET) query quantityLt', () => {
    return request(app.getHttpServer())
      .get('/sweet')
      .query({ quantityLt: 40 })
      .expect(200)
      .expect([
        {
          quantityInStock: 30,
          price: 399,
          name: 'Licorice',
          ingredients: ['black', 'aniseed'],
        },
      ]);
  });

  it('/sweet (GET) query machineId', () => {
    return request(app.getHttpServer())
      .get('/sweet')
      .query({ machineId: '123' })
      .expect(200)
      .expect([
        {
          quantityInStock: 60,
          price: 1399,
          name: 'Chocolate Cake',
          ingredients: ['chocolate', 'flour', 'sugar'],
        },
      ]);
  });
});
