import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

//import {Homepage, Aboutpage, Signup, Login, Feed, NewPost, Profile, Post, Search, EditProfile, Flashcards, FcHome, Planner} from './App'
import App from './App'

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
  );