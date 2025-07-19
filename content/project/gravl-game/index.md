---
date: 2014-05-31 23:22:45-06:00
draft: false
title: "GRAVL: Gravity Puzzle Platformer for Android"
slug: gravl-game
summary: An independently developed Android puzzle platformer where players
  control astronaut Phil manipulating gravity to navigate icy terrain, built
  entirely in Java without game engines over 800 hours of development.
thumbnail: /project/gravl-game/images/featured.gif
categories:
  - App
  - Business
  - Games
  - Mobile
  - Project
  - Web
tags:
  - 2D Graphics
  - Computer Graphics
  - Game Development
  - HTML/CSS
  - Java
  - Mobile Development
  - Physics
  - Professional
---
{{< project-details
  timeline="Summer 2014"
  languages="Java (Android), SQL, HTML, CSS"
  reason="To learn Java and Android Development"
  role="Independent Android Developer, Graphic Designer, Level Designer, Story Writer, and Game Creator"
>}}

## Watch the Trailer

{{< youtube CqwfEolrxec >}}

More than 800 hours over the course of 6 months went into making **[GRAVL](https://dinosoeren.github.io/gravlgame/)**, my first independently developed Android game, from start to finish. With **over 10,000 downloads** across all platforms and **4.8/5 rating** on Google Play at its peak, GRAVL was more successful than I could've ever hoped. It's a platform game (like Super Mario Bros.), except each level is a puzzle that can only be solved using one thing... gravity.

You play as Phil, a stranded astronaut who's trying to collect fuel for his spaceship, while traversing the bizarre icy terrain of an unknown planet. You encounter many different types of **Gravity Switches** along the way, which allow Phil to freely manipulate the laws of physics, to help you avoid falling to your death.


{{< website-button
  url="https://dinosoeren.github.io/gravlgame/"
>}}

{{< amazon-button
  url="http://www.amazon.com/Neros-Studios-GRAVL/dp/B00L8S0SR8"
>}}

{{< googleplay-button
  url="https://play.google.com/store/apps/details?id=com.soerenwalls.gravlpaid"
>}}

This game was more of a programming experiment for me than anything else. I chose not to use any game or physics engines like Unity, and instead chose to program every aspect of the game in pure Java, starting from scratch. This is the primary reason it took so damn long, and also why I wouldn't recommend this approach to anyone whose goal is to efficiently develop a functional game. Don't reinvent the wheel unless you have to, or in my case, unless you want to just for the lolz.

All the graphics in the game are completely original, created by me. The music/sounds are also original; they were composed by my brother Kirby. GRAVL has had its fair share of performance bugs, which have been a pain to fix, but also kinda fun to figure out. I now know the inner workings of Android like never before. You'd be surprised how many different programming and **math** concepts go into developing a game.

## Code Samples

Here are some key code samples from the GRAVL codebase that showcase the technical implementation:

### Gravity System Implementation

The core gravity mechanics are handled in the `Ball` class, which manages the player character's physics:

```java
public class Ball {
    private boolean gravityDown = true;
    private boolean gravityShifting = false;
    private boolean gravityBeingTimed = false;
    private int gravityTimerCount = 0;
    private int gravityTimerMax = 0;

    public void setGravityDown(boolean grdn) {
        gravityDown = grdn;
        if(gravityDown) Assets.playFX(3, Gravl.areSoundsMuted());
        else Assets.playFX(4, Gravl.areSoundsMuted());
    }

    public void incGravityTimer() {
        if(gravityTimerCount > 0 && !finishingLevel) {
            if(gravityTimerCount > 1) {
                gravityTimerCount--;
                if(!gravityBeingTimed) gravityBeingTimed = true;
            } else {
                if(!gravityDown) {
                    gravityShifting = true;
                    gravityDown = true;
                    bouncingV = false;
                } else {
                    gravityShifting = true;
                    gravityDown = false;
                    bouncingV = false;
                }
                if(gravityDown) Assets.playFX(3, Gravl.areSoundsMuted());
                else Assets.playFX(4, Gravl.areSoundsMuted());
                gravityBeingTimed = false;
                gravityTimerCount = 0;
            }
        }
    }
}
```

### Tile Types and Gravity Switches

The game features various tile types, including different gravity switches. Here's how they're defined:

```java
public class Tile {
    // Tile types for different gravity mechanics
    public static final int TYPE_FLOOR = 1;
    public static final int TYPE_GRAVITY_SWITCH_UP = 2;
    public static final int TYPE_GRAVITY_SWITCH_DOWN = 3;
    public static final int TYPE_GRAVITY_SWITCH_ROTATE = 10;
    public static final int TYPE_TIMED_GRAVITY_SWITCH_UP_5_SEC = 17;
    public static final int TYPE_TIMED_GRAVITY_SWITCH_UP_3_SEC = 18;
    public static final int TYPE_TIMED_GRAVITY_SWITCH_DOWN_5_SEC = 19;
    public static final int TYPE_TIMED_GRAVITY_SWITCH_DOWN_3_SEC = 20;
    public static final int TYPE_FLOAT_SLIDE_LEFT_RIGHT = 12;
    public static final int TYPE_FLOAT_SLIDE_UP_DOWN = 13;
    public static final int TYPE_SPRING_LAUNCH = 15;
    public static final int TYPE_TELEPORT = 26;
}
```

### Collision Detection and Gravity Switch Logic

The collision detection system handles interactions with gravity switches:

```java
public void checkVerticalCollision(Rect ballvert) {
    if (Rect.intersects(ballvert, r) && type != TYPE_NOTHING) {
        // Shift gravity UP
        if((type==TYPE_GRAVITY_SWITCH_UP ||
            (!ball.isGravityBeingTimed() &&
                (type==TYPE_TIMED_GRAVITY_SWITCH_UP_5_SEC ||
                 type==TYPE_TIMED_GRAVITY_SWITCH_UP_3_SEC))) &&
            ball.getCenterY() <= tileY + Values.TILE_HEIGHT &&
            ball.isGravityDown() &&
            !ball.isExploding() && !ball.isImploding() &&
            !ball.isRotatingGravity()) {

            ball.setGravityDown(false);
            ball.setGravityShifting(true);
            ball.setBouncingV(false);
            activeCounter = 1;

            if(type==TYPE_TIMED_GRAVITY_SWITCH_UP_5_SEC ||
               type==TYPE_TIMED_GRAVITY_SWITCH_UP_3_SEC)
                ball.setGravityTimerCount(GRAVITY_TIMER_MAX);

            ((GameScreen) thisGameScreen).startArrow(0);
            thisGameScreen.getGameReference().vibrate(0);
            ((GameScreen) thisGameScreen).addMove();
        }
        // Shift gravity DOWN
        else if((type==TYPE_GRAVITY_SWITCH_DOWN ||
                (!ball.isGravityBeingTimed() &&
                    (type==TYPE_TIMED_GRAVITY_SWITCH_DOWN_5_SEC ||
                     type==TYPE_TIMED_GRAVITY_SWITCH_DOWN_3_SEC))) &&
                ball.getCenterY() >= tileY && !ball.isGravityDown() &&
                !ball.isExploding() && !ball.isImploding() &&
                !ball.isRotatingGravity()) {

            ball.setGravityDown(true);
            ball.setGravityShifting(true);
            ball.setBouncingV(false);
            activeCounter = 1;

            if(type==TYPE_TIMED_GRAVITY_SWITCH_DOWN_5_SEC ||
               type==TYPE_TIMED_GRAVITY_SWITCH_DOWN_3_SEC)
                ball.setGravityTimerCount(GRAVITY_TIMER_MAX);

            ((GameScreen) thisGameScreen).startArrow(1);
            thisGameScreen.getGameReference().vibrate(0);
            ((GameScreen) thisGameScreen).addMove();
        }
    }
}
```

### Game Constants and Physics Values

The game uses carefully tuned physics constants for smooth gameplay:

```java
public class Values {
    // Ball physics constants
    public static int BALL_YSPEED = 2;           // Gravity acceleration
    public static int BALL_MOVESPEED = 7;        // Horizontal movement speed
    public static int BALL_MAX_BOUNCE_SPEED = 4; // Maximum bounce velocity
    public static float BALL_LAUNCH_SPEED = 27;  // Spring launch velocity

    // Tile dimensions
    public static int TILE_WIDTH = 60;
    public static int TILE_HEIGHT = 60;

    // Background scrolling
    public static int BGSPEED = 1; // Background scroll speed

    // Frame compensation for different device speeds
    public static final float FRAME_COMPENSATOR_MULTIPLIER = 0.3f;
}
```

### Custom Game Engine Architecture

The game uses a custom framework built from scratch:

```java
public abstract class AndroidGame extends BaseGameActivity implements Game {
    AndroidFastRenderView renderView;
    Graphics graphics;
    Audio audio;
    Input input;
    FileIO fileIO;
    Screen screen;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize custom game engine components
        renderView = new AndroidFastRenderView(this);
        graphics = new AndroidGraphics(this, getAssets());
        fileIO = new AndroidFileIO(this);
        audio = new AndroidAudio(this);
        input = new AndroidInput(this, renderView);
        screen = getInitScreen();
    }
}
```

### Level Loading and Map System

Levels are loaded from text-based map files:

```java
private void loadMap() {
    String mapString = Gravl.getMap(currentLevel);
    Scanner scanner = new Scanner(mapString);

    int tileY = 0;
    while(scanner.hasNextLine()) {
        String line = scanner.nextLine();
        for(int tileX = 0; tileX < line.length(); tileX++) {
            char tileChar = line.charAt(tileX);
            int tileType = Character.getNumericValue(tileChar);

            if(tileType > 0) {
                Tile newTile = new Tile(tileX, tileY, tileType, this);
                tilearray.add(newTile);

                // Special tile handling
                if(tileType == Tile.TYPE_TELEPORT) {
                    teleporterTiles.add(newTile);
                } else if(tileType == Tile.TYPE_POWER_TOGGLE_ALL) {
                    toggleTiles.add(newTile);
                }
            }
        }
        tileY++;
    }
    scanner.close();
}
```

In order to complete this project (which was really my first attempt to create something substantial using Java), I had to learn about:

* Programming for Android
* Background threads
* Runnables
* Bitmap scaling & rendering (pain in the ass!)
* Game controller integration
* Surface view canvas drawing
* Cloud syncing and conflict resolution with Amazon GameCircle and Google Play Services
* Libraries and dependency order
* Slow framerate compensation (and throttling for devices that were TOO fast)
* Hardware acceleration
* Using abstract Java classes for framework layers
* Device compatibility workarounds
* Audio/sound integration
* and tons more.

I also had to use some concepts from trigonometry, like **Pythagorean Theorem** (a big middle finger to all my high school classmates who said we'd never use it outside of school), and I had to come up with some pretty hardcore algorithmic solutions for various issues I ran into along the way.

If you want to read or hear more, I was **[interviewed by Literary Video Games](https://web.archive.org/web/20150113012336/http://www.literaryvideogames.com/2014/07/interview-soeren-walls-creator-of-gravl.html)** about GRAVL; feel free to check that out. I must say, this is one of my projects I'm most proud of, just because of how ridiculous of an undertaking it was. The day I released GRAVL was one of the most satisfying days of my life. But I can guarantee you, I will never attempt make a game without an engine again. Still, it was fun.

## Screenshots

{{< lightgallery
  glob="images/*.png"
>}}
