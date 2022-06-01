# Remix + Firebase auth

This is an example of how to integrate Firebase authentication with Remix. I've chosen GitHub as the auth provider, but this approach works with other providers as well, including user name + password.

This repository was bootstrapped using `npx create-remix` and choosing the "Remix App Server" option.

## Running this code locally

1. Clone this repository and install the dependencies with `yarn install`
2. [Create a Firebase application](https://console.firebase.google.com.) if you don't already have one
3. [Generate a service account key in Firebase](https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account)
4. Create a `.env` file and fill in the values listed in the `.env.sample` file.
5. From your terminal:

   ```sh
   yarn dev
   ```

This starts the example app in development mode, rebuilding assets on file changes.
