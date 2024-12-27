require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected"));

// Define Note schema
const noteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: true,
    },
    noteDescription: {
        type: String,
        required: true,
    },
    notePriority: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Create Note model
const Note = mongoose.model('Notes', noteSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Mello, World!');
});

// Route to create a new note
app.post('/save-notes', async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).send(note);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to save a dummy note
app.get('/save-dummy-note', async (req, res) => {
    const dummyNote = new Note({
        noteTitle: 'Dummy Title',
        noteDescription: 'This is dummy description',
        notePriority: 'High'
    });

    try {
        const savedNote = await dummyNote.save();
        res.status(201).send(savedNote);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to fetch all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on :${port}`);
});
