const connection = require('../config/db');

const login = (req, res) => {
    const { username, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    connection.query(sql, [username, password], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database Error'
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Username or Password'
            });
        }

        res.json({
            success: true,
            role: results[0].role,
            username: results[0].username
        });

    });
};

module.exports = { login };