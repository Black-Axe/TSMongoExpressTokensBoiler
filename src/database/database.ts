import config from "../../config/defaults";
import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = config.mongoURI;
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
