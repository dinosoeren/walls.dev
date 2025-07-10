+++
date = "2015-11-28T06:16:51-06:00"
draft = false
title = "Raycaster: Rendering a Chessboard in C++ with Procedural Graphics"
tags = ["3D Graphics", "Computer Graphics", "C++", "Education", "Programming"]
categories = ["Academic", "Games", "Project"]
thumbnail = "/project/raytracing-engine/images/chessboard.png"
summary = "A custom raycaster built in C++ for a Computer Graphics course at AIT, featuring a procedurally textured chessboard and complex chess pieces modeled with quadrics, glass, gold, gemstones, and procedural normal mapping."
toc = true
+++

{{< project-details
  timeline="Nov 10-24, 2015"
  languages="C++"
  school="AIT at Budapest University of Technology and Economics"
  course="CP360 Computer Graphics"
>}}

## Project Overview

For my major homework assignment in Computer Graphics at AIT, I built a raycaster in C++ that renders a full chessboard scene from scratch. The project was a deep dive into procedural texturing, quadric surfaces, and the magic of simulating light—one pixel at a time.

The assignment: create a physically plausible chessboard with all the pieces, each modeled and shaded to show off a variety of materials and rendering techniques. The result? A scene that looks like it belongs in a graphics textbook, but was actually the product of many late nights, a lot of debugging, and a little bit of stubbornness.

## Features Implemented

- **Procedural Chessboard:** An 8x8 checkerboard, each square procedurally textured so that adjacent squares are visually distinct (not just black and white). This was my first real taste of procedural graphics, and it was surprisingly satisfying to see the pattern emerge from pure math.
- **Pawns:** Modeled from a cone and a sphere, shaded with a plastic material using diffuse + Phong-Blinn BRDF. Simple, but effective.
- **Queen:** Built from clipped quadrics, including a hyperboloid for that classic slender waist. Rendered in reflective gold and silver—because why not go for a little bling?
- **Knights & Bishops:** Also constructed from clipped quadrics, but with a twist: procedural normal mapping. By perturbing the surface normals with gradients of procedural noise, I gave these pieces a bumpy, dented look. Knights are plastic, bishops are shiny gold/silver.
- **King:** The centerpiece—literally. Modeled with a paraboloid crown, made of glass, and both reflective and refractive. Getting the refractions right was a challenge, but seeing the king bend light like a real crystal was worth it.
- **Rooks:** Cylindrical, closed surfaces made of gemstone. These pieces reflect and refract light, with exponential attenuation as it passes through—so the deeper the light goes, the more it fades. (Think: a ruby or sapphire rook.)
- **Multi-bite Clipping:** Some pieces, like the queen’s crown, use quadric surfaces clipped by three or more clippers for extra detail.

## What I Didn’t Get To

- **Caustic King:** I didn’t have time to implement photon mapping for caustics (tracing rays from a light source through the king to the board), but it’s on my graphics bucket list.
- **Revolution Quadrics:** I also skipped assembling a piece from five revolution quadrics with C1 continuity. Maybe next time!

## Screenshots

{{< lightgallery glob="images/*.png" >}}

## Source Code

{{< github-button url="https://github.com/dinosoeren/raycaster" >}}

## Reflections

This project was a crash course in both the beauty and the pain of computer graphics. I learned more about light, materials, and geometry in two weeks than I thought possible. Debugging ray-object intersections at 2am is a special kind of fun, but there’s nothing quite like seeing a glass king refract a pawn for the first time.

If you’re curious about the code or want to see more, check it out above! And if you’re ever tempted to write your own raycaster from scratch, my advice: do it. Just keep lots of coffee on hand.
