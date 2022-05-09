const express = require('express');
const {v4 : uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

const existingNotes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get api request to read db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    res.json(existingNotes);
});

//post api request that receives a new note to save on the request body, add it to the db.json file and then return the new note to the client. Needs a unique id when it's saved.
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const id = uuidv4();

    if (title && text) {
    
    const newNote = {
        title,
        text,
        id,
    };

    let filePath = path.join(__dirname, "/db/db.json");
    existingNotes.push(newNote);

    fs.writeFile(filePath, JSON.stringify(existingNotes), function (err) {
        if(err) {
            console.log(err);
        }
        console.log('Note has been added!');
    });
    }
    res.json(newNote);
});
    
//Delete api notes id, should receive a query parameter containing the id of a note to delete. In order to delete a note you'll need to read all notes from the db.json file, remove the note with the given id property and then rewrite the notes to the db.json file
app.delete('/api/notes/:id', (req, res) => {
    let filePath = path.join(__dirname, '/db/db.json');
    for (i=0; i<existingNotes.length; i++) {
        if (existingNotes[i].id == req.params.id) {
            existingNotes.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(existingNotes), (err) => {
        if(err) {
            console.log(err);
        }
        console.log('Note was deleted');
    });
    res.json(existingNotes);
});

//get request to return notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//get request to return index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});