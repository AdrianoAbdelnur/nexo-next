import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const evidenceTypes = ['photo', 'video', 'file', 'document'] as const;
export const evidenceCategories = [
  'dashboard_engine_on',
  'plate',
  'odometer',
  'initial_state',
  'process',
  'installed_equipment',
  'final_state',
  'validation',
  'other',
] as const;

const geoSchema = new Schema(
  {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    accuracy: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const evidenceSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    executionId: {
      type: Schema.Types.ObjectId,
      ref: 'TaskExecution',
      index: true,
    },
    type: {
      type: String,
      enum: evidenceTypes,
      required: true,
    },
    category: {
      type: String,
      enum: evidenceCategories,
      default: 'other',
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
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
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    takenAt: {
      type: Date,
    },
    geo: {
      type: geoSchema,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

evidenceSchema.index({ taskId: 1 });
evidenceSchema.index({ executionId: 1 });
evidenceSchema.index({ category: 1 });
evidenceSchema.index({ taskId: 1, category: 1, createdAt: -1 });

export type Evidence = InferSchemaType<typeof evidenceSchema>;
export type EvidenceObjectId = Types.ObjectId;
export type EvidenceModel = mongoose.Model<Evidence>;

export default (models.Evidence as EvidenceModel) || model<Evidence>('Evidence', evidenceSchema);
