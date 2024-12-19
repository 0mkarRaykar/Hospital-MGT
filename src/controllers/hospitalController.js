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
  const allowedRoles = 
});
