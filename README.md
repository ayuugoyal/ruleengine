# Rule Engine

A simple yet powerful rule engine built with Next.js and Drizzle ORM that allows users to create, combine, and evaluate rules using an intuitive user interface. The engine utilizes Abstract Syntax Trees (AST) for rule representation and manipulation, enabling complex rule evaluations.

## Table of Contents

-   [Features](#features)
-   [Technologies](#technologies)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)

## Features

-   Create and manage custom rules.
-   Combine multiple rules using specified operations.
-   Evaluate rules against user-provided data.
-   Display rules and their structure visually using an animated AST.
-   Simple and intuitive UI built with NextJS using Shadcn.

## Technologies

This project is built using the following technologies:

-   **Frontend:** Next.js, TypeScript, Tailwind CSS
-   **Backend:** Node.js, Drizzle ORM, PostgreSQL, NeonDB
-   **Others:** Shadcn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ayuugoyal/ruleengine.git
    cd ruleengine
    ```

2. Install dependencies

    ```bash
    pnpm install
    ```

3. Set up your PostgreSQL database and update the database configuration `DATABASE_URL` in your `.env` or `.env.local` file.

4. Start the development server

    ```bash
    pnpm run dev
    ```

5. Open your browser and visit http://localhost:3000.

## Usage

1. **Creating a Rule:**

    - Navigate to the "Create New Rule" section.
    - Enter a name for the rule.
    - Provide a rule string in the specified format.
    - Click "Create Rule" to save the new rule.

2. **Combining Rules:**

    - Select two or more existing rules from the list.
    - Specify the operation (e.g., AND, OR, NOT) to combine them.
    - Click "Combine Rules" to generate a new rule based on the specified operation.

3. **Evaluating Rules:**

    - Input data in JSON format in the designated area.
    - Select a rule from the dropdown menu to evaluate against the provided data.
    - Click "Evaluate" to see the result of the evaluation.

4. **Viewing Existing Rules:**

    - Browse through the list of existing rules.
    - Click on a rule to view its details, including its structure represented as an Abstract Syntax Tree (AST).

## API Endpoints

### `POST /api/create-rule`

-   **Description:** Creates a new rule in the database.

**Request Body:**

```json
{
    "name": "string",
    "ruleAst": "object"
}
```

### `POST /api/combine-rules`

-   **Description:** Combines multiple rules using the specified operation.

**Request Body:**

```json
{
    "ruleData": ["array of rule objects"],
    "operation": "string",
    "name": "string"
}
```

### `POST /api/evaluate`

-   **Description:** Evaluates a selected rule against the provided data.

**Request Body:**

```json
{
    "data": "object",
    "ruleAst": "string"
}
```

### `GET /api/get-rules`

-   **Description:** Fetches all existing rules from the database.
