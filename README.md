This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Unit tests

To run the unit tests, please run:

```bash
npm test
```

## About the project

The code has a layer of services which concentrates all the logic for filtering. This was considered a better option for separation of concerns and also reusing it whenever the
application could grow. As I'm using Next.js, I chose to fetch the data from a server component and apply all stateful logic inside the products table. I added the mock data to
a datastore folder and added a supportedTypes field to the operators as I thought it made more sense for this information to be coupled with an operator. Every chunk of data is
properly typed in the types folder. The full exercise took around 8 hours to be completed.
