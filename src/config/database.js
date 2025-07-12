const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://avman1998:dsbLSknxJ4WfLO83@namastenodeaman.o2golta.mongodb.net/?retryWrites=true&w=majority&appName=namastenodeaman"
  );
};

module.exports = connectDB;
