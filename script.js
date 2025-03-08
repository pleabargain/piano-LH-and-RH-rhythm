// DOM Elements
const difficultySlider = document.getElementById('difficulty');
const difficultyValue = document.getElementById('difficulty-value');
const generateBtn = document.getElementById('generate-btn');
const saveBtn = document.getElementById('save-btn');
const saveJsonBtn = document.getElementById('save-json-btn');
const loadPatternBtn = document.getElementById('load-pattern-btn');
const loadPatternInput = document.getElementById('load-pattern');
const patternNameInput = document.getElementById('pattern-name');
const patternCommentsInput = document.getElementById('pattern-comments');
const patternTitleElement = document.getElementById('pattern-title');
const exerciseContainer = document.getElementById('exercise-container');
const rhythmGrid = document.getElementById('rhythm-grid');
const tempoSlider = document.getElementById('tempo');
const tempoValue = document.getElementById('tempo-value');
const metronomeStartBtn = document.getElementById('metronome-start');
const metronomeStopBtn = document.getElementById('metronome-stop');

// Variables for pattern data
let patternName = '';
let userComments = '';

// Metronome variables
let audioContext;
let currentBeat = 0;
let isPlaying = false;
let metronomeInterval;
let tempo = 60; // BPM

// Pattern Generation
function generatePattern(difficulty) {
    // Convert difficulty to integer (1-5)
    const level = parseInt(difficulty);
    
    // Calculate number of beats based on difficulty (4-12 beats)
    const numBeats = 4 + (level - 1) * 2;
    
    // Initialize pattern arrays
    const pattern = {
        rh: Array(numBeats).fill(false),
        lh: Array(numBeats).fill(false)
    };
    
    // Generate patterns based on difficulty level
    switch(level) {
        case 1: // Beginner - Alternating hands
            // RH plays on beats 1 and 3
            pattern.rh[0] = true;
            pattern.rh[2] = true;
            
            // LH plays on beats 2 and 4 (if available)
            pattern.lh[1] = true;
            if (numBeats >= 4) pattern.lh[3] = true;
            break;
            
        case 2: // Easy - Simple complementary patterns
            // RH plays on beats 1, 3, 5
            pattern.rh[0] = true;
            pattern.rh[2] = true;
            pattern.rh[4] = true;
            
            // LH plays on beats 2, 4, 6
            pattern.lh[1] = true;
            pattern.lh[3] = true;
            pattern.lh[5] = true;
            break;
            
        case 3: // Medium - Some syncopation and overlapping
            // More complex pattern with some overlapping beats
            pattern.rh[0] = true;
            pattern.rh[1] = true;
            pattern.rh[4] = true;
            pattern.rh[5] = true;
            pattern.rh[7] = true;
            
            pattern.lh[1] = true;
            pattern.lh[2] = true;
            pattern.lh[3] = true;
            pattern.lh[6] = true;
            pattern.lh[7] = true;
            break;
            
        case 4: // Advanced - More complex coordination
            // Complex pattern with more overlapping
            pattern.rh[0] = true;
            pattern.rh[2] = true;
            pattern.rh[3] = true;
            pattern.rh[5] = true;
            pattern.rh[6] = true;
            pattern.rh[9] = true;
            
            pattern.lh[0] = true;
            pattern.lh[1] = true;
            pattern.lh[4] = true;
            pattern.lh[7] = true;
            pattern.lh[8] = true;
            pattern.lh[9] = true;
            break;
            
        case 5: // Expert - Complex polyrhythms
            // Very complex pattern with many active beats
            for (let i = 0; i < numBeats; i++) {
                // RH plays on most beats
                pattern.rh[i] = (i % 3 !== 1);
                
                // LH plays on different pattern
                pattern.lh[i] = (i % 2 === 0);
            }
            
            // Ensure some overlapping for challenge
            pattern.rh[1] = true;
            pattern.lh[1] = true;
            pattern.rh[4] = true;
            pattern.lh[4] = true;
            break;
    }
    
    // Add some randomization for variety
    if (Math.random() > 0.5) {
        // Randomly modify one beat in each hand to create variations
        const rhIndex = Math.floor(Math.random() * numBeats);
        const lhIndex = Math.floor(Math.random() * numBeats);
        
        // Ensure we don't make all beats inactive
        if (countActiveBeatsByHand(pattern.rh) > 2) {
            pattern.rh[rhIndex] = !pattern.rh[rhIndex];
        }
        
        if (countActiveBeatsByHand(pattern.lh) > 2) {
            pattern.lh[lhIndex] = !pattern.lh[lhIndex];
        }
    }
    
    return {
        pattern,
        numBeats
    };
}

// Helper function to count active beats for a hand
function countActiveBeatsByHand(handBeats) {
    return handBeats.filter(beat => beat).length;
}

// Create grid cells based on number of beats
function createGridCells(numBeats) {
    const rows = rhythmGrid.querySelectorAll('.row');
    
    // Clear existing beat cells
    rows.forEach(row => {
        // Keep only the header cell
        const headerCell = row.querySelector('.header');
        row.innerHTML = '';
        row.appendChild(headerCell);
        
        // Add beat cells
        for (let i = 1; i <= numBeats; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = i;
            row.appendChild(cell);
        }
    });
}

// Update UI with generated pattern
function updateUI(patternData) {
    const { pattern, numBeats } = patternData;
    
    // Create grid cells based on number of beats
    createGridCells(numBeats);
    
    const rows = rhythmGrid.querySelectorAll('.row');
    
    // Update RH row
    const rhCells = rows[0].querySelectorAll('.cell:not(.header)');
    for (let i = 0; i < numBeats; i++) {
        rhCells[i].className = 'cell ' + (pattern.rh[i] ? 'active' : 'inactive');
    }
    
    // Update LH row
    const lhCells = rows[1].querySelectorAll('.cell:not(.header)');
    for (let i = 0; i < numBeats; i++) {
        lhCells[i].className = 'cell ' + (pattern.lh[i] ? 'active' : 'inactive');
    }
}

// Generate filename based on active beats
function generateFilename(patternData) {
    const { pattern } = patternData;
    const rhActiveBeats = [];
    const lhActiveBeats = [];
    
    // Get active beats for RH
    pattern.rh.forEach((active, index) => {
        if (active) rhActiveBeats.push(index + 1);
    });
    
    // Get active beats for LH
    pattern.lh.forEach((active, index) => {
        if (active) lhActiveBeats.push(index + 1);
    });
    
    return `RH_${rhActiveBeats.join('_')}_LH_${lhActiveBeats.join('_')}.png`;
}

// Save current pattern as image
function saveAsImage() {
    html2canvas(exerciseContainer).then(canvas => {
        // Create temporary link for download
        const link = document.createElement('a');
        
        // Use pattern name in filename if available
        const filename = patternName 
            ? `${patternName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
            : currentFilename;
            
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Save current pattern as JSON
function saveAsJson() {
    if (!currentPattern) {
        alert('Please generate a pattern first');
        return;
    }
    
    const jsonData = {
        name: patternName || 'Unnamed Pattern',
        difficulty: parseInt(difficultySlider.value),
        numBeats: currentPattern.numBeats,
        pattern: currentPattern.pattern,
        comments: userComments,
        timestamp: new Date().toISOString()
    };
    
    // Create and trigger download
    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Use pattern name in filename if available
    const filename = patternName 
        ? `${patternName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
        : currentFilename.replace('.png', '.json');
        
    link.download = filename;
    link.href = url;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
}

// Load pattern from JSON file
function loadPatternFromJson(data) {
    // Validate the loaded data
    if (!data.pattern || !data.numBeats || !data.difficulty) {
        alert('Invalid pattern file format');
        return;
    }
    
    // Set difficulty slider
    difficultySlider.value = data.difficulty;
    difficultyValue.textContent = data.difficulty;
    
    // Load the pattern
    currentPattern = {
        pattern: data.pattern,
        numBeats: data.numBeats
    };
    
    // Update UI with loaded pattern
    updateUI(currentPattern);
    
    // Load pattern name if available
    if (data.name && data.name !== 'Unnamed Pattern') {
        patternNameInput.value = data.name;
        patternName = data.name;
        updatePatternTitle();
    }
    
    // Load comments if available
    if (data.comments) {
        patternCommentsInput.value = data.comments;
        userComments = data.comments;
    }
    
    // Generate filename for potential saving
    currentFilename = generateFilename(currentPattern);
    
    alert('Pattern loaded successfully!');
}

// Update pattern title display
function updatePatternTitle() {
    patternTitleElement.textContent = patternName || 'Unnamed Pattern';
}

// Initialize audio context
function initAudio() {
    try {
        // Create audio context if it doesn't exist
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("Audio context created:", audioContext.state);
        }
        
        // Resume audio context if it's suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log("Audio context resumed:", audioContext.state);
            }).catch(err => {
                console.error("Failed to resume audio context:", err);
            });
        }
    } catch (err) {
        console.error("Error initializing audio:", err);
    }
}

// Create cowbell sound
function playCowbell(time, isAccent) {
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const bandpass = audioContext.createBiquadFilter();
    const highpass = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();
    
    // Set oscillator types and frequencies
    osc1.type = 'square';
    osc1.frequency.value = isAccent ? 1000 : 800;
    osc2.type = 'square';
    osc2.frequency.value = isAccent ? 1500 : 1200;
    
    // Configure filters for cowbell sound
    bandpass.type = 'bandpass';
    bandpass.frequency.value = isAccent ? 1200 : 1000;
    bandpass.Q.value = 1;
    
    highpass.type = 'highpass';
    highpass.frequency.value = isAccent ? 800 : 600;
    
    // Set envelope
    gainNode.gain.value = isAccent ? 0.5 : 0.3;
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    // Connect nodes
    osc1.connect(bandpass);
    osc2.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.3);
    osc2.stop(time + 0.3);
}

// Start metronome
function startMetronome() {
    if (isPlaying) return;
    
    // Initialize audio with user interaction
    try {
        initAudio();
        
        // Ensure audio context is running
        if (audioContext && audioContext.state !== 'running') {
            console.log("Attempting to resume audio context...");
            audioContext.resume().then(() => {
                console.log("Audio context resumed successfully");
                startMetronomeLoop();
            }).catch(err => {
                console.error("Failed to resume audio context:", err);
                alert("Could not start audio. Please try again.");
                metronomeStartBtn.disabled = false;
                metronomeStopBtn.disabled = true;
            });
        } else {
            startMetronomeLoop();
        }
    } catch (err) {
        console.error("Error starting metronome:", err);
        alert("Could not start metronome. Please try again.");
    }
}

// Start the actual metronome loop
function startMetronomeLoop() {
    isPlaying = true;
    currentBeat = 0;
    
    // Get the number of beats in the current pattern
    const numBeats = currentPattern ? currentPattern.numBeats : 4;
    console.log(`Pattern has ${numBeats} beats`);
    
    // Calculate interval in milliseconds from BPM
    const interval = (60 / tempo) * 1000;
    console.log(`Starting metronome at ${tempo} BPM (${interval}ms interval)`);
    
    // Start the metronome loop
    metronomeInterval = setInterval(() => {
        try {
            const now = audioContext.currentTime;
            
            // Determine if this is the first beat (accent)
            const isFirstBeat = currentBeat === 0;
            
            // Play the cowbell sound
            playCowbell(now, isFirstBeat);
            
            // Highlight active notes for the current beat
            highlightActiveNotes(currentBeat);
            
            // Log for debugging
            console.log(`Beat: ${currentBeat + 1} of ${numBeats}`);
            
            // Increment beat counter using the actual number of beats in the pattern
            currentBeat = (currentBeat + 1) % numBeats;
        } catch (err) {
            console.error("Error in metronome loop:", err);
        }
    }, interval);
    
    // Update UI
    metronomeStartBtn.disabled = true;
    metronomeStopBtn.disabled = false;
}

// Stop metronome
function stopMetronome() {
    if (!isPlaying) return;
    
    clearInterval(metronomeInterval);
    isPlaying = false;
    
    // Reset highlighting
    resetNoteHighlighting();
    
    // Update UI
    metronomeStartBtn.disabled = false;
    metronomeStopBtn.disabled = true;
}

// Highlight active notes for the current beat
function highlightActiveNotes(beatIndex) {
    // First, remove any existing highlighting
    resetNoteHighlighting();
    
    // Get all cells for the current beat column (beatIndex + 2 because of header cell)
    const beatColumn = beatIndex + 2;
    
    try {
        // Get RH and LH cells for this beat
        const rhCell = document.querySelector(`.row.header-row .cell:nth-child(${beatColumn})`);
        const lhCell = document.querySelector(`.row:not(.header-row) .cell:nth-child(${beatColumn})`);
        
        if (!rhCell || !lhCell) {
            console.warn(`Could not find cells for beat ${beatIndex + 1}`);
            return;
        }
        
        // Always highlight the current beat column, regardless of active/inactive
        rhCell.classList.add('current-beat');
        lhCell.classList.add('current-beat');
        
        console.log(`Highlighting beat ${beatIndex + 1}`);
        
        // For debugging
        console.log(`RH beat ${beatIndex + 1} is ${rhCell.classList.contains('active') ? 'active' : 'inactive'}`);
        console.log(`LH beat ${beatIndex + 1} is ${lhCell.classList.contains('active') ? 'active' : 'inactive'}`);
    } catch (err) {
        console.error("Error highlighting notes:", err);
    }
}

// Reset note highlighting
function resetNoteHighlighting() {
    const highlightedCells = document.querySelectorAll('.current-beat');
    highlightedCells.forEach(cell => cell.classList.remove('current-beat'));
}

// Event Listeners
let currentPattern;
let currentFilename;

// Update difficulty value display
difficultySlider.addEventListener('input', function() {
    difficultyValue.textContent = this.value;
});

// Update tempo value display
tempoSlider.addEventListener('input', function() {
    tempo = parseInt(this.value);
    tempoValue.textContent = tempo;
    
    // If metronome is playing, restart with new tempo
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
});

// Metronome start button
metronomeStartBtn.addEventListener('click', startMetronome);

// Metronome stop button
metronomeStopBtn.addEventListener('click', stopMetronome);

// Generate new pattern
generateBtn.addEventListener('click', function() {
    const difficulty = difficultySlider.value;
    currentPattern = generatePattern(difficulty);
    updateUI(currentPattern);
    currentFilename = generateFilename(currentPattern);
});

// Save image
saveBtn.addEventListener('click', function() {
    if (!currentPattern) {
        // Generate a pattern first if none exists
        const difficulty = difficultySlider.value;
        currentPattern = generatePattern(difficulty);
        updateUI(currentPattern);
        currentFilename = generateFilename(currentPattern);
    }
    saveAsImage();
});

// Save as JSON
saveJsonBtn.addEventListener('click', function() {
    saveAsJson();
});

// Pattern name input
patternNameInput.addEventListener('input', function() {
    patternName = this.value;
    updatePatternTitle();
});

// Pattern comments input
patternCommentsInput.addEventListener('input', function() {
    userComments = this.value;
});

// Load pattern button
loadPatternBtn.addEventListener('click', function() {
    loadPatternInput.click();
});

// Load pattern file input
loadPatternInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const loadedData = JSON.parse(e.target.result);
            loadPatternFromJson(loadedData);
        } catch (error) {
            alert('Error loading pattern: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be loaded again if needed
    this.value = '';
});

// Initialize with a pattern on page load
window.addEventListener('DOMContentLoaded', function() {
    // Check if initialDifficulty was passed from server
    if (window.initialDifficulty !== undefined) {
        // Set the difficulty slider to the value from command line
        difficultySlider.value = window.initialDifficulty;
        difficultyValue.textContent = window.initialDifficulty;
        console.log(`Using difficulty from command line: ${window.initialDifficulty}`);
    }
    
    const difficulty = difficultySlider.value;
    currentPattern = generatePattern(difficulty);
    updateUI(currentPattern);
    currentFilename = generateFilename(currentPattern);
    updatePatternTitle();
    
    // Initialize tempo
    tempo = parseInt(tempoSlider.value);
    tempoValue.textContent = tempo;
});
