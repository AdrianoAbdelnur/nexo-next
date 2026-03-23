import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const activityEntityTypes = [
  'company',
  'contact',
  'vehicle',
  'service_request',
  'task',
  'task_execution',
  'task_resource',
  'evidence',
  'user',
] as const;
export const activitySourcePlatforms = ['web', 'mobile', 'system'] as const;

const activityLogSchema = new Schema(
  {
    entityType: {
      type: String,
      enum: activityEntityTypes,
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      trim: true,
    },
    oldValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    description: {
      type: String,
      trim: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    actorNameSnapshot: {
      type: String,
      trim: true,
    },
    sourceModule: {
      type: String,
      trim: true,
    },
    sourcePlatform: {
      type: String,
      enum: activitySourcePlatforms,
      default: 'web',
    },
    ip: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ actorId: 1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, createdAt: -1 });

export type ActivityLog = InferSchemaType<typeof activityLogSchema>;
export type ActivityLogObjectId = Types.ObjectId;
export type ActivityLogModel = mongoose.Model<ActivityLog>;

export default (models.ActivityLog as ActivityLogModel) || model<ActivityLog>('ActivityLog', activityLogSchema);
