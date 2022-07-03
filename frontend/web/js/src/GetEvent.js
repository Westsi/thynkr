import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image, Tab, Table } from 'react-bootstrap';
import { checkUserExistence } from './Header';
import Form from 'react-bootstrap/Form';
import { base_url } from './requestURL';


const Event = () => {
    const [eventInfo, setEventInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    let { id } = useParams();
    console.log(id);

    const cue = checkUserExistence();

    const navigate = useNavigate();

    const getEvent = async () => {
        getData(`${base_url}/planner/${id}`)
            .then(data => {
                data.start_time = new Date(data.start_time);
                data.end_time = new Date(data.end_time);
                setEventInfo(data);
                setIsLoading(false);
            }
            )
            .catch(err => {
                console.log(err);
            }
            )
    }
    useEffect(() => {
        getEvent();
    }
        , [])

    if (isLoading) {
        return (
            <div className="container">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    else if (cue.username !== eventInfo.user) {
        return (
            <div className="container">
                <h1>You are not authorized to view this event</h1>
                <Link to="/">
                    <Button variant="primary">Back to Home</Button>
                </Link>
            </div>
        );
    }
    else {
        return (
            <>
                <Header />
                <div className="container">
                    <Card>
                        <Card.Body>
                            <Card.Title>{eventInfo.name}</Card.Title>
                            <Card.Text>
                                {eventInfo.description}
                            </Card.Text>
                            <Card.Text>
                                <Form.Label>Starts:</Form.Label>
                                <Form.Control type="text" value={eventInfo.start_time.getDate() + "/" + eventInfo.start_time.getMonth() + " at " + eventInfo.start_time.toLocaleTimeString()} readOnly />
                            </Card.Text>
                            <Card.Text>
                                <Form.Label>Ends:</Form.Label>
                                <Form.Control type="text" value={eventInfo.end_time.getDate() + "/" + eventInfo.end_time.getMonth() + " at " + eventInfo.end_time.toLocaleTimeString()} readOnly />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

            </>
        )

    }


};


export default Event;