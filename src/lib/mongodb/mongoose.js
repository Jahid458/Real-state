import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);
  if (initialized) {
    console.log("MongoDB  Already Connected.  ");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Real_State",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    initialized = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
  }
};
