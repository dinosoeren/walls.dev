---
date: 2016-10-20
title: Three and a Half Weeks of AI Challenges
slug: ai-block-plan
summary: A whirlwind tour of the wildest, weirdest, and most rewarding AI projects
  I built in just 3.5 weeks.
thumbnail: /project/ai-block-plan/images/mario-ai.jpg
tags:
- Education
- GameDevelopment
- Java
- Python
- Programming
- AI
- MachineLearning
categories:
- Academic
- Games
- Project
toc: true
images:
- /project/ai-block-plan/images/mario-ai.jpg
---
{{< project-details
    timeline="Sep 26 - Oct 19, 2016"
    languages="Python, Java, TensorFlow, Keras"
    school="Colorado College"
    course="CP365: Artificial Intelligence"
>}}

Let me set the scene: Colorado College, the infamous Block Plan, and me—armed with caffeine, optimism, and a vague understanding of Python. In just 3.5 weeks (yes, you read that right), I tackled a semester's worth of Artificial Intelligence projects. Here are the three that left the biggest mark (and, occasionally, a dent in my sanity).

---

## The most fun challenges

### 1. TensorFlow Set Solver: Can a Neural Net Play SET Better Than Me?

SET is a card game that's equal parts logic puzzle and optical illusion. I figured, why not make a neural network do the heavy lifting?

{{< lightgallery glob="images/grid*.jpg" >}}

- **What I built:** A Python program that scans a photo of a SET board, detects cards, and tries to identify them using two neural networks—one for visibility (is there a card here?) and one for recognition (which card is it?).
- **How it works:** The code slides a window over the board image, uses the visibility model to spot cards, and then the recognition model to guess which card is present. It tallies up "votes" for each card position and prints out its best (and second-best) guesses.
- **What I learned:** Training neural nets is hard. Getting them to work on real, messy images is even harder. But seeing the model actually recognize cards (sometimes!) was a huge win.

*Side note*: Debugging image data is like herding cats. If you ever want to feel humble, try it.

Here's the core solving logic:

```python
def solve_set_grid(db_file_path, grid_image_path):
    db = CardDatabase(db_file_path)
    recognition_nn = CardRecognitionNN(db)
    recognition_model = recognition_nn.train()
    visibility_nn = CardVisibilityNN(db)
    visibility_model = visibility_nn.train()

    grid_image = misc.imread(grid_image_path)
    WINDOW_WIDTH = 30
    WINDOW_HEIGHT = 40
    grid_width = len(grid_image[0])
    grid_height = len(grid_image)

    # there are 9 locations on the board, each with 9 possible votes
    card_votes = np.zeros((9,9))

    # start looping through image with a window
    for row in range(0, grid_height-WINDOW_HEIGHT, 2):
        for col in range(0, grid_width-WINDOW_WIDTH, 2):
            # build window from pixels
            window = []
            for i in range(WINDOW_HEIGHT):
                window.append([])
                for j in range(WINDOW_WIDTH):
                    window[i].append(grid_image[row+i][col+j])
            window = np.array(window)

            # run window through visibility model
            window = window.reshape(1, 40, 30, 3)
            visible = visibility_model.predict(window)
            if(visible[0][1] == 1):
                # the window contains a card!
                # run through recognition model
                recognized = recognition_model.predict(window)[0]
                card_idx = get_card_idx_from_window_bounds(col, col+WINDOW_WIDTH,
                                row, row+WINDOW_HEIGHT, grid_width, grid_height)
                card_votes[card_idx] += recognized

    # make final decisions
    card_decisions = card_votes.argmax(axis=1)
    for i in range(len(card_decisions)):
        print "Card %d:" % i,
        print CardDatabase.get_description(card_decisions[i]+9)
```

And the neural network architecture:

```mermaid
graph LR
    A[Input Image<br/>40x30x3] --> B[Conv2D 32 filters<br/>3x3 kernel]
    B --> C[ReLU Activation]
    C --> D[Conv2D 64 filters<br/>3x3 kernel]
    D --> E[ReLU Activation]

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style D fill:#fff3e0
```

```mermaid
graph RL
    F[Flatten Layer] --> G[Dropout 0.5]
    G --> H[Dense Layer<br/>Output Size]
    H --> I[Softmax Activation]
    I --> J[Output<br/>Card Classification]

    style G fill:#ffebee
    style H fill:#f3e5f5
    style J fill:#c8e6c9
```

```python
class ConvolutionalNN:
    def create_model(self, in_shape, out_size):
        model = Sequential()

        # First convolutional layer
        model.add(Convolution2D(32, 3, 3, border_mode='valid', input_shape=in_shape))
        model.add(Activation('relu'))

        # Second convolutional layer
        model.add(Convolution2D(64, 3, 3))
        model.add(Activation('relu'))

        model.add(Flatten())
        model.add(Dropout(0.5))

        model.add(Dense(out_size))
        model.add(Activation('softmax'))

        model.compile(loss='categorical_crossentropy', optimizer="adam", metrics=['accuracy'])
        return model
```

---

### 2. Othello AI: Bots, Boards, and the Joy of Getting Crushed

{{< figure src="https://images.ctfassets.net/cnu0m8re1exe/cgQly4C7mo2GhH0Clztts/c871dc032b33c4ecd9553a6a6fbddc9b/black-and-white-Othello-stone-green-board.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill" alt="Othello player and board" attr="Image: Toru Kimura/Shutterstock" >}}

Othello (a.k.a. Reversi) is a classic strategy game, and for this project, I went all-in: Java GUI, multiple AI bots, and a whole lot of game logic.

- **What I built:** A full Othello game engine with a graphical board, support for human and AI players, and several bot strategies (random, greedy, and minimax).
- **Cool features:** The minimax bot tries to look ahead and make the smartest move, while the greedy bot just grabs the most pieces it can each turn. You can play against the computer or watch bots battle it out.
- **What I learned:** Implementing minimax was a brain workout, but seeing the bots improve (and sometimes beat me) was super satisfying. Also, GUIs are fun—until they aren't.

*Fun fact*: My minimax bot once lost to the random bot. I still have trust issues.

Here's the core minimax implementation with alpha-beta pruning:

```java
public OthelloMove makeMove(OthelloBoard board, int move) {
    Metrics.reset();
    timer.start();
    if(playerColor == OthelloBoard.BLACK) {
        alpha = -Integer.MAX_VALUE;
        beta = Integer.MAX_VALUE;
    } else {
        alpha = Integer.MAX_VALUE;
        beta = -Integer.MAX_VALUE;
    }

    depthLimit = INITIAL_DEPTH_LIMIT;
    Node root = new Node(board, null, currentMove, null);
    q = new LinkedList<Node>();

    dfs(root);
    while(!q.isEmpty() && !timer.hasFinished()) {
        Node nextNode = q.poll();
        if(nextNode.visited)
            continue;
        if(nextNode.depth == currentMove + depthLimit) {
            depthLimit += DEPTH_INCREMENT;
        }
        dfs(nextNode);
    }

    // Choose best scored child as next move
    Node bestChild = root.children.get(0);
    for(Node child : root.children) {
        if((playerColor == OthelloBoard.BLACK && child.score > bestChild.score) ||
            (playerColor == OthelloBoard.WHITE && child.score < bestChild.score)) {
            bestChild = child;
        }
    }

    currentMove+=2;
    previousMove = bestChild;
    return bestChild.move;
}
```

And the evaluation function that weights corners and sides:

```java
private int estimateScore(OthelloBoard b) {
    int score = b.getBoardScore();
    // check corners
    if(b.board[0][0] > 0) {
        score += CORNER_WEIGHT*(b.board[0][0] == 1 ? 1 : -1);
    }
    if(b.board[0][b.size-1] > 0) {
        score += CORNER_WEIGHT*(b.board[0][b.size-1] == 1 ? 1 : -1);
    }
    if(b.board[b.size-1][b.size-1] > 0) {
        score += CORNER_WEIGHT*(b.board[b.size-1][b.size-1] == 1 ? 1 : -1);
    }
    if(b.board[b.size-1][0] > 0) {
        score += CORNER_WEIGHT*(b.board[b.size-1][0] == 1 ? 1 : -1);
    }
    // check sides
    for(int i=0; i<b.size; i++) {
        if(b.board[i][0] > 0) {
            score += SIDE_WEIGHT*(b.board[i][0] == 1 ? 1 : -1);
        }
        if(b.board[0][i] > 0) {
            score += SIDE_WEIGHT*(b.board[0][i] == 1 ? 1 : -1);
        }
        if(b.board[b.size-1][i] > 0) {
            score += SIDE_WEIGHT*(b.board[b.size-1][i] == 1 ? 1 : -1);
        }
        if(b.board[i][b.size-1] > 0) {
            score += SIDE_WEIGHT*(b.board[i][b.size-1] == 1 ? 1 : -1);
        }
    }
    return score;
}
```

---

### 3. Genetic Algorithm Art: Evolving Images, One Polygon at a Time

This one was part science, part digital art experiment. The goal? Use a genetic algorithm to "evolve" a set of colored polygons that mimic a target image.

{{< figure src="images/test.jpg" alt="4 equally-sized squares of different colors" caption="The starting image from which the genetic algorithm could evolve into the target." >}}

- **What I built:** A Java program that starts with a population of random polygon arrangements and, through crossover and mutation, gradually makes them look more like a given picture.
- **How it works:** Each "solution" is a set of polygons. The fitness function compares the generated image to the target, and the best solutions get to "reproduce." Over thousands of generations, the results get spookily close to the original.
- **What I learned:** Evolutionary algorithms are mesmerizing to watch. Sometimes, the program would get stuck in a rut, but with a tweak to mutation rates, it would suddenly leap forward.

*Pro tip*: If you want to feel like a mad scientist, watch your computer "paint" with polygons at 2 a.m.

Here's the core genetic algorithm loop:

```java
public void runSimulation() {
    currentEpoch = 0;
    while(normalizeFitnesses() &&
            population[fittestIndex].getFitness() < 0.95f &&
            currentEpoch < MAX_EPOCHS) {
        crossoverCount = 0;
        mutationCount = 0;
        GASolution[] bestNextEpoch = null;
        float maxPopulationFitness = 0;

        for(int n=0; n<POPULATION_BRANCHES; n++) {
            GASolution[] newPopulation = new GASolution[POPULATION_SIZE];
            float avgPopulationFitness = 0;
            Random rand = new Random();

            for(int i=0; i<POPULATION_SIZE; i++) {
                float r = rand.nextFloat();
                if(r <= CROSSOVER_RATE) {
                    // crossover
                    newPopulation[i] = newCrossover();
                } else {
                    // just add the same individual
                    newPopulation[i] = deepCopy(population[i]);
                }
                avgPopulationFitness += newPopulation[i].getFitness();
            }
            avgPopulationFitness /= POPULATION_SIZE;
            if(avgPopulationFitness > maxPopulationFitness) {
                bestNextEpoch = newPopulation;
                maxPopulationFitness = avgPopulationFitness;
            }
        }

        if(currentEpoch % 10 == 0) {
            System.out.printf("Epoch %d => Avg Fitness: %.2f, Crossovers: %d, Mutations: %d\n",
                    currentEpoch, maxPopulationFitness, crossoverCount/POPULATION_BRANCHES,
                    mutationCount/POPULATION_BRANCHES);
            canvas.setImage(population[fittestIndex]);
            frame.repaint();
        }
        population = bestNextEpoch;
        currentEpoch++;
    }
}
```

And the fitness function that compares generated images to the target:

```java
public float calcFitness(GASolution solution) {
    Random rand = new Random();
    BufferedImage genPicture = solution.getImage();
    float avgDistance = 0;
    for(int i=0; i<FITNESS_SAMPLE_SIZE; i++) {
        int x = rand.nextInt(solution.width);
        int y = rand.nextInt(solution.height);
        Color a = new Color(realPicture.getRGB(x,y));
        Color b = new Color(genPicture.getRGB(x,y));
        // calculate euclidean distance
        float distance = (float) Math.sqrt(Math.pow(a.getRed() - b.getRed(), 2) +
                                    Math.pow(a.getBlue() - b.getBlue(), 2) +
                                    Math.pow(a.getGreen() - b.getGreen(), 2));
        avgDistance += (distance / MAX_DISTANCE);
    }
    avgDistance /= FITNESS_SAMPLE_SIZE;
    return (1 - avgDistance);
}
```

---

### 4. MarioAI: Teaching a Bot to Run, Jump, and (Sometimes) Survive

Who hasn't wanted to build their own Mario bot? For this project, I dove into the MarioAI competition framework and tried to teach an agent to play Super Mario Bros. (or at least, not immediately fall into a pit).

{{< figure src="images/mario-ai.jpg" alt="Mario AI bot screenshot" caption="Java agent controlling Mario to run, jump, and survive in the MarioAI competition framework." >}}

- **What I built:** A Java agent that controls Mario, using simple logic to decide when to run, jump, and speed up. The agent tries to jump over obstacles and keep moving right—sometimes with hilarious results.
- **How it works:** The bot checks if Mario can jump or is in the air, and then presses the jump and speed buttons accordingly. It's not exactly AlphaGo, but it gets the job done (most of the time).
- **What I learned:** Platformer AI is tricky! Timing jumps and reacting to the environment is harder than it looks. Watching the bot fail in new and creative ways was half the fun.

*Side quest*: If you ever want to appreciate human reflexes, watch your bot miss the same jump 20 times in a row.

Here's the core decision-making logic:

```java
public boolean[] getAction() {
    int distFromGap = closestGapDistance();
    if(distFromGap > -1 && distFromGap <= 2 && !hasInitiatedJumpOverGap) {
        // if we detect a gap coming up soon...
        if(!isMarioOnGround) {
            // stop moving right until we hit the ground
            if(leftButtonCounter < 5) {
                action[Mario.KEY_LEFT] = true;
                leftButtonCounter++;
            } else {
                action[Mario.KEY_LEFT] = false;
            }
            action[Mario.KEY_RIGHT] = false;
            action[Mario.KEY_JUMP] = false;
        } else if(isMarioAbleToJump && (rightUpDistFromEnemy == -1 || rightUpDistFromEnemy > DIST_THRESHOLD)) {
            // once we hit the ground, jump and go right!
            leftButtonCounter = 0;
            hasJumped = false;
            hasLanded = false;
            groundCounter = 0;
            hasInitiatedJumpOverGap = true;
            action[Mario.KEY_LEFT] = false;
            action[Mario.KEY_RIGHT] = true;
            action[Mario.KEY_SPEED] = action[Mario.KEY_JUMP] = true;
        }
    } else if(hasInitiatedJumpOverGap && !hasLanded) {
        // if we're still jumping over the gap...
        // keep jumping and moving right
        action[Mario.KEY_LEFT] = false;
        action[Mario.KEY_RIGHT] = true;
        action[Mario.KEY_SPEED] = action[Mario.KEY_JUMP] = true;
        if(!isMarioOnGround) {
            groundCounter = 0;
            hasJumped = true;
        } else if(hasJumped) {
            if(distFromGap > 0) {
                hasJumped = false;
                hasLanded = true;
                hasInitiatedJumpOverGap = false;
                groundCounter = 0;
            } else if(groundCounter < 15) {
                groundCounter++;
            } else {
                // yay! we made the jump!
                hasJumped = false;
                hasLanded = true;
                hasInitiatedJumpOverGap = false;
                groundCounter = 0;
            }
        }
    } else {
        // otherwise, if no gap...
        // always shoot
        if(shootCounter < 15) {
            action[Mario.KEY_SPEED] = true;
            shootCounter++;
        } else if(shootCounter < 20) {
            action[Mario.KEY_SPEED] = false;
            shootCounter++;
        } else {
            shootCounter = 0;
        }

        // see if we're next to a persistent obstacle
        if(!isEmpty(9,10) || !isEmpty(10,10) || !isEmpty(11,10)) {
            obstacleCounter++;
        } else {
            obstacleCounter = 0;
        }

        int leftUpDistFromEnemy = closestEnemyDistance(LEFT|UP);
        int rightUpDistFromEnemy = closestEnemyDistance(RIGHT|UP);
        int leftDownDistFromEnemy = closestEnemyDistance(LEFT|DOWN);
        int rightDownDistFromEnemy = closestEnemyDistance(RIGHT|DOWN);

        // if there are enemies on the down right...
        if(rightDownDistFromEnemy > -1 && rightDownDistFromEnemy <= DIST_THRESHOLD) {
            // if there aren't enemies on the up right...
            if(rightUpDistFromEnemy == -1 || rightUpDistFromEnemy > DIST_THRESHOLD) {
                // move right and jump
                action[Mario.KEY_RIGHT] = true;
                action[Mario.KEY_LEFT] = false;
                action[Mario.KEY_JUMP] = isMarioAbleToJump || !isMarioOnGround;
            }
        } else {
            // move right and jump
            action[Mario.KEY_RIGHT] = true;
            action[Mario.KEY_LEFT] = false;
            action[Mario.KEY_JUMP] = isMarioAbleToJump || !isMarioOnGround;
            if(obstacleCounter > 12) {
                // jump over obstacle
                action[Mario.KEY_JUMP] = isMarioAbleToJump || !isMarioOnGround;
            }
        }
    }
    return action;
}
```

And the gap detection logic:

```java
public int closestGapDistance() {
    int count = 0;
    int lastBrickX = 0;
    int lastEmptyX = 0;
    int dist = -1;
    for(int y=10; y<19; y++) {
        count = 0;
        lastBrickX = -1;
        lastEmptyX = 0;
        for(int x=10; x<19; x++) {
            if(!isEmpty(y,x) && !hasEnemy(y,x)) {
                lastBrickX = x;
            } else if(isEmpty(y,x) && lastBrickX > -1) {
                boolean allTheWayDown = true;
                for(int w=y+1; w<19; w++) {
                    if(!isEmpty(w,x)) {
                        allTheWayDown = false;
                        break;
                    }
                }
                if(allTheWayDown) {
                    if(lastEmptyX == x-1) {
                        count++;
                        if(count == 3) {
                            int pt = x-3;
                            dist = (int)Math.abs(pt-9);
                            return dist;
                        }
                    } else {
                        count = 1;
                    }
                    lastEmptyX = x;
                }
            }
        }
    }
    return dist;
}
```

---

## Other Projects from this Course

Here's a quick rundown of the other projects I tackled during those 3.5 weeks:

- **Linear Regression:** Implemented linear regression for data analysis tasks.
- **Clustering:** K-means clustering on movie ratings data.
- **AISearch:** Search algorithms (BFS, DFS, A*, etc.) for solving sliding puzzles and other problems.

## Source Code

{{< github-button url="https://github.com/dinosoeren/Artificial-Intelligence" >}}

---

## Reflections & Takeaways

- **AI is messy:** Real-world data is never as clean as textbook examples. Embrace the chaos.
- **Bots are humbling:** Sometimes your "smart" AI will lose to random chance. That's life (and debugging).
- **Evolution is cool:** Watching solutions improve over time is weirdly addictive.

If you're curious about the code or want to see some of the (occasionally hilarious) results, try running my code and let me know how it goes in the comments! And remember: every bug is just an undocumented feature waiting to be discovered.

---

*No neural networks were harmed (permanently) in the making of these projects.*
