## Overview

`stylific-lite` is a tiny CSS library that normalises built-in HTML styles and
makes them more palatable.

Useful when you want a decent looking HTML document without any fancy-shmancy
design.

<!-- src -->

## Usage

Copy the prebuilt CSS from this documentation and add overrides as you see fit.

<a href="http://mitranim.com/stylific-lite/styles/docs.css" target="_blank">docs.css →</a>

Or, if you're fancy, use the SCSS source.

Install from `npm`:

```sh
npm i --save-dev Mitranim/stylific-lite
```

Configure variables in your source, then import the library:

```scss
$sf-body-max-width: 768px;
$sf-font-family-sans-serif: Open Sans, sans-serif;

// (Adjust the path if necessary.)
@import './node_modules/stylific-lite/scss/stylific-lite';

// Optional.
@import './node_modules/stylific-lite/scss/classes';
```

## Misc

This a lightweight companion to
<a href="http://mitranim.com/stylific/" target="_blank">`stylific` →</a>

License: <a href="http://www.wtfpl.net" target="_blank">Do What The Fuck You Want To →</a>
