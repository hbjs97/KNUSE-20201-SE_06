var mariadb = require('mariadb');

const pool = mariadb .createPool({
    host: 'lunapreya.ddns.net',
    port: 3306,
    user: 'software',
    password: '1q2w3e4r!',
    connectionLimit: 100
});

async function getUserList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('test'); //사용할 DB
        rows = await conn.query('SELECT * FROM users');
    }
    catch (err) {throw err;}
    finally {
        if(conn) conn.end();
        return rows;
    }
}
module.exports = {getUserList,}