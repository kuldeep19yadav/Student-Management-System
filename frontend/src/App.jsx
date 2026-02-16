import { useEffect, useState } from "react";
import api, { setAuthToken } from "./api/axios";
import { encryptPayload } from "./utils/crypto";

import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";

function App() {
  const [token, setToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    studentId: "",
    grade: "",
  });

  // Initialize system authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      // Request JWT using client credentials
      const tokenRes = await api.post("/token", {
        client_id: "myclient123",
        client_secret: "supersecret456",
      });

      const accessToken = tokenRes.data.access_token;
      setToken(accessToken);
      setAuthToken(accessToken);

      const keyRes = await api.get("/public-key");
      setPublicKey(keyRes.data.publicKey);
    };

    initializeAuth();
  }, []);

  // Fetch all students from backend
  const fetchStudents = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    if (token) fetchStudents();
  }, [token]);

  // Handle create or update 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const encrypted = await encryptPayload(form, publicKey);

      if (editingId) {
        await api.put(`/students/${editingId}`, encrypted);
        setEditingId(null);
      } else {
        await api.post("/students", encrypted);
      }

      setForm({ name: "", studentId: "", grade: "" });
      fetchStudents();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      studentId: student.studentId,
      grade: student.grade,
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <StudentForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingId={editingId}
        error={error}
      />

      <StudentTable
        students={students}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
