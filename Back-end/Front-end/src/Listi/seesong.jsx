import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Seesong = () => {
    const id = localStorage.getItem('id');
    const { query } = useParams();
    const [play, setPlay] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${window.location.origin}/playlist/seesong/getuserplaylistsongs`, { query, id });
                setPlay(prevPlay => [...prevPlay, ...response.data.playlist]);
            } catch (error) {
                console.error('Error fetching playlist songs:', error);
            }
        };

        fetchData();
    }, [id, query]); 

   async  function Handlegetid(){
   await axios.post(`${window.location.origin}/playlist/seesong/getpidc`,{id,query})
   .then(res=>{
    alert(res.data);

   })
   .catch(err=>{
    console.log(err);
   })
   }

    

    return (
        <div className="seesong-container">
            <h2>{query} Playlist</h2>
            <div className="playlist-items">
                {
                    play.map((ele, index) => (
                        <div className="playlist-item" key={index}>{ele}</div>
                    ))
                }
            </div>
            <button className='playlist-item-button' onClick={Handlegetid}>Get ID</button>
        </div>
    );
}

export default Seesong;
