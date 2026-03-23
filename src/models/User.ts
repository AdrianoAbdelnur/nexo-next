import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const userRoleTypes = ['admin', 'manager', 'operator', 'coordinator', 'technician'] as const;

const technicianProfileSchema = new Schema(
  {
    skills: {
      type: [String],
      default: [],
    },
    zone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    roleType: {
      type: String,
      enum: userRoleTypes,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    technicianProfile: {
      type: technicianProfileSchema,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ roleType: 1, active: 1 });

export type User = InferSchemaType<typeof userSchema>;
export type UserObjectId = Types.ObjectId;
export type UserModel = mongoose.Model<User>;

export default (models.User as UserModel) || model<User>('User', userSchema);
