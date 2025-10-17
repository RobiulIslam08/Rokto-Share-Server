
export interface ICreateBloodRequest {
  userId: string;
  donorId: string;
  patientName: string;
  patientAge: number;
  hospital: string;
  hospitalAddress: string;
  unitsNeeded: number;
  urgency: 'Critical' | 'Urgent' | 'Normal';
  neededDate: string;
  neededTime: string;
  contactPhone: string;
  medicalCondition: string;
  additionalNotes?: string;
}

export interface IUpdateRequestStatus {
  status: 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
  rejectionReason?: string;
}

export interface IRequestQuery {
  status?: string;
  urgency?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}