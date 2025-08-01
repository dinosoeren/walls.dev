---
date: 2017-05-02T12:25:00.000-06:00
draft: true
title: "Lexing and Parsing: Building a Java(ish) Interpreter in Haskell"
slug: javaish-haskell
summary: "A look back at my final project for Programming Languages at Colorado
  College: building an interpreter for a Java-like language using Haskell. It
  was a 3-day sprint that melted my brain in the best way possible."
categories:
  - Project
  - Academic
tags:
  - Haskell
  - ProgrammingLanguages
  - Interpreter
  - Compiler
  - FunctionalProgramming
  - Parsing
  - Lexing
toc: true
---
{{< project-details 
  timeline="April 2017" 
  languages="Haskell" 
  school="Colorado College" 
  course="CP341: Programming Languages" 
>}}

# My Last Stand (with a Functional Language)

It was April of my senior year of college. The finish line was in sight. Just one more final project stood between me and graduation. The course? Programming Languages. The challenge? Build a fully-functional interpreter for a subset of Java—lovingly nicknamed "Javaish"—using a language I had only just been introduced to: Haskell.

At Colorado College, we had the [Block Plan](https://www.coloradocollege.edu/basics/blockplan/), which meant this entire course, from researching a comprehensive history of programming languages, to learning Haskell's syntax and submitting the final project, was compressed into three and a half weeks. It was a crash course in imperative vs functional programming, compilers, and sleep deprivation. And honestly? I loved every minute of it.

Building an interpreter from scratch felt like peering under the hood of programming itself. It's one thing to write code; it's another to write code that understands and runs *other* code.

## From Text to Tree: Tokenizing and Parsing

The first step in any interpreter is to make sense of the source code, which is really just a long string of text. This process has two parts:

1. **Lexing/Tokenizing:** Chopping the string into meaningful chunks, or "tokens." For example, `class`, `{`, `myVar`, `123`.
2. **Parsing:** Arranging those tokens into a structured tree (an Abstract Syntax Tree, or AST) that represents the program's logic.

For this, I used the classic Haskell duo: **Alex** for lexing and **Happy** for parsing. They're the Haskell world's answer to the venerable `lex` and `yacc`.

The tokenizer definition in `javaish_tok.hs` maps raw strings to my custom `Token` types.

```haskell
-- From javaish_tok.hs
alex_action_1 =  addPosn TClass 
alex_action_2 =  addPosn TNew 
alex_action_3 =  addPosn TString 
-- ...and so on for every keyword and symbol...
alex_action_19 =  addPosnS( TIntLiteral . read )
alex_action_32 =  addPosnS( TIdent )
```

Once Alex gave me a stream of tokens, Happy's job was to assemble them into our AST, which I defined in `javaish_parse.hs`. The `ExpOnly` data type is a great example of how I represented different kinds of expressions.

```haskell
-- From javaish_parse.hs
data ExpOnly
    = ExpOp Exp Char Exp
    | ExpComOp Exp Char Exp
    | ExpArray Exp Exp
    | ExpFCall Exp Ident [ Exp ]
    | ExpInt Int
    | ExpNewInt Exp
    | ExpBool Bool
    | ExpIdent Ident
    | ExpNewIdent Ident
    | ExpThis
    | ExpNot Exp
    | ExpLength Exp
    | ExpError
    deriving (Show, Eq)
```

*It's just so clean! Using Haskell's algebraic data types to model the language's structure felt incredibly powerful.*

## The Heart of the Interpreter: Making it Run

With a beautiful AST in hand, the real magic could begin: evaluation. The core of the interpreter is a set of recursive functions that walk the tree and "do" what the code says.

The state of our "Javaish" program—variables, class definitions, objects—was managed in a few key data structures. The `Value` type shows how we could represent all the possible data types within our interpreted language.

```haskell
-- From interpreter.hs
data Value
  = VInt    Int
  | VFloat  Float
  | VString String
  | VObj    ObjInfo
  | VBool   Bool
  | VArray  Int [ Value ]
  deriving( Eq, Show )
```

The main workhorse was the `interp_stmt` function. It's essentially a giant `case` statement that uses pattern matching on the AST. This is where the elegance of Haskell really shines. You can see how cleanly it handles an `if/else` statement:

```haskell
-- From interpreter.hs
interp_stmt ( Stmt stmt p ) =
  case stmt of
    -- { <stmts> }
    SList stmts -> forM_ stmts interp_stmt

    -- if <test> then <thenStmt> else <elseStmt>
    SIfElse test thenStmt elseStmt -> do
        VBool testTrue <- interp_exp test
        if testTrue then
          interp_stmt thenStmt
        else
          interp_stmt elseStmt
    
    -- ... and cases for all other statement types
```

### Using Monads for State Management

Some say only the weak-minded require monads to manage state in their Haskell code. But good luck avoiding them entirely!

> 💡 **The Impurity of State**
>
> Haskell is a "pure" functional language, but interpreters need to manage state (like changing the value of a variable). I had to venture into the "impure" world using `IORef`, which is basically a mutable reference. It was my first real brush with monads and managing side effects, and it definitely stretched my brain.

Call me "impure" all you want, but the `IO` monad was an essential part of the `interpreter.hs` file to manage the mutable call stack and object field tables. Those are necessary for simulating the state changes inherent in an imperative language like Javaish within Haskell's pure functional paradigm.

I imported the `Data.IORef` module, which provides the tools for mutable references in Haskell's `IO` monad.

1. **`ObjInfo` Data Type (indirect reference):**

   ```haskell
   data ObjInfo = OI( Maybe ( Ident, ObjInfo, IORef SymbolTable ) )
     deriving( Eq )
   ```

   The `ObjInfo` data type, which defines the structure of an object, includes an `IORef SymbolTable`. This means that the fields of an object are stored in a mutable `SymbolTable` reference.
2. **`interpret` Function (initialization of call stack):**

   ```haskell
   interpret classes whole_program = do
     -- each frame of the call stack includes:
     --  - "this"'s class
     --  - "this"'s field table
     --  - local variable table for the current call
     -- callStack :: IORef [ ( Ident, IORef SymbolTable, SymbolTable ) ] -- Original commented out type
     callStack <- newIORef []
   ```

   Here, `callStack` is initialized as an `IORef` holding a list of tuples representing call frames. `newIORef []` creates an empty mutable reference.
3. **`interp_prog` Function (initialization of `thisFields`):**

   ```haskell
   interp_prog ( Program ( MClass name args body _ ) _ _ ) = do
       thisFields <- newIORef Map.empty
       -- TODO: add real args to local state
       writeIORef callStack [ ( VObj (OI (Just (name, OI Nothing, thisFields) ) ), Map.singleton args ( VString "" ) ) ]
       interp_stmt body
   ```

   `thisFields` is created as an `IORef` to hold the fields of the `this` object for the main class. Its value is then immediately written into the `callStack`.
4. **`SAssign` Statement (writing to locals or fields):**

   ```haskell
   SAssign lhs rhs -> do
       v <- interp_exp rhs
       ( ( VObj (OI (Just ( c, parent, fieldsRef ) ) ), locals ) : s ) <- readIORef callStack
       case Map.lookup lhs locals of
           Just _ ->
               let locals' = Map.insert lhs v locals in
               writeIORef callStack ( ( VObj (OI (Just ( c, parent, fieldsRef ) ) ), locals' ) : s )
           Nothing -> do
               fields <- readIORef fieldsRef
               let fields' = Map.insert lhs v fields
               writeIORef fieldsRef fields'
   ```

   This is a crucial part. When an assignment happens:

   * `readIORef callStack` retrieves the current call stack.
   * `fieldsRef` is extracted from the current `this` object (which itself is an `IORef SymbolTable`).
   * If `lhs` is a local variable, `writeIORef callStack` updates the stack with the new local variable map.
   * If `lhs` is a field, `readIORef fieldsRef` gets the current fields, `Map.insert` updates them, and `writeIORef fieldsRef` commits the change back to the mutable field table.
5. **`SArrayAssign` Statement (writing to array elements):**

   ```haskell
   SArrayAssign lhs idx rhs -> do
       VInt i <- interp_exp idx
       v <- interp_exp rhs
       ( ( VObj (OI (Just ( c, parent, fieldsRef ) ) ), locals ) : s ) <- readIORef callStack
       case Map.lookup lhs locals of
           Just ( VArray length items ) ->
               -- ... (updates local array) ...
               writeIORef callStack ( ( VObj (OI (Just ( c, parent, fieldsRef ) ) ), locals' ) : s )
           Nothing -> do
               fields <- readIORef fieldsRef
               let Just ( VArray length items ) = Map.lookup lhs fields
               -- ... (updates field array) ...
               writeIORef fieldsRef fields'
   ```

   Similar to `SAssign`, this block uses `readIORef` and `writeIORef` to update either local array variables (by updating the entire local map on the stack) or object fields (by updating the `fieldsRef` directly).
6. **`ExpIdent` Expression (reading variable values):**

   ```haskell
   ExpIdent var -> do
       ( ( VObj (OI (Just ( _, _, thisFields ) ) ), locals ) : _ ) <- readIORef callStack
       case Map.lookup var locals of
           Just val -> return val
           Nothing -> do
               fieldTable <- readIORef thisFields
               let Just val = Map.lookup var fieldTable
               return val
   ```

   When an identifier is evaluated, it first checks local variables. If not found, it uses `readIORef thisFields` to look up the variable in the object's mutable field table.
7. **`create_obj` Function (creating new object instances):**

   ```haskell
   create_obj cname = do
     let Just( parent_name, fields, _ ) = Map.lookup cname classes
     fieldTable <- newIORef fields
     parent <- make_parent_from_name parent_name
     return $ VObj $ OI $ Just( cname, parent, fieldTable )
   ```

   When a new object is created, its `fieldTable` is initialized as a new `IORef` holding the default field values for that class.

In essence, `IORef` is used throughout `interpreter.hs` to manage the dynamic, mutable state (call stack and object fields) that is fundamental to interpreting an imperative language.

## All Together Now: Running "Javaish" Code

After days of work, it was time for the moment of truth. Our professor provided a test file, `test.javaish`, that used classes, inheritance, and method calls to see if everything worked.

```java
// From test.javaish
class parent {
    int g;

    public int f1(int a) {
        { System.out.println( 2 ); }
        return a;
    }
}

class kiddo extends parent {

    public int f2(int b) {
        { System.out.println( 3 ); }
        return this.f1(b);
    }
}

class T01 {
    public static void main( String [] args )
    {
        System.out.println( (new kiddo()).f2(1) );
    }
}
```

This program creates a `kiddo` object, calls its `f2` method (which prints `3`), which in turn calls the `parent`'s `f1` method (which prints `2`), and finally prints the return value (`1`).

Seeing the correct output appear on my screen after piping this file into my compiled Haskell program was a satisfying moment.

## Final Thoughts

This project was more than just a final assignment; it was bringing concepts into practice I had learned in CP404 Theory of Computation. It forced me to grapple with complex ideas like parsing, evaluation, state management, and functional programming paradigms (including mutability with monads!).

It taught me that the languages we use fundamentally shape how we think about problems. And sometimes, the best way to understand a language is to try and build one yourself.

## Source Code

The complete source code, including the tokenizer, parser, and interpreter, is available on GitHub. Feel free to browse, but please don't judge my 2017-era Haskell too harshly!
