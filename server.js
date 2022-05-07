const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get request to return notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
});

//get request to return index.html file

//get api request to read db.json file and return all saved notes as JSON

//post api request that receives a new note to save on the request body, add it to the db.json file and then return the new note to the client. Needs a unique id when it's saved.

//Delete api notes id, should receive a query parameter containing the id of a note to delete. In order to delete a note you'll need to read all notes from the db.json file, remove the note with the given id property and then rewrite the notes to the db.json file

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});