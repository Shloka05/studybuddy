import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button, Container, Col, Card } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username or email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(username) && username.includes('@')) {
      newErrors.username = 'Invalid email address format.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log('Login submitted with:', { username, password });
    }
  };

  return (
    <>
      <Container
        fluid className="m-20"
      >
        <Card
          className="mx-auto"
          style={{ width: '40%', padding: '20px', backgroundColor: '#cccccc0c', color: '#fff', 
            borderRadius: '20px', border: '1px solid #999'
           }}
        >
          <h1 className="text-center mt-4">Login</h1>
          <Col className="m-auto" style={{ width: '80%', color: '#000' }}>
            <Form onSubmit={handleSubmit}>
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
              <FloatingLabel controlId="pw" label="Password" className="m-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
              <div className="d-flex justify-content-center mb-4">
                <Button type="submit" className="m-3"  variant="primary">
                  Sign in
                </Button>
              </div>
            </Form>
          </Col>
        </Card>
      </Container>
    </>
  );
};

export default Login;
