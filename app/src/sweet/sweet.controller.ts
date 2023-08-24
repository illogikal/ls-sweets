import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { SweetService } from './sweet.service';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { SweetEntity } from './entities/sweet.entity';
import { FindAllSweetDto } from './dto/find-all-sweet.dto';
import { plainToClass } from 'class-transformer';

@Controller('sweet')
export class SweetController {
  constructor(private readonly sweetService: SweetService) {}

  @Post()
  create(@Body() createSweetDto: CreateSweetDto) {
    return this.sweetService.create(createSweetDto);
  }

  @Get()
  findAll(@Query() queryParams: FindAllSweetDto): Promise<SweetEntity[]> {
    return this.sweetService.findAll(
      plainToClass(FindAllSweetDto, queryParams),
    );
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.sweetService.findOne(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetService.update(name, updateSweetDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.sweetService.remove(name);
  }
}
