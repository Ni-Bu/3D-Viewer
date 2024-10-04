# 3D Apollo Module Viewer

This project is a simple 3D viewer application that displays an Apollo module using Three.js. It allows users to interact with the 3D model through various controls and features a realistic environment with custom lighting and a textured ground plane.

## Features

-   3D rendering of an Apollo module
-   Interactive camera controls (orbit, pan, zoom)
-   Custom lighting setup for realistic rendering
-   Textured grass ground plane
-   Zoom in/out buttons
-   Scrollwheel zoom toggle
-   Reset view functionality
-   Shadow rendering for enhanced realism

## Prerequisites

To run this project, you need:

-   A modern web browser with WebGL support
-   A local web server (e.g., Live Server extension for VS Code)

## Project Structure

-   `viewer.html`: The main HTML file
-   `viewer.js`: The JavaScript file containing the Three.js implementation
-   `viewer.css`: The CSS file for styling
-   `model/apollo_exterior-150k-4096.gltf`: The 3D model file of the Apollo module
-   `textures/grass.jpg`: Texture file for the ground plane
-   `threeJs/`: Directory containing Three.js library and addons

## Setup and Running

1. Ensure all project files are in the correct directory structure.
2. Open the project folder in Visual Studio Code.
3. Install the "Live Server" extension for VS Code if you haven't already:
    - Go to the Extensions view (Ctrl+Shift+X)
    - Search for "Live Server"
    - Click "Install" for the extension by Ritwick Dey
4. Once installed, right-click on the `viewer.html` file in the VS Code file explorer.
5. Select "Open with Live Server" from the context menu.
6. Your default web browser should open automatically, displaying the 3D viewer.

If you're not using VS Code, you can use any other local web server of your choice to serve the project files.

## Usage

-   Use the mouse to orbit around the model:
    -   Left-click and drag to rotate
    -   Right-click and drag to pan
    -   Scroll to zoom (when enabled)
-   Click and hold the "Zoom In" button to zoom in
-   Click and hold the "Zoom Out" button to zoom out
-   Click "Reset View" to return to the default camera position
-   Toggle "Scrollwheel zoom" to enable/disable zooming with the mouse wheel

## Customization

-   Adjust lighting in the `setupLighting()` function
-   Modify ground plane texture and size in the plane creation section
-   Change model scaling and positioning in the model loading section

## Credits

-   Grass texture sourced from [threex.grassground](https://github.com/jeromeetienne/threex.grassground/blob/master/images/grasslight-big.jpg)
-   Apollo module 3D model sourced from [Smithsonian 3D](https://3d.si.edu/object/3d/command-module-apollo-11:d8c6457e-4ebc-11ea-b77f-2e728ce88125)
