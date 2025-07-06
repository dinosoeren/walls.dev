+++
date = "2015-06-23T14:00:09-06:00"
draft = false
title = "Arduino Robot Solves Mazes Using Subsumption Architecture"
# original_title = "Arduino-Powered Robot Solves a Maze Using Subsumption Architecture in C"
tags = ["Education", "Game Development", "Open Source", "Programming", "Hardware", "Robotics"]
categories = ["Academic", "Games", "Robots", "Project"]
thumbnail = "images/arduino-robot/featured.jpg"
+++

| | |
| --- | --- |
| **Timeline:** | April-May, 2015 |
| **Languages Used:** | C |
| **School:** | Colorado College |
| **Course:** | CP248 Introduction to Robotics |

## Watch the Demo

{{< youtube zHynd7FIxx0 >}}


My robot, lovingly named **Pyat** after a certain [Warlock](http://gameofthrones.wikia.com/wiki/Pyat_Pree), had never seen this particular maze before solving it, and it didn't anticipate the maze's - admittedly simple - structure. Pyat was able to complete the whole thing from start to finish using little more than some basic encoded behaviors. It's programmed to complete any maze (theoretically), but unlike other robots that simply [follow one wall](https://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower) to the end of the maze, Pyat uses a widely-known concept in robotics called **Subsumption Architecture** to navigate mazes in the same way that a human might.

When a person gets stuck in a maze, they very rarely have any idea what the maze looks like; otherwise they could just walk right out. So, how do you get out? Well, as I stated before, if the maze is [simply-connected](https://en.wikipedia.org/wiki/Simply_connected_space), you can just keep your hand on one wall and walk forward, and you'll eventually make it to the end. But let's assume you don't know that trick. If you want to make it out before you die of old age, the most important thing is to ensure you're not going in circles. One way to do this is to leave a trail of some sort - breadcrumbs, torches, red paint - whatever works. If you get to a dead end, just follow your trail back to the previous intersection and make a different choice. Repeat this, and eventually you'll find your way out. It may not be the most efficient strategy, but it gets the job done. This is exactly what Pyat is programmed to do.

For those of you wondering how I accomplished this, I independently built Pyat using servos and other basic electrical components, and programmed it in C over the course of a few weeks, for my Robotics class. If you want, [you can build one just like it](http://learn.parallax.com/ShieldRobot). It runs on an Arduino Microprocessor with the BOE (Board of Education) Shield, two IR sensors, and two front contact whiskers.

## How it works
Subsumption Architecture in its simplest form is just layered behaviors. Depending on specific input coming from its sensors, the robot will elevate to a higher behavior, or de-elevate to a lower behavior. Here's the architecture I defined for this robot:

![Soeren Walls Arduino Robot Maze Completion Subsumption Architecture Diagram](../../images/arduino-robot/architecture.png)

The architecture I've defined for Pyat in the above diagram is slightly more complex than others, due to its conditional structure. For example, the **Cruise** behavior cannot possibly subsume the **Return to wall** behavior or the **Return to intersection** behavior unless a wall or an intersection has previously been detected. If not, Pyat will continue to cruise indefinitely until its behavior is elevated by an event detected by the whiskers or IR sensors. Also, the **Follow the wall** behavior is completely different depending on whether or not one, two, or zero walls are detected.

Let's take a look at Pyat's brain while it completes the maze: Pyat creates a grid on the floor as it moves. When the program starts, it begins at the origin (0,0), and after every subsequent movement, Pyat uses displaced distance and angle to compute the current position's exact coordinates relative to the origin. When an important event or sequence of important events occurs in accordance with the subsumption architecture, Pyat records its current position as a wall or an intersection where a choice (left, right, or forward) was made. This is useful when Pyat gets lost; it can get itself back on track via the two lowest-level behaviors, activated after 15 steps (measured in grid units) of uninterrupted cruising.

### What this means
This maze-solving technique potentially allows my robot to navigate more non-trivial patterns, such as a maze with another "island" maze inside of it, Inception-style. The robot can follow walls, make decisions at intersections, maintain a dynamic grid to mark intersection positions, identify when it's stuck, and remember movements required to return to an intersection where it can make a new choice. (Note: I have not yet seen it attempt to destroy planet Earth, so I did not include this behavior in the diagram, though it may be a problem in the future.)

The video may not seem incredibly impressive, because after all, that's a pretty simple maze. Also, even though my subsumption architecture seems to be well-defined, whether or not I've implemented it correctly in the code is another question entirely. Sadly I cannot post the source code for you to prove me wrong, since this was technically my final exam, and I could be expelled for aiding and abetting cheaters. However, hopefully you believe me, and you're at least a little bit impressed, because this took a lot of work, and I love my little Pyat.
