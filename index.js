import { Caido } from "@caido/sdk-frontend";

// Default settings
const defaultSettings = {
  notes: [],
};

// Get settings
const getSetting = (settingName) => {
  if (localStorage.getItem(`notes_${settingName}`) === null) {
    return defaultSettings[settingName];
  }
  return JSON.parse(localStorage.getItem(`notes_${settingName}`)) || "";
};

// Set settings
const setSetting = (settingName, value) => {
  localStorage.setItem(`notes_${settingName}`, JSON.stringify(value));
};

// Create notes tab HTML
// Create notes tab HTML
const createNotesTabHTML = () => {
  const notes = getSetting("notes");

  const notesHtml = notes
    .map(
      (note, index) => `
    <tr>
      <td>${note}</td>
      <td><button class="delete-note" data-index="${index}">Delete</button></td>
    </tr>
  `
    )
    .join("");

  return `
    <div class="notes-settings">
      <header>
        <div class="header-title"><h1>Notes</h1></div>
        <div class="header-description">Create and manage notes.</div>
      </header>
      <main>
        <table class="notes-table">
          <thead>
            <tr>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${notesHtml}
          </tbody>
        </table>
        <div class="add-note">
          <textarea id="note-input" placeholder="Enter a new note"></textarea>
          <button id="add-note-button">Add Note</button>
        </div>
      </main>
    </div>
  `;
};

// Notes tab functionality
const notesTab = () => {
  const notesTabHTML = document.createElement("div");
  notesTabHTML.innerHTML = createNotesTabHTML();

  const addNoteButton = notesTabHTML.querySelector("#add-note-button");
  const noteInput = notesTabHTML.querySelector("#note-input");

  addNoteButton.addEventListener("click", () => {
    const note = noteInput.value.trim();
    if (note !== "") {
      const notes = getSetting("notes");
      notes.push(note);
      setSetting("notes", notes);
      noteInput.value = "";
      location.reload();
    }
  });

  const deleteNoteButtons = notesTabHTML.querySelectorAll(".delete-note");
  deleteNoteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = parseInt(button.getAttribute("data-index"));
      const notes = getSetting("notes");
      notes.splice(index, 1);
      setSetting("notes", notes);
      location.reload();
    });
  });

  return notesTabHTML;
};

// Create notes UI
const notesUI = () => {
  Caido.navigation.addPage("/notes", {
    body: notesTab(),
  });

  Caido.sidebar.registerItem("Notes", "/notes", {
    icon: "fas fa-sticky-note",
    group: "Notes",
  });
};

notesUI();
