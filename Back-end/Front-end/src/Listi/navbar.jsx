import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.png';

const Navbar = () => {
    const [toggle, setToggle] = useState({ visibility: 'hidden', height: '0px' });
    const [searchQuery, setSearchQuery] = useState('');
    const [link, setLink] = useState('/search');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = ['Search', 'Search By Artist', 'Search By Song Name'];
    
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setLink('/search/' + e.target.value);
    };

    const handleClick = () => {
        setToggle(prevToggle => ({
            visibility: prevToggle.visibility === 'hidden' ? 'visible' : 'hidden',
            height: prevToggle.height === '0px' ? '330px' : '0px'
        }));
    };

    return (
        <>
            <div className='navbardiv'>
                <Link to='/'>
                    <div style={{ width: '100px', height: '60px', overflow: 'hidden' }}>
                        <img src={Logo} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }} alt="Logo" />
                    </div>
                </Link>
                <Link to='/music' className='navbar-written'>Music</Link>
                <Link to='/playlist' className='navbar-written'>Playlist</Link>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                        type='search' 
                        placeholder={placeholders[placeholderIndex]} 
                        className='navbar-written-input' 
                        value={searchQuery} 
                        onChange={handleInputChange} 
                    />
                    <button 
                        style={{ marginTop: '3px', borderRadius: '40px', width: '50px', height: '30px', cursor: 'pointer' }}
                    >
                        <Link to={link}>
                            <i className="fa-brands fa-golang" style={{ fontSize: '18px' }}></i>
                        </Link>
                    </button>
                </div>
                <Link to='/myacc' className='navbar-written'>My-account</Link>
            </div>

            <div className='navbardivmobie'>
                <button className='navbarbtn' onClick={handleClick}>
                    <i className="fas fa-bars"></i>
                </button>
                <div style={{ display: 'flex' }}>
                    <input 
                        type='search' 
                        placeholder={placeholders[placeholderIndex]} 
                        className='navbar-written-input-mobile'  
                        onChange={handleInputChange} 
                        value={searchQuery} 
                    />
                    <button 
                        style={{ marginTop: '3px', borderRadius: '40px', width: '50px', height: '30px', cursor: 'pointer' }}
                    >
                        <Link to={link}>
                            <i className="fa-brands fa-golang" style={{ fontSize: '18px' }}></i>
                        </Link>
                    </button>
                </div>
            </div>

            <div className='mobilenavbarsideway' style={toggle}>
                <Link to='/'>
                    <div style={{ width: '100px', height: '50px', overflow: 'hidden', marginTop: '10px' }}>
                        <img src={Logo} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }} alt="Logo" />
                    </div>
                </Link>
                <hr style={{ width: '100%' }} />
                <Link to='/music' className='navbar-written-mobile'>Music</Link>
                <hr style={{ width: '100%' }} />
                <Link to='/playlist' className='navbar-written-mobile'>Playlist</Link>
                <hr style={{ width: '100%' }} />
                <Link to='/myacc' className='navbar-written-mobile'>Account</Link>
                <hr style={{ width: '100%' }} />
            </div>
        </>
    );
};

export default Navbar;
