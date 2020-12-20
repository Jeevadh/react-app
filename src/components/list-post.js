import React, { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom'
import { Button, Modal, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import  axios  from 'axios';
import Moment from 'react-moment';
import Pagination from "react-js-pagination";


const List = () => {

    const history = useHistory();
    const [deleteData, setShow] = useState({ showModal: false, selectedObject: {} });
    const [loading, load] = useState(false);
    const [postData, setPost] = useState({ showPost: false, selectedList: {} });
    const [lists, setList] = useState({ fullList: [], list: [], activePage: 1 });
    const dateToFormat = new Date();


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
                        <h2 className="off-title text-center">Mediwave React Project</h2>
                    </div>
                     <div className = 'col-12 list-button mt-4'>
                     <Link to="/add-post">
                           <i className="fas fa-plus-circle mt-4" aria-hidden="true"></i>
                                <span className='pl-2 mt-4'>Create New Post</span>
                        </Link>
                     </div>
                     <div className="col- 12 d-flex justify-content-between mt-4 post-cl">
                    <header><h2 className='text-left list-ti pl-3 mt-2'>List of Posts</h2></header>
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
                                        <div className="col-12 col-md-12">
                                            <h4>
                                                <strong>{item.title}</strong>
                                            </h4>
                                            <span> {item.body}</span>

                                        </div>
                                    </div>
                                   <div className="row align-items-start p-3">
                                    <div className="col-12 col-md-12 text-right  mt-2">
                                        <span className = 'float-left font-fam mt-3'> <strong> <Moment date={dateToFormat} format= "ll h:mm a" /></strong></span>
                                        <button className="btn btn-info w-70" onClick={() => openModal(item)}><span>Info</span></button>
                                        <button className="btn btn-success ml-2 w-70" onClick={() => editPost(item)}><span>Edit</span></button>
                                        <button className="btn btn-danger ml-2 w-70" onClick={() => handleShow(item)}><span>Delete</span></button>
                                    </div>
                                    </div>
                                </li>

                            ))}
                    </ul>
                    {lists.count &&
                    <Col className="d-flex justify-content-center b-col">
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
                </div>

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




