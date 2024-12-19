import mongoose, { isValidObjectId } from "mongoose";

// import utils
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// import model(s)
import { User } from "../models/userModel.js";
import { Patient } from "../models/patientModel.js";
import { Doctor } from "../models/doctorModel.js";

// @desc     create new patient (role based)
// route     POST api/v1/patients/createPatient
// @accesss  Private
const createPatient = asyncHandler(async (req, res) => {
  const {
    userId,
    age,
    bloodGroup,
    medicalHistory,
    allergies,
    hospitalId,
    emergencyContact,
    currentCondition,
    gender,
    assignedDoctor,
  } = req.body;

  // validate user role
  const allowedRoles = ["Hospital"];
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "You are not authorized to create a patient");
  }

  // validate required fields
  if (
    !age ||
    !bloodGroup ||
    !medicalHistory ||
    !allergies ||
    !emergencyContact ||
    !currentCondition ||
    !gender
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // create the patient
  const patient = await Patient.create({
    userId,
    age,
    bloodGroup,
    medicalHistory,
    allergies,
    hospitalId,
    emergencyContact,
    currentCondition,
    gender,
    assignedDoctor,
  });

  // respond with the created patient
  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient created successfully"));
});

// @desc     fetch all patient from db (role based fetching)
// route     GET api/v1/patients/getAllPatient
// @accesss  Private
const getAllPatient = asyncHandler(async (req, res) => {
  // fetch the role of the requesting user
  const requestingUser = await User.findById(req.user._id);
  if (!requestingUser) {
    throw new ApiError(404, "Requesting user not found");
  }

  let roleFilter = {};

  if (requestingUser.role === "Patient") {
    throw new ApiError(401, "Unauthorized to access the resource");
  }
  // Fetch users based on the role filter, active status, and non-deleted status
  const users = await Patient.find({
    ...roleFilter,
    isActive: true,
    isDeleted: false,
  });
  // Return the fetched users
  res
    .status(200)
    .json(new ApiResponse(200, "Patients fetched successfully", users));
});

// @desc     fetch a patient by Id from db
// route     GET api/v1/patients/{id}
// @accesss  Private
const getPatientById = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  // validate patientId parameter
  if (!isValidObjectId(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  const patient = await Patient.findById(req.params.id)
    .populate("user")
    .populate("assignedDoctor");

  //check if the patient was found
  if (!patient) {
    throw new ApiError(404, "patient not found");
  }

  // return the user details
  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient fetched successfully"));
});

// @desc     update patient by Id from db (role based)
// route     PATCH api/v1/patients/{id}
// @accesss  Private
const updatePatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const {
    age,
    bloodGroup,
    medicalHistory,
    allergies,
    hospitalId,
    emergencyContact,
    currentCondition,
    gender,
    assignedDoctor,
  } = req.body;

  // validate patient
  if (!isValidObjectId(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  // Prepare the update object
  const updateData = {};
  if (age) updateData.age = age;
  if (bloodGroup) updateData.bloodGroup = bloodGroup;
  if (medicalHistory) updateData.medicalHistory = medicalHistory;
  if (allergies) updateData.allergies = allergies;
  if (hospitalId) updateData.hospitalId = hospitalId;
  if (emergencyContact) updateData.emergencyContact = emergencyContact;
  if (currentCondition) updateData.currentCondition = currentCondition;
  if (gender) updateData.gender = gender;
  if (assignedDoctor) updateData.assignedDoctor = assignedDoctor;

  // update user
  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    updateData,
    {
      new: true,
    }
  );

  // check if patient was found and update
  if (!updatePatient) {
    throw new ApiError(404, "Patient not found");
  }

  // return the updated patient details
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, "Patient updated successfully"));
});

// @desc     delete patient by Id from db (soft-delete & role based)
// route     POST api/v1/patient/{id}
// @accesss  Private
const deletePatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  // validate the patientId
  if (!isValidObjectId(patientId)) {
    throw new ApiError(400, "Invalid patient ID");
  }

  // Delete the patient (soft delete)
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    { isDeleted: true },
    { new: true }
  );
  if (!patient) {
    throw new ApiError(404, "patient not found");
  }

  //return success message
  return res
    .status(200)
    .json(new ApiResponse(200, "", "patient deleted successfully"));
});

export {
  createPatient,
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
