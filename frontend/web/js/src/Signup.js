import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from './APIREQ';
import Header from './Header';

const Signup = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    });
    const [profile_picture, setProfile_picture] = useState({});

    useEffect(() => {
        document.title = "Thynkr - Signup";
    }, []);

    const navigate = useNavigate();

    const uploadedImage = (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append('profile_picture', e.target.files[0]);
        console.log(formData);
        setProfile_picture(formData);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(state.email, state.password, state.confirmPassword, state.username);

        if (state.password === state.confirmPassword) {

            getData('http://localhost:5000/users')
            .then(data => {
                console.log(data);
                let userExists = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].email === state.email) {
                        userExists = true;
                    }
                    if (data[i].username === state.username) {
                        userExists = true;
                    }
                }
                if (userExists) {
                    alert("Email or Username already exists");
                } else {
                    postData('http://localhost:5000/users', {
                        email: state.email,
                        password: state.password,
                        name: state.username,
                    }) 
                    .then(data => {
                        console.log(data);
                        alert("User created successfully");
                        fetch('http://localhost:5000/users/pfp/' + data.name, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            cors: 'cors',
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: profile_picture,
                            })
                            .then(response => {
                                console.log(response);
                            })

                        navigate('/');
                    })
                    .catch(err => {
                        console.log(err);
                        alert("Error creating user in post thing");
                    });
                }
            })
            .catch(err => {
                console.log(err);
                alert("Error creating user");
            });

        };
    };
    return (
        <>
        <Header />
    <div className="container">
    <Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={state.email} onChange={e => setState(prevState => { return {...prevState, email: e.target.value}})}/>
        <Form.Text className="text-muted">
        We'll never share your email with anyone else.
        </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={state.password} onChange={e => setState(prevState => { return {...prevState, password: e.target.value}})}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" value={state.confirmPassword} onChange={e => setState(prevState => { return {...prevState, confirmPassword: e.target.value}})}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Username" value={state.username} onChange={e => setState(prevState => { return {...prevState, username: e.target.value}})}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formFile">
        <Form.Label>Upload Profile Picture</Form.Label>
        <Form.Control type="file" onChange={e => uploadedImage(e)} accept=".jpg,.jpeg,.gif,.png, image/jpeg, image/png, image/gif"/>
    </Form.Group>

    <Button variant="primary" type="submit" onClick={onSubmit}>
        Submit
    </Button>
    </Form>
</div>
</>
    );
};


export default Signup;