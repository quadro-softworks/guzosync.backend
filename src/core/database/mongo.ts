// src/core/database/mongo.ts
import mongoose from "mongoose";
import config from "@core/config"; // We'll create this next

export const connectDB = async (): Promise<void> => {
  try {
    if (config.mongo.uri === undefined) {
      throw new Error("MongoDB URI is not defined in the configuration.");
    }
    await mongoose.connect(config.mongo.uri);
    console.log("MongoDB Connected successfully.");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      // Potentially exit the process or implement retry logic
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};
