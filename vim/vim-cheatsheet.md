# Vim Cheat Sheet

A quick reference for the Vim commands I use most often.

---

# Table of Contents

| Section                                       | Description            |
| --------------------------------------------- | ---------------------- |
| [Modes](#modes)                               | Normal, Insert, Visual |
| [Movement](#movement)                         | Navigate the file      |
| [Editing](#editing)                           | Insert, delete, change |
| [Copy & Paste](#copy--paste)                  | Yank and paste         |
| [Undo & Redo](#undo--redo)                    | Reverse changes        |
| [Visual Mode](#visual-mode)                   | Select text            |
| [Searching](#searching)                       | Find text              |
| [Replace](#replace)                           | Substitute text        |
| [Files](#files)                               | Save & quit            |
| [VS Code Vim](#vs-code-vim)                   | Shortcuts I use        |
| [My Favorite Commands](#my-favorite-commands) | Daily commands         |

---

# Modes

| Mode         | Enter      | Purpose         |
| ------------ | ---------- | --------------- |
| Normal       | `Esc`      | Navigate & edit |
| Insert       | `i`        | Type text       |
| Visual       | `v`        | Select text     |
| Visual Line  | `V`        | Select lines    |
| Visual Block | `Ctrl + v` | Select columns  |

---

# Movement

Beginning of file

```vim
gg
```

End of file

```vim
G
```

Go to line

```vim
25G
```

Beginning of line

```vim
0
```

First non-space

```vim
^
```

End of line

```vim
$
```

Next word

```vim
w
```

Previous word

```vim
b
```

End of word

```vim
e
```

Move up/down

```vim
j
k
```

Move multiple lines

```vim
10j
5k
```

Half page down

```vim
Ctrl+d
```

Half page up

```vim
Ctrl+u
```

---

# Editing

Insert

```vim
i
```

Insert at beginning of line

```vim
I
```

Append

```vim
a
```

Append at end of line

```vim
A
```

New line below

```vim
o
```

New line above

```vim
O
```

Delete character

```vim
x
```

Delete line

```vim
dd
```

Delete word

```vim
dw
```

Delete to end of line

```vim
d$
```

Delete inside word

```vim
diw
```

Change word

```vim
ciw
```

Change inside parentheses

```vim
ci(
```

Change inside quotes

```vim
ci"
```

---

# Copy & Paste

Copy line

```vim
yy
```

Copy word

```vim
yiw
```

Copy paragraph

```vim
yap
```

Paste after

```vim
p
```

Paste before

```vim
P
```

---

# Undo & Redo

Undo

```vim
u
```

Redo

```vim
Ctrl+r
```

---

# Visual Mode

Character selection

```vim
v
```

Line selection

```vim
V
```

Block selection

```vim
Ctrl+v
```

Indent

```vim
>
<
```

---

# Searching

Search

```vim
/pokemon
```

Next match

```vim
n
```

Previous match

```vim
N
```

Clear highlight

```vim
:noh
```

---

# Replace

Replace one character

```vim
r
```

Replace word

```vim
ciw
```

Replace all

```vim
:%s/old/new/g
```

Replace with confirmation

```vim
:%s/old/new/gc
```

---

# Files

Save

```vim
:w
```

Quit

```vim
:q
```

Save & quit

```vim
:wq
```

Quit without saving

```vim
:q!
```

---

# VS Code Vim

Open Command Palette

```text
Ctrl+Shift+P
```

Quick Open

```text
Ctrl+P
```

Explorer

```text
Ctrl+Shift+E
```

Toggle Terminal

```text
Ctrl+`
```

Leader shortcuts (mine)

```text
<Space> f   Open file

<Space> s   Save

<Space> e   Explorer
```

---

# My Favorite Commands ⭐

Movement

```vim
gg
G
w
b
$
^
```

Editing

```vim
ciw
diw
dd
o
O
```

Copy/Paste

```vim
yy
yiw
p
P
```

Undo

```vim
u
Ctrl+r
```

Search

```vim
/
n
N
:noh
```
