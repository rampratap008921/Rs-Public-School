const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
---------------------------------------
Route Test
GET /api/admit-card
---------------------------------------
*/
/*
---------------------------------------
Get Students
GET
/api/admit-card/students
---------------------------------------
*/

router.get("/students", (req, res) => {

    const {
        class_name,
        section
    } = req.query;

    const sql = `
        SELECT *
        FROM students
        WHERE class_name = ?
        AND section = ?
        ORDER BY student_name ASC
    `;

    db.query(
        sql,
        [class_name, section],
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
                data: result
            });

        }
    );

});
/*
---------------------------------------
Get Admit Card Data
GET
/api/admit-card
---------------------------------------
*/

router.get("/", (req, res) => {

    const {
        exam_id,
        class_name,
        section
    } = req.query;

    /*
    -----------------------
    Get Exam Details
    -----------------------
    */

    db.query(
        "SELECT * FROM exams WHERE id = ?",
        [exam_id],
        (err, examResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            if (examResult.length === 0) {
                return res.json({
                    success: false,
                    message: "Exam Not Found"
                });
            }

            /*
            -----------------------
            Get Students
            -----------------------
            */

            db.query(
                `
                SELECT *
                FROM students
                WHERE class_name = ?
                AND section = ?
                ORDER BY student_name ASC
                `,
                [class_name, section],
                (err, studentResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database Error",
                            error: err
                        });
                    }

                    /*
                    -----------------------
                    Get Timetable
                    -----------------------
                    */
                    console.log("exam_id =", exam_id);
                    console.log("class_name =", class_name);
                    console.log("section =", section);
                    console.log("Students =", studentResult.length);
                    db.query(
                        `
                        SELECT
                            et.*,
                            es.subject_name,
                            es.subject_code,
                            e.exam_name
                        FROM exam_timetable et
                        LEFT JOIN exam_subjects es
                            ON et.exam_subject_id = es.id
                        LEFT JOIN exams e
                            ON et.exam_id = e.id
                        WHERE
                            et.exam_id = ?
                            AND es.class_name = ?
                            AND es.section = ?
                        ORDER BY et.exam_date ASC
                        `,
                        [
                            exam_id,
                            class_name,
                            section
                        ],
                        (err, timetableResult) => {
                            console.log("Timetable =", timetableResult);
                            console.log("Total Timetable =", timetableResult.length);
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: "Database Error",
                                    error: err
                                });
                            }

                            res.json({

                                success: true,

                                exam: examResult[0],

                                students: studentResult,

                                timetable: timetableResult

                            });

                        }
                    );

                }
            );

        }
    );

});
module.exports = router;