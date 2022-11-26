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

// function
 async function run(){

    try{
       const mobileCategoriesCollection = client.db('mobilePhoneCategory').collection('categories');
       const mobileDetailsCollection = client.db('mobilePhoneCategory').collection('brands');


   //3data
   app.get('/categories', async(req,res)=>{
    const query = {};
    const cursor = mobileCategoriesCollection.find(query);
    const categories = await cursor.toArray();
    res.send(categories);
   })

     //6data   
       app.get('/brands',async(req,res)=>{
        // const id=req.params.id;
        const query = {}
        const cursor = mobileDetailsCollection.find(query)
        const brands = await cursor.limit(6).toArray()
        res.send(brands)
     })
    

     

     app.get('/brands:id',async(req,res)=>{
        const id = req.params.id;
        const query = {id:parseInt(id)}
        const cursor = mobileDetailsCollection.find(query);
        const categoryBrands = await cursor.toArray();
        res.send(categoryBrands)

     })
    //  app.get('/brands/:id',async(req,res)=>{
    //     const id = req.params.id;
    //     const selectedBrands = mobileDetailsCollection.find(b => b._id === id);
    //     res.send(selectedBrands)

    //  })

    

       
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