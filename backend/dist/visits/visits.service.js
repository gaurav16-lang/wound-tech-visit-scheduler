"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VisitsService = class VisitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const patient = await this.prisma.patient.findUnique({ where: { id: dto.patientId } });
        if (!patient)
            throw new common_1.BadRequestException(`Patient with id ${dto.patientId} not found. Register a patient first.`);
        const clinician = await this.prisma.clinician.findUnique({ where: { id: dto.clinicianId } });
        if (!clinician)
            throw new common_1.BadRequestException(`Clinician with id ${dto.clinicianId} not found. Register a clinician first.`);
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
    async findOne(id) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            include: {
                patient: true,
                clinician: true,
            },
        });
        if (!visit)
            throw new common_1.NotFoundException('Visit not found');
        return visit;
    }
    async update(id, dto) {
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
    async remove(id) {
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
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map