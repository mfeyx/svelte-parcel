# A Svelte template

This is a Svelte template using Parcel - inspired by Hackathon Starter ref https://hackathon-starter.walcony.com

## Included in template

- Used svelte-spa-router for handling routes ref https://github.com/ItalyPaleAle/svelte-spa-router
- Bundling using Parcel
- CSS framework [Bulma](https://bulma.io/)
- Testing with Jest (with Snapshot support)
- Formatting with ESLint and Prettier
- Transpiling with Babel
- Wallaby enabled
- User authentication
- User profile page
- User forgot password
- User roles (customer, admin etc)
- Contact forms with Nodemailer on the server side ref https://nodemailer.com/about/ and Sendgrid ref https://sendgrid.com/
- APi server with Express JS - git ref  https://github.com/mylastore/express-api.git

## Getting started

    https://github.com/mylastore/svelte-parcel.git
    cd svelte-parcel
    npm install && npm start

Now head over to your favourite browser and open up `localhost:1234` and you are ready to go.

## Build

To build the project run the following:

    npm run build

## Tests

_NOTE: Current open issue in jest-transform-svelte when adding preprocessor tests get stuck in an infinite loop (works in Wallaby though), ref: https://github.com/rspieker/jest-transform-svelte/issues/12_

I prefer running my tests using Wallaby, but if you prefer plain old command line, just type the following to run your tests:

    npm t

## Linting

You may just check for linting or auto fix using these two options

    npm run lint
    npm run lint:fix
