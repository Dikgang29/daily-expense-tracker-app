const express = require('express')
// const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const pgp = require('pg-promise')();
const DatabaseQuery = require('./databaseFunction');



//connecting my project to the database
const DATABASE_URL =  process.env.DATABASE_URL || `postgresql://tracker_admin:tracker123@localhost:5432/tracker_app`

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
// app.engine('handlebars', exphb.engine({defaultLayout : false}));
// app.set('view engine', 'handlebars');

// Set View's
app.set('view engine', 'ejs');

// setting up bodyParser
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.render('index',{

    });
})

app.get('/register', (req,res)=>{
    res.render('register');
})

app.post('/register',
//  [
//     check('firstName', 'This firstName must have 3+ characters long')
//     .exists()
//     .isLength({min: 5}),
//     check('lastName', 'This LastName must have 3+ characters long')
//     .exists()
//     .isLength({min: 5}),
//     check('email', 'Email is not valid')
//     .isEmail()
//     .normalizeEmail()

// ],
 async (req,res)=>{
    const name = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;

    // res.json(req.body);

    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(422).jsonp(errors.array())
        // const alert = errors.array()

        // res.render('register',{
        //     alert
        // })
         dbFunction.storeInDatabase(name,lName,email,password);
         console.log(dbFunction.all())
         console.log( await dbFunction.storeInDatabase(name,lName,email,password));
         res.redirect('/')
    
})



const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log('the server started at port:', PORT)
})