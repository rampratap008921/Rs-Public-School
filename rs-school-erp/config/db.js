const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rampratap@#$8921',
  database: 'rs_school_erp'
});

connection.connect((err) => {
  if (err) {
    console.log('Database Connection Failed:', err);
  } else {
    console.log('MySQL Connected Successfully');
  }
});

module.exports = connection;