const express =require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

const corsOptions = {
    // origin:['http://localhost:5176', 'https://localhost:5177'],
    Credential:true,
    optionSuccessStatus:200,
}

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
    // get all jobs data from db
    app.get('/jobs',async(req,res)=> {
        const result = await jobCollection.find().toArray();
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