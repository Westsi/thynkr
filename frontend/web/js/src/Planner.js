import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { checkUserExistence } from './Header';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';

const Planner = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartDate, setEventStartDate] = useState();
    const [eventStartTime, setEventStartTime] = useState();
    const [eventLocation, setEventLocation] = useState('');
    const [eventEndDate, setEventEndDate] = useState();
    const [eventEndTime, setEventEndTime] = useState();
    const [showCreator, setShowCreator] = useState(false);
    


    const navigate = useNavigate();


    useEffect(() => {
        
        document.title = "Thynkr - Planner";
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <h1>Loading...</h1>
                <Spinner animation="border" variant="secondary" />
            </>
        )

    }

    return(
        <>
        <Modal show={showCreator}>
                <Modal.Header>
                    <Modal.Title>Create an Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter event description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event Start Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter event start date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event Start Time</Form.Label>
                            <Form.Control type="time" placeholder="Enter event start time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event End Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter event end date" value={eventEndDate !== null  ? eventEndDate : eventStartDate} onChange={(e) => setEventEndDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event End Time</Form.Label>
                            <Form.Control type="time" placeholder="Enter event end time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicText">
                            <Form.Label>Event Location</Form.Label>
                            <Form.Control type="text" placeholder="Enter event location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreator(!showCreator)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        
                        var startDate = new Date();
                        startDate.setMinutes(eventStartTime.split(':')[1]);
                        startDate.setHours(eventStartTime.split(':')[0]);
                        startDate.setDate(eventStartDate.split('-')[2]);
                        startDate.setMonth(eventStartDate.split('-')[1] - 1);
                        startDate.setFullYear(eventStartDate.split('-')[0]);
                        startDate.setSeconds(0);
                        startDate = startDate.getTime();

                        var endDate = new Date();
                        endDate.setMinutes(eventEndTime.split(':')[1]);
                        endDate.setHours(eventEndTime.split(':')[0]);
                        endDate.setDate(eventEndDate.split('-')[2]);
                        endDate.setMonth(eventEndDate.split('-')[1] - 1);
                        endDate.setFullYear(eventEndDate.split('-')[0]);
                        endDate.setSeconds(0);
                        endDate = endDate.getTime();

                        console.log(startDate);
                        console.log(endDate);

                        fetch('http://localhost:5000/planner', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: eventName,
                                description: eventDescription,
                                start: startDate,
                                location: eventLocation,
                                end: endDate,
                                key: checkUserExistence().key
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            setShowCreator(!showCreator);
                        })
                    }}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        <Header />
        <div className="container">
        <br />
        <br />
        <Button variant="primary" onClick={() => {setShowCreator(!showCreator)}}>Create an Event</Button>
            <h1>yayAYyYyYY</h1>
        </div>
        </>
    )
};


export default Planner;