// ---------------------------------
// KEY / TRANSPOSE CONTROL
// ---------------------------------

const keys = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "F#",
    "G",
    "Ab",
    "A",
    "Bb",
    "B"
];

const keyChords = {
    C:  ["C",  "Dm",  "Em",  "F",  "G",  "Am"],
    Db: ["Db", "Ebm", "Fm",  "Gb", "Ab", "Bbm"],
    D:  ["D",  "Em",  "F#m", "G",  "A",  "Bm"],
    Eb: ["Eb", "Fm",  "Gm",  "Ab", "Bb", "Cm"],
    E:  ["E",  "F#m", "G#m", "A",  "B",  "C#m"],
    F:  ["F",  "Gm",  "Am",  "Bb", "C",  "Dm"],
    "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m"],
    G:  ["G",  "Am",  "Bm",  "C",  "D",  "Em"],
    Ab: ["Ab", "Bbm", "Cm",  "Db", "Eb", "Fm"],
    A:  ["A",  "Bm",  "C#m", "D",  "E",  "F#m"],
    Bb: ["Bb", "Cm",  "Dm",  "Eb", "F",  "Gm"],
    B:  ["B",  "C#m", "D#m", "E",  "F#", "G#m"]
};

function updateChordsForKey() {
    const currentKey = keys[currentKeyIndex];
    const chords = keyChords[currentKey];

    chordButtons.forEach((button, index) => {
        button.dataset.chord = chords[index];
    });

    updateChordButtonLabels();

    // Keep the currently selected Roman numeral
    // and update its actual chord
    const selectedButton =
        document.querySelector(".chord.selected");

    if (selectedButton) {
        selectedChord = selectedButton.dataset.chord;
        currentChordDisplay.textContent = selectedChord;
    }

    console.log(
        "Key:",
        currentKey,
        "Chords:",
        chords
    );
}

let currentKeyIndex = 7; // G

const currentKeyDisplay =
    document.getElementById("current-key");

const keyUpButton =
    document.getElementById("key-up");

const keyDownButton =
    document.getElementById("key-down");


keyUpButton.addEventListener("pointerdown", () => {

    currentKeyIndex =
        (currentKeyIndex + 1) % keys.length;

    currentKeyDisplay.textContent =
        keys[currentKeyIndex];
        updateChordsForKey();

});


keyDownButton.addEventListener("pointerdown", () => {

    currentKeyIndex =
        (currentKeyIndex - 1 + keys.length) % keys.length;

    currentKeyDisplay.textContent =
        keys[currentKeyIndex];
        updateChordsForKey();

});

// ---------------------------------
// CHORD BUTTONS
// ---------------------------------

const chordButtons = document.querySelectorAll(".chord");

const currentChordDisplay =
    document.getElementById("current-chord");

const chordModeToggle =
    document.getElementById("chord-mode-toggle");

let showChordNames = false;

function updateChordButtonLabels() {

    const romanNumerals = [
        "I",
        "ii",
        "iii",
        "IV",
        "V",
        "vi"
    ];

    chordButtons.forEach((button, index) => {

        if (showChordNames) {
            button.textContent =
                button.dataset.chord;
        } else {
            button.textContent =
                romanNumerals[index];
        }

    });

  }

chordModeToggle.addEventListener(
    "pointerdown",
    () => {

        showChordNames = !showChordNames;

        updateChordButtonLabels();

        if (showChordNames) {
            chordModeToggle.textContent = "CHORD";
        } else {
            chordModeToggle.textContent = "NUM";
        }
    }
);

// Start with G selected
let selectedChord = "G";

updateChordsForKey();

chordButtons.forEach(button => {

    button.addEventListener("pointerdown", () => {

        // Remove selected state from all buttons
        chordButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // Select the button that was clicked
        button.classList.add("selected");

        // Store the selected chord
        selectedChord = button.dataset.chord;
        currentChordDisplay.textContent = selectedChord;

        console.log("Selected chord:", selectedChord);

    });

});


// ---------------------------------
// GUITAR CHORD VOICINGS
// Notes listed Low E -> High E
// null = muted string
// ---------------------------------

const chordNotes = {

    // ----- C -----
    C:   [null, "C3", "E3", "G3", "C4", "E4"],
    Cm:  [null, "C3", "G3", "C4", "Eb4", "G4"],

    // ----- C# / Db -----
    "C#":  [null, "C#3", "G#3", "C#4", "F4", "G#4"],
    "C#m": [null, "C#3", "G#3", "C#4", "E4", "G#4"],

    Db:   [null, "Db3", "Ab3", "Db4", "F4", "Ab4"],

    // ----- D -----
    D:   [null, null, "D3", "A3", "D4", "F#4"],
    Dm:  [null, null, "D3", "A3", "D4", "F4"],

    // ----- D# / Eb -----
    "D#m": [null, "D#3", "A#3", "D#4", "F#4", "A#4"],

    Eb:   [null, "Eb3", "Bb3", "Eb4", "G4", "Bb4"],
    Ebm:  [null, "Eb3", "Bb3", "Eb4", "Gb4", "Bb4"],

    // ----- E -----
    E:   ["E2", "B2", "E3", "G#3", "B3", "E4"],
    Em:  ["E2", "B2", "E3", "G3", "B3", "E4"],

    // ----- F -----
    F:   ["F2", "C3", "F3", "A3", "C4", "F4"],
    Fm:  ["F2", "C3", "F3", "Ab3", "C4", "F4"],

    // ----- F# / Gb -----
    "F#":  ["F#2", "C#3", "F#3", "A#3", "C#4", "F#4"],
    "F#m": ["F#2", "C#3", "F#3", "A3", "C#4", "F#4"],

    Gb:   ["Gb2", "Db3", "Gb3", "Bb3", "Db4", "Gb4"],

    // ----- G -----
    G:   ["G2", "B2", "D3", "G3", "B3", "G4"],
    Gm:  ["G2", "D3", "G3", "Bb3", "D4", "G4"],

    // ----- G# / Ab -----
    "G#m": ["G#2", "D#3", "G#3", "B3", "D#4", "G#4"],

    Ab:   ["Ab2", "Eb3", "Ab3", "C4", "Eb4", "Ab4"],

    // ----- A -----
    A:   [null, "A2", "E3", "A3", "C#4", "E4"],
    Am:  [null, "A2", "E3", "A3", "C4", "E4"],

    // ----- A# / Bb -----
    "A#m": [null, "A#2", "F3", "A#3", "C#4", "F4"],

    Bb:   [null, "Bb2", "F3", "Bb3", "D4", "F4"],
    Bbm:  [null, "Bb2", "F3", "Bb3", "Db4", "F4"],

    // ----- B -----
    B:   [null, "B2", "F#3", "B3", "D#4", "F#4"],
    Bm:  [null, "B2", "F#3", "B3", "D4", "F#4"]

};

// ---------------------------------
// GUITAR STRINGS
// ---------------------------------

const strings = document.querySelectorAll(".string");

// ---------------------------------
// AUDIO ENGINE
// ---------------------------------

// ---------------------------------
// AUTOMATIC NOTE FREQUENCY
// ---------------------------------

function getNoteFrequency(note) {

    const notePattern =
        /^([A-G])([#b]?)(\d)$/;

    const match = note.match(notePattern);

    if (!match) {
        console.log("Invalid note:", note);
        return null;
    }

    const noteName = match[1] + match[2];
    const octave = Number(match[3]);

    const semitones = {
        "C": 0,
        "C#": 1,
        "Db": 1,
        "D": 2,
        "D#": 3,
        "Eb": 3,
        "E": 4,
        "F": 5,
        "F#": 6,
        "Gb": 6,
        "G": 7,
        "G#": 8,
        "Ab": 8,
        "A": 9,
        "A#": 10,
        "Bb": 10,
        "B": 11
    };

    const midiNumber =
        (octave + 1) * 12 +
        semitones[noteName];

    const frequency =
        440 * Math.pow(
            2,
            (midiNumber - 69) / 12
        );

    return frequency;
}

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {
        audioContext =
            new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}
    
function playNote(note) {

    // Don't do anything for muted strings
    if (!note) {
        return;
    }

    const audio = getAudioContext();

    const frequency = getNoteFrequency(note);

    if (!frequency) {
        console.log("Frequency not found:", note);
        return;
    }

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.value = frequency;

    oscillator.connect(gain);
    gain.connect(audio.destination);


    // Start quietly
    gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
    );

    // Quick attack
    gain.gain.exponentialRampToValueAtTime(
        0.4,
        audio.currentTime + 0.01
    );

    // Fade out
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 1.2
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1.2
    );

}

// ---------------------------------
// STRUMMING ENGINE
// ---------------------------------

// ---------------------------------
// GUITAR INPUT ENGINE - VERSION 0.2
// Entire guitar area is playable
// ---------------------------------

const guitar = document.querySelector(".guitar");

let isPlaying = false;
let lastStringPlayed = null;
let lastPointerY = null;

// Prevent browser dragging
guitar.addEventListener("dragstart", (event) => {
    event.preventDefault();
});


// ---------------------------------
// POINTER DOWN
// ---------------------------------

guitar.addEventListener("pointerdown", (event) => {

    event.preventDefault();

    isPlaying = true;
    lastStringPlayed = null;
    lastPointerY = event.clientY;

    guitar.setPointerCapture(event.pointerId);

    const nearestString = getNearestString(event.clientY);

    if (nearestString !== null) {
        playStringByIndex(nearestString);
    }

});


// ---------------------------------
// POINTER MOVE
// ---------------------------------

guitar.addEventListener("pointermove", (event) => {

    if (!isPlaying) {
        return;
    }

    event.preventDefault();

    const currentPointerY = event.clientY;

    // Get the center position of every string
    const stringCenters = Array.from(strings).map(string => {
        const rect = string.getBoundingClientRect();
        return rect.top + (rect.height / 2);
    });

    // Determine which direction the finger is moving
    const movingDown =
        currentPointerY > lastPointerY;

    const movingUp =
        currentPointerY < lastPointerY;

    if (movingDown) {

        // Check strings from top to bottom
        stringCenters.forEach((stringCenter, index) => {

            if (
                lastPointerY < stringCenter &&
                currentPointerY >= stringCenter
            ) {
                playStringByIndex(index);
            }

        });

    } else if (movingUp) {

        // Check strings from bottom to top
        for (
            let index = stringCenters.length - 1;
            index >= 0;
            index--
        ) {

            const stringCenter =
                stringCenters[index];

            if (
                lastPointerY > stringCenter &&
                currentPointerY <= stringCenter
            ) {
                playStringByIndex(index);
            }

        }

    }

    // Remember where the finger is for the next movement
    lastPointerY = currentPointerY;

});

// ---------------------------------
// FIND NEAREST STRING
// ---------------------------------

function getNearestString(pointerY) {

    const stringCenters = Array.from(strings).map(string => {
        const rect = string.getBoundingClientRect();
        return rect.top + (rect.height / 2);
    });

    // Distance between the first two strings
    const stringSpacing =
        stringCenters[1] - stringCenters[0];

    // Create invisible boundaries half a string-space
    // above the first string and below the last string
    const topBoundary =
        stringCenters[0] - (stringSpacing / 2);

    const bottomBoundary =
        stringCenters[stringCenters.length - 1] +
        (stringSpacing / 2);

    // Outside the playable string area = NULL
    if (
        pointerY < topBoundary ||
        pointerY > bottomBoundary
    ) {
        return null;
    }

    let nearestIndex = null;
    let nearestDistance = Infinity;

    stringCenters.forEach((stringCenter, index) => {

        const distance =
            Math.abs(pointerY - stringCenter);

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
        }

    });

    return nearestIndex;
}


// ---------------------------------
// PLAY STRING BY INDEX
// ---------------------------------

function playStringByIndex(index) {

    if (index === lastStringPlayed) {
        return;
    }

    lastStringPlayed = index;

    const notes = chordNotes[selectedChord];

    const noteIndex = 5 - index;

    const note = notes[noteIndex];

    if (note) {

        console.log(
            "Chord:",
            selectedChord,
            "String:",
            index + 1,
            "Note:",
            note
        );

        playNote(note);

    } else {

        console.log(
            "Chord:",
            selectedChord,
            "String:",
            index + 1,
            "MUTED"
        );

    }

}


// Finger/mouse moves while held down
document.addEventListener("pointermove", (event) => {

    if (!isPlaying) {
        return;
    }

    event.preventDefault();

    const element = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    if (
        element &&
        element.classList.contains("string")
    ) {
        playString(element);
    }

});


// Finger/mouse released
document.addEventListener("pointerup", () => {

    isPlaying = false;
    lastStringPlayed = null;

});


// Also stop if pointer leaves/cancels
document.addEventListener("pointercancel", () => {

    isPlaying = false;
    lastStringPlayed = null;

});


// ---------------------------------
// PLAY A STRING
// ---------------------------------

function playString(stringElement) {

    const index =
        Array.from(strings).indexOf(stringElement);

    if (index === -1) {
        return;
    }

    // Don't repeatedly trigger the same string
    if (index === lastStringPlayed) {
        return;
    }

    lastStringPlayed = index;

    const notes = chordNotes[selectedChord];

    const noteIndex = 5 - index;

    const note = notes[noteIndex];

    if (note) {

        console.log(
            "Chord:",
            selectedChord,
            "String:",
            index + 1,
            "Note:",
            note
        );

        playNote(note);

    } else {

        console.log(
            "Chord:",
            selectedChord,
            "String:",
            index + 1,
            "MUTED"
        );

    }

}

// ---------------------------------
// PLAY STRING DURING STRUM
// ---------------------------------

function playString(stringElement) {

    const index =
        Array.from(strings).indexOf(stringElement);

    // Don't repeatedly trigger the same string
    if (index === lastStringPlayed) {
        return;
    }

    lastStringPlayed = index;

    const notes = chordNotes[selectedChord];

    const noteIndex = 5 - index;

    const note = notes[noteIndex];

    if (note) {
        playNote(note);
    }

}