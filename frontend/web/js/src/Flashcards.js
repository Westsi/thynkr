import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import { getData } from './APIREQ';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { checkUserExistence } from './Header';
import { base_url } from './requestURL';


const Flashcards = () => {

    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);


    const cue = checkUserExistence();
    let { id } = useParams();

    const getSet = () => {
        if (cue.userExists === true) {
            getData(base_url + '/flashcards/' + id)
                .then(data => {
                    if (data.public === true) {
                        setFlashcards(data);
                    } else if (data.public === false && cue.username === data.owner) {
                        setFlashcards(data);
                    } else {
                        setFlashcards([]);
                    }
                    setIsLoading(false);
                }
                )
            }
            setIsLoading(false);
        }

        const nextCard = () => {
            if (currentCard < flashcards.cards.length -1 ) {
                setCurrentCard(currentCard + 1);
                setShowAnswer(false);
            } else {
                setCurrentCard(0);
                setShowAnswer(false);
            }
        }

        const flipCard = () => {
            setShowAnswer(!showAnswer);
        }

    useEffect(() => {
        getSet();
        document.title = "Flashcards on Thynkr";
    }, []);

    if (isLoading === true) {
        return (
            <>
                <Header />
                <h1>Loading...</h1>
                <Spinner animation="border" variant="secondary" />
                <p>If this stays loading for more than 5 seconds, the backend may be down for maintenance.</p>
            </>
        );
    }
    else if (flashcards.length === 0) {
        return (
            <>
                <Header />
                <h1>This set does not exist or you do not have access to it!</h1>
                <Link to="/feed">
                <Button variant="secondary">Go back to the feed</Button>
                </Link>
            </>
        );
    }
    else {

        return (
            <>
            <Header />
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title>{flashcards.title}</Card.Title>
                    <Card.Text className="mb-2 text-muted"> Made by {flashcards.owner}</Card.Text>
                    <Card.Text>
                        {flashcards.public === true ? "Public" : "Private"}
                    </Card.Text>
                    <Card.Text>
                        Flashcards
                    </Card.Text>
                    <Card onClick={() => flipCard()}>
                        <Card.Body>
                            <Card.Title>{flashcards.cards[currentCard].title}</Card.Title>
                            <br />
                            <br />
                            <Card.Text>
                                {showAnswer ? <>{flashcards.cards[currentCard].content}</> : <></>}
                            </Card.Text>
                            {showAnswer ? <><Button variant="secondary" onClick={() => nextCard()}>Next Card</Button></> : null}
                            </Card.Body>
                    </Card>
                    <br />
                    <Card>
                        <Card.Body>
                            <Card.Text>make this like quizlet learn mode</Card.Text>
                            </Card.Body>
                    </Card>
                    </Card.Body>
                </Card>
            </>
        );
    }
};


export default Flashcards;