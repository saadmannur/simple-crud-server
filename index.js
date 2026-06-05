const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://simpleCrudUsers:5sJly2bEntwUatkV@cluster0.nbebzri.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const run = async () => {
    try {
        await client.connect();


        const db = client.db('simpleCrud');
        const userCollection = db.collection('users');

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {
                _id : new ObjectId(id)
            }
            const user = await userCollection.findOne(query)
            res.send(user)
        })


        await client.db('admin').command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)


//mongodb+srv://simpleCrudUsers:5sJly2bEntwUatkV@cluster0.nbebzri.mongodb.net/?appName=Cluster0

app.get('/', (req, res) => {
    res.send("simple CRUD server is serving")
})

app.listen(port, () => {
    console.log(`simple CRUD server is running on port ${port}`)
})