const express = require("express");
const router = express.Router();
const db = require("../config/db");
/*
==================================================
GET
/api/marks-entry/load
==================================================
*/

router.get("/load", (req, res) => {

    const {
        exam_id,
        class_name,
        section,
        subject_name
    } = req.query;

    if (
        !exam_id ||
        !class_name ||
        !section ||
        !subject_name
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing Required Parameters"
        });
    }
        // ================================
// SAVE MARKS
// ================================

router.post("/save", (req, res) => {
    console.log("===== SAVE API HIT =====");
    console.log(req.body);
    console.log(JSON.stringify(req.body, null, 2));
    const {

        exam_id,
        exam_subject_id,
        subject_id,
        teacher_id,
        students

    } = req.body;

    if (
        !exam_id ||
        !exam_subject_id ||
        !subject_id ||
        !students ||
        students.length === 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid Request"
        });

    }

    const values = students.map(student => [

        exam_id,

        exam_subject_id,

        student.student_id,

        subject_id,

        teacher_id || null,

        student.maximum_marks,

        student.obtained_marks || null,

        student.is_absent ? 1 : 0,

        student.remarks || "",

        "Draft"

    ]);

    const sql = `
INSERT INTO marks_entry
(
    exam_id,
    exam_subject_id,
    student_id,
    subject_id,
    teacher_id,
    maximum_marks,
    obtained_marks,
    is_absent,
    remarks,
    status
)
VALUES ?
ON DUPLICATE KEY UPDATE
    teacher_id = VALUES(teacher_id),
    maximum_marks = VALUES(maximum_marks),
    obtained_marks = VALUES(obtained_marks),
    is_absent = VALUES(is_absent),
    remarks = VALUES(remarks),
    status = VALUES(status)
`;

db.query(sql, [values], (err) => {

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
        message: "Marks Saved / Updated Successfully"
    });

});

});
    /*
    ---------------------------------------
    Get Subject Details
    ---------------------------------------
    */

    const subjectSql = `
        SELECT
            id,
            subject_name,
            maximum_marks,
            passing_marks,
            exam_type
        FROM exam_subjects
        WHERE
            exam_id = ?
            AND class_name = ?
            AND section = ?
            AND subject_name = ?
        LIMIT 1
    `;

    db.query(
        subjectSql,
        [
            exam_id,
            class_name,
            section,
            subject_name
        ],
        (err, subjectResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            if (subjectResult.length === 0) {
                return res.json({
                    success: false,
                    message: "Subject Not Found"
                });
            }

            const subject = subjectResult[0];

            /*
            ---------------------------------------
            Get Students + Existing Marks
            ---------------------------------------
            */

            const sql = `
            SELECT
            
                s.id,
                s.roll_no,
                s.admission_no,
                s.student_name,
                s.father_name,
                s.photo,

                m.obtained_marks,
                m.is_absent,
                m.remarks,
                m.status

            FROM students s

            LEFT JOIN marks_entry m

            ON
                s.id = m.student_id

                AND m.exam_id = ?

                AND m.subject_id = ?

            WHERE

                s.class_name = ?

                AND s.section = ?

            ORDER BY s.student_name ASC
            `;

            db.query(
                sql,
                [
                    exam_id,
                    subject.id,
                    class_name,
                    section
                ],
                (err, studentResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database Error",
                            error: err
                        });
                    }
                    console.log(studentResult);
                    res.json({

                        success: true,

                        subject: subject,

                        students: studentResult

                    });

                }
            );

        }
    );

});

module.exports = router;