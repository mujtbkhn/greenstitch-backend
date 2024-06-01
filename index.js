require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const Todo = require('./models/Todo');
const URL = process.env.MONGO_URI
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//connecting mongodb
mongoose.connect(URL)
    .then(() => console.log('Database is connected!'))
    .catch(() => console.log('Failed To Connect'))


//routes
app.post('/createTask', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({
                message: "Please add a title"
            });
        }
        const newTodo = new Todo({
            title,
            description
        });
        await newTodo.save();
        res.status(201).json({
            message: "New Todo created successfully",
            newTodo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get tasks by status: Pending
app.get('/tasks/pending', async (req, res) => {
    try {
        const pendingTasks = await Todo.find({ status: 'Pending' });
        res.status(200).json(pendingTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get tasks by status: In Progress
app.get('/tasks/in-progress', async (req, res) => {
    try {
        const inProgressTasks = await Todo.find({ status: 'In Progress' });
        res.status(200).json(inProgressTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get tasks by status: Completed
app.get('/tasks/completed', async (req, res) => {
    try {
        const completedTasks = await Todo.find({ status: 'Completed' });
        res.status(200).json(completedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update task status
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        let updateData = { status };
        if (status === 'Completed') {
            const currentTime = new Date();
            updateData.timestamp = `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}, ${currentTime.getHours()}:${currentTime.getMinutes()}`;
        }

        const updatedTask = await Todo.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
