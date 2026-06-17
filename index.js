const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

// middleWare
app.use(cors())
app.use(express.json())

// TFn1ejzKxQX7UPoZ   assignment-ten
const uri = "mongodb+srv://assignment-ten:TFn1ejzKxQX7UPoZ@cluster0.kbxs8tk.mongodb.net/?appName=Cluster0";

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
        await client.connect();
        const assignmentTenDB = client.db("assignmentTenDB");
        const allReviewCollection = assignmentTenDB.collection("allReview")

        // apis
        app.post('/postReview',async(req, res) => {
            const newReview = req.body;
            const result = await allReviewCollection.insertOne(newReview);
            res.send(result)
        })

        app.get('/allReview', async(req, res) => {
            const sortField = {currentDate: -1}
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

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port, ()=> {
    console.log(`assignment ten listen on port ${port}`)
})