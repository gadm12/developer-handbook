# HTML Cheat Sheet

A quick reference for the HTML elements I am most likely to use.

---

## Table of Contents

| Section | Description |
|---|---|
| [Basic Page](#basic-page) | Standard HTML document structure |
| [Headings and Text](#headings-and-text) | Titles, paragraphs, emphasis, and line breaks |
| [Links and Images](#links-and-images) | Navigation links and images |
| [Lists](#lists) | Ordered and unordered lists |
| [Containers](#containers) | Grouping and organizing content |
| [Semantic Layout](#semantic-layout) | Meaningful page sections |
| [Forms](#forms) | Inputs, labels, buttons, and forms |
| [Tables](#tables) | Displaying tabular data |
| [Useful Attributes](#useful-attributes) | Common HTML attributes |
| [Common Entities](#common-html-entities) | Special characters |
| [Starter Template](#starter-template) | A reusable HTML page |

---

# Basic Page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Page Title</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <h1>Hello World</h1>

    <script src="./main.js"></script>
  </body>
</html>
```

---

# Headings and Text

## Headings

```html
<h1>Main page heading</h1>
<h2>Major section</h2>
<h3>Subsection</h3>
<h4>Smaller subsection</h4>
```

Usually, a page should have one main `<h1>`.

## Paragraph

```html
<p>This is a paragraph.</p>
```

## Bold or Important Text

```html
<strong>Important text</strong>
```

## Italic or Emphasized Text

```html
<em>Emphasized text</em>
```

## Line Break

```html
First line<br />
Second line
```

Use separate paragraphs instead of `<br />` when the text represents separate ideas.

## Horizontal Line

```html
<hr />
```

---

# Links and Images

## Link

```html
<a href="https://example.com">Visit Example</a>
```

Open in a new tab:

```html
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Visit Example
</a>
```

Link to another page:

```html
<a href="./about.html">About</a>
```

Link to a section on the same page:

```html
<a href="#contact">Contact</a>
```

```html
<section id="contact">
  <h2>Contact</h2>
</section>
```

## Image

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu standing and smiling"
/>
```

Image with width:

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu"
  width="300"
/>
```

Always give meaningful images an `alt` description.

---

# Lists

## Unordered List

```html
<ul>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ul>
```

## Ordered List

```html
<ol>
  <li>Clone the repository</li>
  <li>Install dependencies</li>
  <li>Run the project</li>
</ol>
```

## Navigation List

```html
<nav>
  <ul>
    <li><a href="./index.html">Home</a></li>
    <li><a href="./about.html">About</a></li>
    <li><a href="./contact.html">Contact</a></li>
  </ul>
</nav>
```

---

# Containers

## Div

A general-purpose block container:

```html
<div class="card">
  <h2>Pikachu</h2>
  <p>Electric-type Pokémon</p>
</div>
```

## Span

A small inline container:

```html
<p>
  Your score is
  <span class="score">100</span>.
</p>
```

Use:

- `<div>` for grouping larger sections
- `<span>` for styling or grouping text inside a line

---

# Semantic Layout

Semantic elements describe the purpose of the content.

```html
<header>
  <h1>My Website</h1>
</header>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<main>
  <section>
    <h2>Latest Projects</h2>
  </section>

  <article>
    <h2>Project Title</h2>
    <p>Project description</p>
  </article>
</main>

<aside>
  <p>Related information</p>
</aside>

<footer>
  <p>&copy; 2026 Mohamed Gad</p>
</footer>
```

Common semantic elements:

| Element | Purpose |
|---|---|
| `<header>` | Introductory content |
| `<nav>` | Navigation links |
| `<main>` | Main page content |
| `<section>` | Related group of content |
| `<article>` | Independent content |
| `<aside>` | Supporting or related content |
| `<footer>` | Footer information |

---

# Forms

## Basic Form

```html
<form>
  <label for="username">Name</label>

  <input
    id="username"
    name="username"
    type="text"
    placeholder="Enter your name"
  />

  <button type="submit">Submit</button>
</form>
```

The label's `for` value should match the input's `id`.

## Common Input Types

### Text

```html
<input type="text" name="username" />
```

### Email

```html
<input type="email" name="email" />
```

### Password

```html
<input type="password" name="password" />
```

### Number

```html
<input type="number" name="age" min="1" max="120" />
```

### Checkbox

```html
<label>
  <input type="checkbox" name="newsletter" />
  Subscribe to the newsletter
</label>
```

### Radio Buttons

```html
<label>
  <input
    type="radio"
    name="accountType"
    value="personal"
  />
  Personal
</label>

<label>
  <input
    type="radio"
    name="accountType"
    value="business"
  />
  Business
</label>
```

Radio buttons must share the same `name` to act as one group.

### Date

```html
<input type="date" name="startDate" />
```

## Text Area

```html
<label for="message">Message</label>

<textarea
  id="message"
  name="message"
  rows="5"
  placeholder="Enter your message"
></textarea>
```

## Select Menu

```html
<label for="pokemon-type">Pokémon Type</label>

<select id="pokemon-type" name="pokemonType">
  <option value="">Choose a type</option>
  <option value="fire">Fire</option>
  <option value="water">Water</option>
  <option value="electric">Electric</option>
</select>
```

## Required Input

```html
<input
  type="text"
  name="username"
  required
/>
```

## Buttons

Submit a form:

```html
<button type="submit">Submit</button>
```

Regular button:

```html
<button type="button">Generate Team</button>
```

Reset a form:

```html
<button type="reset">Reset</button>
```

Inside a form, always set the button's `type`.

---

# Tables

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Level</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Pikachu</td>
      <td>Electric</td>
      <td>25</td>
    </tr>

    <tr>
      <td>Charmander</td>
      <td>Fire</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
```

Table elements:

| Element | Purpose |
|---|---|
| `<table>` | Entire table |
| `<thead>` | Header section |
| `<tbody>` | Main table data |
| `<tr>` | Table row |
| `<th>` | Header cell |
| `<td>` | Data cell |

Use tables for actual data, not for page layout.

---

# Useful Attributes

## Class

Used for CSS styling and reusable groups:

```html
<div class="card"></div>
```

## ID

Used for a unique element, JavaScript selection, or page links:

```html
<h2 id="projects">Projects</h2>
```

An `id` should be unique on the page.

## Data Attribute

Stores custom information:

```html
<button data-pokemon-id="25">
  Remove Pikachu
</button>
```

JavaScript access:

```javascript
const id = button.dataset.pokemonId;
```

## Disabled

```html
<button type="submit" disabled>
  Submit
</button>
```

## Placeholder

```html
<input
  type="text"
  placeholder="Enter Pokémon name"
/>
```

## Name

Used when form data is submitted:

```html
<input
  type="text"
  name="pokemonName"
/>
```

## Value

```html
<input
  type="radio"
  name="difficulty"
  value="easy"
/>
```

---

# Common HTML Entities

| Character | HTML |
|---|---|
| `©` | `&copy;` |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| Non-breaking space | `&nbsp;` |

Example:

```html
<p>&copy; 2026 Mohamed Gad</p>
```

---

# Comments

```html
<!-- This is an HTML comment -->
```

---

# File Paths

Same folder:

```html
<a href="./about.html">About</a>
```

Inside a folder:

```html
<img src="./assets/image.png" alt="Description" />
```

Move up one folder:

```html
<a href="../index.html">Home</a>
```

---

# Starter Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>My Project</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <header>
      <h1>My Project</h1>

      <nav>
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="home">
        <h2>Welcome</h2>
        <p>Welcome to my website.</p>
      </section>

      <section id="projects">
        <h2>Projects</h2>

        <article class="card">
          <h3>Project Name</h3>
          <p>Project description.</p>
          <a href="#">View Project</a>
        </article>
      </section>

      <section id="contact">
        <h2>Contact</h2>

        <form>
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
          />

          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
          />

          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
          ></textarea>

          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 Mohamed Gad</p>
    </footer>

    <script src="./main.js"></script>
  </body>
</html>
```# HTML Cheat Sheet

A quick reference for the HTML elements I am most likely to use.

---

## Table of Contents

| Section | Description |
|---|---|
| [Basic Page](#basic-page) | Standard HTML document structure |
| [Headings and Text](#headings-and-text) | Titles, paragraphs, emphasis, and line breaks |
| [Links and Images](#links-and-images) | Navigation links and images |
| [Lists](#lists) | Ordered and unordered lists |
| [Containers](#containers) | Grouping and organizing content |
| [Semantic Layout](#semantic-layout) | Meaningful page sections |
| [Forms](#forms) | Inputs, labels, buttons, and forms |
| [Tables](#tables) | Displaying tabular data |
| [Useful Attributes](#useful-attributes) | Common HTML attributes |
| [Common Entities](#common-html-entities) | Special characters |
| [Starter Template](#starter-template) | A reusable HTML page |

---

# Basic Page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Page Title</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <h1>Hello World</h1>

    <script src="./main.js"></script>
  </body>
</html>
```

---

# Headings and Text

## Headings

```html
<h1>Main page heading</h1>
<h2>Major section</h2>
<h3>Subsection</h3>
<h4>Smaller subsection</h4>
```

Usually, a page should have one main `<h1>`.

## Paragraph

```html
<p>This is a paragraph.</p>
```

## Bold or Important Text

```html
<strong>Important text</strong>
```

## Italic or Emphasized Text

```html
<em>Emphasized text</em>
```

## Line Break

```html
First line<br />
Second line
```

Use separate paragraphs instead of `<br />` when the text represents separate ideas.

## Horizontal Line

```html
<hr />
```

---

# Links and Images

## Link

```html
<a href="https://example.com">Visit Example</a>
```

Open in a new tab:

```html
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Visit Example
</a>
```

Link to another page:

```html
<a href="./about.html">About</a>
```

Link to a section on the same page:

```html
<a href="#contact">Contact</a>
```

```html
<section id="contact">
  <h2>Contact</h2>
</section>
```

## Image

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu standing and smiling"
/>
```

Image with width:

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu"
  width="300"
/>
```

Always give meaningful images an `alt` description.

---

# Lists

## Unordered List

```html
<ul>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ul>
```

## Ordered List

```html
<ol>
  <li>Clone the repository</li>
  <li>Install dependencies</li>
  <li>Run the project</li>
</ol>
```

## Navigation List

```html
<nav>
  <ul>
    <li><a href="./index.html">Home</a></li>
    <li><a href="./about.html">About</a></li>
    <li><a href="./contact.html">Contact</a></li>
  </ul>
</nav>
```

---

# Containers

## Div

A general-purpose block container:

```html
<div class="card">
  <h2>Pikachu</h2>
  <p>Electric-type Pokémon</p>
</div>
```

## Span

A small inline container:

```html
<p>
  Your score is
  <span class="score">100</span>.
</p>
```

Use:

- `<div>` for grouping larger sections
- `<span>` for styling or grouping text inside a line

---

# Semantic Layout

Semantic elements describe the purpose of the content.

```html
<header>
  <h1>My Website</h1>
</header>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<main>
  <section>
    <h2>Latest Projects</h2>
  </section>

  <article>
    <h2>Project Title</h2>
    <p>Project description</p>
  </article>
</main>

<aside>
  <p>Related information</p>
</aside>

<footer>
  <p>&copy; 2026 Mohamed Gad</p>
</footer>
```

Common semantic elements:

| Element | Purpose |
|---|---|
| `<header>` | Introductory content |
| `<nav>` | Navigation links |
| `<main>` | Main page content |
| `<section>` | Related group of content |
| `<article>` | Independent content |
| `<aside>` | Supporting or related content |
| `<footer>` | Footer information |

---

# Forms

## Basic Form

```html
<form>
  <label for="username">Name</label>

  <input
    id="username"
    name="username"
    type="text"
    placeholder="Enter your name"
  />

  <button type="submit">Submit</button>
</form>
```

The label's `for` value should match the input's `id`.

## Common Input Types

### Text

```html
<input type="text" name="username" />
```

### Email

```html
<input type="email" name="email" />
```

### Password

```html
<input type="password" name="password" />
```

### Number

```html
<input type="number" name="age" min="1" max="120" />
```

### Checkbox

```html
<label>
  <input type="checkbox" name="newsletter" />
  Subscribe to the newsletter
</label>
```

### Radio Buttons

```html
<label>
  <input
    type="radio"
    name="accountType"
    value="personal"
  />
  Personal
</label>

<label>
  <input
    type="radio"
    name="accountType"
    value="business"
  />
  Business
</label>
```

Radio buttons must share the same `name` to act as one group.

### Date

```html
<input type="date" name="startDate" />
```

## Text Area

```html
<label for="message">Message</label>

<textarea
  id="message"
  name="message"
  rows="5"
  placeholder="Enter your message"
></textarea>
```

## Select Menu

```html
<label for="pokemon-type">Pokémon Type</label>

<select id="pokemon-type" name="pokemonType">
  <option value="">Choose a type</option>
  <option value="fire">Fire</option>
  <option value="water">Water</option>
  <option value="electric">Electric</option>
</select>
```

## Required Input

```html
<input
  type="text"
  name="username"
  required
/>
```

## Buttons

Submit a form:

```html
<button type="submit">Submit</button>
```

Regular button:

```html
<button type="button">Generate Team</button>
```

Reset a form:

```html
<button type="reset">Reset</button>
```

Inside a form, always set the button's `type`.

---

# Tables

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Level</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Pikachu</td>
      <td>Electric</td>
      <td>25</td>
    </tr>

    <tr>
      <td>Charmander</td>
      <td>Fire</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
```

Table elements:

| Element | Purpose |
|---|---|
| `<table>` | Entire table |
| `<thead>` | Header section |
| `<tbody>` | Main table data |
| `<tr>` | Table row |
| `<th>` | Header cell |
| `<td>` | Data cell |

Use tables for actual data, not for page layout.

---

# Useful Attributes

## Class

Used for CSS styling and reusable groups:

```html
<div class="card"></div>
```

## ID

Used for a unique element, JavaScript selection, or page links:

```html
<h2 id="projects">Projects</h2>
```

An `id` should be unique on the page.

## Data Attribute

Stores custom information:

```html
<button data-pokemon-id="25">
  Remove Pikachu
</button>
```

JavaScript access:

```javascript
const id = button.dataset.pokemonId;
```

## Disabled

```html
<button type="submit" disabled>
  Submit
</button>
```

## Placeholder

```html
<input
  type="text"
  placeholder="Enter Pokémon name"
/>
```

## Name

Used when form data is submitted:

```html
<input
  type="text"
  name="pokemonName"
/>
```

## Value

```html
<input
  type="radio"
  name="difficulty"
  value="easy"
/>
```

---

# Common HTML Entities

| Character | HTML |
|---|---|
| `©` | `&copy;` |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| Non-breaking space | `&nbsp;` |

Example:

```html
<p>&copy; 2026 Mohamed Gad</p>
```

---

# Comments

```html
<!-- This is an HTML comment -->
```

---

# File Paths

Same folder:

```html
<a href="./about.html">About</a>
```

Inside a folder:

```html
<img src="./assets/image.png" alt="Description" />
```

Move up one folder:

```html
<a href="../index.html">Home</a>
```

---

# Starter Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>My Project</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <header>
      <h1>My Project</h1>

      <nav>
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="home">
        <h2>Welcome</h2>
        <p>Welcome to my website.</p>
      </section>

      <section id="projects">
        <h2>Projects</h2>

        <article class="card">
          <h3>Project Name</h3>
          <p>Project description.</p>
          <a href="#">View Project</a>
        </article>
      </section>

      <section id="contact">
        <h2>Contact</h2>

        <form>
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
          />

          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
          />

          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
          ></textarea>

          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 Mohamed Gad</p>
    </footer>

    <script src="./main.js"></script>
  </body>
</html>
```# HTML Cheat Sheet

A quick reference for the HTML elements I am most likely to use.

---

## Table of Contents

| Section | Description |
|---|---|
| [Basic Page](#basic-page) | Standard HTML document structure |
| [Headings and Text](#headings-and-text) | Titles, paragraphs, emphasis, and line breaks |
| [Links and Images](#links-and-images) | Navigation links and images |
| [Lists](#lists) | Ordered and unordered lists |
| [Containers](#containers) | Grouping and organizing content |
| [Semantic Layout](#semantic-layout) | Meaningful page sections |
| [Forms](#forms) | Inputs, labels, buttons, and forms |
| [Tables](#tables) | Displaying tabular data |
| [Useful Attributes](#useful-attributes) | Common HTML attributes |
| [Common Entities](#common-html-entities) | Special characters |
| [Starter Template](#starter-template) | A reusable HTML page |

---

# Basic Page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>Page Title</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <h1>Hello World</h1>

    <script src="./main.js"></script>
  </body>
</html>
```

---

# Headings and Text

## Headings

```html
<h1>Main page heading</h1>
<h2>Major section</h2>
<h3>Subsection</h3>
<h4>Smaller subsection</h4>
```

Usually, a page should have one main `<h1>`.

## Paragraph

```html
<p>This is a paragraph.</p>
```

## Bold or Important Text

```html
<strong>Important text</strong>
```

## Italic or Emphasized Text

```html
<em>Emphasized text</em>
```

## Line Break

```html
First line<br />
Second line
```

Use separate paragraphs instead of `<br />` when the text represents separate ideas.

## Horizontal Line

```html
<hr />
```

---

# Links and Images

## Link

```html
<a href="https://example.com">Visit Example</a>
```

Open in a new tab:

```html
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Visit Example
</a>
```

Link to another page:

```html
<a href="./about.html">About</a>
```

Link to a section on the same page:

```html
<a href="#contact">Contact</a>
```

```html
<section id="contact">
  <h2>Contact</h2>
</section>
```

## Image

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu standing and smiling"
/>
```

Image with width:

```html
<img
  src="./assets/pikachu.png"
  alt="Pikachu"
  width="300"
/>
```

Always give meaningful images an `alt` description.

---

# Lists

## Unordered List

```html
<ul>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Learn JavaScript</li>
</ul>
```

## Ordered List

```html
<ol>
  <li>Clone the repository</li>
  <li>Install dependencies</li>
  <li>Run the project</li>
</ol>
```

## Navigation List

```html
<nav>
  <ul>
    <li><a href="./index.html">Home</a></li>
    <li><a href="./about.html">About</a></li>
    <li><a href="./contact.html">Contact</a></li>
  </ul>
</nav>
```

---

# Containers

## Div

A general-purpose block container:

```html
<div class="card">
  <h2>Pikachu</h2>
  <p>Electric-type Pokémon</p>
</div>
```

## Span

A small inline container:

```html
<p>
  Your score is
  <span class="score">100</span>.
</p>
```

Use:

- `<div>` for grouping larger sections
- `<span>` for styling or grouping text inside a line

---

# Semantic Layout

Semantic elements describe the purpose of the content.

```html
<header>
  <h1>My Website</h1>
</header>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<main>
  <section>
    <h2>Latest Projects</h2>
  </section>

  <article>
    <h2>Project Title</h2>
    <p>Project description</p>
  </article>
</main>

<aside>
  <p>Related information</p>
</aside>

<footer>
  <p>&copy; 2026 Mohamed Gad</p>
</footer>
```

Common semantic elements:

| Element | Purpose |
|---|---|
| `<header>` | Introductory content |
| `<nav>` | Navigation links |
| `<main>` | Main page content |
| `<section>` | Related group of content |
| `<article>` | Independent content |
| `<aside>` | Supporting or related content |
| `<footer>` | Footer information |

---

# Forms

## Basic Form

```html
<form>
  <label for="username">Name</label>

  <input
    id="username"
    name="username"
    type="text"
    placeholder="Enter your name"
  />

  <button type="submit">Submit</button>
</form>
```

The label's `for` value should match the input's `id`.

## Common Input Types

### Text

```html
<input type="text" name="username" />
```

### Email

```html
<input type="email" name="email" />
```

### Password

```html
<input type="password" name="password" />
```

### Number

```html
<input type="number" name="age" min="1" max="120" />
```

### Checkbox

```html
<label>
  <input type="checkbox" name="newsletter" />
  Subscribe to the newsletter
</label>
```

### Radio Buttons

```html
<label>
  <input
    type="radio"
    name="accountType"
    value="personal"
  />
  Personal
</label>

<label>
  <input
    type="radio"
    name="accountType"
    value="business"
  />
  Business
</label>
```

Radio buttons must share the same `name` to act as one group.

### Date

```html
<input type="date" name="startDate" />
```

## Text Area

```html
<label for="message">Message</label>

<textarea
  id="message"
  name="message"
  rows="5"
  placeholder="Enter your message"
></textarea>
```

## Select Menu

```html
<label for="pokemon-type">Pokémon Type</label>

<select id="pokemon-type" name="pokemonType">
  <option value="">Choose a type</option>
  <option value="fire">Fire</option>
  <option value="water">Water</option>
  <option value="electric">Electric</option>
</select>
```

## Required Input

```html
<input
  type="text"
  name="username"
  required
/>
```

## Buttons

Submit a form:

```html
<button type="submit">Submit</button>
```

Regular button:

```html
<button type="button">Generate Team</button>
```

Reset a form:

```html
<button type="reset">Reset</button>
```

Inside a form, always set the button's `type`.

---

# Tables

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Level</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Pikachu</td>
      <td>Electric</td>
      <td>25</td>
    </tr>

    <tr>
      <td>Charmander</td>
      <td>Fire</td>
      <td>18</td>
    </tr>
  </tbody>
</table>
```

Table elements:

| Element | Purpose |
|---|---|
| `<table>` | Entire table |
| `<thead>` | Header section |
| `<tbody>` | Main table data |
| `<tr>` | Table row |
| `<th>` | Header cell |
| `<td>` | Data cell |

Use tables for actual data, not for page layout.

---

# Useful Attributes

## Class

Used for CSS styling and reusable groups:

```html
<div class="card"></div>
```

## ID

Used for a unique element, JavaScript selection, or page links:

```html
<h2 id="projects">Projects</h2>
```

An `id` should be unique on the page.

## Data Attribute

Stores custom information:

```html
<button data-pokemon-id="25">
  Remove Pikachu
</button>
```

JavaScript access:

```javascript
const id = button.dataset.pokemonId;
```

## Disabled

```html
<button type="submit" disabled>
  Submit
</button>
```

## Placeholder

```html
<input
  type="text"
  placeholder="Enter Pokémon name"
/>
```

## Name

Used when form data is submitted:

```html
<input
  type="text"
  name="pokemonName"
/>
```

## Value

```html
<input
  type="radio"
  name="difficulty"
  value="easy"
/>
```

---

# Common HTML Entities

| Character | HTML |
|---|---|
| `©` | `&copy;` |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| Non-breaking space | `&nbsp;` |

Example:

```html
<p>&copy; 2026 Mohamed Gad</p>
```

---

# Comments

```html
<!-- This is an HTML comment -->
```

---

# File Paths

Same folder:

```html
<a href="./about.html">About</a>
```

Inside a folder:

```html
<img src="./assets/image.png" alt="Description" />
```

Move up one folder:

```html
<a href="../index.html">Home</a>
```

---

# Starter Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>My Project</title>

    <link rel="stylesheet" href="./assets/style.css" />
  </head>

  <body>
    <header>
      <h1>My Project</h1>

      <nav>
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="home">
        <h2>Welcome</h2>
        <p>Welcome to my website.</p>
      </section>

      <section id="projects">
        <h2>Projects</h2>

        <article class="card">
          <h3>Project Name</h3>
          <p>Project description.</p>
          <a href="#">View Project</a>
        </article>
      </section>

      <section id="contact">
        <h2>Contact</h2>

        <form>
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
          />

          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
          />

          <label for="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
          ></textarea>

          <button type="submit">Send</button>
        </form>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 Mohamed Gad</p>
    </footer>

    <script src="./main.js"></script>
  </body>
</html>
```