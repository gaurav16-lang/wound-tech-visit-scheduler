import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicianDto, UpdateClinicianDto } from './dto/clinician.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CliniciansService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClinicianDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: 'CLINICIAN',
        clinician: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            specialty: dto.specialty,
            licenseNumber: dto.licenseNumber,
            contactNumber: dto.contactNumber,
          },
        },
      },
      include: { clinician: true },
    });

    return user.clinician;
  }

  async findAll() {
    return this.prisma.clinician.findMany({
      include: { user: { select: { email: true, role: true } } },
    });
  }

  async findOne(id: number) {
    const clinician = await this.prisma.clinician.findUnique({
      where: { id },
      include: { user: { select: { email: true, role: true } }, visits: true },
    });
    if (!clinician) throw new NotFoundException('Clinician not found');
    return clinician;
  }

  async update(id: number, dto: UpdateClinicianDto) {
    await this.findOne(id);
    return this.prisma.clinician.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.clinician.delete({ where: { id } });
  }
}
