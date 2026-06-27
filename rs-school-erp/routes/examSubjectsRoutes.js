const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Exam Subject Route Working"
    });
});
router.post('/', (req, res) => {

    const {
        exam_id,
        class_name,
        section,
        allocationMatrix
    } = req.body;

    if (!allocationMatrix || allocationMatrix.length === 0) {
        return res.json({
            success: false,
            message: "No Subjects Found"
        });
    }

    const values = allocationMatrix.map(subject => [

        exam_id,

        class_name,

        section,

        subject.subject_name,

        subject.subject_code,

        subject.maximum_marks,

        subject.passing_marks,

        subject.exam_type,

        subject.is_theory,

        subject.is_practical,

        subject.theory_marks,

        subject.practical_marks,

        subject.internal_marks,

        subject.status,

        subject.remarks

    ]);

    const sql = `
    INSERT INTO exam_subjects
    (
        exam_id,
        class_name,
        section,
        subject_name,
        subject_code,
        maximum_marks,
        passing_marks,
        exam_type,
        is_theory,
        is_practical,
        theory_marks,
        practical_marks,
        internal_marks,
        status,
        remarks
    )
    VALUES ?
    `;

    db.query(sql, [values], (err, result) => {

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
            message: "All Subjects Saved Successfully",
            totalSaved: result.affectedRows
        });

    });

});

router.get('/classes', (req, res) => {

    const exam_id = req.query.exam_id;

    db.query(
        `
        SELECT DISTINCT class_name
        FROM exam_subjects
        WHERE exam_id = ?
        ORDER BY class_name
        `,
        [exam_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            res.json(result);

        }
    );

});
router.get('/sections', (req, res) => {

    const { exam_id, class_name } = req.query;

    const sql = `
        SELECT DISTINCT section
        FROM exam_subjects
        WHERE exam_id = ?
        AND class_name = ?
        ORDER BY section
    `;

    db.query(sql, [exam_id, class_name], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
router.get('/subjects', (req, res) => {

    const { exam_id, class_name, section } = req.query;

    const sql = `
        SELECT *
        FROM exam_subjects
        WHERE exam_id=?
        AND class_name=?
        AND section=?
        ORDER BY subject_name
    `;

    db.query(sql,
        [exam_id, class_name, section],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        });

});
router.get('/filter', (req, res) => {

    const { exam_id, class_name, section } = req.query;

    const sql = `
        SELECT *
        FROM exam_subjects
        WHERE exam_id = ?
        AND class_name = ?
        AND section = ?
        ORDER BY subject_name ASC
    `;

    db.query(
        sql,
        [exam_id, class_name, section],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            res.json(result);

        }
    );

});
router.get('/all', (req, res) => {

    const sql = `
        SELECT
            es.*,
            e.exam_name
        FROM exam_subjects es
        LEFT JOIN exams e
        ON es.exam_id = e.id
        ORDER BY es.id DESC
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
router.get('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        `
        SELECT
            es.*,
            e.exam_name
        FROM exam_subjects es
        LEFT JOIN exams e
        ON es.exam_id = e.id
        WHERE es.id = ?
        `,
        [id],
        (err, result) => {

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
                    message: "Subject Not Found"
                });
            }

            res.json({
                success: true,
                data: result[0]
            });
        }
    );

});
router.put('/:id', (req, res) => {

    const id = req.params.id;

    const {
        exam_id,
        class_name,
        section,
        subject_name,
        subject_code,
        maximum_marks,
        passing_marks,
        exam_type,
        is_theory,
        is_practical,
        theory_marks,
        practical_marks,
        internal_marks,
        status,
        remarks
    } = req.body;

    const sql = `
        UPDATE exam_subjects
        SET
            exam_id=?,
            class_name=?,
            section=?,
            subject_name=?,
            subject_code=?,
            maximum_marks=?,
            passing_marks=?,
            exam_type=?,
            is_theory=?,
            is_practical=?,
            theory_marks=?,
            practical_marks=?,
            internal_marks=?,
            status=?,
            remarks=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            exam_id,
            class_name,
            section,
            subject_name,
            subject_code,
            maximum_marks,
            passing_marks,
            exam_type,
            is_theory,
            is_practical,
            theory_marks,
            practical_marks,
            internal_marks,
            status,
            remarks,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err
                });
            }

            res.json({
                success: true,
                message: "Subject Updated Successfully"
            });

        }
    );

});
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM exam_subjects WHERE id = ?",
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
                    message: "Subject Not Found"
                });
            }

            res.json({
                success: true,
                message: "Subject Deleted Successfully"
            });

        }
    );

});

module.exports = router;