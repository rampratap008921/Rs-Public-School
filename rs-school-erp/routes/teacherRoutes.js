const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/teacher-test', (req, res) => {
    res.send('Teacher Route Working');
});
router.post('/teachers', (req, res) => {

    console.log("Teacher Data =", req.body);

    const {
        teacher_code,
        teacher_name,
        father_name,
        mobile,
        email,
        gender,
        department,
        designation,
        qualification,
        experience,
        joining_date,
        address,
        photo,
        status
    } = req.body;

    const sql = `
    INSERT INTO teachers
    (
        teacher_code,
        teacher_name,
        father_name,
        mobile,
        email,
        gender,
        department,
        designation,
        qualification,
        experience,
        joining_date,
        address,
        photo,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            teacher_code,
            teacher_name,
            father_name,
            mobile,
            email,
            gender,
            department,
            designation,
            qualification,
            experience,
            joining_date,
            address,
            photo,
            status
        ],
        (err, result) => {

            if(err){
                console.log("MYSQL ERROR =", err);

                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:"Teacher Added Successfully"
            });

        }
    );

});
router.get('/teachers', (req, res) => {

    db.query(
        "SELECT * FROM teachers",
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                data:result
            });

        }
    );

});
module.exports = router;