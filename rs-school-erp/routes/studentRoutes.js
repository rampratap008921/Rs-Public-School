const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../config/multerConfig');
router.post('/', (req, res) => {

    console.log("POST Student Data:", req.body);

    const {
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address,
        admission_date,
        photo
    } = req.body;
    const finalAdmissionDate =
    admission_date === "" ? null : admission_date;
    const sql = `
    INSERT INTO students
    (
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address,
        admission_date,
        photo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log("FINAL DATE =", finalAdmissionDate);
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
            finalAdmissionDate,
            photo
        ],
        (err, result) => {

            if(err){
                console.log("MYSQL POST ERROR =", err);
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

        }
    );

});
router.get('/', (req, res) => {

    db.query(
        "SELECT * FROM students",
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
router.get('/:id', (req, res) => {

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

            if(result.length === 0){
                return res.json({
                    success:false,
                    message:'Student Not Found'
                });
            }

            res.json({
                success:true,
                data:result[0]
            });

        }
    );

});
router.get('/student/admission/:admission_no', (req, res) => {

    const admission_no = req.params.admission_no;

    db.query(
        "SELECT * FROM students WHERE admission_no = ?",
        [admission_no],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            if(result.length === 0){
                return res.json({
                    success:false,
                    message:"Student Not Found"
                });
            }

            res.json({
                success:true,
                data:result[0]
            });

        }
    );

});
router.put('/:id', (req, res) => {

    const id = req.params.id;

    const {
        admission_no,
        student_name,
        father_name,
        class_name,
        section,
        mobile,
        gender,
        address,
       admission_date,
        photo
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
        address=?,
        admission_date=?,
        photo=?
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
            admission_date,
            photo,
            id
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
                message:"Student Updated Successfully"
            });

        }
    );

});
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM students WHERE id = ?",
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
                message:"Student Deleted Successfully"
            });

        }
    );

});
router.get(
'/class/:className/:section',
(req,res)=>{

    const {
        className,
        section
    } = req.params;

    const sql = `
    SELECT
    id,
    admission_no,
    student_name,
    father_name,
    photo
    FROM students
    WHERE class_name = ?
    AND section = ?
    ORDER BY student_name
    `;

    db.query(
        sql,
        [className,section],
        (err,result)=>{

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
router.post('/upload-photo',upload.single('photo'),(req, res) => {
        console.log("Student Data Received:", req.body);
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No Photo Uploaded'
            });
        }

        res.json({
            success: true,
            photoPath: `/uploads/${req.file.filename}`
        });

    }
);
module.exports = router;
