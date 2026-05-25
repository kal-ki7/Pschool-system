const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// ይህ ተጠቃሚው የሚልክልንን መረጃ (form data) እንዲያነብ ይረዳል
app.use(express.urlencoded({ extended: true }));

// የሎጊን ገጽን ለማሳየት
// ይህ መነሻ ገጹን (/) ወደ ሎጊን ገጽ ይመራዋል
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
// የተማሪዎች ዝርዝር ገጽ
app.get('/dashboard', (req, res) => {
    const students = JSON.parse(fs.readFileSync('students.json', 'utf8'));
    
    let tableRows = students.map(s => `
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${s.fullName || s.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${s.studentGrade || s.grade}</td>
        </tr>
    `).join('');

    res.send(`
        <h2 style="text-align: center;">የተማሪዎች መረጃ ዳሽቦርድ</h2>
        <table style="width: 80%; margin: 20px auto; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; border: 1px solid #ddd;">ሙሉ ስም</th>
                <th style="padding: 10px; border: 1px solid #ddd;">ክፍል</th>
            </tr>
            ${tableRows}
        </table>
        <div style="text-align: center; margin-top: 20px;">
            <a href='/login'>ከሲስተሙ ውጣ (Logout)</a>
        </div>
    `);
});
// የሎጊን መረጃን ለማጣራት
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // መረጃው ትክክል ከሆነ ወደ ዳሽቦርድ እንልከዋለን
        res.send("እንኳን ደህና መጡ! ወደ ዳሽቦርድ ለመሄድ <a href='/dashboard'>እዚህ ይጫኑ</a>");
    } else {
        // መረጃው ስህተት ከሆነ ለስህተቱ የሚሆን የተለየ መልእክት
        res.send(`
            <div style="color: red; text-align: center; margin-top: 50px;">
                <h2>የተጠቃሚ ስም ወይም የይለፍ ቃል ስህተት ነው!</h2>
                <a href='/login'>ወደ መግቢያ ገጽ ተመለስ</a>
            </div>
        `);
    }
});

// ዋናው ሰርቨር መነሻ
app.listen(port, () => {
    console.log(`ሰርቨሩ በ http://localhost:${port} እየሰራ ነው`);
});