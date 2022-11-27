const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

// function
 async function run(){

    try{
    
       const mobileCategoriesCollection = client.db('mobilePhoneCategory').collection('categorys');
       const mobileDetailsCollection = client.db('mobilePhoneCategory').collection('services');
       const orderingsCollection = client.db('mobilePhoneCategory').collection('orderings');


   //3data
   app.get('/categorys', async(req,res)=>{
    const query = {};
    const cursor = mobileCategoriesCollection.find(query);
    const categorys = await cursor.toArray();
    res.send(categorys);
   })

    //  6data   
       app.get('/services',async(req,res)=>{
        // const id=req.params.id;
        const query = {}
        const cursor = mobileDetailsCollection.find(query)
        const brands = await cursor.limit(6).toArray()
        res.send(brands)
     })
    
     //my product
     app.get('/orderings', async(req, res) =>{

        const email = req.query.email;
        const query = { email: email};
        const orderings = await orderingsCollection.find(query).toArray();
        res.send(orderings);
    
    })




      //orderings 
      app.post('/orderings', async(req, res) =>{
         const ordering = req.body
        //  console.log(ordering);
        const query = {
            phoneServices: ordering.phoneServices
        }
        const alreadyOrdered = await orderingsCollection.find(query).toArray();

      if(alreadyOrdered.length){
        const message = `already ordering on ${ordering.phoneServices}`
        return res.send({acknowledged: false, message})
      }
         const result = await orderingsCollection.insertOne(ordering);
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