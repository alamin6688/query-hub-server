require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrlryfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const myQueriesCollections = client.db("queryHub").collection("myQueries");
    const recommendationCollections = client
      .db("queryHub")
      .collection("recommendations");

    // Get All Queries
    app.get("/myQueries", async (req, res) => {
      const result = await myQueriesCollections.find().toArray();
      res.send(result);
    });

    // Get A Specific Query
    app.get("/myQueries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myQueriesCollections.findOne(query);
      res.send(result);
    });

    // Post A Query Data In DB
    app.post("/myQueries", async (req, res) => {
      const newData = req.body;
      const result = await myQueriesCollections.insertOne(newData);
      res.send(result);
    });

    // Update A My Query Data In DB
    app.put("/myQueries/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          ...updateData,
        },
      };
      const result = await myQueriesCollections.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Delete A Query
    app.delete("/myQueries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myQueriesCollections.deleteOne(query);
      res.send(result);
    });

    // Get All Recommendations
    app.get("/recommendations", async (req, res) => {
      const result = await recommendationCollections.find().toArray();
      res.send(result);
    });

    // Post A Recommendation Data In DB
    app.post("/recommendations", async (req, res) => {
      const newData = req.body;
      const result = await recommendationCollections.insertOne(newData);
      res.send(result);
    });

    // Get A Specific Recommendation
    app.get("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recommendationCollections.findOne(query);
      res.send(result);
    });

    // Delete A Recommendation
    app.delete("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recommendationCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("query hub is running!");
});

app.listen(port, () => {
  console.log(`Query Hub server is running on port: ${port}`);
});
