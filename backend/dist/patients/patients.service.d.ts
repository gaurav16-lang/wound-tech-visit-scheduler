import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePatientDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        contactNumber: string;
        address: string;
        userId: number;
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
        dateOfBirth: Date;
        contactNumber: string;
        address: string;
        userId: number;
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
        dateOfBirth: Date;
        contactNumber: string;
        address: string;
        userId: number;
    }>;
    update(id: number, dto: UpdatePatientDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        contactNumber: string;
        address: string;
        userId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        contactNumber: string;
        address: string;
        userId: number;
    }>;
}
