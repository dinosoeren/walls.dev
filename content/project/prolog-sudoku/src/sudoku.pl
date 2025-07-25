% Soeren Walls - October 14th, 2015

:- use_module(library(lists),[append/2,transpose/2]).

% sudoku(+Grid0, ?Grid): Grid is a complete refinement of the Sudoku
% grid Grid0, where the "blank" entries of Grid0 are zeros.
sudoku([], []).
sudoku([R|Rs], Grid):-
	zeros_gone(R, SR),
	append([SR], GridN, Grid),
	sudoku(Rs, GridN),
	complete(Grid).

% zeros_gone(+L0, -L): The list L is the list L0 with all zeros
% replaced by positive integers that are not in L0 but are =< the
% length of L0. All elements of L are different from one another.
zeros_gone(L0, L):-
	length(L0, S),
	zeros_gone(L0, L0, L, S).

% zeros_gone(+L0, +LC, -L, +S): The list L is the list L0 with all
% zeros replaced by positive integers that are not in LC but are
% all =< S, where S is the length of LC. The list LC is the unchanged
% original version of list L0 at the time of the first call to this
% predicate. All elements of L are also different from one another.
zeros_gone([], _, [], _).
zeros_gone([A|T], LC, L, S):-
	(	\+ A = 0 -> L = [A|L1]
	;	between_butnotin(1, S, N, LC),
		L = [N|L1]
	),
	zeros_gone(T, LC, L1, S),
	alldiff_not0(L).

% between_butnotin(N, M, X, L): X is an integer >= N and =< M, but
% X is not a member of L.
between_butnotin(N, M, X, L):-
	(	nonmember(N, L) ->
		(	N =< M, X = N
		;	N < M, N0 is N+1,
			between_butnotin(N0, M, X, L)
		)
	;	N < M, N0 is N+1,
		between_butnotin(N0, M, X, L)
	).

% complete(+Grid): Grid is fully filled in and consistent.
complete(Grid):-
	fullyfilled(Grid),
	consistent(Grid).

% fullyfilled(+Grid): All fields of Grid contain positive integers.
fullyfilled([]).
fullyfilled([R|Rs]):-
	allpositive(R),
	fullyfilled(Rs).

% allpositive(+List): All elements in List are positive integers.
allpositive([]).
allpositive([A|T]):-
	integer(A),
	A > 0,
	allpositive(T).

% consistent(+Grid): For all areas of the Sudoku grid Grid, it holds
% that all positive integers in the area are distinct.
consistent([]).
consistent(Grid):-
	rows_alldiff(Grid),
	transpose(Grid, GridT),
	rows_alldiff(GridT),
	findall(Subgrid, subgrid(Grid, Subgrid), L),
	(	foreach(Sub, L)
	do	grid_alldiff(Sub)
	).

% subgrid(+Grid, ?Subgrid): Subgrid is a sub-grid
% of Grid with size K x K, where K is the square root of the
% size of Grid, at (row,col) coordinates (I,J).
subgrid(Grid, Subgrid):-
	length(Grid, M),
	K is integer(sqrt(M)),
	sublist(Grid, SubRows, I, K),
	I mod K =:= 0,
	transpose(SubRows, SubCols),
	sublist(SubCols, SubgridT, J, K),
	J mod K =:= 0,
	transpose(Subgrid, SubgridT).

% grid_alldiff(+Grid): All the elements in the list of lists Grid
% are different from each other, disregarding the number 0.
grid_alldiff([]).
grid_alldiff(Grid):-
	flatten(Grid, L),
	alldiff_not0(L).

% flatten(+Grid, -L): L is the "flattened" list consisting
% of all individual elements from a list of lists called Grid.
flatten([], []).
flatten([R|Rs], L):-
	append(R, L2, L),
	flatten(Rs, L2).

% rows_alldiff(+L): In a list L consisting of sublists, each
% sublist has elements which are all different from each other,
% disregarding the number 0.
rows_alldiff([]).
rows_alldiff([R|Rs]):-
	alldiff_not0(R),
	rows_alldiff(Rs).

% alldiff_not0(+L): The elements of list L are all different from
% each other, disregarding the number 0.
alldiff_not0([]).
alldiff_not0([D|Ds]) :-
	(	\+ D = 0 -> nonmember(D, Ds) % BIP == \+ member(D, Ds)
	;	true
	),
	alldiff_not0(Ds).

% sublist(+Whole, ?Part, +Before, +Length): Part is a sublist of
% Whole such that there are Before number of elements in Whole
% before Part and the length of Part is Length.
sublist(Whole, Part, Before, Length):-
	append([BL,Part,_], Whole),
	length(BL, Before),
	length(Part, Length).
