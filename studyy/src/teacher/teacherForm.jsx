import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function TeacherForm() {
  const { teachId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sex: '',
    age: '',
    qualification: '',
    subject: '',
    pastExp: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [qualificationPreview, setQualificationPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch teacher data if teachId is available
    const fetchTeacherData = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_BACKEND}/api/users/${teachId}`);
        console.log(resp.data);
        setFormData({
          ...formData,
          name: resp.data.name,
          email: resp.data.email,
          sex: resp.data.sex,
          age: resp.data.age,
          qualification: resp.data.qualification,
          subject: resp.data.subject,
          pastExp: resp.data.pastExp,
          image: resp.data.image
        });

        // Set previews for image and qualification if available
        setImagePreview(resp.data.image);
        setQualificationPreview(resp.data.qualification);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    if (teachId) {
      fetchTeacherData();
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (field === 'image') {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (field === 'qualification') {
      setFormData({ ...formData, qualification: file });
      setQualificationPreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/teachers`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Teacher added successfully:', response.data);
      setError('');
    } catch (err) {
      console.error('Error adding teacher:', err.response || err);
      setError('Failed to submit the form. Please check your inputs.');
    }
  };

  return (
    <Container>
      <Card className="mt-5 shadow-lg" style={{ backgroundColor: '#cccccc0c' }}>
        <Card.Body>
          <h2 className="text-center text-primary mb-4">Teacher Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Enter name"
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email"
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3" controlId="formSex">
                  <Form.Label>Sex</Form.Label>
                  <Form.Control
                    as="select"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3" controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    placeholder="Enter age"
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formQualification">
                  <Form.Label>Qualification (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="qualification"
                    onChange={(e) => handleFileChange(e, 'qualification')}
                    accept=".pdf"
                    required
                  />
                  {qualificationPreview && (
                    <div className="mt-2 text-success">
                      Selected File: {qualificationPreview}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    placeholder="Enter subject"
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={(e) => handleFileChange(e, 'image')}
                    accept="image/*"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={10}>
                <Form.Group className="mb-3" controlId="formPastExp">
                  <Form.Label>Past Experience</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="pastExp"
                    value={formData.pastExp}
                    placeholder="Enter past experience"
                    rows={3}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                Profile Image Preview
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '50%', height: '50%', borderRadius: '10px' }}
                      className="border"
                    />
                  </div>
                )}
              </Col>
            </Row>

            {error && <div className="text-danger mb-3">{error}</div>}

            <div className="text-center">
              <Button variant="primary" type="submit" className="px-4">
                Register Teacher
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TeacherForm;