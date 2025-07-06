+++
date = "2015-11-26T02:37:00-06:00"
draft = false
title = "Mario Typer: Rewriting a Buggy OBJ Parser for 3D Games"
# original_title = "Mario Typer: How I Rewrote a Buggy .OBJ Parser for my 3D Game in OpenGL"
tags = ["3D Graphics", "C++", "Computer Graphics", "Education", "Game Development", "Open Source", "Programming"]
categories = ["Academic", "Games", "Project"]
thumbnail = "http://img.youtube.com/vi/I_i6VN_9p4s/maxresdefault.jpg"
summary = "A 3D typing game inspired by Ztype and Super Mario 64, featuring Mario fighting Boo ghosts by typing words, with a detailed account of fixing critical bugs in the provided OBJ parser library to support custom 3D models."
+++

| | |
| --- | --- |
| **Timeline:** | Nov 21-26, 2015 |
| **Languages Used:** | C++ (OpenGL) |
| **School:** | AIT at Budapest University of Technology and Economics |
| **Course:** | CP360 Computer Graphics |

## Watch the Demo

{{< youtube I_i6VN_9p4s >}}

I've always loved typing games. My favorite is [Ztype](http://zty.pe/), which you can play directly in your browser. It's a little sad how many hours I've spent playing this game. Mario Typer, a simple PC game I made in a weekend for my Computer Graphics course at AIT-Budapest, is heavily inspired by Ztype, as well as the cult classic *Super Mario 64*, obviously. Nintendo, if you're reading this, please don't sue me!

![nothing to see here](https://media.giphy.com/media/13d2jHlSlxklVe/giphy.gif)

Phew, now that they've left, I can give you the lowdown.
The concept of Mario Typer is pretty simple. You play as Mario, who remains centered between 4 Boo portals. When the game starts, Boos (the not-so-friendly white ghosts) start to pseudo-randomly emerge from any or all of the 4 portals and fly toward Mario. As Mario, you must constantly watch your back by turning around with the arrow keys to face the Boos in combat. Your goal is to type the word above each Boo in order to throw a fireball at it and kill it before it gets to you! Sounds easy enough, but beware: as the game progresses, Boos begin to emerge more frequently and fly more quickly, and the words get longer. Lastly, Mario Typer, unlike Ztype, is in 3D! That's right: I've **added a whole 'nother dimension**, making my game at least 1.4 times as fun to play as Ztype.

In all seriousness, the 3D rendering in this game was pretty much plug-and-play, since the code that renders the 3D models was written by someone else and given to us openly by the professor in a handy-dandy "black box" rendering library consisting of 3-4 C++ files. I know, disappointing, I got to skip all the actual hard stuff... Weeeelll actually, not quite.
I *actually read* and modified a bunch of the code in this library. "Why?", you may ask. After all, doing so was way beyond the requirements of the project. Well, as you may already suspect, **I found a major bug in the library and decided I should fix it myself.**

![noice](https://media.giphy.com/media/8Odq0zzKM596g/giphy.gif)

The bug in the code came to my attention because, although it was not required, I wanted to use custom .OBJ files downloaded from the internet, like Mario! The professors lovingly provided us with a couple .OBJ files of Tigger and a Honey Pot, but I wanted to be a little more creative. It was not long before I realized that most of the .OBJ files I downloaded caused the game to crash with an **EXC_BAD_ACCESS** error in the `Mesh.cpp` file (one of the files included in the library), whereas the Tigger and Honeypot .OBJ files worked flawlessly. However, after successfully opening the Mario.OBJ file in Blender, I knew the ones I downloaded were not corrupt.

So, as any good programmer would, I dove head-first into the `Mesh.cpp` file, simply because I knew it was responsible for creating 3D meshes from .OBJ files. After about 3 hours of work, not only did I determine the bugs in the original source code I was provided, but I also rewrote the code to work for any .OBJ file, even those downloaded from the internet. I also made the code much more human-readable, yay for comments!

How did I identify and fix the bug, you ask? Well, the first step was [Wikipedia](https://en.wikipedia.org/wiki/Wavefront_.obj_file), obviously. I first had to learn the format of .OBJ files and how to parse them, which was how I determined the bug in the first place. As it turns out, .OBJ's are pretty simple to understand. Here's what one looks like if you open it in a text editor:

```
v -0.022586 -0.100712 -1.022910
vn -0.109723 -0.132262 -0.985123
v -0.036037 -0.073920 -1.026823
vn -0.026845 -0.311611 -0.949830
"¦
vt 0.121094 0.974609
vt 0.110412 0.994141
"¦
f 2436/7843/2436 2437/7844/2437 2438/7845/2438
f 2433/7840 2434/7841 2435/7842
f 2439/7846/2439 2440/7847/2440 2441/7848/2441
```
And here's what it means:

- Lines that start with  `v` are vertices.
- Lines that start with  `vn` are vertex normals.
- Lines that start with  `vt` are texture coordinates.
- Lines that start with  `f` are faces.

There are some other optional line types as well, like `vp`, but this is mostly all you need to know. For the most part, the way these lines are formatted is fairly standard. Since .OBJ's always represent 3D objects, vertices will typically have 3 coordinates (3 numbers after the `v`). Same goes for vertex normals (`vn`). Texture coordinates (`vt`) correspond to 2D uv maps, so these typically have 2 coordinates. But there is one exception: faces (lines that start with `f`). According to Wikipedia:

> Faces are defined using **lists of vertex, texture and normal indices**.
Each item in the list usually comes in the format `%d/%d/%d` (position/texture/normal), as you can see in the example I gave above. However, it's a bad idea to assume that this will always be the case, which is exactly the mistake that was made in the original code of the `Mesh.cpp` file. In actuality, it's not uncommon for faces to be described without a value for the texture index or for the normal index, so they can look like this: `%d/%d` (position/texture), or like this: `%d//%d` (position//normal), and the .OBJ file will still be completely valid. Moreover, different faces in the same .OBJ file can use different formats. Even though it's nice to know about textures and normal vectors, this information is not required to simply define a face. Besides, giving texture and normal indices for every face would be quite redundant in some cases, especially if the texture mapping is less detailed than the mesh. This was the first order of business when I was correcting the mistakes in the code.

The other incorrect assumption made by the `Mesh.cpp` file, though far less fatal, was that faces would always have either 3 or 4 components in the list of vertex, texture, and normal indices. In other words, it **assumed that faces are always either triangles or quadrilaterals** (quads). But, you see, much like dinosaurs, .OBJ files come in all different shapes and sizes. The 3D objects they represent can be made up of triangles, quads, and, while uncommon, even higher-order polygons like pentagons.

![undefined](../../images/mario-typer/screenshot.png)

So, just for fun, I made sure .OBJ files with **pentagonal** faces could also be successfully rendered from the code. Good luck finding a mesh that uses them, though. If you're interested, you can view the old code, and the changes I made to it, in the github repo linked below. The old file is aptly named `Mesh-old.cpp`.

- [View on Github](https://github.com/dinosoeren/MarioTyper)

Have anything to add? I left out some of the details of .OBJ's on purpose, but if you think there's something important I forgot to mention, please let me know in the comments.
