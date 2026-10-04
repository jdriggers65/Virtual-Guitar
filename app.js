// ---------------------------------
// CHORD BUTTONS
// ---------------------------------

const chordButtons = document.querySelectorAll(".chord");

// Start with G selected
let selectedChord = "G";

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

        console.log("Selected chord:", selectedChord);

    });

});


// ---------------------------------
// CHORD / STRING NOTE MAP
// ---------------------------------

const chordNotes = {

    G: [
        "G2",
        "B2",
        "D3",
        "G3",
        "B3",
        "G4"
    ],

    Am: [
        null,
        "A2",
        "E3",
        "A3",
        "C4",
        "E4"
    ],

    Bm: [
        null,
        "B2",
        "F#3",
        "B3",
        "D4",
        "F#4"
    ],

    C: [
        null,
        "C3",
        "E3",
        "G3",
        "C4",
        "E4"
    ],

    D: [
        null,
        null,
        "D3",
        "A3",
        "D4",
        "F#4"
    ],

    Em: [
        "E2",
        "B2",
        "E3",
        "G3",
        "B3",
        "E4"
    ]

};


// ---------------------------------
// GUITAR STRINGS
// ---------------------------------

const strings = document.querySelectorAll(".string");

// ---------------------------------
// AUDIO ENGINE
// ---------------------------------

const noteFrequencies = {

    "E2": 82.41,
    "G2": 98.00,
    "A2": 110.00,
    "B2": 123.47,

    "C3": 130.81,
    "D3": 146.83,
    "E3": 164.81,
    "F#3": 185.00,
    "G3": 196.00,
    "A3": 220.00,
    "B3": 246.94,

    "C4": 261.63,
    "D4": 293.66,
    "E4": 329.63,
    "F#4": 369.99,
    "G4": 392.00

};

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

    const frequency = noteFrequencies[note];

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

    const nearestString = getNearestString(event.clientY);

    if (
        nearestString !== null &&
        nearestString !== lastStringPlayed
    ) {
        playStringByIndex(nearestString);
    }

});


// ---------------------------------
// POINTER UP
// ---------------------------------

guitar.addEventListener("pointerup", (event) => {

    isPlaying = false;
    lastStringPlayed = null;

    if (guitar.hasPointerCapture(event.pointerId)) {
        guitar.releasePointerCapture(event.pointerId);
    }

});


guitar.addEventListener("pointercancel", () => {

    isPlaying = false;
    lastStringPlayed = null;

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