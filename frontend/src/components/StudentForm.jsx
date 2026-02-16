function StudentForm({
  form,
  setForm,
  handleSubmit,
  editingId,
  error
}) {
  return (
    <>
      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Student ID"
          value={form.studentId}
          onChange={(e) =>
            setForm({ ...form, studentId: e.target.value })
          }
        />

        <input
          placeholder="Grade"
          value={form.grade}
          onChange={(e) =>
            setForm({ ...form, grade: e.target.value })
          }
        />

        <button type="submit" className="primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>
    </>
  );
}

export default StudentForm;
