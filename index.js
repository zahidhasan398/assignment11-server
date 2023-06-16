const express=require("express");
const cors =require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express();
app.use(express.json());
app.use(cors());
//----------mongo start-----------


const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.TOY_PASS}@cluster0.5bogflx.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    const toyCarsCollection=client.db("toy").collection("toycars");
    // const toyIndexKey={ name: 1};
    // const toyIndexOption={name:"toyName"};
    // const result=await toyCarsCollection.createIndex(toyIndexKey,toyIndexOption);
    app.post("/addtoy",async(req,res)=>{
        const body=req.body;
        const result=await toyCarsCollection.insertOne(body);
        res.json(result);
    })
    app.get("/category/:subcategory",async(req,res)=>{
        const sub=req.params.subcategory;
        const query={subcategory:sub};
        const result=await toyCarsCollection.find(query).toArray();
        res.json(result);
    })
   app.get("/alltoys",async(req,res)=>{
    const result=await toyCarsCollection.find().toArray();
    res.json(result);
   })
   app.get("/searchtoyname/:inputvalue",async(req,res)=>{
    const inputValue=req.params.inputvalue;
    const result=await toyCarsCollection.find(
        {
          name:{$regex:inputValue,$options:"i"}
        }
    ).toArray();
    res.json(result);
   })
   app.get("/mytoys/:email",async(req,res)=>{
    const email=req.params.email;
    const query={sellerEmail:email};
    const result=await toyCarsCollection.find(query).toArray();
    res.json(result);
   })
   //-------------------
   app.get("/mytoys/ascend/:email",async(req,res)=>{
    const email=req.params.email;
    const query={sellerEmail:email};
    const result=await toyCarsCollection.find(query).sort({price : 1}).toArray();
    res.json(result);
   })
   app.get("/mytoys/descend/:email",async(req,res)=>{
    const email=req.params.email;
    const query={sellerEmail:email};
    const result=await toyCarsCollection.find(query).sort({ price: -1}).toArray();
    res.json(result);
   })
   //---------------------------------
   app.get("/singletoy/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};
    const result=await toyCarsCollection.findOne(query);
    res.json(result);
   })
   app.patch("/update/:id",async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    
    const query={_id: new ObjectId(id)};
    const updateData={
        $set:{
            ...body
        }
    }
    const result=await toyCarsCollection.updateOne(query,updateData);
    res.json(result);
   })
   app.delete("/deltetoy/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};
    const result=await toyCarsCollection.deleteOne(query);
    res.json(result);
   })

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//----------mongo end-----------


app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})

