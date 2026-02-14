import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

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

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
