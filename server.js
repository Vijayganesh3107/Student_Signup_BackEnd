const express=require("express");
const app=express();
const cors=require("cors");
require("dotenv").config();
app.use(cors());
const mongodb=require("mongodb");
const mongoclient=mongodb.MongoClient;
const bodyparser=require("body-parser");
app.use(bodyparser.json())
const url=process.env.MONGO_DB

app.post("/add-details",async(req,res)=>{
    var client=await mongoclient.connect(url);
    var db=await client.db("assignment");
    var checkdata=await db.collection("students").findOne({email:req.body.email})
    if(checkdata){
        res.json({
            message:"Data with the email Id is already present"
        })
        client.close();
        
    }
    else{
    var data= await db.collection("students").insertOne(req.body);
    if(data){
        res.json({
            message:"Data Inserted to the db"
        })
        client.close();
    }
}
})

app.get("/get-details",async(req,res)=>{
    var client=await mongoclient.connect(url);
    var db= await client.db("assignment");
    var data=await db.collection("students").find().toArray();
    res.json(data)
    client.close();
})

app.get("/get-details/:emailid",async (req,res)=>{
    var client=await mongoclient.connect(url);
    var db= await client.db("assignment");
    var data=await db.collection("students").findOne({email:req.params.emailid});
    if(data){
        res.json(data)
        client.close();
    }
    else{
        res.json({
            message:"Data not found"
        })
        client.close();
    }
   

})

app.put("/edit-details/:emailid",async (req,res)=>{
    var client=await mongoclient.connect(url);
    var db= await client.db("assignment");
    var data=await db.collection("students").findOneAndUpdate({email:req.params.emailid},{$set:{name:req.body.name,country:req.body.country,city:req.body.city,state:req.body.state,address1:req.body.address1,address2:req.body.address2,gender:req.body.gender,maritalstatus:req.body.maritalstatus,food:req.body.food,color:req.body.color}})
    if(data){
        res.json({
            message:"Data successfully updated"
        })
        client.close();
    }else{
        res.json({
            message:"data not updated"
        })
        client.close();
    }
})

app.delete("/delete/:emailid",async(req,res)=>{
    var client=await mongoclient.connect(url);
    var db= await client.db("assignment");
    var data=await db.collection("students").deleteOne({email:req.params.emailid});
    if(data){
        res.json({message:"Data Removed"})
        client.close();
    }else{
        res.json({
            message:"Email Not present"
        })
        client.close();
    }
})

var port =process.env.PORT || 5000
app.listen(port);