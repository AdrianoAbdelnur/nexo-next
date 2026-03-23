import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

const companySchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    tradeName: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
    address: {
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

companySchema.index({ businessName: 1 });
companySchema.index({ active: 1, tradeName: 1 });

export type Company = InferSchemaType<typeof companySchema>;
export type CompanyObjectId = Types.ObjectId;
export type CompanyModel = mongoose.Model<Company>;

export default (models.Company as CompanyModel) || model<Company>('Company', companySchema);
