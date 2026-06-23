const express = require('express');
const router = express.Router();
const db = require('../config/db');

/*
GET ALL ALLOCATIONS
*/

router.get('/allocations', (req, res) => {

    const sql = `
    SELECT
        ta.*,
        t.teacher_name,
        t.teacher_code
    FROM teacher_allocations ta
    JOIN teachers t
    ON ta.teacher_id = t.id
    ORDER BY ta.id DESC
    `;

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

/*
ADD ALLOCATION
*/
router.put('/allocations/:id', (req, res) => {

    const { id } = req.params;

    const {
        teacher_id,
        class_name,
        section,
        subject_name,
        is_class_teacher,
        status
    } = req.body;

    const sql = `
    UPDATE teacher_allocations
    SET
        teacher_id=?,
        class_name=?,
        section=?,
        subject_name=?,
        is_class_teacher=?,
        status=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            teacher_id,
            class_name,
            section,
            subject_name,
            is_class_teacher,
            status,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:'Allocation Updated Successfully'
            });

        }
    );

});
router.delete('/allocations/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM teacher_allocations WHERE id=?",
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
                message:'Allocation Deleted Successfully'
            });

        }
    );

});
router.post('/allocations', (req, res) => {

    const {
        teacher_id,
        class_name,
        section,
        subject_name,
        is_class_teacher,
        status
    } = req.body;

    const sql = `
    INSERT INTO teacher_allocations
    (
        teacher_id,
        class_name,
        section,
        subject_name,
        is_class_teacher,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            teacher_id,
            class_name,
            section,
            subject_name,
            is_class_teacher,
            status
        ],
        (err, result) => {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err
                });
            }

            res.json({
                success:true,
                message:'Allocation Saved Successfully'
            });

        }
    );

});

module.exports = router;