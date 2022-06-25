import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import { checkUserExistence } from './Header';
import { base_url } from './requestURL';


const Profile = () => {

    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const cue = checkUserExistence();

    let { id } = useParams();
    console.log(id);

    const makeServerRequest = () => {
        getData(base_url + '/users/' + id)
        .then(data => {
            console.log(data);
            setUserInfo(data);
            setIsLoading(false);
    });
    };

    const getImage = () => {
        return base_url + '/users/pfp/' + userInfo.name;
    };

    useEffect(() => {
        makeServerRequest();
        document.title = id + "'s  Profile on Thynkr";
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
    else if (userInfo.name == undefined) {
        return (
            <>
                <Header />
                <h1>User does not exist</h1>
                <Link to="/feed">
                <Button variant="primary">Go back to the feed</Button>
                </Link>
            </>
        );
    }
    else {
        return(
            <>
            <Header />
            <div className="container">
                <br />
            <Card style={{ width: Screen.width }}>
            <Card.Body>
                <Card.Title><Image src={getImage()} height={100} width={100} roundedCircle />  {userInfo.name}</Card.Title>
                <Card.Text>
                {userInfo.about}
                <br />
                <br />
                {userInfo.name ==  cue.username ? <div><Link to="/editprofile"><Button variant="info">Edit Profile</Button></Link></div> : null}
                </Card.Text>
                <Link to={"/feed"}>
                <Button variant="primary">Back to the feed</Button>
                </Link>
            </Card.Body>
            </Card>
    
            </div>
            </>
        )
    };
};


export default Profile;