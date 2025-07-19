---
date: '2015-03-11T02:58:41-06:00'
draft: false
title: Real-Time Multi-User Drawing App with Node.js
slug: collaborative-canvas
tags:
- Education
- HTML/CSS
- JavaScript
- Open Source
- Programming
- Web Design
categories:
- App
- Academic
- Project
- Web
thumbnail: /project/collaborative-canvas/images/featured.gif
toc: true
summary: A weekend project creating a real-time collaborative drawing web app using
  Node.js, featuring pixel-level synchronization across multiple devices with conflict
  resolution based on recency of user actions.
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

{{< github-button url="https://github.com/dinosoeren/collaborative-canvas" >}}

Without using websockets or anything of the sort, this application synchronizes a drawing canvas across two or more devices almost instantaneously, while gracefully resolving conflicts individually on each pixel, by prioritizing [recency](http://jhigh.co.uk/Higher/expert_systems/conflict_resolution.html) of each user's paint instruction. How? Glad you asked. Well, to start, it's arguably very memory inefficient. But remember, for a weekend project, it's speed of implementation that really counts.

{{< figure src="images/screenshot.png" alt="Screenshot of collaborative canvas app" caption="Side by side view of two clients communicating bidirectionally across one server" >}}

## Client-Side Operations
In order to more easily understand these operations, it's best to think of each client's canvas as a child, and the server's canvas as the parent, where the parent reflects the "real" current state of the canvas.

### Painting on the Child Canvas
We completed this project so quickly by first choosing to create a "canvas" which is actually an HTML `` element, made up of thousands of tiny cells, each representing a pixel with a simple `background-color` CSS attribute. A painted pixel is just a cell with a non-transparent background color, while a blank pixel is a cell with a transparent background color. On mouse-click, a certain number of cells (determined by the current brush size) around the active cell are all painted the color of the currently selected brush.

### Polling for Pixels
On the client-side, the browser sends an XHR request to the server every 500 milliseconds (this is called **polling**) for an updated version of the parent canvas. Regardless of whether any changes have been made, the server will respond to the client with a JSON object containing an array of more objects representing the table's thousands of cells (thus the aforementioned memory inefficiency; remember that this occurs a couple times per second). Upon receiving this response, the client immediately updates the color of every single cell on the local child canvas, corresponding directly to the colored cells in the array sent by the server.

### Listening to Changes
Meanwhile, the client employs *event listeners* to wait for input (clicks) from the user, and updates pixels on the child canvas accordingly in real-time (i.e. without client-server communication.) The client keeps track of all the changes being made locally to the canvas, via a dynamic array (`changed_cells_array`) containing only altered "pixels" (JSON objects with `x`, `y`, and `color` properties).

Additionally, every 100 milliseconds, the client will (in a sense) poll itself, to determine whether or not anything has changed on its child canvas. If the local `changed_cells_array` contains any objects (meaning those corresponding pixels have been somehow locally altered since the last request), then the client sends an XHR to the server containing this array of ONLY altered pixels (as opposed to all pixels in the table) in the form of a JSON object.

### Pixel Conflict Resolution
At any point during the user experience - particularly when the user makes a long brush stroke - it is entirely possible that the following scenario will occur:

> During the time period between the `mousedown` event and the `mouseup` event, the client has requested and received an updated parent canvas from the server which contains new color values for the same cells **currently being painted over** by the user. In other words, in the current brushstroke, the user has painted Cell [43, 586] **green**, but at some point during the brushstroke (perhaps even after said pixel has been painted), the server has informed the client that Cell [43, 586] should be painted **blue** in accordance with another user's changes.

These events can occur in any order, and to more than one cell simultaneously. How does the client know what to do? Can it choose between green and blue in a *predictable* way? Or does it just crash?

Thankfully, it does not crash. In accordance with our rules of prioritizing recency, if the client's child canvas contains local cells which are currently being manipulated by the user, then the client will **not** apply the server's changes to those cells until the `mouseup` event has fired, signaling the end of the user's brushstroke.

Remember the `changed_cells_array`? This array is only ever filled with the altered cells after the brushstroke ends. This ensures that every time the server asks for altered cells *during* a brushstroke, this array will always be empty, and therefore nothing will change in the parent canvas on the server. Once the stroke ends, however, the array is updated and the changes are echoed to the parent canvas and all its children.

This delayed response is important for two reasons:

1. All cells currently being changed but not yet inserted into the `changed_cells_array` take priority over changes from the server, because they are considered more **recent**.
2. If two or more clients manipulate the same cells at the same time, the client who waits the longest to end the brushstroke with a `mouseup` event is the "winner."

## Server-Side Operations
### The Parent Canvas
Similar to `changed_cells_array`, the parent canvas on the server is nothing more than an array of objects corresponding to pixels, each with three properties (`x`, `y`, and `
