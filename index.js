#!/usr/bin/env node

const fs = require('fs');
const { program } = require('commander');
const { version } = require('./package.json');
const { generateMatches } = require('./generator.js');

program
  .version(version) // Use the version from package.json
    .description('Generates a Tailwind safelist.txt file from regex patterns.')
  .argument('<patternsFile>', 'Path to the patterns file (e.g., patterns.js)')
  .option(
    '-o, --output <outputFile>',
    'Path to the output file (default: tailwind-safelist.txt)',
    'tailwind-safelist.txt'
  )
  .parse(process.argv);

const patternsFile = program.args[0];
const outputFile = program.opts().output;


try {
  const patterns = require(patternsFile);

  let matches = [];
  patterns.forEach((pattern) => {
    try {
      matches.push(...generateMatches(pattern));
    } catch (error) {
      console.error(`Error processing pattern "${pattern}": ${error.message}`);
    }
  });

  const formattedMatches = matches.join('\n');

  fs.writeFileSync(outputFile, formattedMatches, 'utf8');

  console.log(`Generated matches saved to ${outputFile}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1); // Exit with an error code
}