import React, { useState, useRef, useEffect } from 'react';
import musicnames from './music_storage.json';
import axios from 'axios';
import audioFile from './audio.mp3';

const Music = () => {
  const [play, setPlay] = useState(['', '', '', '', '']);
  const [heart, setHeart] = useState(Array(musicnames.length).fill("fa-regular fa-heart"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedsongs, setLikedsongs] = useState([]);
  const audioRef = useRef(null);

  // State to manage the progress of the audio
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percentage);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [play]);

  function Handleclick(Name, Src, Artist) {
    setPlay([Name, Src, Artist]);
    if (audioRef.current) {
      audioRef.current.src = audioFile;
      audioRef.current.play();
    }
    setIsPlaying(true);
  }

  async function Handleheart(name) {
    const id = localStorage.getItem('id');
    if (!id) {
      alert('You haven\'t logged in. Please log in to continue.');
      return;
    }

    try {
      const res = await axios.post(`${window.location.origin}/findinheart`, { id });
      if (res.data.result === 'Exist') {
        const index = musicnames.findIndex(ele => ele.Name === name);
        const Element = musicnames.find(ele => ele.Name === name);

        const updatedHeart = [...heart];
        updatedHeart[index] = updatedHeart[index] === "fa-regular fa-heart" ? "fa-solid fa-heart" : "fa-regular fa-heart";
        setHeart(updatedHeart);

        const updatedLikedsongs = [...res.data.likedsongs, Element.Name];
        setLikedsongs(updatedLikedsongs);

        await axios.patch(`${window.location.origin}/myacc/like/` + id, { likedsongs: updatedLikedsongs });
      } else {
        alert('You haven\'t logged in. Please log in to continue.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function togglePlayPause() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <div className='Music_Storage'>
        {musicnames.map((ele, index) => {
          return (
            <div className='Music_element' key={ele.Name}>
              <button onClick={() => { Handleclick(ele.Name, ele.src, ele.Artist) }}>
                <i className="fa-solid fa-circle-play"></i>
              </button>
              <div className='image-div-song'>
                <img src={ele.src} style={{ width: '100%', height: '100%' }} alt={ele.Name} />
              </div>
              <div>
                <h3>{ele.Name}</h3>
                <h5>{ele.Artist}</h5>
              </div>
              <button onClick={() => { Handleheart(ele.Name) }}>
                <i className={heart[index]} style={{ fontSize: '16px' }}></i>
              </button>
              <p>{ele.Duration}</p>
            </div>
          );
        })}
      </div>

      <div className='now-playing'>
        <div className='now-playing-img-div'>
          <img src={play[1]} style={{ width: '100%', height: '100%' }} alt={play[0]} />
        </div>
        <div>{play[0]}</div>
        <div className='playingdivwrap'>
          <div className='playdiv'>
            <i className="fas fa-step-backward"></i>
            {isPlaying ? <i className="fa-solid fa-pause" onClick={togglePlayPause}></i> : <i className="fa-solid fa-play" onClick={togglePlayPause}></i>}
            <i className="fas fa-step-forward"></i>
          </div>
          <p style={{ alignSelf: 'center' }}>{isPlaying ? "Now playing" : "Paused"}</p>
        </div>
        <div>{play[2]}</div>
        {/* Progress Bar */}
        <div className='progress-container'>
          <div className='progress' style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Add the audio element */}
      <audio ref={audioRef} />
    </>
  );
}

export default Music;
