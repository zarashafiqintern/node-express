const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");  
const notes = require("../MOCK_DATA.json");

const validateNotes = (req, res, next) => {
    if (!req.body || !req.body.first_name) {
        return res.status(400).json({ error: "Empty Body is not allowed" });
    }
    next();
};

router.get("/notes", (req, res) => {
  return res.json(notes);
});

router.route("/notes/:id")
  .get((req, res) => {
    const id = req.params.id;
    const note = notes.find((note) => note.id === id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.json(note);
  })

  .put(validateNotes, (req, res) => {
    const id = req.params.id;
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return res.status(404).send("Note not found");
    const updatedNote = req.body;
    notes[noteIndex] = { id, ...updatedNote };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(notes), (err) => {
      return res.json(notes[noteIndex]);
    });
  })

  .delete((req, res) => {
    const id = req.params.id;
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return res.status(404).send("ID not found");
    notes.splice(noteIndex, 1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(notes), (err) => {
      return res.json({ status: "Deleted Successfully" });
    });
  });

router.post("/notes", validateNotes, (req, res) => {
  const body = req.body;
  const newNote = {
    id: uuidv4(),
    ...body
  };
  notes.push(newNote);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(notes), (err) => {
    return res.json({
      status: "Success",
      note: newNote
    });
  });
});

module.exports = router;
