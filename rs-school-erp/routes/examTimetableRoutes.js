const express = require('express');
const router = express.Router();
const db = require('../config/db');

/*
-----------------------------------
Route Test
-----------------------------------
*/

router.get('/', (req, res) => {

    res.json({
        success: true,
        message: "Exam Timetable Route Working"
    });

});


/*
-----------------------------------
Save Timetable
POST
/api/exam-timetable
-----------------------------------
*/

router.post('/', (req, res) => {

    const {
        exam_id,
        exam_subject_id,
        exam_date,
        exam_day,
        start_time,
        end_time,
        room_no,
        invigilator,
        status
    } = req.body;

    const sql = `
        INSERT INTO exam_timetable
        (
            exam_id,
            exam_subject_id,
            exam_date,
            exam_day,
            start_time,
            end_time,
            room_no,
            invigilator,
            status
        )
        VALUES (?,?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            exam_id,
            exam_subject_id,
            exam_date,
            exam_day,
            start_time,
            end_time,
            room_no,
            invigilator,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            res.json({
                success: true,
                message: "Timetable Saved Successfully",
                timetable_id: result.insertId
            });

        }
    );

});
/*
-----------------------------------
Get All Timetable
GET
/api/exam-timetable/all
-----------------------------------
*/

router.get('/all', (req, res) => {

    const sql = `
        SELECT
            et.*,
            e.exam_name,
            es.class_name,
            es.section,
            es.subject_name,
            es.subject_code
        FROM exam_timetable et
        LEFT JOIN exams e
            ON et.exam_id = e.id
        LEFT JOIN exam_subjects es
            ON et.exam_subject_id = es.id
        ORDER BY et.id DESC
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
/*
-----------------------------------
Get Single Timetable
GET
/api/exam-timetable/:id
-----------------------------------
*/

router.get('/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            et.*,
            e.exam_name,
            es.class_name,
            es.section,
            es.subject_name,
            es.subject_code
        FROM exam_timetable et
        LEFT JOIN exams e
            ON et.exam_id = e.id
        LEFT JOIN exam_subjects es
            ON et.exam_subject_id = es.id
        WHERE et.id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Timetable Not Found"
            });
        }

        res.json({
            success: true,
            data: result[0]
        });

    });

});
/*
-----------------------------------
Update Timetable
PUT
/api/exam-timetable/:id
-----------------------------------
*/

router.put('/:id', (req, res) => {

    const id = req.params.id;

    const {
        exam_id,
        exam_subject_id,
        exam_date,
        exam_day,
        start_time,
        end_time,
        room_no,
        invigilator,
        status
    } = req.body;

    const sql = `
        UPDATE exam_timetable
        SET
            exam_id = ?,
            exam_subject_id = ?,
            exam_date = ?,
            exam_day = ?,
            start_time = ?,
            end_time = ?,
            room_no = ?,
            invigilator = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            exam_id,
            exam_subject_id,
            exam_date,
            exam_day,
            start_time,
            end_time,
            room_no,
            invigilator,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: "Timetable Not Found"
                });
            }

            res.json({
                success: true,
                message: "Timetable Updated Successfully"
            });

        }
    );

});
/*
-----------------------------------
Delete Timetable
DELETE
/api/exam-timetable/:id
-----------------------------------
*/

router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM exam_timetable WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.json({
                    success: false,
                    message: "Timetable Not Found"
                });
            }

            res.json({
                success: true,
                message: "Timetable Deleted Successfully"
            });

        }
    );

});
module.exports = router;