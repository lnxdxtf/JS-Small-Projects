require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dns = require('dns')
const urlparser = require('url')
// Basic Configuration
const port = process.env.PORT || 3000;

//MONGOOSE SETTINGS

const connectionString='mongodb+srv://lnxdxtf:147852369n@cluster0.1hqwn.mongodb.net/urlshortnerfreecodecamp'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
console.log("Status mongo: ",mongoose.connection.readyState)

const schema = new mongoose.Schema({url: 'String'})
const Url = mongoose.model('Url', schema)

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.post('/api/shorturl', async(req, res) => {
  let bodyurl = req.body.url
  console.log("HTTPS-POST-201")
  console.log(bodyurl)
  const validator = dns.lookup(urlparser.parse(bodyurl).hostname, (error, address)=>{
    if(!address) {
      res.json({error: "invalid url"})
    }else{
      const url = new Url({url: bodyurl})
      url.save((err,data)=>{
        res.json({
          original_url:data.url,
          short_url: data.id
        })
      })
    }
  })
});

app.get('/api/shorturl/:id', async(req,res)=>{
console.log("HTTPS-GET-200")
const id = req.params.id
Url.findById(id, (err,data)=>{
  if (!data){
    res.json({error:"invalid url"})
  } else {
    res.redirect(data.url)
    }
  })
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
