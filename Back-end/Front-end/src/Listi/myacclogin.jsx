import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const { query } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedin, setLoggedin] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [songName, setSongName] = useState('');
  const audioRefs = useRef([]);
  const [currentSong, setCurrentSong] = useState({ name: 'Song Title', artist: 'Song', index: null });
  const [isPlaying, setIsPlaying] = useState(false);
  const [songImage, setSongImage] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (query) {
      axios.post(`${window.location.origin}/myacc/signup/authenticateuser`, { query, token })
        .then((res) => {
          if (res.data.result === 'success') {
            localStorage.setItem("id", query);
            setUsername(res.data.username);
            setLoggedin(false);
          }
        });
    }
  }, [query]);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSongImage(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let token = localStorage.getItem('token');
    axios.post(`${window.location.origin}/myacc`, { username, password, token })
      .then((res) => {
        if (res.data.result === 'success') {
          localStorage.setItem("id", res.data.id);
          setLikedSongs((prev) => [...prev, ...res.data.likedsongs]);
          setLoggedin(false);
        } else {
          alert('User does not exist or password incorrect, please sign up.');
          setLoggedin(true);
        }
      });
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file && songName && songImage) {
      const songURL = URL.createObjectURL(file);
      const imagePreview = URL.createObjectURL(songImage);
      setUploadedSongs((prev) => [
        ...prev,
        { name: songName, url: songURL, image: imagePreview }
      ]);
      setSongName('');
      setSongImage(null);
      event.target.value = null;
    } else {
      alert("Please enter a song name and upload an image before uploading.");
    }
  };
  const handlePlayPause = (index) => {
    const audioElement = audioRefs.current[index];
    if (audioElement) {
      if (audioElement.paused) {
        // Pause other audios before playing the selected one
        audioRefs.current.forEach((audio, idx) => {
          if (idx !== index && audio) audio.pause();
        });
        audioElement.play();
        setCurrentSong({
          name: uploadedSongs[index].name,
          artist: 'Artist Name',
          image: uploadedSongs[index].image,  // Add this line
          index
        });
        setIsPlaying(true);
      } else {
        audioElement.pause();
        setIsPlaying(false);
      }
    } else {
      console.warn(`Audio element at index ${index} is undefined.`);
    }
  };
  
  const togglePlayPause = () => {
    if (currentSong.index !== null) {
      const audioElement = audioRefs.current[currentSong.index];
      if (audioElement) {
        if (audioElement.paused) {
          audioElement.play();
          setIsPlaying(true);
        } else {
          audioElement.pause();
          setIsPlaying(false);
        }
      }
    }
  };
  

  return (
    <>
      {loggedin ? (
        <>
          <div className="login-container">
            <div className="login-box">
              <h2 className="login-heading">Login</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="login-input"
                  required
                />
                <label className="login-label">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="login-input"
                  required
                />
                <button className="login-button">Forget Password?</button>
                <button type="submit" className="login-button">Login</button>
              </form>
            </div>
          </div>
          <div className="signup-link">
            <span>Not Logged in? </span><Link to='/myacc/signup'>SignUp</Link>
          </div>
        </>
      ) : (
        <>
          <div className="username-div">
            <p className="username-pdiv">Hi {username}</p>
          </div>
          <div className="liked-songs-header">
            <p className="liked-songs-title">Your Liked Songs</p>
            <Link to='/music'>
              <button className="add-button">Add more <i className="fa-solid fa-plus"></i></button>
            </Link>
          </div>
          {likedSongs.map((song, index) => (
            <div key={index} className="song-container">
              <div className="song-box">
                <h3 className="song-title">{song}</h3>
              </div>
            </div>
          ))}

<div className="username-div">
<p className="username-pdiv">Upload A Song</p>
          </div>
          
          <div>
          <div className="liked-songs-header">
            <p className="liked-songs-title">Enter Song</p>
            <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} placeholder="Enter song name" className="add-button" required />
          
          </div>
            
          <br/>
          <div className="liked-songs-header">
            <p className="liked-songs-title">Choose Song</p>
            <input type="file" accept="audio/*" onChange={handleAudioUpload} className="add-button" />
            <p className="liked-songs-title">Choose Image</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="add-button" />
           
          </div>
         
         </div>
          
             
          <div className="username-div">
          <p className="username-pdiv">Your Uploaded Songs</p>
          </div>

          {uploadedSongs.map((song, index) => (
            <div key={index} className='Music_element'>
              <button onClick={() => handlePlayPause(index)}>
                <i className="fa-solid fa-circle-play"></i>
              </button>
              <div className='image-div-song'>
                <img src={song.image} style={{ width: '100%', height: '100%' }}  />
              </div>
              <div>
                <h3>{song.name}</h3>
                <h5>{username}</h5>
              </div>
              <audio ref={(el) => audioRefs.current[index] = el} src={song.url} />
            </div>
          ))}

          <div className='now-playing'>
            {currentSong.image && (
               <div className='now-playing-img-div'>
               <img src={currentSong.image} style={{ width: '100%', height: '100%' }}  />
             </div>
            )}
            <div>{currentSong.name}</div>
            <div className='playingdivwrap'>
              <div className='playdiv'>
                <i className="fas fa-step-backward"></i>
                {isPlaying ? <i className="fa-solid fa-pause" onClick={togglePlayPause}></i> : <i className="fa-solid fa-play" onClick={togglePlayPause}></i>}
                <i className="fas fa-step-forward"></i>
              </div>
              <p style={{ alignSelf: 'center' }}>{isPlaying ? "Now playing" : "Paused"}</p>
            </div>
            <div>{currentSong.artist} - {username}</div>
          </div>
        </>
      )}
        
    </>
  );
};

export default LoginForm;
