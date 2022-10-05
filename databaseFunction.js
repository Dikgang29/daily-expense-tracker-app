module.exports = function DatabaseQuery(db){


     async function storeInDatabase(code, firstname, lastname, email){

        // const checkUser = await db.one('select count(*) from user_reg where code = $1;', [code])
        // if(checkUser.count!==0){

        // }

      await  db.none(`INSERT INTO user_reg (code, firstname, lastname, email) values($1,$2,$3,$4);`,[code,firstname,lastname,email]);

    }

    async function checkUser(){
        
    }

    // logging query
    async function userLogIn(email, code){
        const storedUsers = await db.any('SELECT * from user_reg WHERE email = $1 and code = $2;', [email, code])
        return storedUsers;
    }

    async function getUserByEmailCode(code){
        const findUserByCODE = await db.oneOrNone('Select * from user_reg where code = $1;', code)
        return findUserByCODE;
    }

    async function all(){
    const allUsers = await db.any('SELECT * FROM user_reg;')
    return allUsers
    }

    // category table queries

    async function addCategory(category){
        await db.none('insert into categories (category_name) values($1);', category)

    }

    async function allFromCategory(){
        const selectAllCategory = await db.any('select * from categories order by category_name asc;')
        return selectAllCategory;
    }




    // expense table queries

async function addExpense(category,date,moneySpent){
    await db.none('insert into expenses (category_id, expense_date, daily_expense) values($1,$2,$3);',[category,date,moneySpent])
}

async function allFromExpense(){
    const selectAllExpense = await db.any('select * from expenses;')
    return selectAllExpense;
}


    return{
        storeInDatabase,
        all,
        userLogIn,
        getUserByEmailCode,
        // category table
        addCategory,
        allFromCategory,
        //expenses table
        addExpense,
        allFromExpense
    }
}