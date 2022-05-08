const express = require('express');
const {v4 : uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');
const existingNotes = require('./Develop/db/db.json');
let notes = [];
if(Array.isArray(existingNotes)) {
    notes = [...existingNotes];
} else {
    notes = [existingNotes];
}

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get request to return notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'));
});

//get request to return index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'));
});

//get api request to read db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    if(title && text) {
        existingNotes.forEach(db => {
            console.log(`${db.title}: ${db.text}`);
        });
    
        res.json(`${req.method} request received to get notes`);
    } else {
        res.json('Error in getting notes');
    }
});

//post api request that receives a new note to save on the request body, add it to the db.json file and then return the new note to the client. Needs a unique id when it's saved.
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

    notes = [...notes, newNote];
    const noteString = JSON.stringify(notes, null, 2);

    fs.writeFile(`./Develop/db/db.json`, noteString, (err) =>
        err
            ? console.error(err)
            : console.log(
                `New note for ${newNote.title} has been written to JSON file`
            )
    );

    const response = {
        status: 'success',
        body: newNote,
    };

    console.log(response);

    res.json(response);
    } else {
        res.json('Error in posting note');
    }
});

//Delete api notes id, should receive a query parameter containing the id of a note to delete. In order to delete a note you'll need to read all notes from the db.json file, remove the note with the given id property and then rewrite the notes to the db.json file

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});