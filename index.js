const express = require('express')
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const ShortUniqueId = require('short-unique-id');
const session = require('express-session');
// flash
const  flash  = require('express-flash');
const pgp = require('pg-promise')();
const DatabaseQuery = require('./databaseFunction');


const uid = new ShortUniqueId({ length: 5 });

//connecting my project to the database
const DATABASE_URL =  process.env.DATABASE_URL || 'postgresql://tracker:tracker123@localhost:5432/expense_tracker'

// const conString = "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";

const config = {
    connectionString: DATABASE_URL
}

if(process.env.NODE_ENV === 'production'){
    config.ssl ={
        rejectUnauthorized : false
    }
}

const db = pgp(config);

// console.log(db)
// database query file
const dbFunction = DatabaseQuery(db)



const app = express();

// setting up handlebars
// app.engine('handlebars', exphb.engine({defaultLayout : false}));
app.engine("handlebars", exphb.engine({ extname: "handlebars", layoutsDir: __dirname + '/views/layout' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'))

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
app.use(flash());

app.get('/', async (req,res)=>{
    // console.log(await dbFunction.all())

    if(!req.session.user){
        res.redirect('/login')
        return;
    }
    const categories = await dbFunction.allFromCategory();
    // console.log(categories)
    const expenseList = await dbFunction.allFromExpense();

    const joinList = await db.manyOrNone('select * from expenses join categories on expenses.category_id = categories.id;');

    const getUser = req.session.user.firstname;

    console.log(joinList);

    console.log(getUser)
    res.render('index',{
        // categories : dbFunction.allFromCategory()
        categories,
        joinList,
        getUser
    });
})

app.post('/addValues',(req, res)=>{

    const {categotyId,dateValue,expense} = req.body;

    dbFunction.addExpense(categotyId,dateValue,expense);

    res.redirect('/')
})

app.post('/addCategories', (req,res)=>{

    const {categoryAdd} = req.body;

    dbFunction.addCategory(categoryAdd);
    res.redirect('/')
})

app.get('/register', async (req,res)=>{

    res.render('register',{
    });
})

app.post('/register', async (req,res)=>{

    const code = uid();
    const {firstname} = req.body;
    const {lastname} = req.body;
    const {email} = req.body;
    

    const findUser = 'select count(*) from user_reg where email = $1;';
    const results = await db.one(findUser,email)
    
    if(code && firstname && lastname && email){
        if(Number(results.count) !==0){
            req.flash('error','User already exists');
        } else{
            dbFunction.storeInDatabase(code, firstname,lastname, email);
            req.flash('success',`New user added, please use code: ${code} to log in`)
        } 
    }
    else(
    req.flash('error','Please add all the fields')
        
    )
         res.redirect('/register');
})

app.get('/login', async (req,res)=>{
    res.render('login');
})

app.post('/login', async(req,res)=>{
    const {email} = req.body;
    const {code} = req.body;
    const user = await dbFunction.getUserByEmailCode(code);


    if(email && code){
    //    const testUser = await dbFunction.userLogIn(email,code);

        if(user){
            // console.log(req.session);
            // req.flash('success', 'Successful login');
            req.session.user = user;
            console.log(req.session.user = user);
            res.redirect('/');
            return
        }
    } else{
        req.flash('error', 'Some fields are missing');
    }
    res.render('login')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('the server started at port:', PORT)
})