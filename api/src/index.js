// This allows us to use the new ESM syntax. https://medium.com/web-on-the-edge/tomorrows-es-modules-today-c53d29ac448c
require = require("esm")(module)
module.exports = require("./main.js")