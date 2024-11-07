import React from 'react';
import musicnames from './music_storage.json';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const Musicplus = () => {
    const { query } = useParams();
    console.log(query);
    function HandleClick(name){
       const id=localStorage.getItem('id');
        axios.patch(`${window.location.origin}/playlist/musicplus/addsong/`+ query,{name,id})
        .then((res)=>{
            alert(res.data.message);
        })


    }
    return (
        <div className='Music_Storage'>
            {musicnames.map((ele, index) => {
                return (
                    <div className='Music_element' key={ele.Name}>
                        <button>
                            <i className="fa-solid fa-circle-play"></i>
                        </button>
                        <div className='image-div-song'>
                            <img src={ele.src} style={{ width: '100%', height: '100%', backgroundSize: 'cover' }} alt={ele.Name} />
                        </div>
                        <div>
                            <h3>{ele.Name}</h3>
                            <h5>{ele.Artist}</h5>
                        </div>
                        <button onClick={()=>HandleClick(ele.Name)}>
                            +
                        </button>
                        <p>{ele.Duration}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Musicplus;
