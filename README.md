# Hack The Web - source code and build instructions

In this repo you will find the source code of Hack The Web. This readme gives you instructions on how to get this source code up and running. This is intended as a backup solution in case https://hack.arrrg.de fails. There is a way to get the project up and running again.

The source code should not spoil the tasks - therefore I made sure to put all sensitive data in a separate file and not to deliver it. It contains mainly answers and a few passwords. If you have solved the tasks, you can fill in this file yourself.

### Step 1: Setup

Install git and node.js v20+ (incl. npm) on your computer. Go to a directory of your choice and execute the following commands:

```
git clone https://github.com/Entkenntnis/htw.git
cd htw
npm install
```

Now all prerequisites are fulfilled. Start the dev server with `npm run dev` and have a local version of Hack The Web on `localhost:3000`. The code will automatically update on changes. Use `demo` / `htw123` to login or create a new user with the name `editor` to gain access to all admin features.

### Step 2: Enter answers

In the next step it is your task to enter the answers in the file `secrets.js`. Some answers are given by the task and must have a certain value. Other answers you can define yourself.

### Step 3: Hosting

Run the server with `npm start` for production. Using an external database is recommended for more stable operation (sqlite has slow writes). In addition, an imprint must be inserted. Optionally, a main password can be set to moderate and access all accounts. For the server you need your own subdomain, because all URLs work from the root.

### Step 4: Adaptations

Depending on how you host the project, other requirements may arise. Feel free to adapt the source code accordingly.

### Credits

Background image (milky way): scotbot, CC BY 2.0

Password Check Icon: Freepik
