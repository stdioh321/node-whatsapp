import React from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";

import './App.scss'

const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;


function App() {

  return (
    <>
      <div>
        <h1>Basic Example</h1>
        <div>
          <Link to={"/"}>Home</Link>
          <Link to={"/about"}>About</Link>
        </div>
        <Routes>
          <Route path='/' Component={Home} ></Route>
          <Route path='/about' Component={About}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
