import mongoose from "mongoose";

export async function connectDb() {
  try {
    // Use await to ensure connection completes
    await mongoose.connect(process.env.MONGODB_URI!);

    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to database");
    });
    connection.on("error", (error) => {
      console.log("Error connecting to database: ", error);
      process.exit(1); // Only exit on error
    });

  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1); // Exit if initial connection fails
  }
}