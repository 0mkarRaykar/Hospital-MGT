import mongoose, { isValidObjectId } from "mongoose";

// import utils
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// import model(s)
import { Hospital } from "../models/hospitalModel.js";
import { Bed } from "../models/bedModel.js";
import { Facility } from "../models/facilityModel.js";

// @desc     create new hospital (role based)
// route     POST api/v1/hospitals/createHospital
// @accesss  Private
const createHospital = asyncHandler(async (req, res) => {
  const { name, address, specializedIn, contactNumber } = req.body;

  //validate user role
  const allowedRoles = ["Admin"]
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "You are not authorized to create a hospital");
  }

  // validate required fields
  if (
    !name ||
    !address?.state ||
    !address?.city ||
    !address?.pincode ||
    !specializedIn ||
    !contactNumber
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // create the hospital
  const hospital = await Hospital.create({
    name,
    address,
    specializedIn,
    contactNumber
  })
  // respond with the created hospital
  return res
    .status(201)
    .json(new ApiResponse(201, hospital, "Hospital created successfully"));

});

// @desc     fetch all hospital from db (role based fetching)
// route     GET api/v1/hospitals/getAllHospital
// @accesss  Private

const getAllHospital = asyncHandler(async(req,res)=>{
  // fetch the role of the requesting user
  const requestingUser = await Hospital.findById(req.user._id)
  if(!requestingUser){
    throw new ApiError(404, "Requesting user not found")
  }

  let roleFilter = {};

  if (!requestingUser.role === "Admin" || "Hospital") {
    throw new ApiError(401, "Unauthorized to access the resource");
  }
  // Fetch users based on the role filter, active status, and non-deleted status
    const users = await Hospital.find({
      ...roleFilter,
      isActive: true,
      isDeleted: false,
    });
    // Return the fetched users
    res
      .status(200)
      .json(new ApiResponse(200, "Hospital fetched successfully", users));
})

// @desc     fetch a hospital by Id from db
// route     GET api/v1/hospitals/{id}
// @accesss  Private
const getHospitalById = asyncHandler(async(req,res)=>{
  const {hospitalId} = req.params;

  // validate hospitalId parameter
  if (!isValidObjectId(hospitalId)) {
    throw new ApiError(400, "Invalid hospital ID");
  }

  const hospital = await Hospital.findById(hospitalId)
  //check if the hospital was found
  if (!hospital) {
    throw new ApiError(404, "hospital not found");
  }

  // return the hospital details
  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Facility fetched successfully"));
})

// @desc     update hospital by Id from db (role based)
// route     PATCH api/v1/hospitals/{id}
// @accesss  Private
const updateHospital= asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  const { name, address, specializedIn, contactNumber } = req.body;

  // validate hospital
  if (!isValidObjectId(hospitalId)) {
    throw new ApiError(400, "Invalid hospital ID");
  }
  // Prepare the update object
  const updateData = {};
  if (name) updateData.name = name;
  if (address) updateData.address = address;
  if (specializedIn) updateData.specializedIn = specializedIn;
  if (contactNumber) updateData.contactNumber = contactNumber;
 

  // update user
  const updatedHospital = await Hospital.findByIdAndUpdate(
    hospitalId,
    updateData,
    {
      new: true,
    }
  );

  // check if hospital was found and update
  if (!updatedHospital) {
    throw new ApiError(404, "hospital not found");
  }

  // return the updated hospital details
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedHospital, "hospital updated successfully")
    );
});

// @desc     delete hospital by Id from db (soft-delete & role based)
// route     POST api/v1/hospitals/{id}
// @accesss  Private
const deleteHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;

  // validate the hospitalId
  if (!isValidObjectId(hospitalId)) {
    throw new ApiError(400, "Invalid hospital ID");
  }

  // Delete the hospital (soft delete)
  const hospital = await Hospital.findByIdAndUpdate(
    hospitalId,
    { isDeleted: true },
    { new: true }
  );

  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  //return success message
  return res
    .status(200)
    .json(new ApiResponse(200, "", "Hospital deleted successfully"));
});

export {
 createHospital,
 getAllHospital,
 getHospitalById,
 updateHospital,
 deleteHospital
};
