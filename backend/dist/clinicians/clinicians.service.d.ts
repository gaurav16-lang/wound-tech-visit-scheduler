import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicianDto, UpdateClinicianDto } from './dto/clinician.dto';
export declare class CliniciansService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClinicianDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        contactNumber: string;
        userId: number;
        specialty: string;
        licenseNumber: string;
    } | null>;
    findAll(): Promise<({
        user: {
            email: string;
            role: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        contactNumber: string;
        userId: number;
        specialty: string;
        licenseNumber: string;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            email: string;
            role: string;
        };
        visits: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            patientId: number;
            clinicianId: number;
            scheduledAt: Date;
            endTime: Date;
            subject: string;
            notes: string | null;
            status: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        contactNumber: string;
        userId: number;
        specialty: string;
        licenseNumber: string;
    }>;
    update(id: number, dto: UpdateClinicianDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        contactNumber: string;
        userId: number;
        specialty: string;
        licenseNumber: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        contactNumber: string;
        userId: number;
        specialty: string;
        licenseNumber: string;
    }>;
}
