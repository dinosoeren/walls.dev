---
date: 2013-11-23T02:12:13-06:00
draft: false
title: "Space Warz: Java Game Inspired by Space Invaders"
slug: space-warz
summary: A 2D top-down space shooter game built in Java over a weekend for
  Computer Science I, featuring waves of enemy ships, mini-bosses, shields, and
  downloadable JAR/EXE versions for cross-platform play.
thumbnail: /project/space-warz/images/featured.gif
categories:
  - Academic
  - Games
  - Project
tags:
  - 2DGraphics
  - Education
  - GameDevelopment
  - Java
  - OpenSource
  - Programming
---
{{< project-details 
  timeline="Nov 16-20, 2013" 
  languages="Java" 
  school="Colorado College" 
  course="CP122 Computer Science I" 
>}}

## Watch the Demo

{{< youtube DzXKKAE9ptM >}}

In the fall of 2013, for my Computer Science I final project, I set out to build a classic: a 2D top-down space shooter. The result was **Space Warz**, a game heavily inspired by the timeless arcade classic *Space Invaders*. Built over a single weekend, it features waves of enemy ships, mini-bosses, player shields, and the satisfying chaos of laser fire.

It was a whirlwind of a project, pushing my early Java skills to their limits, and while it had its share of bugs (as any weekend project might!), it was an incredibly fun and rewarding dive into game development.

{{< github-button 
  url="https://github.com/dinosoeren/SpaceWarz" 
>}}

If you're curious to try it out yourself, feel free to download the executable versions below (requires Java to run).

{{< download-button 
  url="../../bin/space-warz.jar" 
  text="Download .jar" 
  ext="jar" 
>}}

{{< download-button 
  url="../../bin/space-warz.exe" 
  text="Download .exe" 
  ext="exe" 
>}}

## Building Space Warz: Under the Hood

Space Warz was my first real foray into building an interactive application from the ground up, and it was a crash course in core programming concepts like game loops, event handling, and object-oriented design.

### The Game's Heartbeat: `GamePanel`

At the core of Space Warz was the `GamePanel.java` class, acting as the main stage for all the action. This is where the game's "heartbeat" resided – a `javax.swing.Timer` that continuously updated the game state and redrew the screen every 15 milliseconds. This rhythmic call to `actionPerformed` and `repaint` brought everything to life.

Here's a glimpse into the central game loop that kept everything moving:

```java
// GamePanel.java snippet
public void actionPerformed(ActionEvent e) {
    // Only update game state if not paused, won, or game over
    if (alive && !won && !paused) {
        // Update player position based on input
        spr.moveSprite();

        // Move player's bullets
        bullets = spr.getBulletsFired();
        for (int i = 0; i < bullets.size(); i++) {
            if (bullets.get(i).isInScreen())
                bullets.get(i).moveSprite();
            else {
                bullets.remove(i);
            }
        }

        // Move enemies and their bullets, handle their logic
        for (int i = 0; i < enemies.size(); i++) {
            if (!enemies.get(i).isDying()) {
                enemies.get(i).moveSprite();
                // Randomly fire bullets
                // ...
            }
            // ... move enemy bullets ...
        }

        // Check for interactions between all game objects
        checkForCollision();
    } else {
        // Handle game over, win, or paused states
    }

    // Request a redraw of the entire panel
    this.repaint();
}
```

And the `paint` method, responsible for rendering every sprite, star, and UI element on the screen:

```java
// GamePanel.java snippet
public void paint(Graphics g) {
    super.paint(g);
    Graphics2D g2 = (Graphics2D) g;

    // Draw background stars
    for (StarSprite star : stars)
        g2.drawImage(star.getSpriteImage(), star.getXPos(), star.getYPos(), this);

    // Draw player's bullets
    bullets = spr.getBulletsFired();
    for (BulletSprite blt : bullets)
        g2.drawImage(blt.getSpriteImage(), blt.getXPos(), blt.getYPos(), this);

    // Draw enemies, rotating them to face the player
    for (int z = 0; z < enemies.size(); z++) {
        // ... draw enemy bullets ...
        double rotationDegrees = getEnemyRotAngle(enemies.get(z));
        // ... apply rotation and draw enemy sprite ...
    }

    // Draw the player ship, also rotated towards the mouse cursor
    double sprCenterX = (double) spr.getWidth() / 2;
    double sprCenterY = (double) spr.getHeight() / 2;
    AffineTransform spr_atrans = AffineTransform.getRotateInstance(angleToRotate, sprCenterX, sprCenterY);
    AffineTransformOp spr_atop = new AffineTransformOp(spr_atrans, AffineTransformOp.TYPE_BILINEAR);
    if (spr.isVisible())
        g2.drawImage(spr_atop.filter(spr.getSpriteImage(), null), spr.getXPos(), spr.getYPos(), this);

    // ... draw UI elements like score, lives, level ...

    g.dispose();
}
```

### Player Control and Projectiles

The player's ship, represented by the `PlayerSprite.java` class, responded to keyboard input for movement. When the player pressed a key, `keyPressed` would update the intended direction, and the `moveSprite` method would then apply that movement, gradually accelerating or decelerating for a smoother feel.
Here's how key presses initiated movement:

```java
// PlayerSprite.java snippet - Handling keyboard input
public void keyPressed(KeyEvent e) {
    int keyCode = e.getKeyCode();
    if (!dying) { // Can't move if exploding!
        // Move right or 'D' key
        if ((keyCode == KeyEvent.VK_RIGHT || keyCode == KeyEvent.VK_D)) {
            if (changex == 0) accel = true; // Start accelerating if at a stop
            changex = PLAYER_SPEED;
        }
        // Move left or 'A' key
        else if ((keyCode == KeyEvent.VK_LEFT || keyCode == KeyEvent.VK_A)) {
            if (changex == 0) accel = true;
            changex = -PLAYER_SPEED;
        }
        // ... similar logic for UP/W and DOWN/S ...
    }
}
```

When the player fired, a `BulletSprite` object was created. Its trajectory was determined by the player's position and the mouse cursor's position, ensuring bullets flew directly where the player was aiming. The `BulletSprite` then simply updated its coordinates each frame based on this calculated path.

```java
// PlayerSprite.java snippet - Firing a bullet
public void fireBullet() {
    bulletsFired.add(new BulletSprite(panel, x + PLAYERSPRITE_WIDTH / 2, y + PLAYERSPRITE_HEIGHT / 2, bulletDistX, bulletDistY, 1, 0));
}
```

```java
// BulletSprite.java snippet - Bullet movement
public void moveSprite() {
    // Update position based on pre-calculated X and Y increases
    xPos = xPos - (int) xIncrease;
    yPos = yPos - (int) yIncrease;

    // Make bullet invisible if it goes off-screen
    if (yPos < 0 || yPos > GAMESCREEN_HEIGHT || xPos < 0 || xPos > GAMESCREEN_WIDTH)
        bulletVisible = false;
}
```

### Enemy AI and Behavior

The `Enemy1Sprite.java` class defined our standard enemy ships. They had basic vertical movement, often cycling from top to bottom or vice-versa. A more interesting element was their "gravitational pull" – a subtle AI that nudged them towards the player if they were within a certain distance, making them feel a bit more dynamic. They also had a simple random chance to fire bullets, adding to the challenge.

```java
// Enemy1Sprite.java snippet - Movement and 'gravitational' pull
public void moveSprite() {
    // Basic vertical scrolling movement
    if (direction.equals("down")) {
        if (yPos > GAME_HEIGHT)
            yPos = 0 - GAME_HEIGHT * 1; // Loop back to top
        yPos = yPos + ENEMY_SPEED;
    } else {
        if (yPos < 0 - height)
            yPos = GAME_HEIGHT + GAME_HEIGHT * 1; // Loop back to bottom
        yPos = yPos - ENEMY_SPEED;
    }

    // If enemy is on screen, apply a "gravitational" pull towards the player
    if (yPos > 0 && yPos < GAME_HEIGHT) {
        sprXPos = sprPlayer.getXPos();
        sprYPos = sprPlayer.getYPos();
        sprDistX = sprXPos - xPos;
        sprDistY = sprYPos - yPos;

        // If within gravitation range, calculate and apply pull
        if (((sprDistX < 0 && sprDistX > -DIST_TO_GRAVITATE) || (sprDistX > 0 && sprDistX < DIST_TO_GRAVITATE)) &&
            ((sprDistY < 0 && sprDistY > -DIST_TO_GRAVITATE) || (sprDistY > 0 && sprDistY < DIST_TO_GRAVITATE))) {
            // ... complex gravity calculation based on distance ...
            yPos += gravPullY;
            xPos += gravPullX;
        }
    }
}
```

### Collision Detection

Crucial for any game, the `checkForCollision` method in `GamePanel.java` was a workhorse. It systematically checked for intersections between different game entities – player, player bullets, enemies, and enemy bullets – and triggered appropriate consequences like health reduction, explosions, or score updates.

```java
// GamePanel.java snippet - Collision detection logic
public void checkForCollision() {
    Rectangle shipSize = spr.getSpriteSize();

    // Check Player vs. Enemy collisions
    for (Enemy1Sprite enm : enemies) {
        Rectangle enmSize = enm.getSpriteSize();
        if (enm.isCollidable() && shipSize.intersects(enmSize) && !playerDying) {
            killEnemy(enm); // Enemy explodes
            if (!spr.isHurting())
                killPlayer(); // Player takes damage or dies
        }
    }

    // Check Player vs. Enemy Bullet collisions
    for (ArrayList<BulletSprite> enemyBulletsList : enemyBullets) {
        for (BulletSprite blt : enemyBulletsList) {
            Rectangle bltSize = blt.getSpriteSize();
            if (bltSize.intersects(shipSize) && !playerDying) {
                blt.setVisible(false); // Bullet disappears
                if (!spr.isHurting())
                    killPlayer();
            }
        }
    }

    // Check Player Bullet vs. Enemy collisions
    for (BulletSprite playerBullet : bullets) {
        Rectangle bltSize = playerBullet.getSpriteSize();
        for (Enemy1Sprite enm : enemies) {
            if (enm.isCollidable() && bltSize.intersects(enmSize)) {
                soundExplode.playSound();
                playerBullet.setVisible(false); // Player bullet disappears
                killEnemy(enm); // Enemy explodes
                score += 15; // Earn points!
            }
        }
    }
    // ... similar checks for mini-bosses and other interactions ...
}
```

## Lessons Learned

Looking back, **Space Warz** was more than just a game; it was a foundational learning experience. Much like Friendlier, it provided a rich environment for practical lessons, though its focus was purely technical rather than business-oriented.

* **Game Loop Fundamentals:** Building a robust `actionPerformed` and `paint` cycle taught me the core rhythm of real-time applications. Understanding how state updates and rendering combine is critical for any interactive software.
* **Object-Oriented Design in Practice:** Creating separate classes for `PlayerSprite`, `Enemy1Sprite`, `BulletSprite`, etc., wasn't just academic; it was essential for managing complexity in a dynamic system. It showed me the power of abstraction and encapsulation.
* **Event-Driven Programming:** Handling keyboard and mouse inputs, and tying them to game actions, solidified my understanding of event listeners and responders.
* **Debugging and Iteration:** Weekend projects are brutal but effective teachers. Every bug was a puzzle, and fixing it iteratively refined both the code and my problem-solving skills.
* **The Joy of Creation:** While Friendlier ended in a painful external dependency failure, Space Warz was a pure dive into bringing a creative vision to life with code. The satisfaction of seeing sprites move, lasers fire, and enemies explode was immense, setting the stage for future projects and reinforcing my passion for building.

Space Warz, though simple, was a testament to what can be built in a short time with focused effort, and it laid crucial groundwork for my later, more complex endeavors.

## Screenshots

{{< lightgallery 
  glob="images/*.png" 
>}}
