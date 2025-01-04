import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button, Container, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    uname: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
      valid = false;
    }

    if (!formData.uname.trim()) {
      newErrors.uname = 'Username is required.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address.';
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Select user role.';
      valid = false;
    }    

    if (!formData.password) {
      newErrors.password = 'Password is required.';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Call it only once to prevent default form submission
    if (validate()) {
      console.log('Form submitted successfully:', formData);
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND}/api/users/register`, formData);
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };
  

  return (
    <Container fluid className="m-20">
      <Card className="mx-auto shadow-sm" 
        style={{ width: '50%', padding: '20px', backgroundColor: '#cccccc0c', color: '#fff', 
        borderRadius: '20px', border: '1px solid #999'
       }}>
        <h1 className="text-center mb-4">Register</h1>
        <Col md={12} className="m-auto" style={{ color: '#000' }}>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FloatingLabel controlId="name" label="Full Name" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="First and Last Name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="uname" label="Username" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={formData.uname}
                    onChange={handleChange}
                    isInvalid={!!errors.uname}
                  />
                  <Form.Control.Feedback type="invalid">{errors.uname}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FloatingLabel controlId="email" label="Email address" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="role" label="User Role" className="mb-3">
                  <Form.Select value={formData.role} onChange={handleRoleChange} isInvalid={!!errors.role}>
                    <option value="">Choose user role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel controlId="password" label="Password" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>

            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Sign up
              </Button>
            </div>
          </form>
        </Col>
      </Card>
    </Container>
  );
};

export default Register;