import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData, deleteData, postData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import { checkUserExistence } from './Header';
import Form from 'react-bootstrap/Form';


const Post = () => {
        const [postInfo, setPostInfo] = useState();
        const [isLoading, setIsLoading] = useState(true);
        const [comments, setComments] = useState([]);
        const [comment, setComment] = useState("");
    
        let { id } = useParams();
        console.log(id);
    
        const cue = checkUserExistence();
    
        const navigate = useNavigate();
    
        const getImage = () => {
            return 'http://localhost:5000/users/pfp/' + postInfo.author;
        };
    
        const makeServerRequest = () => {
            setIsLoading(true);
            getData('http://localhost:5000/posts/' + id)
            .then(data => {
                console.log(data);
                setPostInfo(data);
                setIsLoading(false);
        });
        };
    
        const getComments = () => {
            setIsLoading(true);
            getData('http://localhost:5000/comments')
            .then(data => {
                var temp = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].on_post_id == id) {
                        temp.push(data[i]);
                    }
                }
                setComments(temp);
                setIsLoading(false);
        });
        };
    
    
    
        const setTitle = () => {
            if (isLoading == false) {
                document.title = postInfo.title + " on Thynkr";
            }
        }
    
        const handlePostDelete = () => {
            deleteData('http://localhost:5000/posts/' + id)
            .then(data => {
                console.log(data);
                for (let i = 0; i < comments.length; i++) {
                    deleteData('http://localhost:5000/comments/' + comments[i].comment_id)
                }
                navigate('/feed');
                
        });
        }
    
        const handleCommentDelete = (comment_id) => {
            deleteData('http://localhost:5000/comments/' + comment_id)
            window.location.reload(true);
        }
    
        const handleCommentSubmit = () => {
            const data = {
                content: comment,
                post_id: id,
                key: cue.key
            }
            console.log(data);
            postData('http://localhost:5000/comments', data)
            .then(data => {
                console.log(data);
        });
        createNotifCallComment();
        }

        const createNotifCallComment = () => {
            const data = {
                notif_type: "comment",
                key: cue.key,
                post_link: id,
                user_to_send_to: postInfo.author,
            }
            console.log(data);
            postData('http://localhost:5000/notifs', data)
            .then(data => {
                console.log(data);
                window.location.reload();
        });
        }
    
        useEffect(() => {
            makeServerRequest();
            getComments();
            setTitle();
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
        else if (postInfo.title == undefined) {
            return (
                <>
                    <Header />
                    <h1>Post does not exist or has been deleted</h1>
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
            <Card style={{ width: '80rem' }}>
            <Card.Body>
                <Card.Title>{postInfo.title}</Card.Title>
                <Card.Text>
                {postInfo.content}
                </Card.Text>
                <Card.Text>
                {new Date(postInfo.date_time).getDate()}/{new Date(postInfo.date_time).getMonth() + 1} at {new Date(postInfo.date_time).getHours()}:{new Date(postInfo.date_time).getMinutes()}
                </Card.Text>
                <Link to={`/users/${postInfo.author}`}>
                <Button variant="primary">Post by <Image src={getImage()} height={20} />{postInfo.author}</Button>
                </Link>
                {cue.username == postInfo.author ? <Button variant="danger" onClick={handlePostDelete}>Delete Post</Button> : null}

                
            </Card.Body>
            </Card>

            <br />
            
            <h3>Comments</h3>
            {cue.userExists == true ? <div><Form.Control as="textarea" rows="3" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} /> <Button variant="primary" onClick={handleCommentSubmit.bind()}>Submit</Button> </div>: null}
            {comments.map(comment => {
                if (comment.author === cue.username) {
                    return (
                        <div>
                            <Card style={{ width: '80rem' }}>
                            <Card.Body>
                            <Card.Text>
                                {comment.content}
                            </Card.Text>
                            <Card.Text>
                                {new Date(comment.date_time).getDate()}/{new Date(comment.date_time).getMonth() + 1} at {new Date(comment.date_time).getHours()}:{new Date(comment.date_time).getMinutes()}
                            </Card.Text>
                            <Link to={`/users/${comment.author}`}>
                            <Button variant='secondary'>Comment by {comment.author}</Button>
                            </Link>
                            <Button variant="warning" onClick={handleCommentDelete.bind(this, comment.comment_id)}>Delete Comment</Button>
                            </Card.Body>
                            </Card>
                            <br />
                            <br />
                            </div>
                    );
                }
                else {
                    return (
                        <div>
                            <Card style={{ width: '80rem' }}>
                            <Card.Body>
                            <Card.Text>
                                {comment.content}
                            </Card.Text>
                            <Card.Text>
                                {new Date(comment.date_time).getDate()}/{new Date(comment.date_time).getMonth() + 1} at {new Date(comment.date_time).getHours()}:{new Date(comment.date_time).getMinutes()}
                            </Card.Text>
                            <Link to={`/users/${comment.author}`}>
                            <Button variant='secondary'>Comment by {comment.author}</Button>
                            </Link>
                            </Card.Body>
                            </Card>
                            <br />
                            <br />
                            </div>
                    );
                }
    })}
    
            </div>
            </>
        )
    };
    };


export default Post;