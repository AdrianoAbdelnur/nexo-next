import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const taskResourceTypes = ['electronic_device', 'company_vehicle', 'tool', 'supply', 'accessory', 'other'] as const;
export const taskResourceSources = ['odoo', 'manual'] as const;
export const taskResourceStatuses = ['planned', 'reserved', 'used', 'cancelled'] as const;

const taskResourceSnapshotSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    serial: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const taskResourceSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: taskResourceTypes,
      required: true,
    },
    source: {
      type: String,
      enum: taskResourceSources,
      default: 'manual',
    },
    externalResourceId: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    plannedQty: {
      type: Number,
      default: 1,
      min: 0,
    },
    usedQty: {
      type: Number,
      min: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: taskResourceStatuses,
      default: 'planned',
    },
    notes: {
      type: String,
      trim: true,
    },
    snapshot: {
      type: taskResourceSnapshotSchema,
      required: false,
    },
  },
  { timestamps: true }
);

taskResourceSchema.index({ taskId: 1, status: 1 });
taskResourceSchema.index({ taskId: 1, resourceType: 1 });
taskResourceSchema.index({ source: 1, externalResourceId: 1 });

export type TaskResource = InferSchemaType<typeof taskResourceSchema>;
export type TaskResourceObjectId = Types.ObjectId;
export type TaskResourceModel = mongoose.Model<TaskResource>;

export default (models.TaskResource as TaskResourceModel) || model<TaskResource>('TaskResource', taskResourceSchema);
