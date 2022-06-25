import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { postData } from './APIREQ';
import { checkUserExistence } from './Header';
import { base_url } from './requestURL';

const NewPost = () => {

    const cue = checkUserExistence();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(title, content);
        postData(base_url + "/posts", { title:title, content:content, key:cue.key })
        .then(data => {
            console.log(data);
            navigate("/posts/" + data.post_id);
        });
    };

    if (cue.userExists === true) {
        return(
            <>
            <Header />
            <Container>
                <h1>New Post</h1>
                <Link to="/feed">
                <Button variant="primary">Back</Button>
                </Link>
                <br />
                <br />
                <Form>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={({ target }) => setTitle(target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control type="text" placeholder="Enter content" value={content} onChange={({ target }) => setContent(target.value)}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={onSubmit}>
                    Submit Post as {cue.username}
                </Button>
                </Form>
            </Container>
            </>
        );
    } else {
        return(
            <>
            <Header />
            <Container>
                <h1>You need to be logged in to make a post!</h1>
                <Link to="/login">
                <Button variant="primary">Log in to your account</Button>
                </Link>
                <Link to="/signup">
                <Button variant="primary">Make an account</Button>
                </Link>
            </Container>
            </>
        )
    
    };
}

export default NewPost;