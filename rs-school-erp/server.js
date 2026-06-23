const path = require('path');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
console.log(studentRoutes);
console.log("Teacher =", teacherRoutes);
const authRoutes = require('./routes/authRoutes');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
require('./config/db');

app.get('/', (req, res) => {
  res.send('R.S. Public School ERP Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});