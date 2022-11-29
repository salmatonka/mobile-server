const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ycofkd3.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// token function
   function verifyJWT(req,res,next){
    console.log('token verify',req.headers.authorization);
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return res.status(401).send('unauthorized access');
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
      if(err){
        
        return res.status(403).send({message:'access token'})
      }
      req.decoded = decoded;
      next();
    })
   }

// function
 async function run(){

    try{
    
      
      const mobileDetailsCollection = client.db('mobilePhoneCategory').collection('services');
       const orderingsCollection = client.db('mobilePhoneCategory').collection('orderings');
       const usersCollection = client.db('mobilePhoneCategory').collection('users');


   
    //  4 data   
    app.get('/services',async(req,res)=>{
      const query = {};
      const cursor = mobileDetailsCollection.find(query)
      const services = await cursor.toArray()
      res.send(services)
   })
    
   //4 data id
     
     app.get('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query ={_id: ObjectId(id)};
      const service = await mobileDetailsCollection.findOne(query);
      res.send(service)
   })


     //my order product
     app.get('/orderings', verifyJWT, async(req, res) =>{
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
    if(email !== decodedEmail){
       return res.status(403).send({message: 'forbidden access'});
    }

      const query = { email: email};
      const orderings = await orderingsCollection.find(query).toArray();
      res.send(orderings);
})


    

      // orderings 
      app.post('/orderings', async(req, res) =>{
         const ordering = req.body
          console.log(ordering);
          const query = {
            phoneServices: ordering.phoneServices
        }
        const alreadyOrdered = await orderingsCollection.findOne(query).toArray();

      if(alreadyOrdered.length){
        const message = `already ordering on ${ordering.phoneServices}`
        return res.send({acknowledged: false, message})
      }
         const result = await orderingsCollection.insertOne(ordering);
         res.send(result);
      });

    app.get('/jwt', async(req,res) =>{
      const email = req.query.email;
         console.log(email)
        const query = { email: email};
        const user = await usersCollection.findOne(query);
        
        if(user && user.email){
          const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '2h'})
          return res.send({accessToken: token});
        }


          console.log(user);
        res.status(403).send({accessToken: ''})
    
     })

     app.get('/users',async(req,res) =>{
      const query = {};
      const users = await usersCollection.findOne(query).toArray;
      res.send(users);
  })


      app.post('/users',async(req,res) =>{
          const user = req.body;
          console.log(user);
          const result = await usersCollection.insertOne(user);
          res.send(result);
      })



    }
    finally{

    }
}

run().catch(console.log);



app.get('/',(req,res)=>{
    res.send('hello mobile market');

})

app.listen(port,()=>{
    console.log(`hello mobile market server : ${port}`)
})