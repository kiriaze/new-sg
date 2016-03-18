# Styleguide-HB
> Includes [BrowserSync](https://github.com/shakyShane/browser-sync) for fast live reloading across devices on code changes. [Handlebars](http://handlebars.com) templating, [Sass](http://sass-lang.com/) and a simple grid implementation with [S-Grid](https://github.com/kiriaze/s-grid).

Based off styleguide but uses handlebars instead of jade.

It comes preconfigured with Browserify, sourcemaps, libsass, optimization, bower, browser-sync, gh-pages and more.

Check the live example out at [https://kiriaze.github.io/styleguide](https://kiriaze.github.io/styleguide)!

### Get started
It's easy to get started. Just follow the steps below.

### Prerequisites

###$ [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 0.10.x.
If you require Node, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

### 1. Clone/Download

Clone or Download Styleguide.

	$ git clone git@github.com:kiriaze/styleguide.git


### 2. Install / Run

Change directory into cloned project & run Node Package Manager to install everything...and you're good to go.

This will open up a server with your styleguide and start watching for changes, with automatic refreshes on all devices! **Easy peazy titty squeezy.**

	$ cd styleguide && npm install

### 3. Deploy

Want to push it to github pages?

	gulp gh-pages

Want to push it to server?

	gulp deploy

Or include a deploy.sh script in your repo and set up a webhook for auto deployment.

**Boom goes the dynamite.**

### ToDo's
- Subsections - utilizing simpleAnchors.js
- Different stylguide themes/layouts
- Ability for modules to be used as pages
