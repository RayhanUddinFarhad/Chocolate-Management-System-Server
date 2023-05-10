const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();


const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.edrit7p.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const chocolate = client.db("chocolatedb");
    const chocolateCollections = chocolate.collection("chocolateCollections");

    app.post  ('/chocolate', async (req, res) => {


        const body = req.body;

        const result = await chocolateCollections.insertOne(body);

        res.send (result);






    })

    app.get ('/chocolate', async (req, res) => { 


       

        const cursor = chocolateCollections.find();
        const result = await cursor.toArray()

        res.send (result)


    })

    app.get ('/chocolate/:id', async (req, res) => { 

        const id  = req.params.id;

        const query = { _id : new ObjectId (id)}

        const newChocolate = await chocolateCollections.findOne(query);


        res.send (newChocolate)


        




    });

    app.delete ('/chocolate/:id', async (req, res) => { 


        const id = req.params.id;

        const query = { _id : new ObjectId (id)};

        const result = await chocolateCollections.deleteOne(query);


        res.send (result)


    })

    app.put ('/chocolate/:id' , async (req, res) => { 

      const id = req.params.id;
      const body = req.body;
      const filter = { _id : new ObjectId (id)};


      const options = { upsert: true };


      const updateDoc = {
        $set: {

          name : body.name,
          country : body.country,
          image : body.image,
          type : body.type

        },
      };
      const result = await chocolateCollections.updateOne(filter, updateDoc, options);

      res.send (result)




    })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

















app.get ('/', (req, res) => { 


    res.send ('App is running')
})

app.listen (port, (req, res) => {


    console.log ('App is listening on port')
 })