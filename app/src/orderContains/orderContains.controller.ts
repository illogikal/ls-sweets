import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { OrderContainsService } from './orderContains.service';
import { CreateOrderContainsDto } from './dto/create-orderContains.dto';
import { OrderContainsEntity } from './entities/orderContains.entity';
import { FindAllOrderContainsDto } from '../orderContains/dto/find-all-orderContains.dto';
import { FindOneOrderContainsDto } from '../orderContains/dto/find-one-orderContains.dto';

@Controller('orderContains')
export class OrderContainsController {
  constructor(private readonly orderContainsService: OrderContainsService) {}

  @Post()
  create(
    @Body() createOrderContainsDto: CreateOrderContainsDto,
  ): Promise<OrderContainsEntity> {
    return this.orderContainsService.create(createOrderContainsDto);
  }

  @Get()
  findAll(
    @Body() findAllOrderContainsDto: FindAllOrderContainsDto,
  ): Promise<OrderContainsEntity[]> {
    return this.orderContainsService.findAll(findAllOrderContainsDto);
  }

  @Get(':name')
  findOne(
    @Body() findOneOrderContainsDto: FindOneOrderContainsDto,
  ): Promise<OrderContainsEntity> {
    return this.orderContainsService.findOne(findOneOrderContainsDto);
  }

  @Delete(':name')
  remove(
    @Body() findOneOrderContainsDto: FindOneOrderContainsDto,
  ): Promise<void> {
    return this.orderContainsService.remove(findOneOrderContainsDto);
  }
}
