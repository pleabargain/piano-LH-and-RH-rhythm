# Piano Rhythm Generator - Implementation Rules

## Project Overview
This document outlines the rules and guidelines for implementing a web-based tool that generates piano rhythm exercises displaying active and inactive beats for left and right hands in a 4-beat grid format.

## Core Requirements

### Visual Display
1. Create a grid layout with 2 rows (RH and LH) and variable number of columns (beats)
2. Active beats must be displayed in black text
3. Inactive beats must be displayed in gray text
4. Display exercise number (e.g., "#1") before the grid
5. Grid length should increase with difficulty level (4-8 beats)

### Pattern Generation
1. Generate patterns based on music theory principles
2. Start with simple patterns at lower difficulty levels
3. Implement these pattern types in order of increasing difficulty:
   - Level 1: Alternating hands (4 beats)
   - Level 2: Simple complementary patterns (5 beats)
   - Level 3: Some syncopation with occasional overlapping beats (6 beats)
   - Level 4: More complex coordination patterns (7 beats)
   - Level 5: Advanced polyrhythms (8 beats)

### User Interface
1. Include a "Generate New Pattern" button
2. Implement a difficulty slider with 5 levels
3. Add a "Save Image" button that exports the current pattern
4. Saved image filenames must include active RH and LH beat numbers (e.g., "RH_1_3_LH_2_4.png")

## Technical Specifications

### HTML Structure
1. Create a responsive container for the application
2. Include sections for:
   - Title/header
   - User controls (buttons and slider)
   - Single rhythm display grid with dynamic beat cells
3. Add proper semantic HTML elements and accessibility attributes

### CSS Requirements
1. Style the grid to match the example image
2. Use a clean, readable font for numbers and labels
3. Implement responsive design for different screen sizes
4. Use CSS Grid or Flexbox for layout
5. Style active/inactive beats with appropriate colors

### JavaScript Implementation
1. Create a modular structure with separate functions for:
   - Pattern generation
   - Grid cell creation
   - UI rendering
   - User interaction handling
   - Image export

2. Pattern Generation Algorithm:
   - Function must accept difficulty level as input
   - Output should be an object with RH and LH active beats and number of beats
   - Patterns must follow music theory rules for the given difficulty
   - Grid length should increase with difficulty level
   - Ensure variety by implementing multiple pattern options per difficulty level

3. Image Export:
   - Use HTML5 Canvas to convert the grid to an image
   - Generate filename based on active beats in pattern
   - Implement browser download functionality

## Implementation Details

### Pattern Generation Logic
The core of the application is the pattern generation algorithm. Here's how to implement it:

1. Create a function that takes difficulty level (1-5) as input
2. Calculate number of beats based on difficulty (4-8 beats)
3. Initialize arrays for RH and LH beats (active/inactive) with the appropriate length
4. Based on difficulty level, set specific beats as active following these rules:
   - For beginner patterns, use simple alternating hands
   - For intermediate patterns, use complementary rhythms
   - For advanced patterns, use more complex polyrhythms
5. Add some randomization to create variety in patterns
6. Return an object containing the generated pattern and number of beats

### UI Update Logic
To update the UI with the generated pattern:

1. Create grid cells dynamically based on the number of beats
2. Get references to all grid cells
3. For each cell, set its class to 'active' or 'inactive' based on the pattern

### Image Export Logic
For saving the pattern as an image:

1. Use the html2canvas library to capture the grid as an image
2. Generate a filename based on the active beats in the pattern
3. Create a download link and trigger it programmatically

## Code Style Guidelines
1. Use vanilla JavaScript (no external libraries except for image export)
2. Follow consistent naming conventions
3. Include comments explaining the pattern generation logic
4. Implement error handling for user interactions
5. Keep code simple and readable
