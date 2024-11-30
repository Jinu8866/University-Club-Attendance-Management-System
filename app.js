const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection failed', err);
    });

// User 스키마 및 모델
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Middleware 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// /api/signup POST 요청 처리
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Failed to create user' });
    }
});

// /api/login POST 요청 처리
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(401).send({ error: 'Invalid email or password' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
