import mongoose, { InferSchemaType, Schema, model, models, Types } from 'mongoose';

export const contactPreferredMethods = ['phone', 'email', 'whatsapp', 'other'] as const;

const contactSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
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
    notes: {
      type: String,
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: contactPreferredMethods,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

contactSchema.index({ companyId: 1, active: 1 });
contactSchema.index({ companyId: 1, name: 1 });
contactSchema.index({ email: 1 });

export type Contact = InferSchemaType<typeof contactSchema>;
export type ContactObjectId = Types.ObjectId;
export type ContactModel = mongoose.Model<Contact>;

export default (models.Contact as ContactModel) || model<Contact>('Contact', contactSchema);
