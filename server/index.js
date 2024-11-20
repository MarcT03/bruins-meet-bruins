const PORT = 8000   //place holder port

const express = require('express')
const cors = require('cors')
const authRoute = require('./routes/authRoute')

 
//middleware
const app = express()
app.use(cors())
app.use(express.json())

app.use('/', authRoute)

//callback function syntax, client sending requests to server,
//for example, user fills in login information, this needs to be sent to backend server to authenticate
app.get("/", (req, res) => {
    res.json('Hello APP!')
})


//get every user information
app.get("/users", async (req, res) => {
    const client = new MongoClient(uri) //pass through our database so we can connect to it

    try{
        await client.connect() //connect to client
        const database = client.db('data-app') //name of our database on mongo
        const user = database.collection('users')   //collection called user in our database

        const totalusers = await user.find().toArray()
        res.json(totalusers);
    }finally{
        await client.close()
    }
})

app.listen(PORT, () => console.log('Server is runing on: ' + PORT))