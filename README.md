# Fetch CRUD Posts Manager

## Project Overview
Fetch CRUD Posts Manager is a web application built with JavaScript and the Fetch API. It allows users to retrieve, create, edit, delete, and filter posts using the JSONPlaceholder REST API.

## Technologies Used
- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Fetch API
- JSONPlaceholder REST API
- Vite
- Git and GitHub

## Features
- Fetch and display posts from JSONPlaceholder.
- Filter posts by user.
- Create and publish new posts.
- Edit existing posts.
- Delete posts.
- Display loading and error messages.
- Responsive user interface.

## API Used
[JSONPlaceholder](https://jsonplaceholder.typicode.com/)

Main endpoints:
- `GET /posts` — Retrieve posts.
- `GET /posts?userId=1` — Filter posts by user.
- `POST /posts` — Create a post.
- `PATCH /posts/:id` — Update a post.
- `DELETE /posts/:id` — Delete a post.

**Note:** JSONPlaceholder is a testing API. Create, update, and delete requests simulate successful operations but do not permanently change the server's data.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Keniaumwali/week6-fetch-crud.git
   ```

2. Open the project folder:

   ```bash
   cd week6-fetch-crud
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Project Structure

```text
week6-fetch-crud/
├── public/
├── src/
│   ├── api/
│   │   └── http.js
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Learning Objectives
- Understand asynchronous JavaScript.
- Use Fetch API to communicate with a REST API.
- Perform CRUD operations.
- Handle API responses and errors.
- Organize JavaScript code into reusable modules.
- Use Git and GitHub for version control.

## Author
**Umwali Keza Kenia**

Software Engineering Student