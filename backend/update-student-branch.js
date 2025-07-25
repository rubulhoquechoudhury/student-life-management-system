const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Teacher = require('./models/teacherSchema');
const Student = require('./models/studentSchema');

dotenv.config();

async function updateStudentBranch() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const teacher = await Teacher.findOne({ email: 'pranjal@gmail.com' });
    if (!teacher) throw new Error('Teacher not found');
    const teachBranch = teacher.teachBranch;
    if (!teachBranch) throw new Error('Teacher has no teachBranch');

    const student = await Student.findOne({ email: 'rubul@gmail.com' });
    if (!student) throw new Error('Student not found');

    student.branch = teachBranch;
    await student.save();
    console.log('Student branch updated successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateStudentBranch(); 