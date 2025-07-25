% Soeren Walls - November 15th, 2015

:- use_module(library(clpfd)).
:- use_module(library(lists),[append/2,transpose/2,reverse/2]).

% :- type spuzzle ---> ss(size,list(clue))
% :- type size == int.
% :- type clue ---> g(num,row,col) ; v(vcount,dir,rowcol).
% :- type row == int.
% :- type col == int.
% :- type rowcol == int.
% :- type num == int.
% :- type vcount == int.
% :- type dir ---> n ; e ; s ; w.
% :- type ssol == list(list(num)).
% :- pred skysudoku(spuzzle::in, ssol::out).

% skysudoku(SP, SS): SS is a solution of the Skyscraper Sudoku puzzle SP.
skysudoku(ss(0,_), [[]]).
skysudoku(ss(1,_), [[1]]):- !.
skysudoku(ss(K,Clues), SS):-
	M #= K*K,
	length(SS, M),
	length(SST, M),
	transpose(SS, SST),
	clues(Clues, SS),
	grid_alldiff(SS, SST, M),
	SGI #= M-K,
	subgrids_alldiff(SS, K, SGI, SGI, M), % K=2 => (SS,2,2,2,4), K=3 => (SS,3,6,6,9)
	append(SS, SSF),
	labeling([], SSF).

% clues(Clues, SS): SS is a Skyscraper Sudoku puzzle for which the
% properties in the list Clues hold true.
clues([], _).
clues([g(N,R,C)|Clues], SS):-
	given(N, R, C, SS),
	clues(Clues, SS).
clues([v(V,Dir,RC)|Clues], SS):-
	visnum(V, Dir, RC, SS),
	clues(Clues, SS).

% given(+N, +R, +C, ?Grid): N appears in row R, column C of Grid.
% The rows and columns begin at index 1.
given(N, 1, C, [Row|_]):-
	element(C, Row, N), !.
given(N, R, C, [_|Rows]):-
	R0 #= R-1,
	given(N, R0, C, Rows).

% visnum(V, Dir, RC, SS): The number of elements in row or column RC
% of grid SS that are visible from the direction Dir is V. The rows
% and columns begin at index 1.
visnum(V, n, RC, SS):- % north => left visibility, RC is column number
	transpose(SS, SST),
	nth(RC, SST, Col),
	visnum_left(V, Col).
visnum(V, w, RC, SS):- % west => left visibility, RC is row number
	nth(RC, SS, Row),
	visnum_left(V, Row).
visnum(V, s, RC, SS):- % south => right visibility, RC is column number
	transpose(SS, SST),
	nth(RC, SST, Col),
	visnum_right(V, Col).
visnum(V, e, RC, SS):- % east => right visibility, RC is row number
	nth(RC, SS, Row),
	visnum_right(V, Row).

% nth(?N, +L, ?E): The N-th element of the proper list L is E.
% The head of a list is considered its 1st element.
nth(1, [Head|_], Head).
nth(N, [_|Tail], E):-
	nth(M, Tail, E),
	N #= M+1.

% visnum_left(V, L): The number of elements in list L that are visible
% from the left is V.
visnum_left(0, []).
visnum_left(1, [_]).
visnum_left(V, [A,B|As]):-
	A #< B #<=> Visible,
	V #= V0 + Visible,
	Visible #=> C #= B,
	#\ Visible #=> C #= A,
	visnum_left(V0, [C|As]).

% visnum_right(V, L): The number of elements in list L that are visible
% from the right is V.
visnum_right(V, L):-
	reverse(L, LR),
	visnum_left(V, LR).

% grid_alldiff(+Grid, +GridT, M): The rows of Grid contain distinct
% integers from 1 to M. The same holds for the rows of GridT. GridT
% is the transpose of the grid Grid of size MxM.
grid_alldiff([], [], _).
grid_alldiff([Row|Rows], [Col|Cols], M):-
	length(Row, M),
	length(Col, M),
	domain(Row, 1, M),
	domain(Col, 1, M),
	all_distinct(Row),
	all_distinct(Col),
	grid_alldiff(Rows, Cols, M).

% subgrids_alldiff(+Grid, ?Subgrid, K, I, J, C): Subgrid is the C-th
% sub-grid of Grid with size KxK, where K is the square root of the
% width of Grid, at (row,col) coordinates (I,J), and all elements
% in Subgrid are distinct integers from 1 to K^2.
subgrids_alldiff(_, _, _, _, 0):- !.
subgrids_alldiff(Grid, K, I, J, SGCount):-
	M #= K*K,
	I in 0..M,
	J in 0..M,
	sublist(Grid, SubRows, I, K),
	transpose(SubRows, SubCols),
	sublist(SubCols, SubgridT, J, K),
	append(SubgridT, Subgrid),
	length(Subgrid, M),
	domain(Subgrid, 1, M),
	all_distinct(Subgrid),
	I #= 0 #<=> IZero,
	IZero #=> I0 #= M-K,
	IZero #=> J0 #= J-K,
	#\ IZero #=> I0 #= I-K,
	#\ IZero #=> J0 #= J,
	SGC0 #= SGCount - 1,
	subgrids_alldiff(Grid, K, I0, J0, SGC0).

% sublist(+Whole, ?Part, +Before, +Length): Part is a sublist of
% Whole such that there are Before number of elements in Whole
% before Part and the length of Part is Length.
sublist(Whole, Part, Before, Length):-
	append([BL,Part,_], Whole),
	length(BL, Before),
	length(Part, Length).
