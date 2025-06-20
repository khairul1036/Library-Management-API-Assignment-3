import mongoose from "mongoose";
import config from "./config";
import app from "./app";

const serverStarts = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@cluster0.ah9aw.mongodb.net/LibraryDB?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Mongodb connected by Mongoose");

    await app.listen(config.PORT, () => {
      console.log("App listening on port", config.PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

serverStarts();
