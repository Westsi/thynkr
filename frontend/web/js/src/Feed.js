import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const FeedItem = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPosts = () => {
        setIsLoading(true);
        return fetch('http://localhost:5000/posts')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setPosts(data.reverse());
            setIsLoading(false);
        })
    };

    useEffect(() => {
        document.title = "Thynkr - Feed";
        getPosts();
        
    }, []);

    if (isLoading) {
        return (
            <>
                <h1>Loading...</h1>
                <Spinner animation="border" variant="secondary" />
            </>
        );
    }
    else if (posts.length === 0) {
        return <h1>No posts yet</h1>
    }
    else {
        return (
            <>
            <Row lg={4} md={3} sm={2} xs={1}>
            {posts.map(post => {
                if (post.content.length > 20) {
                    post.content = post.content.substring(0, 50) + "...";
                }
                return (
                    <Col className="d-flex">
                        <Card className="flex-fill" style={{ width: '18rem' }}>
                            <Card.Body>
                                <Link to={`/posts/${post.post_id}`}>
                                <Card.Title>{post.title}</Card.Title>
                                </Link>
                                <Card.Text>
                                {new Date(post.date_time).getDate()}/{new Date(post.date_time).getMonth() + 1} at {new Date(post.date_time).getHours()}:{new Date(post.date_time).getMinutes()}
                                </Card.Text>
                                <Card.Text>{post.content}</Card.Text>
                                <Link to={`/users/${post.author}`}>
                                <Button variant="info">Post by {post.author}</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            })}
            </Row>
            </>
        );
    };
};

const Feed = () => {
    
    return(
        <>
        <Header />
        <div className="container">
            <h1>Feed</h1>
            <Link to="/newpost">
            <Button variant="secondary">New Post</Button>
            </Link>
            <br />
            <br />
            <FeedItem />

        </div>
        </>
    )
};


export default Feed;