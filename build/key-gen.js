const chalk = require("chalk");
const keypair = require("keypair");
const prettyHrtime = require("pretty-hrtime");
const fs = require("fs-extra");

const pair = keypair();
const start = process.hrtime();
fs.outputFileSync("src/certs/private.key",pair.private);
fs.outputFileSync("src/certs/public.key",pair.public);

const end = process.hrtime(start);
console.log(chalk.greenBright(`✓ key files generated (${prettyHrtime(end)})`));

