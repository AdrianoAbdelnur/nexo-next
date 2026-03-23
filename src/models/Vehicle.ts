import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

const vehicleSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    plate: {
      type: String,
      required: true,
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
      min: 1900,
    },
    color: {
      type: String,
      trim: true,
    },
    chassis: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

vehicleSchema.index({ companyId: 1, plate: 1 }, { unique: true });
vehicleSchema.index({ companyId: 1, active: 1 });
vehicleSchema.index({ plate: 1 });

export type Vehicle = InferSchemaType<typeof vehicleSchema>;
export type VehicleObjectId = Types.ObjectId;
export type VehicleModel = mongoose.Model<Vehicle>;

export default (models.Vehicle as VehicleModel) || model<Vehicle>('Vehicle', vehicleSchema);
