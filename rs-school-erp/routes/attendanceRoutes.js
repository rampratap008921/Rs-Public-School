/**
 * R.S. Public School ERP Backend - Attendance Module Routes
 * File: attendanceRoutes.js
 * Technology Stack: Node.js, Express.js, MySQL (Callback Style)
 * Description: Production-ready API routes for managing student attendance. 
 * Optimized with callback patterns to strictly match the existing code architecture.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route   POST /api/attendance/
 * @desc    Bulk save class attendance with duplicate verification check
 * @access  Private (Teacher Dashboard / Portal)
 */
router.post('/', (req, res) => {
    console.log("POST Attendance Bulk Data:", req.body);

    const {
        teacher_id,
        class_name,
        section,
        subject_name,
        attendance_date,
        students
    } = req.body;

    // 1. Basic Request Validation
    if (!teacher_id || !class_name || !section || !subject_name || !attendance_date || !Array.isArray(students) || students.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Missing required tracking parameters or student roster array is empty."
        });
    }

    // 2. Prevent Duplicate Submission Check
    const checkDuplicateSql = `
        SELECT COUNT(*) AS count 
        FROM attendance 
        WHERE teacher_id = ? 
          AND class_name = ? 
          AND section = ? 
          AND subject_name = ? 
          AND attendance_date = ?
    `;

    db.query(
        checkDuplicateSql,
        [teacher_id, class_name, section, subject_name, attendance_date],
        (err, duplicateResult) => {
            if (err) {
                console.log("MYSQL DUPLICATE CHECK ERROR =", err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error during validation checking.",
                    error: err
                });
            }

            if (duplicateResult && duplicateResult[0] && duplicateResult[0].count > 0) {
                return res.json({
                    success: false,
                    message: "Attendance already submitted."
                });
            }

            // 3. Prepare Multi-row Bulk Insertion Array Bulk Value
            const insertSql = `
                INSERT INTO attendance 
                (teacher_id, student_id, class_name, section, subject_name, attendance_date, status, remarks) 
                VALUES ?
            `;

            const bulkValues = [];
            for (let i = 0; i < students.length; i++) {
                const s = students[i];
                if (!s.student_id || !s.status) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid structured payload entry discovered at sequence index positioning: ${i}.`
                    });
                }
                bulkValues.push([
                    teacher_id,
                    s.student_id,
                    class_name,
                    section,
                    subject_name,
                    attendance_date,
                    s.status,
                    s.remarks || ""
                ]);
            }

            // 4. Atomic Multi-row Entry Query Database Insertion Execution Pass
            db.query(insertSql, [bulkValues], (insertErr, insertResult) => {
                if (insertErr) {
                    console.log("MYSQL BULK INSERT ERROR =", insertErr);
                    return res.status(500).json({
                        success: false,
                        message: "Database Error during bulk record placement logging.",
                        error: insertErr
                    });
                }

                res.json({
                    success: true,
                    message: "Attendance Added Successfully"
                });
            });
        }
    );
});

/**
 * @route   GET /api/attendance/history
 * @desc    Get dynamic historically tracked verification log registry ordered by latest processing date
 * @access  Private (Teacher Portal / History Dashboard View)
 */
router.get('/history', (req, res) => {
    const { teacher_id, class_name, section, subject_name, attendance_date,status } = req.query;

            let sql = `
        SELECT
        a.*,
        s.student_name,
        s.admission_no,
        s.photo,
        t.teacher_name
        FROM attendance a
        JOIN students s
        ON a.student_id = s.id
        JOIN teachers t
        ON a.teacher_id = t.id
        WHERE 1=1
        `;
    const queryParams = [];

            if (teacher_id) {
            sql += ` AND a.teacher_id = ?`;
            queryParams.push(teacher_id);
        }

        if (class_name) {
            sql += ` AND a.class_name = ?`;
            queryParams.push(class_name);
        }

        if (section) {
            sql += ` AND a.section = ?`;
            queryParams.push(section);
        }

        if (subject_name) {
            sql += ` AND a.subject_name = ?`;
            queryParams.push(subject_name);
        }

        if (attendance_date) {
            sql += ` AND a.attendance_date = ?`;
            queryParams.push(attendance_date);
        }

        if (status) {
            sql += ` AND a.status = ?`;
            queryParams.push(status);
        }
    sql += ` ORDER BY attendance_date DESC, id DESC`;

        db.query(sql, queryParams, (err, result) => {

        if (err) {

            console.log("==========================");
            console.log("MYSQL HISTORY ERROR");
            console.log(err);
            console.log("==========================");

            return res.status(500).json({
                success: false,
                message: "Database Error tracking filter lookup processing metrics.",
                error: err
            });
        }

        console.log("Attendance History =", result);

        res.json({
            success: true,
            data: result
        });

    });
});

/**
 * @route   GET /api/attendance/report
 * @desc    Aggregates statistical operational analytics reporting calculations matrix filters
 * @access  Private (Management Dashboard / Report Engine UI Context)
 */
router.get('/report', (req, res) => {

    const {
        teacher_id,
        class_name,
        section,
        subject_name,
        from_date,
        to_date,
        status,
        admission_no,
        student_name
    } = req.query;

    let where = " WHERE 1=1 ";
    let params = [];

    if (teacher_id) {
        where += " AND a.teacher_id = ?";
        params.push(teacher_id);
    }

    if (class_name) {
        where += " AND a.class_name = ?";
        params.push(class_name);
    }

    if (section) {
        where += " AND a.section = ?";
        params.push(section);
    }

    if (subject_name) {
        where += " AND a.subject_name = ?";
        params.push(subject_name);
    }

    if (status) {
        where += " AND a.status = ?";
        params.push(status);
    }

    if (admission_no) {
        where += " AND s.admission_no = ?";
        params.push(admission_no);
    }

    if (student_name) {
        where += " AND s.student_name LIKE ?";
        params.push(`%${student_name}%`);
    }

    if (from_date) {
        where += " AND a.attendance_date >= ?";
        params.push(from_date);
    }

    if (to_date) {
        where += " AND a.attendance_date <= ?";
        params.push(to_date);
    }

    const summarySql = `
        SELECT
            COUNT(a.id) total_records,
            SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) present_count,
            SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) absent_count,
            SUM(CASE WHEN a.status='Late' THEN 1 ELSE 0 END) late_count,
            SUM(CASE WHEN a.status='Leave' THEN 1 ELSE 0 END) leave_count
        FROM attendance a
        JOIN students s ON a.student_id=s.id
        ${where}
    `;

    const recordsSql = `
        SELECT
            a.id,
            s.photo,
            s.admission_no,
            s.student_name,
            a.class_name,
            a.section,
            a.subject_name,
            t.teacher_name,
            a.attendance_date,
            a.status,
            a.remarks,
            a.updated_at
        FROM attendance a
        JOIN students s
            ON a.student_id=s.id
        LEFT JOIN teachers t
            ON a.teacher_id=t.id
        ${where}
        ORDER BY a.attendance_date DESC,a.id DESC
    `;

    db.query(summarySql, params, (err, summary) => {

        if (err) {
            return res.status(500).json({
                success:false,
                error:err
            });
        }

        db.query(recordsSql, params, (err2, records) => {

            if (err2) {
                return res.status(500).json({
                    success:false,
                    error:err2
                });
            }

            const s = summary[0];

            const total = Number(s.total_records || 0);
            const present = Number(s.present_count || 0);
            const absent = Number(s.absent_count || 0);
            const late = Number(s.late_count || 0);
            const leave = Number(s.leave_count || 0);

            const percentage = total
                ? (((present + late) / total) * 100).toFixed(2)
                : 0;

            res.json({

                success:true,

                summary:{
                    total_students:total,
                    present_count:present,
                    absent_count:absent,
                    late_count:late,
                    leave_count:leave,
                    attendance_percentage:percentage
                },

                records:records

            });

        });

    });

});

/**
 * @route   GET /api/attendance/student/:studentId
 * @desc    Fetch comprehensive ledger entries tied specifically around unique Student index values
 * @access  Private (Parent Portal / Student Dashboard)
 */
router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    const sql = `SELECT * FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC`;

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error performing system validation tracing targeted student logs.",
                error: err
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

/**
 * @route   GET /api/attendance/date/:attendanceDate
 * @desc    Pull categorical index matching entries associated across an isolated static timeline frame
 * @access  Private (Admin Portal Views)
 */
router.get('/date/:attendanceDate', (req, res) => {
    const attendanceDate = req.params.attendanceDate;

    const sql = `SELECT * FROM attendance WHERE attendance_date = ? ORDER BY class_name ASC, section ASC`;

    db.query(sql, [attendanceDate], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error filtering records mapping individual timestamp execution indexes.",
                error: err
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

/**
 * @route   PUT /api/attendance/:id
 * @desc    Modify data characteristics metrics stored on isolated single row transactional identifiers
 * @access  Private (Teacher Mod Edit Portal View)
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { status, remarks } = req.body;
        const validStatus = [
            'Present',
            'Absent',
            'Late',
            'Leave'
        ];

        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Attendance Status"
            });
        }
    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status modification configuration requires a value parameter selection inputs."
        });
    }

    const sql = `
        UPDATE attendance 
        SET status = ?, remarks = ?, updated_at = NOW() 
        WHERE id = ?
    `;

    db.query(sql, [status, remarks, id], (err, result) => {
        if (err) {
            console.log("MYSQL UPDATE ERROR =", err);
            return res.status(500).json({
                success: false,
                message: "Database Error processing requested line entry changes.",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Attendance entry not found or no structural record field change modification occurred."
            });
        }

        res.json({
            success: true,
            message: "Attendance Updated Successfully"
        });
    });
});

/**
 * @route   DELETE /api/attendance/:id
 * @desc    Removes an active unique database row configuration entry structure based around sequential IDs
 * @access  Private (Admin Control Infrastructure Management Layer)
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM attendance WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error removing record execution timeline reference context node.",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Attendance target identifier entry key matching record trace data could not be parsed."
            });
        }

        res.json({
            success: true,
            message: "Attendance Deleted Successfully"
        });
    });
});

module.exports = router;