import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData, patchData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import { checkUserExistence } from './Header';
import Form from 'react-bootstrap/Form';
import { base_url } from './requestURL';


const EditProfile = () => {

    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [profile_picture, setProfile_picture] = useState({});
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const cue = checkUserExistence();

    const makeUserRequest = () => {
        getData(base_url + '/users/' + cue.username)
        .then(data => {
            setUserInfo(data);
            setIsLoading(false);
    });
    };

    const getImage = () => {
        return base_url + '/users/pfp/' + userInfo.name;
    };

    const onSubmit = (e) => {
            e.preventDefault();
            console.log(email);
            console.log(password);
            console.log(confirmPassword);
            if (email == undefined) {
                setEmail(userInfo.email);
            }
            if (password == undefined) {
                setPassword(userInfo.password);
            }
            if (confirmPassword == undefined) {
                setConfirmPassword(userInfo.password);
            }
            if (password == confirmPassword) {
                patchData(base_url + '/users/' + cue.username, {
                    email: email,
                    password: password
                })
                .then(data => {
                    console.log(data);
                    const loggedInUser = localStorage.getItem("user");
                    const foundUser = JSON.parse(loggedInUser);
                    foundUser.email = email;
                    foundUser.password = password;
                    localStorage.setItem("user", JSON.stringify(foundUser));

                });
            }
            else {
                alert("Passwords do not match");
            }

    }



    useEffect(() => {
        makeUserRequest();
        document.title = "Editing your profile on Thynkr";
    }, []);


    if (isLoading == true) {
        return (
            <>
                <Header />
                <h1>Loading...</h1>
                <Spinner animation="border" variant="secondary" />
                <p>If this stays loading for more than 5 seconds, the backend may be down for maintenance.</p>
            </>
        );
    }
    else if (cue.username == undefined) {
        return (
            <>
                <Header />
                <h1>You need to be logged in to edit your profile</h1>
                <Link to="/login">
                <Button variant="primary">Login</Button>
                </Link>
                <Link to="/signup">
                <Button variant="primary">Create an Account</Button>
                </Link>
            </>
        );
    }
    else {
        return(
            <>
            <Header />
            <div className="container">
                <h2>You only need to change the fields you wish to update!</h2>
            <Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder={userInfo.email} value={email} onChange={({ target }) => setEmail(target.value)}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={({ target }) => setPassword(target.value)}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={({ target }) => setConfirmPassword(target.value)}/>
    </Form.Group>

    <Button variant="primary" type="submit" onClick={onSubmit}>
        Submit
    </Button>
    </Form>
    
            </div>
            </>
        )
    };
};


export default EditProfile;