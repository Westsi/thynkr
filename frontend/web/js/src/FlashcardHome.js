import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import { checkUserExistence } from './Header';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const FcHome = () => {

    const [sets, setSets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [setType, setSetType] = useState(true);
    // setType true is personal, false is public (public includes personal)
    // personal is defined by "owner" in the set object

    const cue = checkUserExistence();

    let id = cue.username;

    const makeServerRequest = () => {
        getData('http://localhost:5000/users/' + id)
        .then(data => {
            console.log(data);
            setSets(data);
    });
        getData('http://localhost:5000/flashcards')
        .then(data => {
            console.log(data);
            setSets(data);
            setIsLoading(false);
    });
    };

    const navigate = useNavigate();

    const newSet = () => {
        navigate('/createSet');
    };

    useEffect(() => {
        makeServerRequest();
        document.title = id + "'s  Sets on Thynkr";
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
    else {
        return(
            <>
            <Header />
                        <h1>{id}'s Sets</h1>
                        <p>Click on a set to view it.</p>
                        <p>Click on the plus sign to create a new set.</p>
                        <Button variant="primary" onClick={() => setSetType(!setType)}>{setType == true ? 'Public ' : 'Private '}Sets</Button>
                        <Button variant="primary" onClick={() => {newSet()}}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>Create Set</Button>
                        <br />
                        <br />
                        <Row lg={4} md={3} sm={2} xs={1}>
                            {setType == true ?
                                sets.map(set => {
                                    if (set.owner == id) {
                                        return (
                                            <Col className="d-flex">
                                            <Card className='flex-fill' style={{ width: '18rem' }}>
                                                <Card.Img variant="top" src={set.image} />
                                                <Card.Body>
                                                    <Card.Title>{set.title}</Card.Title>
                                                    <Link to={`/flashcards/${set.id}`}>
                                                        <Button variant="primary">View Cards</Button>
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        )
                                    }
                                    else {
                                        return null;
                                    }
                                }
                                    )
                                :
                                sets.map(set => {
                                    return (
                                        <Col className="d-flex">
                                        <Card className='flex-fill' style={{ width: '18rem' }}>
                                            <Card.Img variant="top" src={set.image} />
                                            <Card.Body>
                                                <Card.Title>{set.title}</Card.Title>
                                                <Link to={`/flashcards/${set.id}`}>
                                                    <Button variant="primary">View Cards</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    )
                                }
                                    )
                            }
                        </Row>
            </>
        );
    };
};


export default FcHome;