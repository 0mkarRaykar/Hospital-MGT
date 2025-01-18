import mongoose, { Schema } from "mongoose";

const FacilitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    type: {
      type: Number,
      enum: [0, 1, 2], // 0 - Hospital, 1 - Clinic, 2 - Health Center
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Facility = mongoose.model("facility", FacilitySchema);
