import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const taskExecutionStatuses = ['not_started', 'arrival_confirmed', 'started', 'waiting_validation', 'finished', 'closed'] as const;
export const taskExecutionSyncStatuses = ['pending', 'synced', 'error'] as const;

const executionLocationSchema = new Schema(
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
    address: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const taskExecutionSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: taskExecutionStatuses,
      default: 'not_started',
    },
    arrivalAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    startedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    finishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    closedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    startLocation: {
      type: executionLocationSchema,
      required: false,
    },
    endLocation: {
      type: executionLocationSchema,
      required: false,
    },
    durationSeconds: {
      type: Number,
      min: 0,
    },
    closingNotes: {
      type: String,
      trim: true,
    },
    syncStatus: {
      type: String,
      enum: taskExecutionSyncStatuses,
      default: 'pending',
    },
  },
  { timestamps: true }
);

taskExecutionSchema.index({ taskId: 1 }, { unique: true });
taskExecutionSchema.index({ status: 1 });
taskExecutionSchema.index({ syncStatus: 1, updatedAt: -1 });

export type TaskExecution = InferSchemaType<typeof taskExecutionSchema>;
export type TaskExecutionObjectId = Types.ObjectId;
export type TaskExecutionModel = mongoose.Model<TaskExecution>;

export default (models.TaskExecution as TaskExecutionModel) || model<TaskExecution>('TaskExecution', taskExecutionSchema);
