function StudentTable({ students, handleEdit, handleDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td>{s.name}</td>
            <td>{s.studentId}</td>
            <td>{s.grade}</td>
            <td>
              <button
                className="edit"
                onClick={() => handleEdit(s)}
              >
                Edit
              </button>{" "}
              <button
                className="delete"
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StudentTable;
