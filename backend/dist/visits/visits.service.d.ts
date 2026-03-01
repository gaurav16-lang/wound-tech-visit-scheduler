import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';
export declare class VisitsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateVisitDto): Promise<{
        patient: {
            firstName: string;
            lastName: string;
        };
        clinician: {
            firstName: string;
            lastName: string;
            specialty: string;
        };
    } & {
        scheduledAt: Date;
        endTime: Date;
        status: string;
        notes: string | null;
        subject: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
        clinicianId: number;
    }>;
    findAll(): Promise<({
        patient: {
            id: number;
            firstName: string;
            lastName: string;
        };
        clinician: {
            id: number;
            firstName: string;
            lastName: string;
            specialty: string;
        };
    } & {
        scheduledAt: Date;
        endTime: Date;
        status: string;
        notes: string | null;
        subject: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
        clinicianId: number;
    })[]>;
    findOne(id: number): Promise<{
        patient: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            contactNumber: string;
            address: string;
        };
        clinician: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            firstName: string;
            lastName: string;
            contactNumber: string;
            specialty: string;
            licenseNumber: string;
        };
    } & {
        scheduledAt: Date;
        endTime: Date;
        status: string;
        notes: string | null;
        subject: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
        clinicianId: number;
    }>;
    update(id: number, dto: UpdateVisitDto): Promise<{
        scheduledAt: Date;
        endTime: Date;
        status: string;
        notes: string | null;
        subject: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
        clinicianId: number;
    }>;
    remove(id: number): Promise<{
        scheduledAt: Date;
        endTime: Date;
        status: string;
        notes: string | null;
        subject: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        patientId: number;
        clinicianId: number;
    }>;
    getStats(): Promise<{
        totalPatients: number;
        totalClinicians: number;
        scheduled: number;
        completed: number;
    }>;
}
