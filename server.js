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