import mongoose, { mongo } from "mongoose";

export async function connectDb(){
    try {
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to database");
        });
        connection.on("error", (error) => {
            console.log("Error connecting to database: ", error);
        });
        process.exit(1);
    } catch (error) {
        console.log("Error connecting to database: ", error);
    }
}