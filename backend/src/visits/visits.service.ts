import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVisitDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
    if (!patient) throw new BadRequestException(`Patient with id ${dto.patientId} not found. Register a patient first.`);

    const clinician = await this.prisma.clinician.findUnique({ where: { id: dto.clinicianId } });
    if (!clinician) throw new BadRequestException(`Clinician with id ${dto.clinicianId} not found. Register a clinician first.`);

    return this.prisma.visit.create({
      data: {
        patientId: dto.patientId,
        clinicianId: dto.clinicianId,
        scheduledAt: new Date(dto.scheduledAt),
        endTime: new Date(dto.endTime),
        subject: dto.subject || 'Visit',
        notes: dto.notes,
        status: dto.status || 'SCHEDULED',
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        clinician: { select: { firstName: true, lastName: true, specialty: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.visit.findMany({
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        clinician: { select: { id: true, firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        patient: true,
        clinician: true,
      },
    });
    if (!visit) throw new NotFoundException('Visit not found');
    return visit;
  }

  async update(id: number, dto: UpdateVisitDto) {
    await this.findOne(id);
    return this.prisma.visit.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.visit.delete({ where: { id } });
  }

  async getStats() {
    const [totalPatients, totalClinicians, scheduled, completed] = await Promise.all([
      this.prisma.patient.count(),
      this.prisma.clinician.count(),
      this.prisma.visit.count({ where: { status: 'SCHEDULED' } }),
      this.prisma.visit.count({ where: { status: 'COMPLETED' } }),
    ]);
    return { totalPatients, totalClinicians, scheduled, completed };
  }
}
