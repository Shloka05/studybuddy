import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button, Container, Row, Col, Table, Card } from 'react-bootstrap';

const Register = () =>  {
  return (
    <>
    <Container>
        <Card className='mx-auto my-8' style={{ width: '40%' }}>
            <h1 className='text-center mt-4'>Register</h1>
            <Col md={4} className='m-auto' style={{ width: '80%' }}>
                <FloatingLabel controlId="name" label="Full Name" className="m-3">
                    <Form.Control type="input" placeholder="First and Last Name" />
                </FloatingLabel>
                <FloatingLabel controlId="uname" label="Username" className="m-3">
                    <Form.Control type="input" placeholder="Username" />
                </FloatingLabel>
                <FloatingLabel controlId="email" label="Email address" className="m-3">
                    <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
                <FloatingLabel controlId="pw" label="Password" className="m-3">
                    <Form.Control type="password" placeholder="Password" />
                </FloatingLabel>
                <FloatingLabel controlId="rpw" label="Confirm Password" className="m-3">
                    <Form.Control type="password" placeholder="Confirm Password" />
                </FloatingLabel>
                <div className="d-flex justify-content-center mb-4">
                    <Button variant="primary" type="submit" className='m-3'>
                        Sign up
                    </Button>
                </div>
            </Col>
        </Card>
    </Container>
    </>
  );
}

export default Register;