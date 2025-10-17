// src/app/modules/BloodRequest/request.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequest extends Document {
  requestId: string;
  userId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  patientName: string;
  patientAge: number;
  hospital: string;
  hospitalAddress: string;
  unitsNeeded: number;
  urgency: 'Critical' | 'Urgent' | 'Normal';
  neededDate: Date;
  neededTime: string;
  contactPhone: string;
  medicalCondition: string;
  additionalNotes?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
  rejectionReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bloodRequestSchema = new Schema<IBloodRequest>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile', // ✅ Changed from 'Donor' to 'UserProfile'
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientAge: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age must be less than 120'],
    },
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    hospitalAddress: {
      type: String,
      required: [true, 'Hospital address is required'],
      trim: true,
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Units needed is required'],
      min: [1, 'At least 1 unit required'],
      max: [10, 'Maximum 10 units allowed'],
    },
    urgency: {
      type: String,
      enum: {
        values: ['Critical', 'Urgent', 'Normal'],
        message: '{VALUE} is not a valid urgency level',
      },
      required: [true, 'Urgency level is required'],
    },
    neededDate: {
      type: Date,
      required: [true, 'Needed date is required'],
    },
    neededTime: {
      type: String,
      required: [true, 'Needed time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number'],
    },
    medicalCondition: {
      type: String,
      required: [true, 'Medical condition is required'],
      trim: true,
      minlength: [5, 'Medical condition must be at least 5 characters'],
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Fixed: Generate unique request ID (backup যদি service এ না করা হয়)
bloodRequestSchema.pre('save', async function (next) {
  if (this.isNew && !this.requestId) {
    try {
      const count = await mongoose.model('BloodRequest').countDocuments();
      this.requestId = `REQ-${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating requestId:', error);
    }
  }
  next();
});

// Index for efficient querying
bloodRequestSchema.index({ userId: 1, createdAt: -1 });
bloodRequestSchema.index({ donorId: 1, status: 1, createdAt: -1 });
bloodRequestSchema.index({ status: 1, urgency: 1, neededDate: 1 });

export const BloodRequest = mongoose.model<IBloodRequest>(
  'BloodRequest',
  bloodRequestSchema
);