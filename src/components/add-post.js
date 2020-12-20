import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import  axios  from 'axios';
const Add = () => {

    const [validated, setValidated] = useState(false);
    const [input, setInputs] = useState({ title: '', body: '' });
    const [loading, load] = useState(false);
    const history = useHistory();

    const handleInputChange = (event) => {
        event.persist();
        setInputs(input => ({ ...input, [event.target.name]: event.target.value }));
    }
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            if (event) {
                event.preventDefault();
                const payload = {
                    'title': input.title,
                    'body': input.body,
                    userId: 1
                }
                load(true);
                axios.post(`https://jsonplaceholder.typicode.com/posts/`, { payload }).then(res => {
                    load(false);
                    toast.success('Added Successfully');
                    setTimeout(() => {
                        redirecToHome();
                    }, 2000);
                }).catch(e => {
                    load(false);
                    toast.error('Failed to add post');
                })
            }
        }
    }
    const redirecToHome = () => {
        history.push("/");
    }

    return (
        <Container>
            <Row>
                <Col className='form-design mt-4'>
                    <header><h2 className='text-left bg-title'><i class="fa fa-plus-circle f-icon"></i> Add Post</h2></header>
                    <Form className="text-left f-size list-header" noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label className="text-dark mb-0"><h5><strong>Title</strong></h5></Form.Label>
                            <Form.Control required type="text" className = 'border-0' onChange={handleInputChange} value={input.title} name="title" placeholder="Enter the Title" />
                            <Form.Control.Feedback type="invalid">*Title is required</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="body">
                            <Form.Label className="text-dark mb-0"><h5><strong>Description</strong></h5></Form.Label>
                            <Form.Control required as="textarea" className = 'border-0 h-100' rows={3} onChange={handleInputChange} value={input.body} name="body" placeholder="Enter the description" />
                            <Form.Control.Feedback type="invalid">*Description is required</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col className="text-right">
                                <Button variant="secondary" type="button" onClick={redirecToHome} className="mr-2">
                                    Cancel</Button>
                                <Button variant="primary" type="submit">
                                    {loading && <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}

                                    Add</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
            />
        </Container>

    )

}
export default Add;

