import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button, Container, Col, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';

const Login = ({ onAdminLogin, onStudentLogin, onTeacherLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username or email address is required.';
    } else if (username.includes('@') && !/\S+@\S+\.\S+/.test(username)) {
      newErrors.username = 'Invalid email address format.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiError('');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/users/login`,
        { username, password }
      );

      console.log('Login successful:', response.data);

      const { role, token } = response.data;

      localStorage.setItem('authToken', token);

      if (role === 'admin') {
        onAdminLogin();
        navigate('/admin');
      } else if (role === 'student') {
        onStudentLogin();
        navigate('/student');
      } else if (role === 'teacher') {
        onTeacherLogin();
        navigate('/teacher');
      } else {
        setApiError('Invalid role. Please contact support.');
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="m-20">
      <Card
        className="mx-auto"
        style={{
          width: '40%',
          padding: '20px',
          backgroundColor: '#cccccc0c',
          color: '#fff',
          borderRadius: '20px',
          border: '1px solid #999',
        }}
      >
        <h1 className="text-center mt-4">Login</h1>
        <Col className="m-auto" style={{ width: '80%', color: '#000' }}>
          <Form onSubmit={handleSubmit}>
            {apiError && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setApiError('')}
              >
                {apiError}
              </Alert>
            )}
            <FloatingLabel
              controlId="uname"
              label="Username or Email address"
              className="m-3"
            >
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </FloatingLabel>
            <div className="relative">
              <FloatingLabel controlId="pw" label="Password" className="m-3">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Button
                  className="position-absolute top-7 end-0 translate-middle-y me-2"
                  style={{ zIndex: 1 }}
                  variant="light"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <Button
                type="submit"
                className="m-3"
                variant="primary"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Sign in'}
              </Button>
            </div>
          </Form>
        </Col>
      </Card>
    </Container>
  );
};

Login.propTypes = {
  onAdminLogin: PropTypes.func.isRequired,
  onStudentLogin: PropTypes.func.isRequired,
  onTeacherLogin: PropTypes.func.isRequired,
};

export default Login;