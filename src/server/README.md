# challenges-server

The engine behind https://hack.arrrg.de

## Introduction

A great way to learn and master a skill is to solve challenges. This package aims at providing a foundation on which you can create a set of challenges and invite people to solve them.

![grafik](https://user-images.githubusercontent.com/13507950/88150563-d8a5ce80-cc01-11ea-99a4-6fc7f9d39a3b.png)

## Getting started

Create a new project (e.g. with `npm init`) and install the package:

```
npm install @entkenntnis/challenges-server sqlite3
```

Add a main script into your project and write

```js
require('@entkenntnis/challenges-server')((config) => {
  // configure server
  return config
})
```

to start the server.

## Create and Share!

Look at the [create-challenges-server repo](https://github.com/Entkenntnis/create-challenges-server) for an extended introduction into creating your own set of challenges.

## Challenges Definition

Every challenge is an object with following properties:

### id

The unique (positive-integer) identifier for this challenge.

### pos

An object with x and y property, defines the position of the challenge.

### title

The title of the challenge

### deps

Array of ids of challenge. Is visible only when at least one of the deps is solved. Leave empty to make challenge always visible.

### html

The html content of the challenge

### render

Optional instead of html: Pass a function that will render the challenge (instead of html). The input is an object with the properties `App` and `req`.

### solution

A string value for the solution of the challenge. (case-insensitive, trimmed) - can also be an array of strings for multiple correct solutions.

### check

Optional instead of solution: Function that gets the answer and an object with `App` and `req`. Return an object with answer (the displayed solution value) and correct, a boolean that indicates whether the challenge is solved or not. Alternative: Just return a boolean. Replaces solution attribute. Set `rawAnswer` to true to only show answer without right/wrong.

This is the default check function:

```js
function (raw) {
  const answer = raw.toLowerCase().trim()
  const solutions = Array.isArray(challenge.solution)
    ? challenge.solution
    : [challenge.solution]
  const correct = solutions.some(
    (solution) => solution && answer === solution.toLowerCase().trim()
  )
  return {
    answer,
    correct,
  }
}
```

### hidesubmit

Optional, don't show default submit form.

### noScore

Optional, This challenges scores no points and doesn't update last active in highscore. Still counts towards solved challenges and shows as last solved challenge in profile.

### author

Optional, shows the name of an author

### showAfterSolve

Only visible after challenge is solved

### showAboveScore

When score is higher than value, challenge becomes visible, even if not reached yet

## Configuration

The server exposes a lot of config options, which you can all override and customize:

```js
require('@entkenntnis/challenges-server')((config) => {
  // configure server
  config.port = 8080
  config.theme = 'yeti'
  return config
})
```

Here you can find the full list of options.

### config.database

Sets up the database connection, passed as `options` into [sequelize](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor). Defaults to sqlite and the value

```js
{
  dialect: 'sqlite',
  storage: './.data/db.sqlite',
}
```

You can also use other database backends (e.g. mariadb, mysql, ...), but this is optional. Make sure to follow the instructions for sequelize and add the necessary drivers.

### config.sync

Is passed as `options` into the database [sync function](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-method-sync). For development purposes, default is empty object.

### config.logdb

Enable logging of all db commands (very verbose). Default is `false`.

### config.logprefix

A string that is prefixes to every console output, default is `"[challenges-server] "`.

### config.port

The port on which to start the server, default is 3000. The server is listening to all available networks on your computer.

### config.sessionSecret

Secret value to generate session tokens. Set it to something unique, default is `"keyboard cat"`.

### config.languages

Set selectable languages, currently available are `"de"` (German), `"en"` and `"fr"` (French). Default is `['en']`.

### config.theme

You choose from one of the theme from [bootswatch](https://bootswatch.com/4/):

![grafik](https://user-images.githubusercontent.com/13507950/88153920-5e2b7d80-cc06-11ea-93e4-9cc7b230af55.png)

Available values are: cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux, materia, minty, pulse, sandstone, simplex, sketchy, slate, solar, spacelab, superhero, united, yeti. Default is sketchy.

### config.reloadChallenges

Reloads challenges every page view. Good for development, default is true. Disable this option to improve performance.

### config.configRoutes

Enables `/settheme/<theme>` route to dynamically change theme. Enabled by default, disable this on production.

### config.challengesDir

The directory in which the `challenges.js` file is located. Defaults to the value of `process.cwd()`.

### config.staticFolder

Folder for public assets. Default is `"./public"`.

### config.accounts

This object defines the boundaries for user accounts and rooms. The default options are here:

```js
{
  minUsername: 3,               // minimal username length
  maxUsername: 40,              // maximal username length
  minPw: 4,                     // minimal password length
  maxPw: 100,                   // maximal password length
  regex: /^[ -~äöüÄÖÜß]+$/,     // username filter
  maxRatePerHour: 500,          // maximal amout of registrations per hour
  roomRegex: /^[a-zA-Z0-9]+$/,  // room name filter
  minRoom: 3,                   // minimal room name length
  maxRoom: 20,                  // maximal room name length
  maxRoomPerHour: 50,           // maximal amout of new rooms per hour
  highscoreLimit: 2000,         // maximal amout of users shown in the highscore
  topHackersLimit: 10,          // numbers of top hackers on the start page
  solveRateLimit: 20,           // number of attempts before timeout
  solveRateTimeout: 30,         // duration of timeout in secondes
}
```

### config.map

You can configure the background image of the map with this object. Default value:

```js
{
  background: '/background.jpg',
  backgroundLicenseHtml:
    '<a href="https://paintingvalley.com/sketch-paper-texture#sketch-paper-texture-37.jpg">paintingvalley.com</a> (<a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">CC BY-NC 4.0</a>)',
  centeringOffset: 1,
  width: '1600',
  height: '1200',
  customMapHtml: '' // can also be a function with argument {App, req}
}
```

Add the background image into the static folder and reference it. Please add a license if its not your own picture. The centeringOffset helps to align the challenge titles on the map, it can be positive (move title right) or negative (move title left), and floating point.

You can also set the width and the height of the map. You can add custom html to the map.

### config.brand

The title of the page. Default value is `"challenges-server"`.

### config.periodic

Some internal values of periodic tasks, like cleaning up user sessions:

```js
{
  startupDelay: 2000,     // ms to wait before first action
  baseInterval: 10000,    // ms to wait between checks for action
}
```

### config.session

Configure session timing:

```js
{
  cleanupInterval: 5,           // minutes between checks
  allowUnderexpire: 10,         // soft boundary in minutes before updating expire date of session
  maxAge: 1000 * 60 * 60 * 24,  // ms age of session, default are 24 hours
}
```

### config.urlPrefix

If you can only host your server on a subfolder, you need to set the urlPrefix to let the server point to the correct path, default is `""`, you can use it like `"/challenges"` (without trailing slash). Warning: this option is not very well tested, use at own risk.

### config.i18nConfig

Setting up locale data:

```js
{
  debug: false,         // enable (verbose) debugging info
  fallbackLng: 'en',    // set fallback language
  backend: {
    loadPath: __dirname + '/lang/{{lng}}.json',   // set locale file directory
  },
}
```

### config.i18nExtend

Default is an empty array. You can override translations by adding objects here like this:

```js
config.i18nExtend.push({
  lng: 'de',
  key: 'home.version',
  value: 'Version: Juni 2020',
})
```

Look into the views folder to find out the key of the string.

### config.styles

You can customize the styling of several elements on the page:

```js
{
  mapTextColor: 'black',
  mapTextWeight: 'normal',
  connectionColor: 'var(--gray)',
  pointColor: 'var(--success)',
  pointColor_solved: 'var(--gray-dark)',
  hrColor: undefined,
  solutionClass_correct: 'success',    // bootstrap 4 class
  solutionClass_wrong: 'danger',
  tableHighlightClass: 'primary',
  fontSize: undefined,
}
```

### config.editors

Array of usernames that can access all challenges (test user accounts), default is `[]`. Good for development.

### config.customCSS

Some CSS that is added to every page, default is `""`.

### config.callback

Default is `undefined`. Set it to a function to execute after the server started. It receives the `App` object that contains all modules of the server.

### config.masterPassword

Default is `undefined`. If this is set, you can access every user account with this password.

### config.githubHref

URL to GitHub (shown on start page), default is link to this repo.

### config.githubTargetBlank

Open URL in new tab, default is `true`.

### config.fullscreenMap

Shows the map fullscreen. Default is `false`

### config.statusBackgroundColor

If map is fullscreen, you can add background color to the status.

### config.prefixPlaceholder

This string is replaced with the current url prefix, default is `{{PREFIX}}`

### config.scoreMode

'fixed' -> 12 points for every challenge, 'time' -> 10 points for every challenge, and up to 2 points time bonus (time bonus halves every 3 minutes), 'distance' -> 10 points for every challenge, 1 additional point for (shortest) distance to start

### config.onSubmit

A hook that is called if the user submits any challenge. Object argument with properties: App, id, correct, solved (list of ids that the user has solved) and the raw answer. The function can be sync or async. Example:

```js
config.onSubmit = ({ App, id, correct, solved, isEditor, answer }) => {
  console.log('Submit challenge:', id, correct)
}
```

### config.hintPage

An object with properties `url`. Adds an external link to the status bar with the given translation string `statusBar.hint`.

### config.assetsMaxAge

Set maxAge for assets of the server (default background image, css). Default value is `2d`.

### config.noSelfAdmin

Array of user names that can't admin themselves (no password change, no delete), default is `[]`

### config.bcryptRounds

Number of bcrypt rounds. current default is `10`.

### config.historyBack

Use `window.history.back()` for back navigation from challenge (restores scroll position)

### config.slowRequestWarning

Logs a warning if a request took longer than threshold. (default false)

### config.slowRequestThreshold

Amount of ms for request to become slow (default 10000)

### config.autoPassword

Allow users to store an automatically generated password in browser. (default false)

### config.tokenSecret

Secret server value for auth tokens. (default "mouse dog")

### config.allowNewAutoPassword

Allow or disallow new registrations with auto-password (default false)

### config.rateLimit

This is the default value:

```
{
  enabled: false,
  timespan: 5, // time frame in minutes
  requests: 400, // number of requests that are allowed in this time frame
}
```

Will show a message if the number of requests exceeds the limit within the time frame.

## Changelog

### 2.5.3

Chore: Update dependencies

### 2.5.2

Fix: Make click-area bigger

### 2.5.1

Feature: Add `detectLanguage` and make it optional

### 2.5.0

Feature: Add `rawAnswer` attribute

### 2.4.3

Refactor: avoid using google fonts for lato

### 2.4.2

Feat: Improve performance by caching challenge stats

### 2.4.1

Feat: showAboveScore

### 2.4.0, January 2024

Feat: Allow function for customMapHtml

### 2.3.1

Fix: Sanitize query for highscore

Feat: Warn if attempt to use email as username

### 2.3.0

Feat: Allow arrays for `solution`

### 2.2.1

Feat: Add pagination for highscore

### 2.2.0

Feat: Improve map rendering performance (avoid svg.js)

### 2.1.5

Fix: Scrollbars and css for `/register`

### 2.1.4

Feat: Auto-login after registration

### 2.1.3

Feat: Registration as ceremony

### 2.1.2

Fix: incorrect redirect logic for language subpaths

### 2.1.1

Fix: Translation string
Feat: Dedicated page for english home on `/en`

### 2.1.0

Feat: Add rate limiter

### 2.0.7

Fix: Hidden challenges not visible for demo accounts

### 2.0.6

Fix: Duplicated translation key

### 2.0.5

Fix: User is loaded for all routes
Fix: potential server crash

### 2.0.4

Fix: missing translation in challenge, rank in profile matches rank in highscore

### 2.0.3

Fix: profile date translation, challenges can return translated content

### 2.0.1, 2.0.2

Fix: Add sameSite attribute

### 2.0.0

Breaking I18n rework:

- `locale` is replaced by `languages`
- `slogan` replaced by i18n string `home.slogan`
- `hintPage.label` replaced by i18n string `statusBar.hint`

### 1.4.5

Add showAfterSolve

### 1.4.4

Show placeholder for inaccessible challenges

### 1.4.3

Add author to challenge definition, fix for noScore in distance calculation

### 1.4.2

Allow render to be async

### 1.4.1

Last active in profile includes noScore challenges

### 1.4.0

Add noScore config for challenge

### 1.3.2

Add migration strategy to exit auto password

### 1.3.1

Found a better improvement

### 1.3.0

Improve javascript back

### 1.2.8

Fix vertical align for local accounts

### 1.2.7

Auto password improvements

### 1.2.6

Small performance improvement for highscore

### 1.2.5

Show top percentage

### 1.2.4

Add path to slow request warning

### 1.2.3

Link to last activities on landing page

### 1.2.2

Show number of all users in profile rank

### 1.2.1

Disable monthly count

### 1.2.0

Add `/token` and `/verify` for third-party auth

### 1.1.5

Hints are not opening in new tab

### 1.1.4

Only show after password changed

### 1.1.3

Allow manual removal from local accounts

### 1.1.2

Bugfix for auto password and change password

### 1.1.1

Add `autoPassword` feature

### 1.1.0, May 2023

Add username check

### 1.0.5

Improve slow request warning implementation, add `slowRequestThreshold`

### 1.0.4

Added `slowRequestWarning`

### 1.0.3

CustomMapHtml, add username to last solved tooltip.

### 1.0.2

Fix translation for profile

### 1.0.1

Add historyBack

### 1.0.0, February 2023

Moving out of beta, fix missing translations

### 0.10.2

Show last solved time of challenge as tooltip.

### 0.10.1

Use better way of finding last user.

### 0.10.0, December 2022

Show last solved time of challenge, show created date of user in highscore in tooltip, upgrade dependencies

### 0.9.2

Fix error on malformed answer input, add supporter message

### 0.9.1

Add githubTargetBlank.

### 0.9.0, May 2022

Show creation date of challenges, upgrade dependencies, show entries count for highscore mode "month".

### 0.8.2

Fix raced requests on register, add config for bcrypt rounds.

### 0.8.1

Set sameSite attribute of cookies.

### 0.8.0

Retry transaction on deadlock, add noSelfAdmin feature

### 0.7.6

Add answer to onSubmit-hook

### 0.7.5, February 2022

Upgrade dependencies, scroll to username in highscore

### 0.7.4

Fix memory leak in map rendering

### 0.7.3

Autofocus for forms

### 0.7.2

Bugfix for highscore recent activity, enable cache header for data directory, better error messaging

### 0.7.1

Fix bug in distance calculation

### 0.7.0, July 2021

Add sort/filter to highscore, add rank to profile, add last solved challenge to profile

### 0.6.1

Add maxAge for static assets.

### 0.6.0

Remove sqlite3 as dependency.

### 0.5.4,

Move Join Room to Rooms section, add config.hintPage

### 0.5.3,

Add isEditor to onSubmit hook.

### 0.5.2

Add solved challenges to onSubmit hook.

### 0.5.1

Only count solved challenges that exist.

### 0.5.0, February 2021

Add onSubmit hook.

### 0.4.3

Fix regression: Show new score on successful answer

### 0.4.2

Make database access more robust (catch errors, use transactions).

### 0.4.1, December 2020

Show registered date in profile.

### 0.4.0

Adds a internal key-value store for challenges. API is similiar to HTML5 localStorage, accessible with `App.storage`.

### 0.3.3

Fix bug in distance calculation

### 0.3.2

Different score modes

### 0.3.1

prefix Placeholder, render for challenges

### 0.3.0 August 2020

github link config, Fullscreen Map, status with background color, config for map height and width, map font weight

### 0.2.8

Expose challenges data on `App`.

### 0.2.6, July 2020

Fix highscoreLimit.

### 0.2.5, June 2020

Full release with all relevant features.

### 0.1.0, May 2020

Initial release
