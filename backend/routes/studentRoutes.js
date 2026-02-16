const express = require("express");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function (privateKey, decryptMiddleware) {
  const router = express.Router();

  // All routes protected by JWT
  router.use(authMiddleware);

  // CREATE 
  router.post("/", decryptMiddleware(privateKey), async (req, res) => {
    try {
      const student = new Student(req.body);
      await student.save();
      return res.json(student);
    } catch (err) {
      // Duplicate Student ID error
      if (err.code === 11000) {
        return res.status(400).json({
          message: "Student ID already exists",
        });
      }

      console.error("POST Error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  });

  // READ 
  router.get("/", async (req, res) => {
    const students = await Student.find();
    res.json(students);
  });

  // UPDATE 
  router.put("/:id", decryptMiddleware(privateKey), async (req, res) => {
    try {
      const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
      });
      return res.json(updated);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          message: "Student ID already exists",
        });
      }

      console.error("PUT Error:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  });

  return router;
};
