import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    const statusMap = {
      0: { label: "Pending", color: "warning" },
      1: { label: "Rejected", color: "danger" },
      2: { label: "Pending", color: "warning" },
      3: { label: "Rejected", color: "danger" },
      4: { label: "Pending", color: "warning" },
      5: { label: "Rejected", color: "danger" },
      6: { label: "Accepted", color: "success" },
    };
    return statusMap[status] || "Unknown";
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("No auth token found. Please log in.");
        }

        const teacherInfo = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/admin/teachers`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (teacherInfo.data.length === 0) {
          throw new Error("No teacher data found");
        }

        setTeachers(teacherInfo.data);
        setFilteredTeachers(teacherInfo.data);
      } catch (err) {
        console.error("Error fetching teacher data:", err.message);
        setError("Failed to fetch teacher data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchValue = e.target.value.toLowerCase();
    setFilteredTeachers(
      teachers.filter((teacher) =>
        [teacher.teachId?.name, teacher.subject, getStatusLabel(teacher.formStatus)]
          .map((value) => (value || "").toLowerCase())
          .some((value) => value.includes(searchValue))
      )
    );
  };

  const handleSort = (key) => {
    const sorted = [...filteredTeachers].sort((a, b) => {
      const aValue = key === "status" ? getStatusLabel(a.formStatus) : a[key];
      const bValue = key === "status" ? getStatusLabel(b.formStatus) : b[key];
      return aValue > bValue ? 1 : -1;
    });
    setFilteredTeachers(sorted);
    setSortBy(key);
  };

  const handleViewClick = (teacher) => {
    if (teacher._id) {
      navigate(`/admin/teachers/form/${teacher._id}`);
    } else {
      alert("Form ID is missing for this teacher.");
    }
  };

  const pendingRequestsCount = teachers.filter((teacher) =>
    [0, 2, 4].includes(teacher.formStatus)
  ).length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="my-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="d-flex justify-content-center align-items-center">
          <h1 className="mb-0">Teacher List</h1>
          <sup className="badge bg-warning ms-2">Pending Requests: {pendingRequestsCount}</sup>
        </h6>
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Search by name, subject, or status"
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <Table variant="dark" striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Sr. No.</th>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Teacher Name {sortBy === "name" && "🔽"}
            </th>
            <th onClick={() => handleSort("subject")} style={{ cursor: "pointer" }}>
              Subject {sortBy === "subject" && "🔽"}
            </th>
            <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
              Status {sortBy === "status" && "🔽"}
            </th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher, index) => (
            <tr key={index} className="text-center">
              <td>{index + 1}.</td>
              <td>{teacher.teachId?.name}</td>
              <td>{teacher.subject}</td>
              <td className={`text-${getStatusLabel(teacher.formStatus).color}`}>{getStatusLabel(teacher.formStatus).label}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewClick(teacher)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TeacherList;