const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dam4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travel-man");
    const packageCollection = database.collection("packages");
    const bookingCollection = database.collection("bookings");
    // GET api
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/bookings/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // POST api
    app.post("/bookings", async (req, res) => {
      const result = await bookingCollection.insertOne(req.body);
      res.json(result);
    });
    app.post("/packages", async (req, res) => {
      console.log(req.body);
      const result = await packageCollection.insertOne(req.body);
      res.json(result);
    });
    // UPDATE API
    app.put("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "Approved",
        },
      };
      const result = await bookingCollection.updateOne(query, updateStatus);
      res.json(result);
    });
    // DELETE api
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to travel man websites server <3");
});
app.listen(port, () => {
  console.log(`listening to port : ${port}`);
});
