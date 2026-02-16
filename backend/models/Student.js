const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
    uppercase: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
