import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ProducedByService } from './producedBy.service';
import { CreateProducedByDto } from './dto/create-producedBy.dto';
import { ProducedByEntity } from './entities/producedBy.entity';
import { FindAllProducedByDto } from '../producedBy/dto/find-all-producedBy.dto';
import { FindOneProducedByDto } from '../producedBy/dto/find-one-producedBy.dto';

@Controller('producedBy')
export class ProducedByController {
  constructor(private readonly producedByService: ProducedByService) {}

  @Post()
  create(
    @Body() createProducedByDto: CreateProducedByDto,
  ): Promise<ProducedByEntity> {
    return this.producedByService.create(createProducedByDto);
  }

  @Get()
  findAll(
    @Body() findAllProducedByDto: FindAllProducedByDto,
  ): Promise<ProducedByEntity[]> {
    return this.producedByService.findAll(findAllProducedByDto);
  }

  @Get(':name')
  findOne(
    @Body() findOneProducedByDto: FindOneProducedByDto,
  ): Promise<ProducedByEntity> {
    return this.producedByService.findOne(findOneProducedByDto);
  }

  @Delete(':name')
  remove(@Body() findOneProducedByDto: FindOneProducedByDto): Promise<void> {
    return this.producedByService.remove(findOneProducedByDto);
  }
}
