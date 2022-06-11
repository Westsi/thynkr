import React, { Component } from 'react';
import Header from './Header';


class Aboutpage extends Component {

    render() {
        
        return (
            <>
            <Header />
            <div className="container">
                <h1>About Us</h1>
                <br />
                <p>Out aim is to help people learn!</p>
            </div>
            </>
        );
    }
}

export default Aboutpage;