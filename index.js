const express = require("express");
const fs = require("fs");
const notes = require("./MOCK_DATA.json");
const app = express();

app.use(express.json());

app.get("/notes", (req, res) => {
  return res.json(notes);
});

app.route("/notes/:id")
  .get((req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find((note) => note.id === id);
    return res.json(note);
  })

.put((req, res) => {
    const id = parseInt(req.params.id);
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
        return res.send("Note not found");
    }
    const updatedNote = req.body;   
    notes[noteIndex] = { id, ...updatedNote };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(notes), (err) => {
        return res.json(notes[noteIndex]);
    })
})

   .delete((req, res) => { 
    const id = parseInt(req.params.id);
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) {
        return res.send("id not found");
    }
    const deletedNote = notes.splice(noteIndex, 1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(notes), (err) => {
        return res.send(JSON.stringify(notes))
    });
});

app.post("/notes", (req, res) => {
  const body = req.body;
  notes.push({ id: notes.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(notes), (err) => {
    return res.json({
         status: "Success",
          id: notes.length
         });
  });
});

app.listen(8000, () => {
  console.log("Server Started");
});
