# Piano Rhythm Generator

A simple JavaScript tool for generating piano practice rhythm exercises for both left and right hands.

## Overview

This tool helps pianists practice coordination between left and right hands by generating visual rhythm patterns. Each pattern shows which beats should be played with each hand, following basic music theory principles.

## Features

- **Visual Rhythm Display**: Clear grid showing active and inactive beats for both hands
- **Theory-Based Patterns**: Generates patterns following music theory principles
- **Adaptive Grid Length**: Grid length increases with difficulty level (4-8 beats)
- **Difficulty Levels**: Adjustable difficulty from beginner to advanced
- **Pattern Naming**: Name your patterns for easy identification
- **Comments**: Add notes and practice tips to your patterns
- **Save Options**: Export patterns as images or JSON files
- **Load Patterns**: Load previously saved patterns from JSON files
- **Metronome**: Built-in metronome with adjustable tempo and cowbell sound

## How to Use

### Option 1: Direct File Opening
1. Open `index.html` directly in any modern web browser
2. Adjust the difficulty slider to your preferred level
3. Click "Generate New Pattern" to create a new rhythm exercise
4. Name your pattern and add any helpful comments
5. Practice the displayed pattern on your piano
6. Save the pattern as an image or JSON file for later practice
7. Load previously saved patterns using the "Load Pattern" button

### Option 2: Using the Node.js Server (Recommended)
1. Make sure you have Node.js installed on your computer
2. Open a terminal/command prompt in the project directory
3. Run the command: `node server.js`
4. Open your browser and navigate to: `http://localhost:3000`
5. The application will run on this unique URL
6. Use the controls as described above
7. Press Ctrl+C in the terminal to stop the server when finished

## Pattern Difficulty Levels

- **Level 1**: Basic alternating hand patterns (4 beats)
- **Level 2**: Simple complementary patterns (6 beats)
- **Level 3**: Patterns with some overlapping beats and syncopation (8 beats)
- **Level 4**: More complex coordination patterns (10 beats)
- **Level 5**: Advanced polyrhythms for experienced players (12 beats)

## Pattern Management

### Saving Patterns
- **Save as Image**: Captures the current pattern as a PNG image
- **Save as JSON**: Saves the pattern data in JSON format, including:
  - Pattern name
  - Difficulty level
  - Number of beats
  - Active/inactive beats for both hands
  - Your comments
  - Timestamp

### Metronome
- **Adjustable Tempo**: Set the tempo from 40 to 208 BPM
- **Cowbell Sound**: Distinctive cowbell sound with accent on the first beat
- **Visual Feedback**: Active notes are highlighted as the metronome plays
- **Simple Controls**: Start and stop buttons for easy operation

### Loading Patterns
1. Click the "Load Pattern" button
2. Select a previously saved JSON file
3. The pattern will be loaded with all its properties:
   - The grid will display the saved beat pattern
   - Difficulty level will be restored
   - Pattern name and comments will be populated

## JSON Format

Saved patterns use the following JSON structure:

```json
{
  "name": "Pattern Name",
  "difficulty": 3,
  "numBeats": 6,
  "pattern": {
    "rh": [true, false, true, true, false, true],
    "lh": [true, true, false, false, true, false]
  },
  "comments": "Your practice notes and comments go here",
  "timestamp": "2025-03-08T10:15:30.000Z"
}
```

## Technical Details

Built with vanilla JavaScript, HTML, and CSS. Uses the html2canvas library for image export functionality.

## Files

- `index.html`: Main application page
- `styles.css`: Styling for the application
- `script.js`: JavaScript logic for pattern generation and UI
- `server.js`: Simple Node.js server for running the application on a unique URL

## Future Enhancements

Potential future features:
- Audio playback of patterns
- Additional time signatures beyond 4/4
- Custom pattern creation
- Pattern library to save favorite exercises
