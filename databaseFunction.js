module.exports = function DatabaseQuery(db){


    async function storeInDatabase(firstName,lastName,email,password){

        await db.any(`INSERT INTO users (FirstName, LastName,EmailAdress, UserPassword) values($1,$2,$3,$4);`,[firstName,lastName,email,password]);

    }

    async function all(){
    const allUsers = await db.any('SELECT * FROM users;')
    return allUsers
    }
    return{
        storeInDatabase,
        all
    }
}