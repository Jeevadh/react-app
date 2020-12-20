import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom'
import { Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import  axios  from 'axios';
import Pagination from "react-js-pagination";


const List = () => {

    const history = useHistory();
    const [deleteData, setShow] = useState({ showModal: false, selectedObject: {} });
    const [loading, load] = useState(false);
    const [postData, setPost] = useState({ showPost: false, selectedList: {} });
    const [lists, setList] = useState({ fullList: [], list: [], activePage: 1 });

    useEffect((params) => {
        getList();
    }, [])

    const getList = () => {
        load(true);
        axios.get(`https://jsonplaceholder.typicode.com/posts`)
            .then(response => {
                load(false);
                setList(prevState => ({
                    fullList: response.data,
                    count: response.data.length,
                    list: response.data.slice(0, 10),
                    activePage: 1
                }));
            }).catch(e => {
                load(false);
                toast.error("Failed to get posts");
            })
    }
    const closeModal = () => {
        setShow(prevState => ({
            ...prevState,
            showModal: false
        }));
    };
    const handleShow = (item) => {
        setShow(prevState => ({
            selectedObject: item,
            showModal: true
        }));
    };
    const deletePost = () => {
        load(true);
        const payload = {
            id: deleteData.selectedObject.id
        }
        axios.delete(`https://jsonplaceholder.typicode.com/users/${payload.id}`)
            .then(response => {
                load(false);
                closeModal();
                toast.success("Deleted Successfully");
                getList();
            }).catch(e => {
                load(false);
                toast.error("Failed to delete post");
            })
    }
    const hidePost = () => {
        setPost(prevState => ({
            ...prevState,
            showPost: false
        }));
    }
    const openModal = (item) => {
        setPost(prevState => ({
            selectedList: item,
            showPost: true
        }));
    }
    const handlePagination = (item) => {
        var number = item - 1;
        setList(prevState => ({
            ...prevState,
            list: lists.fullList.slice(number * 10, ((number * 10) + 10)),
            activePage: item
        }));
    }
    const editPost = (item) => {
        history.push("/edit-post/" + item.id);
    }

    return (
        <Fragment>
            <div className="container p-3 p-md-4 list-header">
                <div className="col-12 ">
                    <div>
                        <h2 className=" bg-title text-center">Mediwave React Project</h2>
                    </div>
                    <div className="d-flex pb-4 justify-content-between mt-4">
                        <h2 className="pb-0 mb-0 text-dark">List of Posts</h2>
                        <Link to="/add-post">
                            <button className="btn btn-primary"><i className="fas fa-plus-circle" aria-hidden="true"></i>
                                <span className='pl-2'>Add Post</span></button>
                        </Link>
                    </div>

                    <ul className="list-group text-left">
                        {lists.list &&
                            lists.list.map((item, index) => (
                                <li
                                    className=
                                    "list-group-item p-1"
                                    key={index}
                                >
                                    <div className="row align-items-start p-3">
                                        <div className="col-12 col-md-10">
                                            <h4>
                                                <strong>{item.title}</strong>
                                            </h4>
                                            <span> {item.body}</span>

                                        </div>
                                        <div className="col-12 col-md-2 text-right  mt-2">
                                            <i className="fas fa-info-circle pr-2 pr-md-2 cursor" onClick={() => openModal(item)}></i>
                                            <i className="fas text-primary fa-pencil-alt pr-2 pr-md-2 cursor" onClick={() => editPost(item)}></i>
                                            <i className="fas text-danger fa-trash-alt cursor" onClick={() => handleShow(item)}></i>
                                        </div>
                                    </div>
                                </li>

                            ))}
                    </ul>
                </div>
                {lists.count &&
                    <Col className="d-flex justify-content-center">
                        <Pagination
                            activePage={lists.activePage}
                            itemsCountPerPage={10}
                            totalItemsCount={lists.count}
                            itemClass="page-item pt-4 text-right"
                            linkClass="page-link"
                            prevPageText='prev'
                            nextPageText='next'
                            pageRangeDisplayed={5}
                            onChange={handlePagination}
                        />
                    </Col>

                }

                <Modal show={deleteData.showModal} onHide={closeModal} backdrop="static" keyboard={false}>
                    <Modal.Header className='head-col'>
                        <Modal.Title>Delete Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel</Button>
                        <Button variant="danger" onClick={deletePost}>
                            {loading && <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />}
                            Delete </Button>
                    </Modal.Footer>
                </Modal>
                <Modal className='list-header' show={postData.showPost} onHide={hidePost} backdrop="static" keyboard={false} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header className='head-col'>
                        <Modal.Title>View Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col> <h4><strong>{postData.selectedList.title}</strong></h4>
                            </Col>

                        </Row>
                        <Row>
                            <Col> <span>  {postData.selectedList.body}
                            </span>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={hidePost}>
                            Close </Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                />
            </div>
        </Fragment>


    )

}
export default List;
