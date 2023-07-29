const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdphknw.mongodb.net/?retryWrites=true&w=majority`;

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

        const booksCollection = client.db('bookManagement').collection('books')
        const cartCollection = client.db('bookManagement').collection('carts')

        // get book data from mongodb

        app.get('/books', async (req, res) => {
            const cursor = booksCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // added books saved on books database

        app.post('/books', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await booksCollection.insertOne(item)
            res.send(result)
        }) 

        // added books saved on cart database
        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })
        // get cart all
        app.get('/carts', async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // get item based on email
        app.get('/carts', async (req, res) => {
            const email = req.query.email
            if (!email) {
                res.send([])
            }
            const query = { email: email }
            const result = await cartCollection.find(query).toArray()
            res.send(result)

        })

        // delete item from carts
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
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

app.get('/', (req, res) => {
    res.send('Books is Reading')
})

app.listen(port, () => {
    console.log(`Books is Reading on Port ${port}`);
})
