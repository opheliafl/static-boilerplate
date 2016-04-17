<div align="center">
	<a href="#postcss">PostCSS</a>
	&nbsp;|&nbsp;
	<a href="#js-linting">JS Linting</a>
	&nbsp;|&nbsp;
	<a href="#svg-icons">SVG Icons</a>
	&nbsp;|&nbsp;
	<a href="#browsersync">BrowserSync</a>
	&nbsp;|&nbsp;
	<a href="#distribution">Minifying</a>
</div>

#Static website boilerplate
Static website boilerplate workflow with [Gulp](http://gulpjs.com), [PostCSS](http://postcss.org), [BrowserSync](https://www.browsersync.io) and more.

Once compiled, an `all.css`, `lib.js` and `app.js` file will be be output in the root folder along with `index.html`.

The main Gulp tasks are
* `gulp build` to compile the code
* `gulp live` to start file watching and BrowserSync
* `gulp dist` to generate a minified distribution folder


####Requirements
* [Node.js](https://nodejs.org/)
* [NPM](https://www.npmjs.com)


####Installation
Run `npm install` from the project's root folder in your CLI.



##PostCSS
<div align="center">
	<a href="#overview">Overview</a>
	&nbsp;|&nbsp;
	<a href="#file-structure">File Structure</a>
	&nbsp;|&nbsp;
	<a href="#settings">Settings</a>
	&nbsp;|&nbsp;
	<a href="#syntax">Syntax</a>
</div>

###Overview
[PostCSS](http://postcss.org) is used to compile custom CSS syntax much like SASS does, with the added benefit of getting extra features through plugins from [PostCSS.parts](http://postcss.parts).

The plugins used are:
* [autoprefixer](https://github.com/postcss/autoprefixer) - adds vendor prefixes
* [cssnano](https://github.com/ben-eb/cssnano) - optimizes and minifies CSS
* [css-declaration-sorter](https://github.com/Siilwyn/css-declaration-sorter) - sorts css properties, because OCD
* [css-mqpacker](https://github.com/hail2u/node-css-mqpacker) - joins identical media queries and places them at the end of the file
* [postcss-alias](https://github.com/seaneking/postcss-alias) - create alias words as variables instead of `$var` variables
* [postcss-alias-atrules](https://github.com/maximkoretskiy/postcss-alias-atrules) - create aliases for PostCSS `@` rules
* [postcss-color-alpha](https://github.com/avanes/postcss-color-alpha) - converts `#0a82b4.5` to `rgba(10,130,180,.5)`
* [postcss-custom-media](https://github.com/postcss/postcss-custom-media) - define custom media query aliases
* [postcss-define-property](https://github.com/daleeidd/postcss-define-property) - create custom css properties
* [postcss-extend](https://github.com/travco/postcss-extend) - use SASS style extends
* [postcss-import](https://github.com/postcss/postcss-import) - inlines `@import` rules
* [postcss-nested](https://github.com/postcss/postcss-nested) - use SASS style nested syntax
* [postcss-position-alt](https://github.com/sylvainbaronnet/postcss-position-alt) - shorthand position syntax
* [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) - transforms `px` font-sizes to `rem` based on 16px root size
* [postcss-sassy-mixins](https://github.com/andyjansson/postcss-sassy-mixins) - SASS style mixins
* [postcss-short-data](https://github.com/jonathantneal/postcss-short-data) - select `#app[data-state='open']` with `#app[:state='open']`


###File Structure
The **compiled file** `all.css` will be in the root directory.

* [`./dev/pcss/config/source.pcss`](dev/pcss/config/source.pcss)

	[postcss-import](https://github.com/postcss/postcss-import) will inline all files in the order they are defined. New files must be added here.

* [`./dev/pcss/parts/fonts.pcss`](dev/pcss/parts/fonts.pcss)

	The fonts themselves should be in `./assets/fonts`. This is where all `@font-face` rules should go.

	*NOTE:* Since the compiled CSS file (all.css) will be at root level, `@font-face` rules should point to `assets/fonts/[fontfile]`.

* [`./dev/pcss/settings.pcss`](dev/pcss/settings.pcss)

	This is where you can define custom color aliases, a custom easing function font name aliases, font sizes and media query aliases.

* [`./dev/pcss/main.pcss`](dev/pcss/main.pcss)

	This file is intended to be used for overall styles.

* [`./dev/pcss/parts/reset.pcss`](dev/pcss/parts/reset.pcss)

	This is an actual reset and not a normalized CSS. It sets nearly all defaults to 0. All elements have their position set to `relative` by default and their box-sizing is set to `border-box`.


###Settings
The [settings](dev/pcss/settings.pcss) file allows for a quick setup and easy access to stylesheet wide values.
* **Colors**

	Define color aliases within the `@colors` rule using `alias: color`. Any valid CSS3 color syntax can be used, however hex values are recommended for use with `postcss-color-alpha`.

	You could define colours through non identifying names like `white`, `dark`, `accent` etc. This way, if the accent color is changed from blue to red, you wont have a `blue` alias that compiles to red.

* **Type**

	Define aliases for fonts as with colors. Again, non identifying names can keep code easy to maintain.

* **Transition**

	Define a transition alias.

	*NOTE:* The `easing` alias is necessary for the `ease` custom property.

* **Custom-media**

	Define custom media aliases, eg. `@custom-media --md (max-width:775px)` can be used as `@media (--md) -> @media (max-width:775px)`.

* **General**

	Define stylesheet wide styles here. This file is imported at the top of the stylesheet, after the CSS reset.


###Syntax
You could write your CSS normally. Custom syntax and shortcuts are described below.

####Nesting
You can nest your CSS as you would with SASS. This also applies to media queries.
######Input
```css
main {
	width: 100%;
	height: 100%;

	p {
		padding-bottom: 1.3em;
		color: #3a3a3a;
		&::after {
			content: '';
			width: 100%;
			height: 1px;
			@media(max-width: 775px) {display: none}
		}

		span {
			color: red;
			&:hover {color: blue}
		}
	}
}
```
######Output
```css
main {
	width: 100%;
	height: 100%
}

main p {
	padding-bottom: 1.3em;
	color: #3a3a3a
}

main p::after {
	content: '';
	width: 100%;
	height: 1px
}

main p span {
	color: red
}

main p span:hover {
	color: blue
}

@media (max-width: 775px) {
	main p::after {
		display: none
	}
}
```

####Mixins
Use SASS style mixins thanks to [postcss-sassy-mixins](https://github.com/andyjansson/postcss-sassy-mixins)
######Input
```css
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }
```
######Output
```css
.box {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  border-radius: 10px;
}
```

####Extending
Extend using the `%` silent placeholder:
######Input
```css
%button {
	width: 160px;
	padding: .75rem;
	font-size: 22px
}

%buttonblue {
	@extend %button;
	color: white;
	background-color: blue
}

%buttonred {
	@extend %button;
	color: black;
	background-color: red
}

%buttondisabled {
	pointer-events: none;
	opacity: .6
}

span.btn {
	@extend %buttonblue;
	display: inline-block
}

menu button {@extend %buttonred}

form {
	button {
		@extend %buttonblue;
		&[:state='disabled'] {@extend %buttondisabled}
	}
}
```
######Output
```css
.next-slide,
menu button,
form button {
	width: 160px;
	padding: .75rem;
	font-size: 22px
}

.next-slide,
form button {
	color: white;
	background-color: blue
}

menu button {
	color: black;
	background-color: red
}

form button[data-state='disabled'] {
	pointer-events: none;
	opacity: .6
}

span.btn {
	display: inline-block
}
```

####Custom properties
Custom properties allow for shorthand syntax to be expanded based on variables. In the descriptions below, the expected property values are indicated with `$`.
```css
/* this guide says */
size: $width $height;

/* which could be used as */
size: 100% 25px;

/* which outputs */
width: 100%;
height: 25px;
```
The properties often rely on the number of inputs to evaluate their output. The order in which inputs are entered is important.
######size
```css
/* input */
size: $width $height;

size: $size;

/* output */
width: $width;
height: $height;

width: $size;
height: $size;
```
######typeface
```css
/* input */
typeface: $font-family $font-size $color;
typeface: $font-family $font-size;

/* output */
font-family: $font-family;
font-size: $font-size;
color: $color;
```
######flexbox
```css
/* input */
flexbox: $flex-direction $flex-wrap $justify-content $align-items $align-content;
flexbox: $flex-wrap $justify-content $align-items $align-content;
flexbox: $flex-direction $justify-content $align-items;
flexbox: $justify-content $align-items;
flexbox: $justify-content;

/* output */
flex-direction: $flex-direction;
flex-wrap: $flex-wrap;
justify-content: $justify-content;
align-items: $align-items;
align-content: $align-content;
```
######ease
The easing alias defined in settings will be automatically used. If no property is defined, 'all' is used.
```css
/* input */
ease: $property $duration $delay;
ease: $property $duration;
ease: $duration;

/* output */
transition: $property $duration easing(from settings) $delay;
```
######bg-cover
```css
/* input */
bg-cover: $url;

/* output */
background-image: url($url);
background-size: cover;
background-position: center;
```
######colors
```css
/* input */
colors: $color $background-color;

/* output */
color: $color;
background-color: $background-color;
```

####Shortcuts
* **Alpha channel**

	Input `#0a82b4.5` or `blue.5` will output `rgba(10,130,180,.5)`
* **PX to REM**

	font-sizes defined with `px` will be converted to `rem`
* **Data-attribute selector**

	`button[:state='disabled']` will output `button[data-state='disabled']`
* **Shorthand position**

	Writing `absolute: top left;` will output `position: absolute; top: 0; left: 0;`. Adding a measurement unit after a position, eg. `fixed: top 50% left 200px;` will ouput `position: fixed; top: 50%; left: 200px;`

####Preconfigured aliases
######Flexbox
```
down   > column
up     > column-reverse
back   > row-reverse
spread > space-around
push   > space-between
start  > flex-start
end    > flex-end
```

######Background
```
bg-img   > background-image
bg-color > background-color
bg-pos   > background-position
bg-size  > background-size
```



##JS Linting
Linting is provided by [jsHint](https://github.com/spalger/gulp-jshint) and will output warnings and errors directly to the command line.

All files under `./lib/` will be concatenated and minified to `./lib.js` using [uglify](https://github.com/terinjokes/gulp-uglify) but will not be linted as some libraries can throw lint errors that will stop BrowserSync.



##SVG Icons
An SVG icon spritesheet will be generated from all `.svg` under `./dev/svg-icons/` that ends up in `./assets/icons.svg`. The file is then inlined at the top of the `<body>` element.

To use an icon in your document, for example an icon who's original filename is `logo.svg`, type out `<icon>#logo</icon>`. Once compiled, this will become `<svg class="icon"><use xlink:href="#logo"></use></svg>`. To style it in CSS, use `.icon` class selector.



##BrowserSync
For full documentation, see the [BrowserSync](https://www.browsersync.io) website. To launch BrowserSync with file watching, type `gulp live` in your terminal.



##Minifying
By typing `gulp dist` in your console, a new folder `./dist/` will be generated with a full copy of only necessary files for distribution. Instead of having `lib.js` and `app.js`, they will be concatenated and minified to `app.js` and the reference to `lib.js` in the html files will be removed.
