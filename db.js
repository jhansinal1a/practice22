const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  const connection = await mongoose.connect(uri, {
    dbName: "waypoint_portal",
    serverSelectionTimeoutMS: 15000,
  });

  console.log(
    `MongoDB Atlas connected: ${connection.connection.name}`
  );

  return connection;
}

module.exports = connectDB;