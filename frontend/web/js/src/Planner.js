import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { checkUserExistence } from './Header';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { base_url } from './requestURL';


const DayView = () => {
    const months = [
        "January  ",
        "February ",
        "March    ",
        "April    ",
        "May      ",
        "June     ",
        "July     ",
        "August   ",
        "September",
        "October  ",
        "November ",
        "December "
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

    const [events, setEvents] = useState([]);
    const [globalDate, setGlobalDate] = useState(new Date());
    const month = globalDate.getMonth();
    const year = globalDate.getFullYear();
    const day = globalDate.getDate();
    const dayOfWeek = globalDate.getDay();

    return (
        <>
            <Table striped bordered hover size="sm" variant="light">
                <thead>
                    <tr>
                        <th>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const newDate = new Date();
                                    newDate.setDate(globalDate.getDate() - 1);
                                    newDate.setMonth(globalDate.getMonth());
                                    newDate.setFullYear(globalDate.getFullYear());
                                    if (globalDate.getDate() <= 1) {
                                        newDate.setMonth(globalDate.getMonth() - 1);
                                        newDate.setDate(daysInMonth[newDate.getMonth()]);
                                    }
                                    setGlobalDate(newDate); 
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </Button>
                        </th>
                        <th width="50%">{daysOfWeek[dayOfWeek]} {day} {months[month]} {year}/ {globalDate.toDateString()}</th>
                        <th>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const newDate = new Date();
                                    newDate.setDate(globalDate.getDate() + 1);
                                    newDate.setMonth(globalDate.getMonth());
                                    newDate.setFullYear(globalDate.getFullYear());
                                    if (globalDate.getDate() >= daysInMonth[globalDate.getMonth()]) {
                                        newDate.setMonth(globalDate.getMonth() + 1);
                                        newDate.setDate(1);
                                    }
                                    setGlobalDate(newDate);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                    </tr>
                </tbody>
            </Table>
        </>
    );
};


const MonthView = () => {
    const months = [
        "January  ",
        "February ",
        "March    ",
        "April    ",
        "May      ",
        "June     ",
        "July     ",
        "August   ",
        "September",
        "October  ",
        "November ",
        "December "
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

    const [events, setEvents] = useState([]);
    const [globalDate, setGlobalDate] = useState(new Date());
    const month = globalDate.getMonth();
    const year = globalDate.getFullYear();
    const day = globalDate.getDate();
    const dayOfWeek = globalDate.getDay();
    const firstDayOfMonthDay = daysOfWeek[new Date(year, month, 1).getDay()];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay();
    const lastDayOfMonthNumber = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonthNumber = new Date(year, month, 1).getDate();
    const days = (() => {
        let daysArr = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArr.push(null);
        }
        for (let i = 1; i <= lastDayOfMonthNumber; i++) {
            daysArr.push(i);
        }
        for (let i = 0; i < 6 - lastDayOfMonth; i++) {
            daysArr.push(i + 1);
        }
        return daysArr;
    })();

    return (
        <>
            <Table striped bordered hover size="sm" variant="light">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const newDate = new Date();
                                    newDate.setMonth(globalDate.getMonth() - 1);
                                    if (globalDate.getFullYear() !== newDate.getFullYear()) {
                                        newDate.setFullYear(globalDate.getFullYear());
                                    }
                                    if (globalDate.getMonth() <= 0) {
                                        newDate.setFullYear(globalDate.getFullYear() - 1);
                                        newDate.setMonth(11);
                                    }
                                    setGlobalDate(newDate);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </Button>
                        </th>
                        <th width="50%">{months[month]} {year}</th>
                        <th>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const newDate = new Date();
                                    newDate.setMonth(globalDate.getMonth() + 1);
                                    if (globalDate.getFullYear() !== newDate.getFullYear()) {
                                        newDate.setFullYear(globalDate.getFullYear());
                                    }
                                    if (globalDate.getMonth() >= 11) {
                                        newDate.setFullYear(globalDate.getFullYear() + 1);
                                        newDate.setMonth(0);
                                    }
                                    setGlobalDate(newDate);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
                            </Button>
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {daysOfWeek.map((day, index) => {
                            return <td key={index}>{day}</td>;
                        })}
                    </tr>

                    {days.map((day, index) => {
                        if (index % 7 === 5) {
                            // MAKE CLICK ON CELL RETURN VAL and create new event on that day - how
                            // also week view and day view
                            // use lighthouse to test and do everything possible to decrease load time
                            return (
                                <tr key={index}>
                                    {" "}
                                    {days.slice(index - 5, index + 2).map((day, index2) => {
                                        return (
                                            <td key={index2} onClick={() => { console.log(day); alert(day) }}>{day}</td>
                                        );
                                    })}
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </Table>
        </>
    );
};




const Planner = () => {
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

    return (
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
                            <Form.Control type="date" placeholder="Enter event end date" value={eventEndDate !== null ? eventEndDate : eventStartDate} onChange={(e) => setEventEndDate(e.target.value)} />
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

                        fetch(base_url + '/planner', {
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
                <Button variant="primary" onClick={() => { setShowCreator(!showCreator) }}>Create an Event</Button>
            </div>
            <DayView />
        </>
    )
};

export default Planner;