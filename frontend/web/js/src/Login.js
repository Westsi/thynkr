import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { postData } from './APIREQ';
import Header from './Header';
import { base_url } from './requestURL';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState();

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const user = {email: email, password: password};
        postData(base_url + '/keys', user)
        .then(data => {
            console.log(data);
            localStorage.setItem("key", JSON.stringify(data));
            if (data.message) {
                alert("Incorrect email or password");
            }
            else {
                navigate('/');
            }
        })
        };
    useEffect(() => {
        const loggedInUser = localStorage.getItem("key");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setUser(foundUser);
          document.title = "Thynkr - Login";
        }
      }, []);

    if (user) {
        return(
            navigate('/')
        );
    };

    return (
    <>
    <Header />
    <div className="container">
    <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={({ target }) => setEmail(target.value)}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
    </Form.Group>
    <Button variant="primary" type="submit">Login</Button>
    </Form>
    </div>
    </>
    );
};


export default Login;