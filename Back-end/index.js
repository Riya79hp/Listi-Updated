const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('mongoose');

const path = require("path");
let uri="mongodb+srv://demo:321321@listi790.tym2dyc.mongodb.net/?retryWrites=true&w=majority&appName=listi790"
mongoose.connect(uri); 


const Userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true ,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
  username :{
    type:String,
    required:true,
    unique: true
   

  },
  likedsongs: {
    type: [String] 
}
});

const Userplaylist = new mongoose.Schema({
  ids:{
type:[String],
required:true
  },
  playlistname:{
  type:String,
  required:true
  },

  songs: {
    type: [String],
    default: []
}
});

const Collabrativeplaylist = new mongoose.Schema({
  id1sender: {
    type: String,
    required: true ,
  
  },
  id2receiver: { 
    type: String,
    required: true,
    
  },
  usernameofrequest :{
    type:String,
    required:true,
   
  },
  playlistid: {
    type: String ,
    required:true,
    
},
playlistname:{
  type:String,
  required:true,
},

});

const Userdata = mongoose.model('userdata', Userschema);
const Playlist=mongoose.model('Playlist',Userplaylist);
const Cplaylist=mongoose.model('Collabrativeplaylist',Collabrativeplaylist);
const secretKey='listi@listen';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
  });
};
app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
  res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
  });

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
    res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
    });


    

app.post('/myacc',verifyToken, async (req, res) => { 
  const acc = req.body;

    const est = await Userdata.findOne({ username: acc.username}); 

    if (est) {
      res.json({result:"success",id:est.id,likedsongs:est.likedsongs});
    } else {
  
      res.json('User does not exist');
    }
   
});
app.post('/myacc/signup/authenticateuser',verifyToken,async (req, res) => { 
  const acc = req.body;


    const est = await Userdata.findById(acc.query); 
    
    if (est) {
      res.json({result:"success",id:est.id,username:est.username});
    } else {
  
      res.json('User does not exist');
    }
   
});


app.post('/myacc/signup', async (req, res) => { 
  const acc = req.body;
 console.log(req.body)
    const est = await Userdata.insertMany([acc]); 
   const element=await Userdata.findOne({email:acc.email});
    if (est) {
      const token = jwt.sign({ acc }, secretKey);
      res.json({id:element.id,token:token});
     
    } 
    else{
      res.json('')
    }
  
});

app.post('/findinheart',async (req,res)=>{
  const id=req.body.id;
  const est= await Userdata.findById(id);
 
  if(est){
    res.json({result:'Exist',likedsongs:est.likedsongs});
  }
  else{
    res.json('Dont Exist')
  }
})

app.patch('/myacc/like/:id', async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    
    const updatedUser = await Userdata.findByIdAndUpdate(
      id, 
      { likedsongs: data.likedsongs },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(updatedUser)

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/playlist/musicplus/addsong/search/getplaylist', async (req, res) => {
  const { id } = req.body;
  
  try {
      
      let playlists = await Playlist.find({ ids: { $all: [id] } });
      let playlistNames = playlists.map(playlist => playlist.playlistname);
      res.json({ playlist: playlistNames });
  } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.patch('/playlist/musicplus/addsong/:query', async (req, res) => {
  const { name, id } = req.body;
  const query = req.params.query;
 

  try {
    
    let playlist = await Playlist.findOne({ ids: { $all: [id] }, playlistname: query });
    
    if (!playlist) {
    
      playlist = new Playlist({
        ids: [id],
        playlistname: query,
        songs: [name]
      });
      await playlist.save();
    } else {
    
      playlist.songs.push(name);
      await playlist.save();
    }

    res.json({ message: 'Song added to playlist successfully', playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/playlist/getuserplaylist', async (req, res) => {
 
      const { id } = req.body;

      const playlist = await Playlist.find({ ids :{ $all: [id]} });

let collabrate=[]
let single=[]
playlist.map((ele)=>{

  if(ele.ids.length > 1){
collabrate.push(ele.playlistname);
  }
  else{
    single.push(ele.playlistname);
  }
})
console.log(single);
console.log(collabrate);

      if (!playlist) {
          return res.json({ message: 'Playlist Not found' });
      }

      res.json({ message: 'Playlist found', playlistsingle:single, playlistcollabrate:collabrate });
 
});

app.post('/playlist/seesong/getuserplaylistsongs', async (req, res) => {
 
  const { id ,query} = req.body;

  const playlist = await Playlist.find({ids :{ $all: [id]} , playlistname:query});
let g;
playlist.map((ele)=>{

  g=ele.songs
  
})



console.log(g);
  if (!playlist) {
      return res.json('');
  }

  res.json( {playlist:g} );

});


app.post('/playlist/seesong/getpidc',async (req,res)=>{
  const {id,query}=req.body;

  const playlist = await Playlist.find({ ids :{ $all: [id]} , playlistname:query});

  if(playlist){
    res.status(200).json(playlist[0]._id);
  }
  else{
    res.status(500).json('server error')
  }
})

app.post('/playlist/sendreq',async (req,res)=>{
  const {pid,uid} = req.body;

  const userdatas=await Userdata.findById(uid);
  const userdatar=await Playlist.findById(pid);

  let cplay={
    id1sender:uid,
    playlistid:pid,
    id2receiver:userdatar.ids[0],
    usernameofrequest:userdatas.username,
    playlistname:userdatar.playlistname,
    
  

    
  }
  const inser=await Cplaylist.insertMany([cplay]);
  if(inser){
    res.json('Sent Successfully');
  }
  else{
    res.json('Playlist does not exist');
  }

})

app.post('/playlist/seereq',async(req,res)=>{
  const {id}=req.body;

 const cplaydata=await Cplaylist.find({id2receiver:id});
 
 res.json(cplaydata);

})
app.post('/playlist/seereq/accept',async (req,res)=>{
  const {id1sender,playlistid}=req.body;
  const playlistupdateid= await Playlist.findById(playlistid);
  const delectedq=await Cplaylist.find({id1sender:id1sender,playlistid:playlistid})
  await Cplaylist.findByIdAndDelete(delectedq[0]._id);

  const v=playlistupdateid.ids.push(id1sender);
  if(v){
    res.json('Success')
  }
  else{
    res.json('Error occured')
  }
  await playlistupdateid.save();
})
app.post('/playlist/seereq/reject', async (req, res) => {
  const { id1sender, playlistid } = req.body;

  try {
    // Find the collaborative request that needs to be rejected
    const request = await Cplaylist.findOne({ id1sender, playlistid });

    if (request) {
      // Delete the request from the collection
      await Cplaylist.findByIdAndDelete(request._id);
      res.json({ message: 'Request rejected successfully' });
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/myacc/login/forgotpassword', async (req, res) => {
  const { x: username } = req.body;

  const user = await Userdata.findOne({ username });
  if (user) {
    
    res.json({ result: 'success' });
  } else {
    res.json({ result: 'error', message: 'User does not exist' });
  }
});


app.post('/myacc/login/setnewpassword', async (req, res) => {
  const { username, password } = req.body;

  const user = await Userdata.findOneAndUpdate(
    { username },
    { password },
    { new: true }
  );

  if (user) {
    res.json({ result: 'success', message: 'Password updated successfully' });
  } else {
    res.json({ result: 'error', message: 'User not found' });
  }
});

app.listen(4500, () => {
  console.log("server started");
});
