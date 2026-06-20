const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/students', (req, res) => {

    const {
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address,
        admission_date
    } = req.body;

    const sql = `
    INSERT INTO students
    (admission_no, student_name, father_name, class_name, section, mobile, gender, address, admission_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address,
        admission_date
    ], (err, result) => {

        if(err){
            return res.status(500).json({
                success:false,
                message:'Database Error',
                error:err
            });
        }

        res.json({
            success:true,
            message:'Student Added Successfully'
        });

    });

});

router.get('/students', (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {

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

    });

});
router.get('/students/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM students WHERE id = ?',
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                data:result[0]
            });

        }
    );

});
router.put('/students/:id', (req, res) => {

    const id = req.params.id;

    const {
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address
    } = req.body;

    const sql = `
    UPDATE students
    SET
        admission_no=?,
        student_name=?,
        father_name=?,
        class_name=?,
        section=?,
        mobile=?,
        gender=?,
        address=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            admission_no,
            student_name,
            father_name,
            class_name,
            section,
            mobile,
            gender,
            address,
            id
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:"Student Updated Successfully"
            });

        }
    );

});
console.log("Student Routes Loaded");
module.exports = router;
