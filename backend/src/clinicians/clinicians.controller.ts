import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { CreateClinicianDto, UpdateClinicianDto } from './dto/clinician.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('clinicians')
export class CliniciansController {
  constructor(private cliniciansService: CliniciansService) {}

  @Post()
  create(@Body() dto: CreateClinicianDto) {
    return this.cliniciansService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.cliniciansService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cliniciansService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClinicianDto) {
    return this.cliniciansService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cliniciansService.remove(id);
  }
}
