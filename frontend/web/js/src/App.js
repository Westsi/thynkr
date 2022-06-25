import React from 'react'
import {Routes, Route } from 'react-router-dom';
const Homepage = React.lazy(() => import('./Homepage'));
const Aboutpage = React.lazy(() => import('./Aboutpage'));
const Signup = React.lazy(() => import('./Signup'));
const Login = React.lazy(() => import('./Login'));
const Feed = React.lazy(() => import('./Feed'));
const NewPost = React.lazy(() => import('./NewPost'));
const Profile = React.lazy(() => import('./GetProfile'));
const Post = React.lazy(() => import('./GetPosts'));
const Search = React.lazy(() => import('./Search'));
const EditProfile = React.lazy(() => import('./EditProfile'));
const Flashcards = React.lazy(() => import('./Flashcards'));
const FcHome = React.lazy(() => import('./FlashcardHome'));
const Planner = React.lazy(() => import('./Planner'));

const App = () => {
    return (
    <Routes>
            <Route path="/" element={<React.Suspense fallback={<>...</>}>
              <Homepage />
            </React.Suspense>} />
            <Route path="/about" element={<React.Suspense fallback={<>...</>}>
              <Aboutpage />
            </React.Suspense>} />
            <Route path="/signup" element={<React.Suspense fallback={<>...</>}>
              <Signup />
            </React.Suspense>} />
            <Route path="/login" element={<React.Suspense fallback={<>...</>}>
              <Login />
            </React.Suspense>} />
            <Route path="/feed" element={<React.Suspense fallback={<>...</>}>
              <Feed />
            </React.Suspense>} />
            <Route path="/newpost" element={<React.Suspense fallback={<>...</>}>
              <NewPost />
            </React.Suspense>} />
            <Route path="/users/:id" element={<React.Suspense fallback={<>...</>}>
              <Profile />
            </React.Suspense>} />
            <Route path="/posts/:id" element={<React.Suspense fallback={<>...</>}>
              <Post />
            </React.Suspense>} />
            <Route path="/search/:id" element={<React.Suspense fallback={<>...</>}>
              <Search />
            </React.Suspense>} />
            <Route path="/editprofile" element={<React.Suspense fallback={<>...</>}>
              <EditProfile />
            </React.Suspense>} />
            <Route path="/flashcards/:id" element={<React.Suspense fallback={<>...</>}>
              <Flashcards />
            </React.Suspense>} />
            <Route path="/flashcards" element={<React.Suspense fallback={<>...</>}>
              <FcHome />
            </React.Suspense>} />
            <Route path="/planner" element={<React.Suspense fallback={<>...</>}>
              <Planner />
            </React.Suspense>} />
        </Routes>
    );
}

export default App;