const express = require('express')
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const ShortUniqueId = require('short-unique-id');
const session = require('express-session');
const pgp = require('pg-promise')();
const DatabaseQuery = require('./databaseFunction');


const uid = new ShortUniqueId({ length: 5 });

//connecting my project to the database
const DATABASE_URL =  process.env.DATABASE_URL || 'postgresql://tracker:tracker123@localhost:5432/expense_tracker'

// const conString = "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";

const config = {
    connectionString: DATABASE_URL
}



const db = pgp(config);

// console.log(db)
// database query file
const dbFunction = DatabaseQuery(db)



const app = express();

// setting up handlebars
app.engine('handlebars', exphb.engine({defaultLayout : false}));
app.set('view engine', 'handlebars');

// Set View's
// app.set('view engine', 'ejs');

// setting up bodyParser
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: "Dikgang",
    resave: false,
    saveUninitialized: false
}));
// app.use(flash());

app.get('/', async (req,res)=>{
    // console.log(await dbFunction.all())
    res.render('index',{
    });
})

app.get('/register', (req,res)=>{
    res.render('register');
})

app.post('/register', async (req,res)=>{

    const code = uid();
    const {firstname} = req.body;
    const {lastname} = req.body;
    const {email} = req.body;

    const findUser = 'select count(*) from user_reg where email = $1;';
    const results = await db.one(findUser,email)

    // console.log(results.count)
    
    if(code && firstname && lastname && email){
        if(Number(results.count) !==0){
            return 'User already exists';
        } else{
            dbFunction.storeInDatabase(code, firstname,lastname, email);
        } 
    }
         res.redirect('/');
})

app.get('/login', async (req,res)=>{
    res.render('login');
})

app.post('/login', async(req,res)=>{
    const {email} = req.body;
    const {code} = req.body;
    const user = await dbFunction.getUserByEmailCode(code);
    // const getCode = user.code
    // console.log(user)
    if(email && code){
    //    const testUser = await dbFunction.userLogIn(email,code);
        if(user){
            // console.log(req.session);
            req.session.user = user;
            console.log(req.session.user = user)
            // if user was logged in, they should be directed to a certain page
            return;
        }
    }
    res.render('login')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('the server started at port:', PORT)
})