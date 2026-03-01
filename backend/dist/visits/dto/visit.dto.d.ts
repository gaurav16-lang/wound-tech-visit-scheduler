export declare class CreateVisitDto {
    patientId: number;
    clinicianId: number;
    scheduledAt: string;
    endTime: string;
    subject?: string;
    notes?: string;
    status?: string;
}
export declare class UpdateVisitDto {
    patientId?: number;
    clinicianId?: number;
    scheduledAt?: string;
    endTime?: string;
    subject?: string;
    notes?: string;
    status?: string;
}
