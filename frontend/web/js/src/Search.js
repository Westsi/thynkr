import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import { base_url } from './requestURL';


const Search = () => {
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let { id } = useParams();
    console.log(id);

    var allData = [];
    const makeServerRequests = () => {
        var amountDone = 0
        getData(base_url + '/posts')
        .then(data => {
            allData.push(data);
            amountDone++;
            if (amountDone === 3) {
                filterData();
            }

        });
        getData(base_url + '/users')
        .then(data => {
            allData.push(data);
            amountDone++;
            if (amountDone === 3) {
                filterData();
            }
        });

        getData(base_url + '/comments')
        .then(data => {
            allData.push(data);
            amountDone++;
            if (amountDone === 3) {
                filterData();
            }
        });

    };

    const filterData = () => {
        console.log("filtering data");
        var filteredData = [];
        allData.forEach(data => {
            data.forEach(item => {
                if (String(item.content).toLowerCase().includes(String(id).toLowerCase()) == true) {
                    console.log(item);
                    filteredData.push(item);
                }
                else if (String(item.about).toLowerCase().includes(String(id).toLowerCase()) == true) {
                    console.log(item);
                    filteredData.push(item);
                }
                else if (String(item.title).toLowerCase().includes(String(id).toLowerCase()) == true) {
                    console.log(item);
                    filteredData.push(item);
                }
                else if (String(item.name).toLowerCase().includes(String(id).toLowerCase()) == true) {
                    console.log(item);
                    filteredData.push(item);
                }
            });
        });
        setDataToDisplay(filteredData);
        setIsLoading(false);
    };


    useEffect(() => {
        makeServerRequests();
        document.title = "'" + id + "' search on Thynkr";
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
    else if (dataToDisplay.length == 0) {
        return (
            <>
                <Header />
                <h1>No results found</h1>
                <Link to="/feed">
                <Button variant="primary">Go back to the feed</Button>
                </Link>
            </>
        );
    }
    else {

        return (
            <>
                <Header />
                <h1>Searching for '{id}'</h1>
                <p>Results:</p>
                {dataToDisplay.map(data => {
                    if (data.comment_number != undefined) {
                        return (
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{data.title}</Card.Title>
                                    <Card.Text>
                                        {data.content}
                                    </Card.Text>
                                    <Link to={"/posts/" + data.post_id}>
                                        <Button variant="primary">Go to post</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        );
                    }
                    else if (data.about != undefined) {
                        return (
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{data.name}</Card.Title>
                                    <Card.Text>
                                        {data.about}
                                    </Card.Text>
                                    <Link to={"/users/" + data.name}>
                                        <Button variant="primary">Go to user</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        );
                    }
                    else if (data.on_post_id != undefined) {
                        return (
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>{data.author}</Card.Title>
                                    <Card.Text>
                                        {data.content}
                                    </Card.Text>
                                    <Link to={"/posts/" + data.on_post_id}>
                                        <Button variant="primary">Go to post</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        );
                    }
                })}
            </>
        );
    }
};


export default Search;