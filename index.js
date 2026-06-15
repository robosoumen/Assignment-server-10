const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.post('/allReview',async(req, res) => {
            const newReview = req.body;
            const result = await allReviewCollection.insertOne(newReview);
            res.send(result)
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