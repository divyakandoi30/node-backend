const express =require('express');
const app =express();
const cors = require('cors');
const bodyParser= require('body-parser');
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());
app.use(bodyParser.raw());
const MongoClient = require('mongodb').MongoClient
//create a server that browsers can listen to.


MongoClient.connect("mongodb://localhost:27017/crud", { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes')
    app.options("/quotes", cors());
    app.post('/quotes',cors(), (req, res) => {
        console.log(req.body);
        quotesCollection.insertOne(req.body)
          .then(result => {
           res.send(true);
          })
          .catch(error => console.error(error))
      })
    app.get('/quotes',cors(),(req,res)=>{
        db.collection('quotes').find().toArray()
        .then(results=>{
        // console.log(results);
        res.send(results);
        })
        .catch(error=>console.log(error))
    })
    app.delete('/quotes',cors(), (req, res) => {
        console.log(req.body);
        db.collection('quotes').deleteOne(
          { name: req.body.name }
        ).then(result => {
            res.json(`Deleted Darth Vadar's quote`)
          })
          .catch(error => console.error(error))
      })
      app.put('/quotes',cors(),(req,res)=>{
        console.log(req.body);
        db.collection('quotes').findOneAndUpdate(
            {name:req.body.name},
            {$set:{
                name:req.body.updatedName,
                quote:req.body.updatedQuote
            }},
            {
                upsert: true
              }
          
          ).then(result=>{
            res.send('Updated successfully');
          })
    })

  })
  
  .catch(error => console.error(error))

// In Express, we handle a GET request with the get method:
//app.get(endpoint, callback)
//endpoint is the requested endpoint. It’s the value that comes after your domain name.
//callback tells the server what to do when the requested endpoint matches the endpoint stated. It takes two arguments: A request object and a response object.
/* app.get('/',(req,res)=>{
    res.send('Hello World');
}) */

//we serve up an index.html page back to the browser. To do this, we use the sendFile method that’s provided by the res object
app.get('/',function(req,res){
    res.sendFile( __dirname,'/index.html')
})

app.listen(3000,function(){
    console.log('listening to port 3000');
})

/* app.post('/quotes',cors(), (req, res) => {
    console.log('Hellooooooooooooooooo!');
    res. header("Access-Control-Allow-Headers");
    res.send("Post call suceeded");
    console.log(req.body);
  }) */