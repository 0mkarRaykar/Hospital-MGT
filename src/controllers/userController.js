import mongoose, { isValidObjectId } from "mongoose";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/userModel.js";

// @desc     fetch all user from db (role based fetching)
// route     GET api/v1/users/getAllUsers
// @accesss  Private

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user._id);

    if (!requestingUser) {
      return res.status(404).json({
        success: false,
        message: "Requesting user not found",
      });
    }

    // Check if the user's role is allowed (0 or 1)
    const { role } = requestingUser;
    if (![0, 1].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Unauthorized to access this resource",
      });
    }

    // Fetch users only if authorized
    const users = await User.find({
      isActive: true,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
    });
  }
});

// @desc     fetch a user by Id from db
// route     GET api/v1/users/{id}
// @accesss  Private
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // validate userId parameter
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // find the user by ID
  const user = await User.findById(userId);

  //check if the user was found
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // return the user details
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// @desc     update user by Id from db
// route     PATCH api/v1/users/{id}
// @accesss  Private
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, mobileNumber } = req.body;

  // validate user
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  //Prepare the update object
  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;
  if (mobileNumber) updateData.mobileNumber = mobileNumber;

  // update user
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  // check if user was found and update
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  // return the updated user details
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// @desc     delete user by Id from db (soft-delete)
// route     POST api/v1/users/{id}
// @accesss  Private
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // validate the userId
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Delete the user (soft delete)
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // return success message
  return res
    .status(200)
    .json(new ApiResponse(200, "", "User deleted successfully"));
});

export { getAllUsers, getUserById, updateUser, deleteUser };
