import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Row, Col, Button, Modal } from "react-bootstrap";

const TeacherDetails = () => {
  const { teacherId } = useParams(); // Get teacherId from URL params
  const [teacher, setTeacher] = useState(null);
  const [qualificationBlob, setQualificationBlob] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacher = async () => {
      if (loading) {
        try {
          const authToken = localStorage.getItem("authToken");
          if (!authToken) {
            throw new Error("No auth token found. Please log in.");
          }

          // Fetch teacher details
          const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/admin/${teacherId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!response.data) {
            throw new Error("Teacher not found");
          }
          const teacherData = response.data;
          setTeacher(teacherData);

          // Convert qualification file data into Blob
          const qualificationArray = new Uint8Array(teacherData.qualification.data.data);
          setQualificationBlob(
            URL.createObjectURL(
              new Blob([qualificationArray], {
                type: teacherData.qualification.contentType,
              })
            )
          );

          // Convert image file data into Blob
          const imageArray = new Uint8Array(teacherData.image.data.data);
          setImageBlob(
            URL.createObjectURL(
              new Blob([imageArray], {
                type: teacherData.image.contentType,
              })
            )
          );
        } catch (err) {
          console.error("Error fetching teacher data:", err.message);
          setError("Failed to fetch teacher data. Please try again later.");
        } finally {
          setLoading(false); // Ensure loading is set to false after fetching
        }
      }
    };

    fetchTeacher();
  }, [teacherId, loading]);

  const handleAccept = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND}/api/admin/${teacherId}`,
        { formStatus: 6 },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      navigate("/admin/teachers");
      setShowAcceptModal(false);
      // Optionally refresh teacher data
    } catch (error) {
      console.error("Error accepting teacher:", error);
      alert("Failed to accept teacher. Please try again.");
    }
  };
  
  const handleReject = async () => {
    try {
      if (!remark.trim()) {
        alert("Please add a remark before rejecting.");
        return;
      }
      const authToken = localStorage.getItem("authToken");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND}/api/admin/${teacherId}`,
        { formStatus: teacher.formStatus + 1, remark }, // Increment status and add remark
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      navigate("/admin/teachers");
      setShowRejectModal(false);
      setRemark(""); // Reset remark
      // Optionally refresh teacher data
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      alert("Failed to reject teacher. Please try again.");
    }
  };
  

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  if (loading || !teacher ) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <Container className="py-5">
      <Card className="py-3" style={{ backgroundColor: "#cccccc0c", color: "#ccc" }}>
        <Card.Body>
          <h2 className="text-center text-primary mb-4">Teacher Details</h2>
          <Form>
            <Row>
                <Col md={10}>
                    <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={teacher.teachId.name} readOnly />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={teacher.teachId.email} readOnly />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control type="text" value={teacher.subject} readOnly />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                        <Form.Label>Sex</Form.Label>
                        <Form.Control type="text" value={teacher.sex} readOnly />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" value={teacher.age} readOnly />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                        <Form.Label>Past Experience</Form.Label>
                        <Form.Control as="textarea" rows={2} value={teacher.pastExp} readOnly />
                        </Form.Group>
                    </Col>
                    </Row>
                </Col>
                
                <Col md={2}>
                    <Form.Group className="mb-3">
                    <Form.Label>Profile Image</Form.Label>
                    <div>
                        <img
                        src={imageBlob}
                        alt="Teacher Profile"
                        style={{  width: '90%', borderRadius: "10px" }}
                        />
                    </div>
                    </Form.Group>
                </Col>
            </Row>

            <Col md={12}>
              <Form.Group className="mb-3">
              <Form.Label className="flex justify-between">Qualification (PDF)
              <a href={qualificationBlob} target="_blank" rel="noopener noreferrer">
                Download Qualification
              </a>
              </Form.Label> 
              <div>
                  {qualificationBlob && teacher.qualification.contentType === "application/pdf" ? (
                  <iframe
                      src={qualificationBlob}
                      style={{ width: "100%", height: "500px" }}
                      title="Qualification PDF"
                  ></iframe>
                  ) : (
                  <p className="text-warning">Cannot preview. Unsupported file type.</p>
                  )}
              </div>
              </Form.Group>
            </Col>

            <div className="mt-3 w-[100%] flex justify-content-evenly">
              {(teacher.formStatus === 0 || teacher.formStatus === 2 || teacher.formStatus === 4) && (
                <>
                  <Button variant="danger" className="px-4" onClick={() => setShowRejectModal(true)}>
                    Reject
                  </Button>
                  <Button variant="success" className="px-4" onClick={() => setShowAcceptModal(true)}>
                    Accept
                  </Button>
                </>
              )}

              {(teacher.formStatus === 1 || teacher.formStatus === 3 || teacher.formStatus === 5) && (
                <Button variant="danger" className="px-4" disabled>
                  Rejected
                </Button>
              )}

              {teacher.formStatus === 6 && (
                <Button variant="success" className="px-4" disabled>
                  Accepted
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Accept Modal */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header style={{ backgroundColor: '#222', color: '#ccc' }} closeButton>
          <Modal.Title>Confirm Accept</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#222', color: '#ccc' }}>Are you sure you want to accept this teacher?</Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#222', color: '#ccc' }}>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAccept}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header style={{ backgroundColor: '#222', color: '#ccc' }} closeButton>
          <Modal.Title>Reject Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#222', color: '#ccc' }}>
          <Form.Group><p>Are you sure you want to reject this teacher?</p>
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea" autoFocus
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#222', color: '#ccc' }}>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherDetails;
