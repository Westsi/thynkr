import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faHouse, faMessage, faBell, faBoltLightning, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { getData, deleteData, postData } from './APIREQ';
import logo from './images/logo.png';
import { base_url } from './requestURL';

const checkUserExistence = () => {
    const loggedInUser = localStorage.getItem("key");
        if (loggedInUser !== null) {
          const foundUser = JSON.parse(loggedInUser);
          const username = foundUser.user;
          const userExists = true;
          const key = foundUser.value;
          return {userExists, key, username};
        }
        else {
          const userExists = false;
          return {userExists};
        };
};

const handleLogout = () => {
    localStorage.removeItem("key");
    window.location.reload();
};

const Header = () => {
    const [search, setSearch] = useState('');
    const [notifs, setNotifs] = useState([]);

    const navigate = useNavigate();

        const handleSearch = () => {
            navigate(`/search/${search}`);
            window.location.reload();
        };

        const notifRead = (id) => {
            deleteData(base_url + '/notifs/' + id)
            .then(data => {
                console.log(data);
                window.location.reload();
            });
        }

        const getNotifications = () => {
            if (checkUserExistence().userExists === true) {
                getData(base_url + '/notifs/' + checkUserExistence().key)
            .then(data => {
                console.log(data);
                setNotifs(data.reverse());
            }
            );
            }
            
        };

        const checkKeyExpiration = () => {
            if (checkUserExistence().userExists === false) {
                return null;
            }
                const currentTime = new Date();
                const data = JSON.parse(localStorage.getItem("key"));
                console.log(data);
                const expirationTime = new Date(data.expiry_date);
                if (currentTime > expirationTime) {
                    postData(base_url + '/keys/' + checkUserExistence().key, JSON.parse(localStorage.getItem("key")))
                    .then(data => {
                        console.log(data);
                        localStorage.setItem("key", JSON.stringify(data));
                        window.location.reload();
                    });
            }
        }

        const updateName = () => {
            if (checkUserExistence().userExists === true) {
                getData(base_url + '/keys/' + checkUserExistence().key)
            .then(data => {
                console.log(data);
                localStorage.setItem("key", JSON.stringify(data));
            }
            );
            }
        }

        const cue = checkUserExistence();
        useEffect(() => {
            checkKeyExpiration();
            getNotifications();
        }, []);
            return (
                <Navbar bg="primary" expand="lg">
                    <Container>
                        <Navbar.Brand href="/"><Image src={logo} width="30"></Image>Thynkr</Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link to="/" as={Link}><FontAwesomeIcon icon={faHouse} /> Home</Nav.Link>
                            <Nav.Link to="/feed" as={Link}><FontAwesomeIcon icon={faMessage} /> Feed</Nav.Link>
                            <Nav.Link to="/login" as={Link}><FontAwesomeIcon icon={faUser} /> Login</Nav.Link>
                            <Nav.Link to="/signup" as={Link}><FontAwesomeIcon icon={faUser} /> Signup</Nav.Link>
                            <Nav.Link href="/flashcards"><FontAwesomeIcon icon={faBoltLightning} /> Flashcards</Nav.Link>
                            <Nav.Link to="/planner" as={Link}><FontAwesomeIcon icon={faCalendarCheck} /> Planner</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse className="justify-content-end">
                                <Nav>
                                <Form className="d-flex">
                                    <FormControl
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    value={search} 
                                    onChange={({ target }) => setSearch(target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    />
                                    <Button variant="outline-success" onClick={handleSearch.bind()}>Search</Button>
                                </Form>
                                {cue.userExists === true ? 
                                <>
                                <NavDropdown title={cue.username} id="basic-nav-dropdown">
                                    <Link to={`/users/${cue.username}`} as={Link}>
                                    <NavDropdown.Item href= {"/users/" + cue.username}><FontAwesomeIcon icon={faUser} /> Profile</NavDropdown.Item>
                                    </Link>
                                    <NavDropdown.Item onClick={handleLogout.bind()}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</NavDropdown.Item>
                                </NavDropdown>

                                {notifs.length > 0 ? <NavDropdown title={<FontAwesomeIcon icon={faBell} shake />} id="basic-nav-dropdown">
                                    {
                                    notifs.map(notif => {
                                            return ( 
                                                <Card key={notif.id}>
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {notif.notif_type == 'like'? 
                                                        <><Link to={`/users/${notif.user_to_link}`}>{notif.user_to_link}</Link> liked your <Link to={`/posts/${notif.post_to_link}`}>post</Link>.</>:null}
                                                        {notif.notif_type == 'comment'?
                                                        <><Link to={`/users/${notif.user_to_link}`}>{notif.user_to_link}</Link> commented on your <Link to={`/posts/${notif.post_to_link}`}>post</Link>.</>:null}
                                                        </Card.Title>
                                                        <Card.Text>{new Date(notif.date_time).getDate()}/{new Date(notif.date_time).getMonth() + 1} at {new Date(notif.date_time).getHours()}:{new Date(notif.date_time).getMinutes()}</Card.Text>
                                                        <Button variant="outline-success" onClick={() => notifRead(notif.notif_id)}>Mark as read</Button>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        })
                                    }
                                </NavDropdown>
                                :
                                <NavDropdown title={<FontAwesomeIcon icon={faBell} />} id="basic-nav-dropdown">
                                    <NavDropdown.Item>No notifications</NavDropdown.Item>
                                </NavDropdown>
                                }
                                
                                </>
                                :<></>}
                                </Nav>
                            </Navbar.Collapse>
                    </Container>
                </Navbar> 
            );  
};


export default Header;

export { checkUserExistence };