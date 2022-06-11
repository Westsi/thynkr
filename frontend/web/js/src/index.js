import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

import {Homepage, Aboutpage, Signup, Login, Feed, NewPost, Profile, Post, Search, EditProfile, Flashcards, FcHome, Planner} from './App'

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/newpost" element={<NewPost />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route path="/search/:id" element={<Search />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/flashcards/:id" element={<Flashcards />} />
            <Route path="/flashcards" element={<FcHome />} />
            <Route path="/planner" element={<Planner />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
  );