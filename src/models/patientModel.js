import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    name: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
      required: true,
    },
    allergies: [
      {
        type: String,
      },
    ],
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    emergencyContact: {
      type: String,
    },
    currentCondition: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("patient", PatientSchema);
