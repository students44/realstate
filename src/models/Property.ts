import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  propertyType: "house" | "apartment" | "plot";
  purpose: "buy" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: "sqft" | "marla";
  location: {
    address: string;
    city: string;
    state?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  features: string[];
  owner: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "plot"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["buy", "rent"],
      required: true,
    },
    bedrooms: Number,
    bathrooms: Number,
    area: { type: Number, required: true },
    areaUnit: {
      type: String,
      enum: ["sqft", "marla"],
      default: "sqft",
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [{ type: String }],
    features: [{ type: String }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
