import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import axios from "axios";

const Edit = () => {

    const [loading, setLoad] = useState(false);
    const history = useHistory();
    const params = useParams();
    const [validated, setValidated] = useState(false);
    const [input, setInputs] = useState({ title: '', body: '', id: '', userId: '' });

    useEffect(() => {
        getOneRecord(params);
    }, [])

    const getOneRecord = (params) => {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${params.id}`).then(res => {
            setInputs(prevInput => ({
                title: res.data.title,
                body: res.data.body,
                id: res.data.id,
                userId: res.data.userId,
            }));

        }).catch(e => {
            toast.error('Failed to get post');
        })
    }

    const handleInput = (event) => {
        event.persist();
        setInputs(input => ({ ...input, [event.target.name]: event.target.value }));
    }
    const Submit = (event) => {
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
                    'userId': input.userId,
                    'id': input.id
                }
                setLoad(true);
                axios.put(`https://jsonplaceholder.typicode.com/posts/${payload.id}`,{payload}).then(res => {
                    setLoad(false);
                    toast.success('Updated Successfully');
                    setTimeout(() => {
                        redirecToList();
                    }, 2000)
                }).catch(e => {
                    setLoad(false);
                    toast.error('Failed to Update Post');
                })
            }
        }
    }
    const redirecToList = () => {
        history.push("/");
    }

    return (
        <Container>
            <Row >
                <Col className = 'form-design mt-4'> 
                <header><h2 className='text-left bg-title'><i class="fa fa-pencil f-icon"></i> Edit Post</h2></header>
                    <Form className="text-left mt-3 list-header" noValidate validated={validated} onSubmit={Submit}>
                        <Form.Group controlId="title">
                            <Form.Label className="text-dark mb-0"><h5><strong>Title</strong></h5></Form.Label>
                            <Form.Control required type="text" className = 'border-0' onChange={handleInput} value={input.title} name="title" placeholder="Enter the Title" />
                            <Form.Control.Feedback type="invalid" className="text-col">*Title is required</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="body">
                            <Form.Label className="text-dark mb-0"><h5><strong>Description</strong></h5></Form.Label>
                            <Form.Control required as="textarea" className = 'border-0 h-100' rows={6} onChange={handleInput} value={input.body} name="body"placeholder="Enter the description" />
                            <Form.Control.Feedback type="invalid" className="text-col">*Description is required</Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col className="text-right">
                                <Button variant="secondary" type="button" onClick={redirecToList} className="mr-2">
                                    Cancel</Button>
                                <Button variant="primary" type="submit">
                                    {loading && <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                                    Update</Button>
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
export default Edit;

