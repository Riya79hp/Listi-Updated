import React from 'react';
import ReactDOM from 'react-dom/client';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Home from './Listi/home';
import reportWebVitals from './reportWebVitals';
import Navbar from './Listi/navbar';
import Music from './Listi/music';
import Search from './Listi/search';
import Login from './Listi/myacclogin';
import SignUp from './Listi/myaccountsignup';
import Playlist from './Listi/playlist';
import Musicplus from './Listi/music+';
import Seesong from './Listi/seesong';
import Seereq from './Listi/seereq';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
     <BrowserRouter>
     <Navbar/>
    <Routes>

    <Route path='/' element={<Home />} />
    <Route path='/music' element={<Music />} />
    <Route path='/search/:query' element={<Search/>}/>
    <Route path='/myacc' element={<Login/>}/>
    <Route path='/myacc/signup' element={<SignUp/>}/>
    <Route path='/myacc/:query' element={<Login/>}/>
    <Route path='/playlist' element={<Playlist/>}/>
    <Route path='/playlist/Musicplus/:query' element={<Musicplus/>}/>
    <Route path='/playlist/seesongs/:query' element={<Seesong/>}/>
    <Route path='/playlist/seereq' element={<Seereq/>}/>

    </Routes>
  </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
