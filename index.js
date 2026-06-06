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

        //READ
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {
                _id: new ObjectId(id)
            }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        //POST
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        //PATCH
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id

            const filter = {
                _id: new ObjectId(id)
            }

            const modifiedDocument = req.body;

            const updatedDocument = {
                $set:{
                    name: modifiedDocument.name,
                    email: modifiedDocument.email,
                    role: modifiedDocument.role
                }
            }
            const result = await userCollection.updateOne(filter, updatedDocument);
            res.send(result)
        })

        //DELETE
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })


        await client.db('admin').command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("simple CRUD server is serving")
})

app.listen(port, () => {
    console.log(`simple CRUD server is running on port ${port}`)
})