## About
A plant management web app to keep track of your houseplants. Built with Next.js, Prisma (SQLite), Tailwind CSS and shadcn/ui.

## Getting Started

Initial setup:
```
- npm install
- npx prisma migrate dev (initial setup of locally hosted database)
- npx prisma db seed (fill database with predefined data)
```

<br>

Run the development server:
```
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br>

Run GUI of the database (in browser):
```
npx prisma studio
```
Open the URL shown in the terminal with your browser to see the result.

<br>