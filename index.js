const express = require('express')
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

// middleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kbxs8tk.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/',(req,res) => {
    res.send('assignment ten(10) server is running on pc..........')
})

async function run(){
    try{
        // await client.connect();
        const assignmentTenDB = client.db("assignmentTenDB");
        const allReviewCollection = assignmentTenDB.collection("allReview");
        const myFavoriteReviewCollection = assignmentTenDB.collection("FavoriteReview");

        // apis
        app.post('/postReview',async(req, res) => {
            const newReview = req.body;
            const result = await allReviewCollection.insertOne(newReview);
            res.send(result)
        })

        app.get('/allReview',async(req, res) => {
            const sortField = {rating: -1}
            const cursor = allReviewCollection.find().sort(sortField).limit(6);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/allCard',async(req, res) => {
            const sortField = {rating: -1}
            const cursor = allReviewCollection.find().sort(sortField);
            const result = await cursor.toArray();
            res.send(result)
        })

        // user er review api
        app.get('/userReview', async(req, res) => {
            const email = req.query.email;
            const query = {};
            if(email){
                query.userEmail = email
            };
            const cursor = allReviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/my-favorite', async(req, res) => {
            const email = req.query.email;
            const query = {};
            if(email){
                query.userEmail = email
            }
            const result = await myFavoriteReviewCollection.find(query).toArray();
            res.send(result);
        })

        // users favorite card api i need post api and get api
        app.post('/favorite', async(req, res) => {
            const data = req.body;
            const result = await myFavoriteReviewCollection.insertOne(data);
            res.send(result);
        })

        // single review get
        app.get('/userReview/:id', async(req, res) => {
            const id = req.params.id;

            const result = await allReviewCollection.findOne({
                _id:new ObjectId(id)
            })

            res.send(result)

        })

        // delete user review
        app.delete('/userReview/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await allReviewCollection.deleteOne(query);
            res.send(result);
        })

        // favorite page delete api
        app.delete('/delete/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await myFavoriteReviewCollection.deleteOne(query);
            res.send(result);
        })

        // put operation
        app.put('/userReview/:id', async(req,res) => {
            const id = req.params.id;
            const updatedReview = req.body;
            const query = {_id : new ObjectId(id)};
            const update = {
                $set:updatedReview
            };
            const result = await allReviewCollection.updateMany(query, update);
            res.send(result);
        })

        // search karar api
        app.get('/search', async(req, res) => {
            const search_text = req.query.search;
            const result = await allReviewCollection.find({foodName:{$regex:search_text, $options:"i"}}).toArray();
            res.send(result);
        })


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port, ()=> {
    console.log(`assignment ten listen on port ${port}`)
})