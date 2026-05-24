const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const FILE_NAME = 'students.json';
const GRADES_FILE = 'grades.json';

app.use(express.json());

// መረጃዎችን ከፋይል የማንበብ ተግባር
function loadStudents() {
    if (fs.existsSync(FILE_NAME)) {
        return JSON.parse(fs.readFileSync(FILE_NAME, 'utf8'));
    }
    return [];
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/students', (req, res) => {
    res.json(loadStudents());
});

app.get('/api/grades', (req, res) => {
    if (fs.existsSync(GRADES_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(GRADES_FILE, 'utf8')));
    }
    res.json([]);
});

// አዲስ ተማሪ ከዌብሳይት ሲላክ ተቀብሎ ፋይል ውስጥ የመጻፍ ትዕዛዝ (API POST)
app.post('/api/students', (req, res) => {
    let studentsList = loadStudents();
    
    // አዲስ መለያ ቁጥር በራሱ እንዲፈጠር ማድረግ (ለምሳሌ REG/005...)
    let newId = "REG/00" + (studentsList.length + 3); 
    
    let newStudent = {
        studentId: newId,
        fullName: req.body.fullName,
        studentGrade: req.body.studentGrade
    };
    
    studentsList.push(newStudent);
    fs.writeFileSync(FILE_NAME, JSON.stringify(studentsList, null, 2));
    
    console.log(`[ሲስተም] አዲስ ተማሪ ተመዝግቧል: ${newStudent.fullName}`);
    res.json({ success: true, student: newStudent });
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` ሰርቨሩ በድጋሚ ተነስቷል!`);
    console.log(`========================================`);
});