import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { Link } from 'react-router-dom';
import Header from './Header';

class Homepage extends Component {

    componentDidMount() {
        document.title = "Thynkr - Where the world learns";
    }

    render() {
        
        return (
            <>
            <Header />
            <div className="container">
                <h1>Thynkr</h1>
                <br />
                <p>Join your friends in studying and help others learn!</p>
                <ButtonGroup aria-label="Basic example">
                    <Link to='/signup'>
                    <Button variant="primary">Create Account</Button>
                    </Link>
                    <Link to='/login'>
                    <Button variant="secondary">Login</Button>
                    </Link>
                </ButtonGroup>
            </div>
            </>
        );
    }
}

export default Homepage;