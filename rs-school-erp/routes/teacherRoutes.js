const upload = require('../config/multerConfig');
console.log("TEACHER ROUTES LOADED");
const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/teacher-test', (req, res) => {
    res.send('Teacher Route Working');
});
router.post('/', (req, res) => {

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
router.get('/', (req, res) => {

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
    router.put('/:id', (req, res) => {

    const teacherId = req.params.id;

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
    UPDATE teachers
    SET
        teacher_code=?,
        teacher_name=?,
        father_name=?,
        mobile=?,
        email=?,
        gender=?,
        department=?,
        designation=?,
        qualification=?,
        experience=?,
        joining_date=?,
        address=?,
        photo=?,
        status=?
    WHERE id=?
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
            status,
            teacherId
        ],
        (err, result) => {

            if(err){
                console.log(err);

                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:"Teacher Updated Successfully"
            });

        }
    );

});
router.delete('/:id', (req, res) => {

    const teacherId = req.params.id;

    db.query(
        'DELETE FROM teachers WHERE id=?',
        [teacherId],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:'Teacher Deleted Successfully'
            });

        }
    );

});
router.post(
    '/upload',
    upload.single('photo'),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No photo uploaded'
            });
        }

        res.json({
            success: true,
            photo: '/uploads/' + req.file.filename
        });

    }
);
router.post('/login', (req, res) => {

    const { teacher_code } = req.body;

    const sql = `
    SELECT *
    FROM teachers
    WHERE teacher_code = ?
    `;

    db.query(sql, [teacher_code], (err, result) => {

        if(err){
            return res.status(500).json({
                success:false
            });
        }

        if(result.length === 0){
            return res.json({
                success:false,
                message:'Teacher Not Found'
            });
        }

        res.json({
            success:true,
            teacher:result[0]
        });

    });

});
router.get('/code/:teacherCode', (req, res) => {

    const { teacherCode } = req.params;

    const sql = `
    SELECT *
    FROM teachers
    WHERE teacher_code = ?
    LIMIT 1
    `;

    db.query(sql, [teacherCode], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Teacher Not Found"
            });
        }

        res.json({
            success: true,
            teacher: result[0]
        });

    });

});
module.exports = router;