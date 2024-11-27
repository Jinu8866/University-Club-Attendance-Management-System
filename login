const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());

const users = {}; 

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = users[username];
    if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});


const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');
    try {
        req.user = jwt.verify(token, 'secret_key');
        next();
    } catch {
        res.status(401).send('Invalid token');
    }
};

app.get('/protected', authenticate, (req, res) => {
    res.send(`Hello, ${req.user.username}`);
});

app.listen(3000, () => console.log('Server started on port 3000'));
