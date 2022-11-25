const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)
//mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ycofkd3.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




//function
// async function run(){

//     try{
//        const mobileCategoryCollection = client.db('mobileCategory').collection('');

//        app.get('/categories', async(req,res)=>{
//         const query = {};
//         const categories = await mobileCategoryCollection.find(query).toArray();
//         res.send(categories);
//        })
//     }
//     finally{

//     }
// }

// run().catch(console.log);



app.get('/',(req,res)=>{
    res.send('hello mobile market');

})

app.listen(port,()=>{
    console.log(`hello mobile market server : ${port}`)
})