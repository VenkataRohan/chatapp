const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);


const mongose=require('mongoose')

const dbURI="mongodb+srv://user:1234@cluster0.6hssd.mongodb.net/chat?retryWrites=true&w=majority"
const {Msg,User}=require('./models/chatdb')

mongose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
  .then((res)=>console.log('connected chat'))
  .catch((err)=>console.log(err))
var bodyParser = require('body-parser');
var multer = require('multer');
var forms = multer();

// apply them

app.use(bodyParser.json());
app.use(forms.array()); 
app.use(bodyParser.urlencoded({ extended: true }));
// Loads env variables
require('dotenv').config()

// // Initalizes express server




// // specifies what port to run the server on
const PORT = process.env.PORT || 3001;

  
 app.post('/friends',async (req,res)=>{
  
  // console.log(req.body.name);
  
    User.find({number:req.body.name}, function(err, data){
      console.log(data);
      res.send(data)
   })
 })
 app.post('/getMsg',async (req,res)=>{
    Msg.find({ $or: [{
      from: req.body.from,
      to:req.body.to
  },
  {
      from: req.body.to,
      to:req.body.from
  },
  ]}, function(err, data){
      console.log(data);
      res.send(data)
   })
 })
 

const usersOnline=new Map()
 let i=0
io.on("connection", (socket) => {
  

    console.log("a user connected : "+socket.id);
    socket.on("chat", (ms,to,from) => {
       console.log(to+" "+from);
        const me=new Msg(
          {
          msg:`${ms}`,
          from:from,
          to:to
        })
       me.save()
       .then((res)=>{
         //console.log(res);
        Msg.find({ $or: [{
          from: from,
          to:to
      },
      {
          from: to,
          to:from
      },
      ]}, function(err, data){
          let n=data.length-1,arr=[]
          for(let i=0;i<=n;i++)
          {
            arr[i]={m:data[i].msg,id:data[i]._id}
          }

         io.to(usersOnline.get(to)).to(usersOnline.get(from)).emit("aa",arr);
       })
       
     });
      
    });

    socket.on('addUser',(name,socketId)=>{

      usersOnline.set(name,socketId)
      console.log(usersOnline);
    })


  });




//app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
server.listen(PORT, () => console.log("server running on port:" + PORT));

