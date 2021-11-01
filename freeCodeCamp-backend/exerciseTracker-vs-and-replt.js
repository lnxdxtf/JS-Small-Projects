const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

//mongo
const mongoose = require('mongoose')
  const {Schema} = mongoose
const connectionString='mongodb+srv://lnxdxtf:147852369n@cluster0.1hqwn.mongodb.net/exerciseTracker'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

//schema
const userSchema = new Schema({username: {type: String, unique: true}})
const User = mongoose.model('User', userSchema)

const exerciseSchema = new Schema({userId: String,
                                  description: String,
                                  duration: Number,
                                  date: Date
                                  })
const Exercise = mongoose.model('Exercise', exerciseSchema)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req,res)=>{
  const newUser = new User({username: req.body.username})
  newUser.save((err,data)=>{
    if(err){
      res.json("Username already exists")
    }else{
    res.json({username: data.username, "_id":data.id })
    console.log("Usuário: ", data.username, " criado")
    console.log("Id do usuário: ", data.id)
    console.log("================")
    }
  })
})

app.post('/api/users/:_id/exercises', (req,res)=>{
  let userId = req.params._id
  let { description , duration , date }= req.body

  if(!date){
    date = new Date()
  }else{
    date = new Date(date)
  }
  User.findById(userId, (err,data)=>{
    if(!data){
      res.send("Unknown UserId")
    }else{
      const user = data
      const newExercise = new Exercise({userId:user._id, description, duration, date})
      newExercise.save((err,data)=>{
        const objectJson = {_id: newExercise.userId,
                            username: user.username,
                            date: new Date(newExercise.date).toDateString(),
                            duration: newExercise.duration,
                            description: newExercise.description}
        res.json(objectJson)
      })
    } 
  }) 
})



app.get('/api/users',(req,res)=>{
  User.find({},(err,data)=>{
    if(!data){
      res.send("No data")
    }else {
      res.json(data)
    }
  })
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
