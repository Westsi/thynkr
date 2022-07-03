import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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


const DayView = (props) => {
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
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

    const [events, setEvents] = useState([]);
    const [globalDate, setGlobalDate] = useState(props.initDate);
    const [loading, setLoading] = useState(true);
    const month = globalDate.getMonth();
    const year = globalDate.getFullYear();
    const day = globalDate.getDate();
    const dayOfWeek = globalDate.getDay();

    const getEvents = () => {
        getData(base_url + "/planner/" + checkUserExistence().key)
            .then(data => {
                setEvents(data);
                setLoading(false);
            }
            )
            .catch(err => {
                console.log(err);
            }
            );
    }

    const getEventsToMap = () => {
        const data = events;
        let eventsOnDay = [];
        for (let i = 0; i < data.length; i++) {
            data[i].start_time = new Date(data[i].start_time);
            data[i].end_time = new Date(data[i].end_time);
            if (data[i].start_time.getDate() === day && data[i].start_time.getMonth() === month && data[i].start_time.getFullYear() === year) {
                eventsOnDay.push(data[i]);
            }
        }
        eventsOnDay.sort((a, b) => {
            return a.start_time - b.start_time;
        }
        );
        return eventsOnDay;
    }

    const eventsOnDay = getEventsToMap();

    useEffect(() => {
        getEvents();
    }
        , []);

    if (loading) {
        return (
            <>
                <h1>Loading events...</h1>
                <Spinner animation="border" variant="secondary" />
            </>
        );
    }
    else {
        return (
            <>
                <Table striped bordered hover size="sm" variant="light">
                    <thead>
                        <tr>
                            <th>
                                <Button
                                    variant="info"
                                    onClick={() => {
                                        //from stackoverflow
                                        const newDate = new Date(globalDate); // starting point!
                                        newDate.setDate(globalDate.getDate() - 1);  // month overflow happens automatically!
                                        setGlobalDate(newDate); // That's it!
                                    }}
                                >
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </Button>
                            </th>
                            <th width="40%">{daysOfWeek[dayOfWeek]} {day} {months[month]} {year}</th>
                            <th>
                                <Button
                                    variant="info"
                                    onClick={() => {
                                        //from stackoverflow
                                        const newDate = new Date(globalDate); // starting point!
                                        newDate.setDate(globalDate.getDate() + 1);  // month overflow happens automatically!
                                        setGlobalDate(newDate); // That's it!
                                    }}
                                >
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Starts at</td>
                            <td>Ends at</td>
                            <td>Name</td>
                        </tr>
                        {eventsOnDay.map((event, index) => {
                            return (
                                <tr>
                                    <td>{event.start_time.toLocaleTimeString()}</td>
                                    <td>{event.end_time.toLocaleTimeString()}</td>
                                    <td key={index}>
                                        <Link to={"/planner/event/" + event.id}>{event.name}</Link>
                                    </td>
                                </tr>
                            );
                        }
                        )}
                    </tbody>
                </Table>
            </>
        );
    }
};


const MonthView = (props) => {
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
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    const [globalDate, setGlobalDate] = useState(new Date());
    const month = globalDate.getMonth();
    const year = globalDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay();
    const lastDayOfMonthNumber = new Date(year, month + 1, 0).getDate();
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
                                    const newDate = new Date(globalDate); // starting point!
                                    newDate.setMonth(globalDate.getMonth() - 1);  // month overflow happens automatically!
                                    setGlobalDate(newDate); // That's it!
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </Button>
                        </th>
                        <th width="30%">{months[month]} {year}</th>
                        <th>
                            <Button
                                variant="info"
                                onClick={() => {
                                    const newDate = new Date(globalDate); // starting point!
                                    newDate.setMonth(globalDate.getMonth() + 1);  // month overflow happens automatically!
                                    setGlobalDate(newDate); // That's it!
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
                                    {days.slice(index - 5, index + 2).map((day, index2) => {
                                        return (
                                            // how to change view to day view and pass date?
                                            <td key={index2} onClick={() => { const thing = new Date(globalDate); thing.setDate(day); props.onChange(thing); }}>{day}</td>
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
    const [viewType, setViewType] = useState('Month');
    const [datePassThrough, setDatePassThrough] = useState(new Date());


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

                        var endDate = new Date();
                        endDate.setMinutes(eventEndTime.split(':')[1]);
                        endDate.setHours(eventEndTime.split(':')[0]);
                        endDate.setDate(eventEndDate.split('-')[2]);
                        endDate.setMonth(eventEndDate.split('-')[1] - 1);
                        endDate.setFullYear(eventEndDate.split('-')[0]);
                        endDate.setSeconds(0);
                        endDate = endDate.getTime();

                        var notifSendTime = new Date(startDate);
                        notifSendTime.setMinutes(notifSendTime.getMinutes() - 15);
                        notifSendTime = notifSendTime.getTime();

                        startDate = startDate.getTime();

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
                                key: checkUserExistence().key,
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                setShowCreator(!showCreator);
                                fetch(base_url + '/enotif', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        key: checkUserExistence().key,
                                        time_to_send_notif: notifSendTime,
                                        id: data.id

                                    })
                                }
                                )
                            }
                            )
                    }}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
            <Header />
            <div className="container">
                <h1 variant="primary">Thynkr Planner</h1>
                <br />
                <br />
                <Button variant="primary" onClick={() => { setShowCreator(!showCreator) }}>Create an Event</Button>
                {viewType === 'Month' ? <Button variant="primary" onClick={() => { setViewType('Day') }}>Day View</Button> : <Button variant="primary" onClick={() => { setViewType('Month') }}>Month View</Button>}
            </div>
            {viewType === 'Day' ? <DayView initDate={datePassThrough} /> : <MonthView onChange={(date) => { setViewType('Day'); setDatePassThrough(date); }} />}
        </>
    )
};

export default Planner;