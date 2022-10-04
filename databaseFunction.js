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
    return{
        storeInDatabase,
        all,
        userLogIn,
        getUserByEmailCode
    }
}