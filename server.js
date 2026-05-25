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
        res.send("እንኳን ደህና መጡ! ወደ ዋናው ገጽ ገብተዋል፡ " + user.username);
    } else {
        res.send("የይለፍ ቃል ወይም የተጠቃሚ ስም ስህተት ነው። <a href='/login'>እንደገና ይሞክሩ</a>");
    }
});

// ዋናው ሰርቨር መነሻ
app.listen(port, () => {
    console.log(`ሰርቨሩ በ http://localhost:${port} እየሰራ ነው`);
});