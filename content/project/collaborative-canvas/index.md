---
date: 2015-03-11T02:58:41-06:00
draft: false
title: Real-Time Multi-User Drawing App with Node.js
slug: collaborative-canvas
summary: A weekend project creating a real-time collaborative drawing web app
  using Node.js, featuring pixel-level synchronization across multiple devices
  with conflict resolution based on recency of user actions.
thumbnail: /project/collaborative-canvas/images/featured.webp
images:
  - /project/collaborative-canvas/images/featured.webp
categories:
  - App
  - Academic
  - Project
  - Web
tags:
  - Education
  - HTML/CSS
  - JavaScript
  - OpenSource
  - Programming
  - WebDesign
toc: true
---
{{< project-details 
  timeline="May 8-13, 2015" 
  languages="JavaScript (Node.js), HTML, CSS" 
  school="Colorado College" 
  course="CP215 Application Design" 
>}}

## Watch the Demo

{{< youtube _3YCofUo3Q4 >}}

Ever wanted to draw online together with your friends? This app is perfect for that! ... but not much else. It doesn't even have a function to save/download the masterpieces you create, let alone do most things expected of sophisticated drawing applications these days.

Why not? This app was both an experiment in node.js, as well as my collaborative final project for my CP215 Application Design class. So essentially, it was made in a weekend by two people. But that's not to say it isn't a noteworthy project!

{{< github-button 
  url="https://github.com/dinosoeren/collaborative-canvas" 
>}}

Without using websockets or anything of the sort, this application synchronizes a drawing canvas across two or more devices almost instantaneously, while gracefully resolving conflicts individually on each pixel, by prioritizing [recency](http://jhigh.co.uk/Higher/expert_systems/conflict_resolution.html) of each user's paint instruction. How? Glad you asked. Well, to start, it's arguably very memory inefficient. But remember, for a weekend project, it's speed of implementation that really counts.

{{< figure src="images/screenshot.png" alt="Screenshot of collaborative canvas app" caption="Side by side view of two clients communicating bidirectionally across one server">}}

## Client-Side Operations

In order to more easily understand these operations, it's best to think of each client's canvas as a child, and the server's canvas as the parent, where the parent reflects the "real" current state of the canvas.

### Painting on the Child Canvas

We completed this project so quickly by first choosing to create a "canvas" which is actually an HTML `` element, made up of thousands of tiny cells, each representing a pixel with a simple `background-color` CSS attribute. A painted pixel is just a cell with a non-transparent background color, while a blank pixel is a cell with a transparent background color. On mouse-click, a certain number of cells (determined by the current brush size) around the active cell are all painted the color of the currently selected brush.

The `setupTable` function in `paint_client.js` is responsible for dynamically building this HTML table structure:

```javascript
// From paint_client.js
function setupTable()
{
  table = document.getElementById("tbody");
  for(var i = 0; i < canvas_size; i++)
  {
    var rowArray = [];
    var row = document.createElement("tr");
    for (var j = 0; j < canvas_size; j++)
    {
      var cell = document.createElement("td");
      cell.x = i; // Custom property to store X coordinate
      cell.y = j; // Custom property to store Y coordinate
      cell.lastUpdated = new Date().getTime(); // Timestamp for conflict resolution
      cell.style.backgroundColor = "#ffffff"; // Default background color (white)
      row.appendChild(cell);
      rowArray.push(cell);
    }
    table.appendChild(row);
    tableArray.push(rowArray); // Stores references to actual DOM cells
  }
}
```

When a user clicks or drags, the `clickCell` function is triggered. It iterates through the cells within the brush's radius and updates their `backgroundColor` and `lastUpdated` timestamp directly on the client's DOM:

```javascript
// From paint_client.js, within clickCell function
for(var i=0; i<pen_size/2; i++) {
  for(var j=0; j<pen_size/2; j++) {
    var cellIndex = x + (pen_size/4 - i);
    var rowIndex = y + (pen_size/4 - j);
    try {
      var tableCell = tableArray[rowIndex][cellIndex];
      tableCell.style.backgroundColor = c; // Apply selected pen color
      tableCell.lastUpdated = new Date().getTime(); // Mark last local update time
      if(clickedCells.indexOf(tableCell) === -1)
      {
        clickedCells.push(tableCell); // Add to a temporary array of currently clicked cells
      }
    } catch(e) {
      console.log("Error: Couldn't paint cell ["+rowIndex+", "+cellIndex+"]:"+e);
    }
  }
}
```

### Polling for Pixels

On the client-side, the browser sends an XHR request to the server every 500 milliseconds (this is called **polling**) for an updated version of the parent canvas. Regardless of whether any changes have been made, the server will respond to the client with a JSON object containing an array of more objects representing the table's thousands of cells (thus the aforementioned memory inefficiency; remember that this occurs a couple times per second). Upon receiving this response, the client immediately updates the color of every single cell on the local child canvas, corresponding directly to the colored cells in the array sent by the server.

The client's polling mechanism is implemented in the `pollColors` function:

```javascript
// From paint_client.js
function pollColors()
{
  var request_colors = new XMLHttpRequest();
  request_colors.startTime = new Date().getTime(); // Record request start time for recency check
  request_colors.onload = colorsListener; // Callback when response is received
  request_colors.open( "get", "get_changed_cells" ); // Request all cells from the server
  request_colors.send();
}
```

On the server side, the `sendChangedCells` function simply serializes and sends the entire `canvas` array:

```javascript
// From paint_server.js
function sendChangedCells(req, res)
{
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(canvas)); // Sends the entire server's canvas state
}
```

### Listening to Changes

Meanwhile, the client employs *event listeners* to wait for input (clicks) from the user, and updates pixels on the child canvas accordingly in real-time (i.e. without client-server communication.) The client keeps track of all the changes being made locally to the canvas, via a dynamic array (`changed_cells_array`) containing only altered "pixels" (JSON objects with `x`, `y`, and `color` properties).

Additionally, every 100 milliseconds, the client will (in a sense) poll itself, to determine whether or not anything has changed on its child canvas. If the local `changed_cells_array` contains any objects (meaning those corresponding pixels have been somehow locally altered since the last request), then the client sends an XHR to the server containing this array of ONLY altered pixels (as opposed to all pixels in the table) in the form of a JSON object.

The `sendColors` function is responsible for gathering and sending these local changes to the server:

```javascript
// From paint_client.js
function sendColors()
{
  if(changedCells.length > 0) {
    var url = "change_cells?";
    // Loop through all locally changed cells and append them to the URL query string
    for(var i=0; i<changedCells.length; i++) {
      var cell = changedCells[i];
      var newData = "c"+i+"="+cell.x+"-"+cell.y+"-"+pen_color+"&"; // Format: c0=x-y-color
      url += newData;
    }
    changedCells = []; // Clear the array after preparing to send
    var send_change = new XMLHttpRequest();
    send_change.open("get", url);
    send_change.send();
  }
}
```

### Pixel Conflict Resolution

At any point during the user experience - particularly when the user makes a long brush stroke - it is entirely possible that the following scenario will occur:

> During the time period between the `mousedown` event and the `mouseup` event, the client has requested and received an updated parent canvas from the server which contains new color values for the same cells **currently being painted over** by the user. In other words, in the current brushstroke, the user has painted Cell \[43, 586] **green**, but at some point during the brushstroke (perhaps even after said pixel has been painted), the server has informed the client that Cell \[43, 586] should be painted **blue** in accordance with another user's changes.

These events can occur in any order, and to more than one cell simultaneously. How does the client know what to do? Can it choose between green and blue in a *predictable* way? Or does it just crash?

Thankfully, it does not crash. In accordance with our rules of prioritizing recency, if the client's child canvas contains local cells which are currently being manipulated by the user, then the client will **not** apply the server's changes to those cells until the `mouseup` event has fired, signaling the end of the user's brushstroke.

Remember the `changed_cells_array`? This array is only ever filled with the altered cells after the brushstroke ends. This ensures that every time the server asks for altered cells *during* a brushstroke, this array will always be empty, and therefore nothing will change in the parent canvas on the server. Once the stroke ends, however, the array is updated and the changes are echoed to the parent canvas and all its children.

This delayed response is important for two reasons:

1. All cells currently being changed but not yet inserted into the `changed_cells_array` take priority over changes from the server, because they are considered more **recent**.
2. If two or more clients manipulate the same cells at the same time, the client who waits the longest to end the brushstroke with a `mouseup` event is the "winner."

The `colorsListener` function on the client side incorporates this conflict resolution logic:

```javascript
// From paint_client.js, within colorsListener function
// This function runs when the client receives an updated canvas from the server.
function colorsListener()
{
  this.endTime = new Date().getTime(); // Time when server response was received
  var canvas = JSON.parse(this.responseText); // The server's full canvas state

  // ... (looping through canvas data)

          if(tableCell) {
            var currentColor = tableCell.style.backgroundColor;
            if(!colorsSame(currentColor, cellColor) && // If the colors are different
                this.startTime - tableCell.lastUpdated > 0 && // AND server update is more recent than local client's last paint
                changedCells.indexOf(tableCell) === -1 &&    // AND the cell is NOT queued to be sent to server
                clickedCells.indexOf(tableCell) === -1) {     // AND the cell is NOT currently being painted by the user

              changedCellCount++;
              tableCell.style.backgroundColor = cellColor; // Then, apply the server's change
            } else {
              // Otherwise, log a warning (or silently ignore):
              // The client's local change is more recent or in progress, so it takes priority.
              // console.log("Warning: Cell ["+i+", "+j+"] has been updated on the client more recently than the server. Won't overwrite.");
            }
          }
// ... (rest of function)
}
```

## Server-Side Operations

### The Parent Canvas

Similar to `changed_cells_array`, the parent canvas on the server is nothing more than an array of objects corresponding to pixels, each with three properties (`x`, `y`, and `color`).

The server maintains its "master" version of the canvas as a simple 2D JavaScript array, initialized with white pixels:

```javascript
// From paint_server.js
var CANVAS_SIZE = 200;

/* Multidimensional Array storing all columns and rows of colors in the table. */
var canvas = [];

function resetCanvas()
{
    canvas = [];
    for(var i=0; i<CANVAS_SIZE; i++)
    {
        canvas[i] = [];
        for(var j=0; j<CANVAS_SIZE; j++) {
            canvas[i][j] = "#ffffff"; // Initialize all cells to white
        }
    }
}
```

The main `serverFn` handles incoming HTTP requests and routes them based on the URL. This demonstrates how the server distinguishes between requests for the current canvas state, requests to change pixels, and requests to serve static files:

```javascript
// From paint_server.js
function serverFn(req,res)
{
    var filename = req.url.substring( 1, req.url.length );

    if(filename === "") {
        filename = "./index.html"; // Default to index.html for root requests
    }

    if(filename.indexOf("get_changed_cells") > -1) {
        sendChangedCells( req, res ); // Handle requests for the canvas state
    }
    else if(filename.indexOf("change_cells") > -1) {
        // Handle requests to update pixels
        var urlData = filename.split("change_cells")[1];
        if(urlData.indexOf("?") > -1) {
            getCellsFromUrl( urlData ); // Parse and apply incoming pixel changes
            serveFile( "./index.html", req, res ); // Then serve the main page
        } else {
            serveFile( "./index.html", req, res );
        }
    }
    else if(filename.indexOf("clear_canvas") > -1) {
        resetCanvas(); // Clear the server's canvas
        serveFile(filename, req, res);
    }
    else {
        serveFile(filename, req, res); // Serve other static files (HTML, JS, CSS)
    }
}
```

When a client sends changes via `change_cells`, the `getCellsFromUrl` function on the server parses the URL's query parameters and updates the server's `canvas` array accordingly:

```javascript
// From paint_server.js
/* Parse URL into an array of cells and update the server's canvas. */
function getCellsFromUrl( urlData )
{
    var queryData = urlData.split("?")[1];
    var fields = queryData.split("&"); // Each field represents a changed cell (e.g., "c0=x-y-color")
    for(var i=0; i<fields.length; i++) {
        var fieldSplit = fields[i].split("=");
        if(fieldSplit.length > 1) {
            var fieldValue = fieldSplit[1];
            var cellCoords = fieldValue.split("-"); // Splits x, y, and color
            if(cellCoords.length === 3) {
                var x = parseInt(cellCoords[0]);
                var y = parseInt(cellCoords[1]);
                var color = cellCoords[2];
                // Note: Actual implementation includes color parsing/conversion logic here
                try {
                    canvas[x][y] = color; // Update the server's parent canvas with the new color
                } catch(e) {
                    console.log("Error: Couldn't find specified cell from URL in the canvas.");
                }
            }
        }
    }
}
```

## Reflections & Lessons Learned

Developing Collaborative Canvas was an invaluable weekend project, especially in real-time web applications. Key lessons included:

* **Polling's Trade-offs:** XHR polling enabled rapid prototyping but quickly revealed severe inefficiency (sending 40,000 cells every 500ms). This underscored the necessity of robust real-time protocols like WebSockets for scalable production.
* **Complexity of Distributed State:** Synchronizing multiple clients and a central server is inherently difficult. Our "recency" conflict resolution and careful client-side state management (e.g., `clickedCells`) were pragmatic solutions to manage race conditions and ensure predictable behavior.
* **Prototype Speed vs. Performance:** Opting for quick implementation (HTML `<table>`, full canvas polls) over optimal performance highlighted the crucial balance between project constraints (weekend deadline) and ideal architectural choices.
* **Value of Granular Updates:** Sending only `changed_cells_array` to the server was a vital optimization, demonstrating significant bandwidth savings achieved by sending "deltas" rather than full state.
* **Mastering Event Lifecycle:** Managing `mousedown`, `mousemove`, and `mouseup` events was crucial. Delaying server updates until `mouseup` ensured continuous local brushstrokes were prioritized, improving responsiveness and user experience.

- - -

*Let me know in the comments if there's anything else you would have done differently!*
