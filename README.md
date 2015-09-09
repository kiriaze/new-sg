### Styleguide
---

A gulp flavored styleguide inspired by Huge's styleguide, utilizing jade/json but in a cleaner, extendable format.
Includes Browserify, sourcemaps, sass minification/concatenation, auto bower setup and concatenation of files, browser-sync, gh-pages and more.

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


### 2. Install

Change directory into cloned project & run Node Package Manager

	$ cd styleguide && npm install --global gulp && npm install

*This will install Gulp globally. Depending on your user account, you may need to configure your system to install packages globally without administrative privileges.*

If you have installed Node with sudo or root permission, You will need to fix permissions to the .npm folder with the following command:

	sudo chown -R $(whoami) ~/.npm
	sudo chown -R $(whoami) /usr/local/lib/node_modules

### 3. Build

Run Gulp and you're good to go. Easy peazy titty squeezy.

	$ gulp

Want to push it to github pages?

	gulp gh-pages

**Boom goes the dynamite.**

### ToDo's
Consider https://github.com/assemble/assemble or replacing jade with handlebars, swig or something similar.

This styleguide works as a standalone but can possibly be included within your project and separated by example below.

gulpfile.js in your main project:

	require('./gulp');
	require('./styleguide/gulp');
