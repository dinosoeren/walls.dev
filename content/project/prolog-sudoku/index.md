---
date: 2015-12-01
draft: false
title: "Solving Sudoku with Prolog: A Journey into Declarative Programming"
slug: prolog-sudoku
summary: An exploration of how Prolog's declarative nature makes it a powerful
  tool for solving Sudoku puzzles, from basic rule implementation to tackling
  advanced variants like Skyscraper Sudoku.
thumbnail: /project/prolog-sudoku/images/featured.jpg
thumbnailHd: /project/prolog-sudoku/images/featured-hd.jpg
images:
  - /project/prolog-sudoku/images/featured-hd.jpg
categories:
  - Project
  - Academic
  - Games
tags:
  - Programming
  - Prolog
  - DeclarativeProgramming
  - LogicProgramming
  - AI
  - Puzzles
  - Sudoku
toc: true
---
{{< project-details 
  timeline="Oct-Nov 2015" 
  languages="Prolog" 
  school="AIT at Budapest University of Technology and Economics" 
  course="Semantic and Declarative Technologies" 
>}}

# How I Learned to Stop Worrying and Love Logic Programming

During my *Semantic and Declarative Technologies* course at AIT-Budapest, I was introduced to Prolog, a language that’s dramatically different from imperative languages like Python or Java. Instead of specifying *how* to achieve a goal, you describe the goal itself and the logical rules that define it. This makes it a fascinating and powerful tool for problems that are all about constraints and logic—like Sudoku.

Prolog is built on the idea of **unification** and **backtracking**. You define a set of facts and rules, and Prolog’s engine searches for solutions that satisfy them. If it hits a dead end, it backtracks and tries another path. This is, conceptually, very similar to how a human solves Sudoku: you make a guess, see if it breaks any rules, and if it does, you backtrack and try something else.

This project was my first real dive into this different way of thinking about programming. I started with a standard Sudoku solver and then moved on to a more complex variant called "Skyscraper Sudoku" to really test my understanding.

## The most fun challenges

### 1. The Core Logic: Defining Sudoku Rules

A Sudoku puzzle is a grid where every row, column, and 3x3 sub-grid must contain all the numbers from 1 to 9 without repetition. In Prolog, we can translate these rules directly into logical predicates.

The main predicate, `sudoku/2`, ties everything together. It takes an incomplete grid (`Grid0`) and produces a solved grid (`Grid`).

```prolog
sudoku([], []).
sudoku([R|Rs], Grid):-
	zeros_gone(R, SR),
	append([SR], GridN, Grid),
	sudoku(Rs, GridN),
	complete(Grid).
```

This might look intimidating, so let's break it down:

* The first line, `sudoku([], []).`, is our base case: an empty grid is already solved.
* The `zeros_gone/2` predicate is a helper I wrote to replace the blank entries (represented as `0`) with unassigned variables that Prolog can solve for.
* `append/3` reconstructs the grid with the newly variable-filled row.
* `sudoku(Rs, GridN)` recursively processes the rest of the rows.
* Finally, `complete(Grid)` is called to check if the generated grid is a valid Sudoku solution.

The `complete/1` predicate is where the rules of Sudoku are enforced:

```prolog
complete(Grid):-
	fullyfilled(Grid),
	consistent(Grid).

consistent(Grid):-
	rows_alldiff(Grid),
	transpose(Grid, GridT),
	rows_alldiff(GridT),
	findall(Subgrid, subgrid(Grid, Subgrid), L),
	(	foreach(Sub, L)
	do	grid_alldiff(Sub)
	).
```

* `fullyfilled/1` simply ensures there are no empty spots left.
* `consistent/1` is the real powerhouse. It checks three conditions:

  1. `rows_alldiff(Grid)`: All numbers in each row must be unique.
  2. `transpose(Grid, GridT), rows_alldiff(GridT)`: It cleverly transposes the grid (rows become columns) and runs the same uniqueness check, thus validating the columns.
  3. `subgrid/2`: It defines and then checks all the 3x3 sub-grids to ensure they also contain unique numbers.

This declarative approach is the beauty of Prolog. We don't implement a step-by-step solving algorithm. Instead, we define *what a correct solution looks like*, and Prolog's engine does the hard work of finding it.

- - -

### 2. Upping the Ante: Skyscraper Sudoku

To push myself further, I tackled Skyscraper Sudoku. This variant adds a new layer of constraints. Imagine the numbers in the grid represent the heights of buildings. The numbers outside the grid tell you how many buildings are visible from that vantage point in that row or column. A taller building hides any shorter ones behind it.

{{< skyscraper-sudoku "images/skyscraper-sudoku.png" >}}

This required a more advanced approach. My first solver was a "generate-and-test" model: it would generate a complete grid and then test if it was valid. For Skyscraper Sudoku, this is incredibly inefficient. The solution was to use **Constraint Logic Programming over Finite Domains (CLP(FD))**, a library that turns Prolog into a powerful constraint solver.

With [CLP(FD)](https://www.swi-prolog.org/man/clpfd.html), you define the domains for your variables (e.g., integers from 1 to 9) and the constraints they must satisfy *before* Prolog starts its search. This prunes the search space dramatically, making the problem feasible to solve.

The key predicate here is `visnum/4`, which defines the "visibility" constraint:

```prolog
% visnum(V, Dir, RC, SS): The number of elements in row or column RC
% of grid SS that are visible from the direction Dir is V.
visnum(V, n, RC, SS):- % north => left visibility, RC is column number
	transpose(SS, SST),
	nth(RC, SST, Col),
	visnum_left(V, Col).
visnum(V, w, RC, SS):- % west => left visibility, RC is row number
	nth(RC, SS, Row),
	visnum_left(V, Row).
...
```

The interesting part is `visnum_left/2`, which calculates the visibility from one direction.

```prolog
visnum_left(V, [A,B|As]):-
	A #< B #<=> Visible,
	V #= V0 + Visible,
	Visible #=> C #= B,
	#\ Visible #=> C #= A,
	visnum_left(V0, [C|As]).
```

This uses CLP(FD)'s specialized operators (`#<`, `#<=>`, `#=`, `#=>`):

* `A #< B #<=> Visible`: `Visible` becomes `1` (true) if `A` is less than `B`, and `0` (false) otherwise. This determines if building `B` is visible past `A`.
* `V #= V0 + Visible`: The total visibility `V` is the sum of the visibility from the rest of the list (`V0`) plus the current `Visible` state.
* The next two lines cleverly determine the new "tallest building so far" (`C`) for the recursive call.

Using CLP(FD) felt like a superpower. It shows the real potential of logic programming for solving combinatorial problems by defining constraints and letting the solver handle the optimization.

- - -

## Final Thoughts

Working with Prolog was a mind-bending and rewarding experience. It forces a different kind of problem-solving—one focused on defining logical systems rather than detailing computational steps. It’s a powerful reminder that the tools we choose can fundamentally shape how we approach a problem. For puzzles, logic, and AI, Prolog remains a uniquely elegant tool.

The complete code for both the standard and Skyscraper Sudoku solvers is embedded in this post below. Feel free to play with it and explore the world of logic programming!

## More Resources

* [Learn `X` In `Y` Minutes, Where `X=Prolog`](https://learnxinyminutes.com/prolog/)

## Source Code

{{< details "`sudoku.pl`" >}}
{{< snippet file="/project/prolog-sudoku/src/sudoku.pl" lang="prolog" >}}
{{< /details >}}

{{< details "`skysudoku.pl`" >}}
{{< snippet file="/project/prolog-sudoku/src/skysudoku.pl" lang="prolog" >}}
{{< /details >}}

- - -

*It’s only logical.*
