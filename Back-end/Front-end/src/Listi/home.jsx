import React, { useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import Explore_By_Artist from './Explore_By_Artist.png';
import Explore_By_Songs from './Explore_By_Songs.png';
import likeit from './likeit.png';
import playnpause from './playnpause.png';


const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [link, setLink] = useState('/search');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setLink('/search/' + e.target.value);
  };

  return (
    <div className="home-container">
      <section className="home-parallax" style={{ backgroundImage: 'url(https://us-wd.gr-cdn.com/www-pages/sites/14/2022/03/0550/music-0-header.jpg)' }}>
        <div className="home-parallax-content">
          <h1 className="home-title">Welcome to Listi</h1>
          <p className="home-subtitle">Your ultimate music streaming destination</p>
        </div>
      </section>

      <section className="home-explore-search">
        <h2 className="home-section-title">Explore and Search</h2>
        <div className="home-explore-content">
          <div className="home-search-bar">
            <input
              type="text"
              placeholder="Search for songs, artists, albums..."
              className="home-search-input"
              onChange={handleInputChange}
            />
            <button className="home-search-button">
              <Link to={link} style={{ color: 'white', textDecoration: 'none' }}>Search</Link>
            </button>
          </div>
          <Slider className="home-slider" {...sliderSettings}>
            <div>
              <img src={Explore_By_Artist} alt="Explore 1" className="home-slider-image" />
            </div>
            <div>
              <img src={Explore_By_Songs} alt="Explore 2" className="home-slider-image" />
            </div>
            <div>
              <img src="https://cms-fym.imgix.net/Akg6_E1c_S_Ot_Rb_P8_W_Qnd2w_6370716e42.png?auto=compress,format&fit=fillmax&ch=Save-Data&w=1600&max-h=1600" alt="Explore 3" className="home-slider-image" />
            </div>
          </Slider>
        </div>
      </section>

      <section className="home-playlists-parallax" style={{ backgroundImage: 'url(https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/YTM_PlaylistImprovements_Composite_1440x1080.jpg)' }}>
        <div className="home-parallax-content">
          <h2 className="home-section-title">Create and Share Playlists</h2>
          <p>Make collaborative playlists with your friends and enjoy music together.</p>
          <Link to="/playlist" className="home-button-plist">Explore Playlists</Link>
        </div>
      </section>


      <h2 className="home-section-title">Discover</h2>
      <section className="home-discover" style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/18/22/21/blur-1839303_960_720.jpg)' }}>
        <div className="home-discover-content">
          <div className="home-discover-item">
            <img src={likeit} alt="Discover 1" className="home-discover-image" />
            <p>Like a Song</p>
          </div>
          <div className="home-discover-item">
            <img src={playnpause} alt="Discover 2" className="home-discover-image" />
            <p>Play any song</p>
          </div>
        </div>
        <div className="home-discover-content">
          <Link to="/music" className="home-button">Go to Music</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
