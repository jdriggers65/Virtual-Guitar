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

    // Build seventh chords from the current key
const seventhChords = chords.map((chord, index) => {
    if (index === 0 || index === 3) {
        return chord + "maj7";
    }

    if (index === 4) {
        return chord + "7";
    }

    return chord.replace(/m$/, "m7");
});

// Update the seventh-chord buttons
seventhChordButtons.forEach((button, index) => {
    button.dataset.chord = seventhChords[index];
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

const chordButtons =
    document.querySelectorAll(".chord-buttons .chord");

const seventhChordButtons =
    document.querySelectorAll(".seventh-chord-buttons .chord");

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

const seventhRomanNumerals = [
    "Imaj7","ii7","iii7","IVmaj7","V7","vi7"
];

seventhChordButtons.forEach((button, index) => {

    if (showChordNames) {
        button.textContent = button.dataset.chord;
    } else {
        button.textContent = seventhRomanNumerals[index];
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

const allChordButtons = [
    ...chordButtons,
    ...seventhChordButtons
];

allChordButtons.forEach(button => {

    button.addEventListener("pointerdown", () => {

        stopAllStrings();

        // Remove selected state from all chord buttons
        allChordButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        // Select the button that was clicked
        button.classList.add("selected");

        console.log("Button selected:", button.textContent, button.className);

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
    Cmaj7: [null, "C3", "E3", "G3", "B3", "E4"],

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

// Generate seventh chords from existing chords
Object.entries(chordNotes).forEach(([chordName, notes]) => {

    // Skip any seventh chords already defined manually
    if (chordName.includes("7")) return;

    const isMinor = chordName.endsWith("m");
    const root = isMinor ? chordName.slice(0, -1) : chordName;

    // Get the root note's pitch class
    const noteNames = [
        "C", "C#", "D", "Eb", "E", "F",
        "F#", "G", "Ab", "A", "Bb", "B"
    ];

    const aliases = {
        Db: "C#", "D#": "Eb", Gb: "F#",
        "G#": "Ab", "A#": "Bb"
    };

    const normalizedRoot = aliases[root] || root;
    const rootIndex = noteNames.indexOf(normalizedRoot);

    if (rootIndex === -1) return;

    const makeSeventh = (semitones, suffix) => {
        const seventhIndex = (rootIndex + semitones) % 12;
        const seventhName = noteNames[seventhIndex];

        const newNotes = [...notes];

        // Replace the highest sounding note with the seventh
        for (let i = newNotes.length - 1; i >= 0; i--) {
            if (newNotes[i] !== null) {
                const octave = parseInt(newNotes[i].slice(-1), 10);
                newNotes[i] = seventhName + octave;
                break;
            }
        }

        chordNotes[root + suffix] = newNotes;
    };

    if (isMinor) {
        makeSeventh(10, "m7");
    } else {
        makeSeventh(11, "maj7");
        makeSeventh(10, "7");
    }
});

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
            new (window.AudioContext || window.webkitAudioContext)({
                latencyHint: "interactive"
            });
    }

    return audioContext;
}

async function prepareAudio() {

    const audio = getAudioContext();

    if (audio.state === "suspended") {
        await audio.resume();
    }

}

// ----- ACOUSTIC GUITAR SAMPLES -----

const guitarSamples = {};

// Track the currently playing note on each guitar string
const activeStringNotes = {};

// Fade out all currently ringing guitar strings
function stopAllStrings() {

    const audio = getAudioContext();
    const now = audio.currentTime;

    Object.keys(activeStringNotes).forEach(index => {

        const note = activeStringNotes[index];

        note.gain.gain.cancelScheduledValues(now);

        note.gain.gain.setValueAtTime(
            note.gain.gain.value,
            now
        );

        note.gain.gain.linearRampToValueAtTime(
            0,
            now + 0.50
        );

        note.source.stop(now + 0.50);

        delete activeStringNotes[index];
    });
}

const guitarSampleFiles = {
    E2: "mix-e2.wav",
    A2: "mix-a2.wav",
    D3: "mix-d3.wav",
    G3: "mix-g3.wav",
    B3: "mix-b3.wav",
    E4: "mix-e4.wav"
};

async function loadGuitarSamples() {

    const audio = getAudioContext();

    for (const [note, filename] of Object.entries(guitarSampleFiles)) {

        try {
            const response = await fetch("./audio/" + filename);

            if (!response.ok) {
                throw new Error("Could not load " + filename);
            }

            const fileData = await response.arrayBuffer();

            guitarSamples[note] = await audio.decodeAudioData(fileData);

            console.log("Loaded guitar sample:", note);

        } catch (error) {
            console.error("Error loading", note, error);
        }
    }
}

loadGuitarSamples();
    
function playNote(note, stringIndex, velocity = 0.7) {

    // Don't play muted strings
    if (!note) {
        return;
    }

    const audio = getAudioContext();

    const targetFrequency = getNoteFrequency(note);

    if (!targetFrequency) {
        console.log("Frequency not found:", note);
        return;
    }

    // Find the recorded sample closest to our target note
    let closestSample = null;
    let closestFrequency = 0;
    let smallestDifference = Infinity;

    for (const sampleNote of Object.keys(guitarSamples)) {

        const sampleFrequency = getNoteFrequency(sampleNote);

        const difference = Math.abs(
            Math.log2(targetFrequency / sampleFrequency)
        );

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestSample = guitarSamples[sampleNote];
            closestFrequency = sampleFrequency;
        }
    }

    if (!closestSample) {
        console.log("Guitar samples not ready");
        return;
    }

    // Play the selected guitar recording

    // Fade out the previous note on this same string
const previousNote = activeStringNotes[stringIndex];

if (previousNote) {
    const now = audio.currentTime;

    previousNote.gain.gain.cancelScheduledValues(now);
    previousNote.gain.gain.setValueAtTime(
        previousNote.gain.gain.value,
        now
    );
    previousNote.gain.gain.linearRampToValueAtTime(
        0,
        now + 0.05
    );

    previousNote.source.stop(now + 0.05);
}

    const source = audio.createBufferSource();
    const gain = audio.createGain();

    source.buffer = closestSample;

    // Adjust pitch to match the chord note
    source.playbackRate.value =
        targetFrequency / closestFrequency;

    // Control note volume based on playing strength
    gain.gain.value = velocity;

    source.connect(gain);
    gain.connect(audio.destination);

    // Remember which note is playing on this string
activeStringNotes[stringIndex] = {
    source: source,
    gain: gain
};

// Clear the reference when playback finishes
source.onended = () => {
    if (activeStringNotes[stringIndex]?.source === source) {
        delete activeStringNotes[stringIndex];
    }
};

    // Skip the silence before the recorded guitar note
    // Adjust the starting point for individual guitar samples
    let sampleOffset = 0.30;

    if (closestSample === guitarSamples.B3) {
    sampleOffset = 0.52;
    }

    if (closestSample === guitarSamples.D3) {
    sampleOffset = 0.34;
    }

    source.start(0, sampleOffset);
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
let lastPointerTime = performance.now();
let smoothedStrumSpeed = 0;

// Prevent browser dragging
guitar.addEventListener("dragstart", (event) => {
    event.preventDefault();
});


// ---------------------------------
// POINTER DOWN
// ---------------------------------

guitar.addEventListener("pointerdown", async event => {

    event.preventDefault();

    await prepareAudio();

    isPlaying = true;
    lastStringPlayed = null;
    lastPointerY = event.clientY;

    guitar.setPointerCapture(event.pointerId);

    const nearestString = getNearestString(event.clientY);

    if (nearestString !== null) {
        playStringByIndex(nearestString, 0.25);
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

    // Measure how fast the finger is moving
    const currentPointerTime = performance.now();

    const timeDifference = currentPointerTime - lastPointerTime;
    const distanceMoved = Math.abs(currentPointerY - lastPointerY);

   // Calculate speed and limit unrealistic spikes
    const strumSpeed = timeDifference > 0
    ? Math.min(distanceMoved / timeDifference, 5)
    : 0;

    // Smooth out sudden changes in finger speed
    smoothedStrumSpeed =
    smoothedStrumSpeed * 0.7 + strumSpeed * 0.3;

    // Convert strumming speed into playing strength
   // Wider dynamic range for testing
const strumVelocity = Math.min(
    1.0,
    Math.max(0.08, smoothedStrumSpeed * 0.20)
);

lastPointerTime = currentPointerTime;

console.log("Strum speed:", strumSpeed.toFixed(2));

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
                playStringByIndex(index, strumVelocity);
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
                playStringByIndex(index, strumVelocity);
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

function playStringByIndex(index, velocity = 0.7) {

    console.log("Playing velocity:", velocity.toFixed(2));

    if (index === lastStringPlayed) {
        return;
    }

    lastStringPlayed = index;

    const notes = chordNotes[selectedChord];

    const noteIndex = 5 - index;

    const stringElement = strings[index];

stringElement.classList.remove("vibrating");

// Force the browser to reset the animation
void stringElement.offsetWidth;

stringElement.classList.add("vibrating");

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

        playNote(note, index, velocity);

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
/*
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
*/

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

        playNote(note, index);

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
        playNote(note, index);
    }

}

// ----- SETTINGS SCREEN -----

const settingsButton =
    document.getElementById("settings-button");

const settingsOverlay =
    document.getElementById("settings-overlay");

const settingsClose =
    document.getElementById("settings-close");

// Open Settings
settingsButton.addEventListener("pointerdown", () => {
    settingsOverlay.style.display = "flex";
});

// Close Settings
settingsClose.addEventListener("click", () => {
    settingsOverlay.style.display = "none";
});

// ----- SEVENTH CHORDS SETTING -----

const seventhChordsToggle =
    document.getElementById("seventh-chords-toggle");

const seventhChordColumn =
    document.querySelector(".seventh-chord-buttons");

seventhChordsToggle.addEventListener("change", () => {

    if (seventhChordsToggle.checked) {
        seventhChordColumn.style.display = "flex";
    } else {
        seventhChordColumn.style.display = "none";
    }

    // If a seventh chord is selected, switch to its standard chord
    if (!seventhChordsToggle.checked) {

        const selectedSeventh =
            document.querySelector(".seventh-chord-buttons .selected");

        if (selectedSeventh) {
            const chordIndex =
                Array.from(seventhChordButtons).indexOf(selectedSeventh);

            allChordButtons.forEach(button => {
                button.classList.remove("selected");
            });

            const standardButton = chordButtons[chordIndex];

            standardButton.classList.add("selected");
            selectedChord = standardButton.dataset.chord;
            currentChordDisplay.textContent = selectedChord;
        }
    }

    // Save the Seventh Chords preference
    localStorage.setItem("seventhChordsEnabled", seventhChordsToggle.checked);

});

// Restore saved Seventh Chords preference when the app opens
if (localStorage.getItem("seventhChordsEnabled") === "false") {
    seventhChordsToggle.checked = false;
    seventhChordColumn.style.display = "none";
}

// ----- CHORD NAMES SETTING -----

const chordNamesToggle =
    document.getElementById("chord-names-toggle");

chordNamesToggle.addEventListener("change", () => {

    showChordNames = chordNamesToggle.checked;

    updateChordButtonLabels();

    localStorage.setItem("showChordNames", chordNamesToggle.checked);

});

// Restore saved chord name preference when the app opens
if (localStorage.getItem("showChordNames") === "true") {
    chordNamesToggle.checked = true;
    showChordNames = true;
    updateChordButtonLabels();
}

// ----- LEFT-HANDED MODE SETTING -----

const leftHandedToggle =
    document.getElementById("left-handed-toggle");

const guitarApp =
    document.querySelector(".guitar-app");

leftHandedToggle.addEventListener("change", () => {

    if (leftHandedToggle.checked) {
        guitarApp.style.flexDirection = "row-reverse";
    } else {
        guitarApp.style.flexDirection = "row";
    }

    guitarApp.classList.toggle("left-handed", leftHandedToggle.checked);
    localStorage.setItem("leftHandedMode", leftHandedToggle.checked);

});

// Restore saved left-handed preference when the app opens
if (localStorage.getItem("leftHandedMode") === "true") {
    leftHandedToggle.checked = true;
    guitarApp.style.flexDirection = "row-reverse";
    guitarApp.classList.add("left-handed");
}