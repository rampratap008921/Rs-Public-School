const examRoutes = require('./routes/exams');
const examSubjectsRoutes = require('./routes/examSubjectsRoutes');
const examTimetableRoutes = require('./routes/examTimetableRoutes.js');

console.log("Exam Timetable Routes =", examTimetableRoutes);
console.log("Exam Subjects Routes =", examSubjectsRoutes);
console.log("Exam Routes =", examRoutes);
console.log("SERVER FILE LOADED");

const attendanceRoutes = require('./routes/attendanceRoutes');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const teacherAllocationRoutes =
require('./routes/teacherAllocationRoutes');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);
app.use('/api', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/teacher-allocation', teacherAllocationRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exam-subjects', examSubjectsRoutes);
app.use('/api/exam-timetable', examTimetableRoutes);
require('./config/db');

app.get('/', (req, res) => {
  res.send('R.S. Public School ERP Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});