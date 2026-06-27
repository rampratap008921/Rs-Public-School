const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/', (req, res) => {

    res.json({
        success: true,
        message: "Exam Route Working"
    });

});
router.post('/', (req, res) => {
    console.log("BODY RECEIVED =");
    console.log(req.body);
    const {
        examName,
        examCode,
        academicSession,
        examType,
        examStatus,
        examStartDate,
        examEndDate
    } = req.body;

    const sql = `
        INSERT INTO exams
        (
            exam_name,
            exam_code,
            academic_session,
            exam_type,
            status,
            start_date,
            end_date
        )
        VALUES (?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            examName,
            examCode,
            academicSession,
            examType,
            examStatus,
            examStartDate,
            examEndDate
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            res.json({
                success: true,
                message: "Exam Created Successfully",
                exam_id: result.insertId
            });

        }
    );

});
// Get All Exams
router.get('/all', (req, res) => {

    const sql = `
        SELECT *
        FROM exams
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        res.json({
            success: true,
            data: result
        });

    });

});


// Get Single Exam
router.get('/:id', (req, res) => {

    db.query(
        "SELECT * FROM exams WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:"Database Error",
                    error:err
                });
            }

            if(result.length===0){
                return res.json({
                    success:false,
                    message:"Exam Not Found"
                });
            }

            res.json({
                success:true,
                data:result[0]
            });

        }
    );

});


// Update Exam
router.put('/:id',(req,res)=>{

    const {
        examName,
        examCode,
        academicSession,
        examType,
        examStatus,
        examStartDate,
        examEndDate
    } = req.body;

    const sql = `
        UPDATE exams
        SET
            exam_name=?,
            exam_code=?,
            academic_session=?,
            exam_type=?,
            status=?,
            start_date=?,
            end_date=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            examName,
            examCode,
            academicSession,
            examType,
            examStatus,
            examStartDate,
            examEndDate,
            req.params.id
        ],
        (err)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:"Database Error",
                    error:err
                });
            }

            res.json({
                success:true,
                message:"Exam Updated Successfully"
            });

        }
    );

});


// Delete Exam
router.delete('/:id',(req,res)=>{

    db.query(
        "DELETE FROM exams WHERE id=?",
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:"Database Error",
                    error:err
                });
            }

            if(result.affectedRows===0){
                return res.json({
                    success:false,
                    message:"Exam Not Found"
                });
            }

            res.json({
                success:true,
                message:"Exam Deleted Successfully"
            });

        }
    );

});
module.exports = router;