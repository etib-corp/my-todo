# MyTodo

Real-time collaborative dashboard for personal and team productivity.

## Documentations

- [Next.js](https://nextjs.org/docs/getting-started)
- [ShadCN UI](https://ui.shadcn.com/docs/components)
- [Prisma with SQLite](https://www.prisma.io/docs/prisma-orm/quickstart/sqlite)

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:etib-corp/my-todo.git
    cd my-todo
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the database:

    ```bash
    touch .env
    echo "DATABASE_URL=file:./dev.db" > .env
    npx prisma generate
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.
