const express =require('express');
const cors = require('cors');
const jwt =require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

// const corsOptions = {
//     // origin:['http://localhost:5176', 'https://localhost:5177'],
//     Credential:true,
//     optionSuccessStatus:200,
// }

app.use(cors(corsOptions))
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ce00xrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const jobCollection = client.db('jobquesthub').collection('jobs');
    const bidCollection = client.db('jobquesthub').collection('bids');

    // jwt implement
    app.post('/jwt',async(req,res)=> {
      const user =req.body;
      console.log(user);
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'365d'
      })
      res.cookie('token',token,{
httpOnly:true,
secure:process.env.NODE_ENV === 'production',
sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
      })
      .send({success:true})
    })

// save bid data
app.post('/bid',async(req,res) => {
  const bidData = req.body;
  const result = await bidCollection.insertOne(bidData)
  res.send(result)
})
// get bid data
app.get('/bids/:email' , async(req,res) => {
  const email = req.params.email;
  const filter = req.query.filter;
  const query ={email}
console.log(query);
  // let query = {}
  if (filter){category=filter}

 
  const result = await bidCollection.find(query).toArray()
  res.send(result)
})
    // get all jobs data from db
    app.get('/jobs',async(req,res)=> {
      const search = req.query.search
        
       if (search) {
        query = {
          job_title:{$regex:search,$options:'i'}
          }
       }
       const result = await jobCollection.find().toArray();
        res.send(result);

    })
    // post all jobs from client
    app.post('/job',async(req,res)=> {
      const jobData = req.body;
      const result = await jobCollection.insertOne(jobData)
      res.send(result);
    });
    // specific email user
    app.get('/jobs/:email',async(req,res)=>{
      const email=req.params.email;
      const query = {user_email : email}
      const result = await jobCollection.find(query).toArray();
      res.send(result);
    })

    // delete jobs
    app.delete('/jobs/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });
    // update
    app.put("/job/:id",async(req,res)=>{
      const id = req.params.id;
      const jobData = req.body;
      const query = {_id:new ObjectId(id)};
      const options = {upsert:true};
      const updateDoc ={
        $set:{
          ...jobData
        },
      }
      const result = await jobCollection.updateOne(query,updateDoc, options)
      res.send(result);
    });




    // get a single job details data 
app.get("/job/:id" ,async(req,res) => {
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await jobCollection.findOne(query);
  res.send(result);
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
 
  }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('Hello from....')
  })
app.listen(port, () => console.log(`Server running on port ${port}`))