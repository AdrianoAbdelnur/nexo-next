import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const serviceRequestServiceTypes = ['installation', 'removal', 'maintenance'] as const;
export const serviceRequestPriorities = ['low', 'medium', 'high', 'urgent'] as const;
export const serviceRequestStatuses = [
  'draft',
  'requested',
  'in_coordination',
  'partially_coordinated',
  'coordinated',
  'in_execution',
  'partially_completed',
  'completed',
  'cancelled',
] as const;

const initialAttachmentSchema = new Schema(
  {
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const serviceRequestSchema = new Schema(
  {
    requestNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    },
    serviceType: {
      type: String,
      enum: serviceRequestServiceTypes,
      required: true,
    },
    vehicleCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    priority: {
      type: String,
      enum: serviceRequestPriorities,
      default: 'medium',
    },
    source: {
      type: String,
      trim: true,
    },
    requestedWindowStart: {
      type: Date,
    },
    requestedWindowEnd: {
      type: Date,
    },
    generalNotes: {
      type: String,
      trim: true,
    },
    initialAttachments: {
      type: [initialAttachmentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: serviceRequestStatuses,
      default: 'requested',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ requestNumber: 1 }, { unique: true });
serviceRequestSchema.index({ companyId: 1, status: 1 });
serviceRequestSchema.index({ priority: 1, createdAt: -1 });
serviceRequestSchema.index({ requestedWindowStart: 1, requestedWindowEnd: 1 });

export type ServiceRequest = InferSchemaType<typeof serviceRequestSchema>;
export type ServiceRequestObjectId = Types.ObjectId;
export type ServiceRequestModel = mongoose.Model<ServiceRequest>;

export default (models.ServiceRequest as ServiceRequestModel) || model<ServiceRequest>('ServiceRequest', serviceRequestSchema);
