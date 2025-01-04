import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';

function TeacherForm() {
  const [formData, setFormData] = useState({
    teachId: '', // Will hold User ID
    name: '', // Pre-filled from User
    email: '', // Pre-filled from User
    sex: '',
    age: '',
    qualification: '',
    subject: '',
    pastExp: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
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
      <Card className="mt-4 p-4">
        <h2 className="text-center">Teacher Registration</h2>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3" controlId="formQualification">
            <Form.Label>Qualification</Form.Label>
            <Form.Control
              type="text"
              name="qualification"
              value={formData.qualification}
              placeholder="Enter qualification"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="formPastExp">
            <Form.Label>Past Experience</Form.Label>
            <Form.Control
              type="text"
              name="pastExp"
              value={formData.pastExp}
              placeholder="Enter past experience"
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '150px', maxHeight: '150px' }}
                />
              </div>
            )}
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}

          <Button variant="primary" type="submit">
            Register Teacher
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default TeacherForm;

