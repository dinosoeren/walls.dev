---
date: 2015-11-28 06:16:51-06:00
draft: false
title: 'Raycaster: Rendering a Chessboard in C++ with Procedural Graphics'
slug: raytracing-engine
summary: A custom raycaster built in C++ for a Computer Graphics course at AIT, featuring
  a procedurally textured chessboard and complex chess pieces modeled with quadrics,
  glass, gold, gemstones, and procedural normal mapping.
thumbnail: /project/raytracing-engine/images/chessboard.png
categories:
- Academic
- Games
- Project
tags:
- 3DGraphics
- ComputerGraphics
- C++
- Education
- Programming
- GameDev
toc: true
images:
- /project/raytracing-engine/images/chessboard.png
---
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

* **Procedural Chessboard:** An 8x8 checkerboard, each square procedurally textured so that adjacent squares are visually distinct (not just black and white). This was my first real taste of procedural graphics, and it was surprisingly satisfying to see the pattern emerge from pure math.
* **Pawns:** Modeled from a cone and a sphere, shaded with a plastic material using diffuse + Phong-Blinn BRDF. Simple, but effective.
* **Queen:** Built from clipped quadrics, including a hyperboloid for that classic slender waist. Rendered in reflective gold—because why not go for a little bling?
* **Knights & Bishops:** Also constructed from clipped quadrics, but with a twist: procedural normal mapping. By perturbing the surface normals with gradients of procedural noise, I gave these pieces a bumpy, dented look. Knights are plastic, bishops are shiny silver.
* **King:** The centerpiece—literally. Modeled with a paraboloid crown, made of glass, and both reflective and refractive. Getting the refractions right was a challenge, but seeing the king bend light like a real crystal was worth it.
* **Rooks:** Cylindrical, closed surfaces made of gemstone. These pieces reflect and refract light, with exponential attenuation as it passes through—so the deeper the light goes, the more it fades. (Think: a ruby or sapphire rook.)
* **Multi-bite Clipping:** Some pieces, like the queen’s crown, use quadric surfaces clipped by three or more clippers for extra detail.

## Chess Piece Implementations

Below are details of how some of the most interesting chess pieces were constructed in code, using combinations of quadric surfaces (spheres, ellipsoids, cones, cylinders, hyperboloids, paraboloids) and geometric transformations. Each piece is a `MultiClipped` object composed of these primitives.

| Piece  | Main Primitives Used                       | Notable Features                 |
| ------ | ------------------------------------------ | -------------------------------- |
| Pawn   | Sphere, Cone, Ellipsoid, Cylinder          | Simple, rounded top, banded base |
| Queen  | Sphere, Ellipsoid, Hyperboloid             | Crown with ball, layered body    |
| Knight | Paraboloid, Sphere, Ellipsoid, Hyperboloid | Head/neck shape, rotated parts   |

### Example: Pawn

```cpp
MultiClipped* MultiClipped::pawn() {
    objects.clear();
    // ball
    objects.push_back((new Quadric(material))->sphere()
        ->transform(float4x4::translation(float3(0,3.65,0))));
    // cone
    objects.push_back((new ClippedQuadric(
        (new Quadric())->cone()->transform(float4x4::translation(float3(0,1,0))),
        (new Quadric())->parallelPlanes(), material))
        ->transform(float4x4::scaling(float3(0.5,2,0.5)) * float4x4::translation(float3(0,2.65,0))));
    // ... (other ellipsoids and cylinders for base)
    this->transform(float4x4::scaling(float3(0.2, 0.2, 0.2)));
    return this;
}
```

### Example: Queen

```cpp
MultiClipped* MultiClipped::queen() {
    objects.clear();
    // ball (crown)
    objects.push_back((new Quadric(material))->sphere()
        ->transform(float4x4::scaling(float3(0.2,0.2,0.2)) * float4x4::translation(float3(0,3.15,0))));
    // crown hyperboloid
    objects.push_back((new ClippedQuadric(
        (new Quadric())->hyperboloid()->transform(float4x4::scaling(float3(1,1.4,1)) * float4x4::translation(float3(0,-0.4,0))),
        (new Quadric())->parallelPlanes(), material))
        ->transform(float4x4::scaling(float3(0.35,0.3,0.35)) * float4x4::translation(float3(0,2.85,0))));
    // ... (other ellipsoids and hyperboloids for body and base)
    this->transform(float4x4::scaling(float3(0.5, 0.5, 0.5)));
    return this;
}
```

### Example: Knight

```cpp
MultiClipped* MultiClipped::knight() {
    objects.clear();
    // head paraboloid
    objects.push_back((new ClippedQuadric(
        (new Quadric())->paraboloid(), (new Quadric())->parallelPlanes(), material))
        ->transform(float4x4::scaling(float3(0.4,0.8,0.4)) * float4x4::rotation(float3(0,0,1), -0.7) * float4x4::translation(float3(-1.0,1.4,0))));
    // head sphere
    objects.push_back((new Quadric(material))->sphere()
        ->transform(float4x4::scaling(float3(0.6,0.5,0.6)) * float4x4::rotation(float3(0,0,1), 0.3) * float4x4::translation(float3(-0.3,2.2,0))));
    // ... (other ellipsoids and hyperboloids for neck and base)
    this->transform(float4x4::scaling(float3(0.4, 0.4, 0.4)));
    return this;
}
```

Each piece is built by combining and transforming these primitives, then grouped as a `MultiClipped` object. This approach allows for highly detailed, mathematically defined models that are both efficient to render and visually accurate.

- - -

## Materials & Procedural Textures

The raycaster features a variety of materials and procedural textures. Here are a few of the most interesting implementations:

### Procedural Chessboard

```cpp
float3 ChessBoard::shade(float3 position, float3 normal, float3 viewDir,
                      float3 lightDir, float3 powerDensity)
{
    float cosTheta = normal.dot(lightDir);
    if(cosTheta < 0) cosTheta = (-normal).dot(lightDir);
    float axis1 = (direction == XZ || direction == XY) ? position.x : position.z;
    float axis2 = (direction == XZ || direction == YZ) ? position.z : position.y;
    if(fabs(axis1) < 4 && axis2 < 0 && axis2 > -8) {
        int xc = floor(axis1);
        int zc = floor(axis2);
        if(abs((xc + zc) % 2) == 1) {
            return kd_boardColor1 * powerDensity * cosTheta;
        } else {
            return kd_boardColor2 * powerDensity * cosTheta;
        }
    }
    return kd * powerDensity * cosTheta;
}
```

*This function computes the color of a point on the chessboard by determining which square it falls into, using only math—no textures!*

### Bumpy Plastic (Procedural Normal Mapping)

```cpp
float3 BumpyPlastic::shade(float3 position, float3 normal, float3 viewDir,
                                float3 lightDir, float3 powerDensity)
{
    float w = position.x * period + pow(snoise(position * scale), sharpness)*turbulence;
    w: pow(sin(w)*0.5+0.5, 4);
    float3 dShade = Diffuse::shade(position, normal, viewDir, lightDir, powerDensity);
    float3 halfway = (viewDir+lightDir).normalize();
    float cosDelta = w * normal.dot(halfway);
    if(cosDelta < 0) cosDelta = w * (-normal).dot(halfway);
    return dShade + (powerDensity * ks * pow(cosDelta, shininess));
}
```

*This material perturbs the normal using a procedural noise function, giving the surface a bumpy, organic look.*

### Simple Procedural Noise

```cpp
float snoise(float3 r) {
    unsigned int x = 0x0625DF73;
    unsigned int y = 0xD1B84B45;
    unsigned int z = 0x152AD8D0;
    float f = 0;
    for(int i=0; i<32; i++) {
        float3 s(
                 x/(float)0xffffffff,
                 y/(float)0xffffffff,
                 z/(float)0xffffffff);
        f += sin(s.dot(r));
        x: x << 1 | x >> 31;
        y: y << 1 | y >> 31;
        z: z << 1 | z >> 31;
    }
    return f / 64.0 + 0.5;
}
```

*This is a simple hash-based noise function used for procedural texturing and bump mapping.*

If you want to see more examples of materials (like glass, metal, or dielectric), view the full source code below!

## What I Didn’t Get To

* **Caustic King:** I didn’t have time to implement photon mapping for caustics (tracing rays from a light source through the king to the board), but it’s on my graphics bucket list.
* **Revolution Quadrics:** I also skipped assembling a piece from five revolution quadrics with C1 continuity. Maybe next time!

## Screenshots

{{< lightgallery
  glob="images/*.png"
>}}

## Source Code

{{< github-button
  url="https://github.com/dinosoeren/raycaster"
>}}

## Reflections

This project was a crash course in both the beauty and the pain of computer graphics. I learned more about light, materials, and geometry in two weeks than I thought possible. Debugging ray-object intersections at 2am is a special kind of fun, but there’s nothing quite like seeing a glass king refract a pawn for the first time.

If you’re curious about the code or want to see more, check it out above! And if you’re ever tempted to write your own raycaster from scratch, my advice: do it. Just keep lots of coffee on hand.
