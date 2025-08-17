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

Note: Depending on the system, installing `sqlite3` can be a bit tricky. If you see any `node-gyp` errors, see https://github.com/Entkenntnis/htw/issues/671

**Important**: Copy `secrets.placeholder.js` and rename it to `secrets.js`.

Now all prerequisites are fulfilled. You can start the server with `npm start` and have a working server on `localhost:3000`. To develop, you can also use `npm run dev` to automatically update the source code.

### Step 2: Enter answers

In the next step it is your task to enter the answers in the file `secrets.js`. Some answers are given by the task and must have a certain value. Other answers you can define yourself.

### Step 3: Hosting

In production mode, the project uses a separate database. The password for this must also be entered. In addition, an imprint must be inserted. Optionally, a master password can be set to moderate. For the server you need your own subdomain, because all URLs work from the root. That's it. The rest of the code is for administration, such as the possibility to recalculate the score or an extensive analysis function (the latter only activated on localhost, `localhost:3000/dashboard`).

### Step 4: Adaptations

Depending on how you host the project, other requirements may arise. Feel free to adapt the source code accordingly.

### Credits

Background image (milky way): scotbot, CC BY 2.0
