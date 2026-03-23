import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const taskServiceTypes = ['installation', 'removal', 'maintenance'] as const;
export const taskStatuses = [
  'pending',
  'coordinated',
  'resources_defined',
  'assigned',
  'on_the_way',
  'on_site',
  'started',
  'in_progress',
  'paused',
  'completed',
  'observed',
  'rescheduled',
  'cancelled',
] as const;

const locationSchema = new Schema(
  {
    address: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  { _id: false }
);

const companySnapshotSchema = new Schema(
  {
    businessName: {
      type: String,
      trim: true,
    },
    tradeName: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const contactSnapshotSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { _id: false }
);

const vehicleSnapshotSchema = new Schema(
  {
    plate: {
      type: String,
      uppercase: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      index: true,
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
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    serviceType: {
      type: String,
      enum: taskServiceTypes,
      required: true,
    },
    status: {
      type: String,
      enum: taskStatuses,
      default: 'pending',
      index: true,
    },
    scheduledDate: {
      type: Date,
      index: true,
    },
    scheduledTimeStart: {
      type: String,
      trim: true,
    },
    scheduledTimeEnd: {
      type: String,
      trim: true,
    },
    location: {
      type: locationSchema,
      required: false,
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    coordinatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    constraints: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    replicatedFromTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    order: {
      type: Number,
      min: 0,
    },
    companySnapshot: {
      type: companySnapshotSchema,
      required: false,
    },
    contactSnapshot: {
      type: contactSnapshotSchema,
      required: false,
    },
    vehicleSnapshot: {
      type: vehicleSnapshotSchema,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

taskSchema.index({ requestId: 1 });
taskSchema.index({ technicianId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ scheduledDate: 1 });
taskSchema.index({ companyId: 1, status: 1, scheduledDate: 1 });

export type Task = InferSchemaType<typeof taskSchema>;
export type TaskObjectId = Types.ObjectId;
export type TaskModel = mongoose.Model<Task>;

export default (models.Task as TaskModel) || model<Task>('Task', taskSchema);
