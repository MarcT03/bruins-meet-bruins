const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//temp uri link, will convert to hidden with env later
const uri = 'mongodb+srv://cs35l:GoBruins12345@cluster1.cdta9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1' 

//adapated http response status codes for logging from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

const signup = async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body
    const generateID = uuidv4()     //generate specific user ID
    const hashpass = await bcrypt.hash(password, 10) //hash the password for security

    try{
        await client.connect()
        const database = client.db('data-app')
        const user = database.collection('users')

        const userexists = await user.findOne({ email })

        if(userexists){     //if user already created an account
            return res.status(409).send('User with this email already exists! Please login.') //logging errors
        }
        const convertemail = email.toLowerCase()

        //model for Login information that we will send to our database
        const data= {
            userId: generateID,
            email: convertemail,
            hashedPass: hashpass
        }
        const loginInfo = await user.insertOne(data)
        const loginToken = jwt.sign(loginInfo, convertemail, {
            expiresIn: 60 * 24, //24 hour time period 
        })
        return res.status(201).json({ loginToken, userId: generateID }) //logging info
    }
    catch(err){
        console.log(err)
    }
};

const login = async (req, res) => {
    const client = new MongoClient(uri)
    const { email, password } = req.body

try{
    await client.connect()
    const database = client.db('data-app')
    const user = database.collection('users')

    const finduser = await user.findOne({email})

    if(finduser && (await bcrypt.compare(password, finduser.hashedPass))){  //if we find the email, and the password is correct
        const loginToken = jwt.sign(finduser, email, {
            expiresIn: 60 * 24, //24 hour time period 
        })
        return res.status(201).json({ loginToken, userId: finduser.userId }) //logging 
    }
    return res.status(400).send("INVALID credentials!") //error logging
    }
    catch(err){
        console.log(err)
    }
}

module.exports = { signup, login }