import connectDB from "./database";
import DBPopulate from "./Populate";

export async function initAndPopulateDB() {
    console.log("starting conn");
    await connectDB();
    console.log("Connected to MongoDB...");
    await DBPopulate.populate();
}