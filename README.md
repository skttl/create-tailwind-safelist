# Tailwind CSS Safelist Generator

**Are you missing your regex based safelist after upgrading to Tailwind CSS 4?**

With this command-line tool, you can generate a text file containing all safelisted class values, based on your regex patterns.

This helps ensure that all necessary Tailwind classes are included in your production build, even those generated dynamically.

## Features

*   Generates a list of Tailwind CSS classes based on provided regex patterns.
*   Supports patterns with alternatives (e.g., `text-(blue|red)-500`).
*   Provides a command-line interface for easy integration into your build process.
*   Allows specifying an output file.
*   Includes basic regex validation to prevent potentially dangerous patterns.

## Usage

```bash
npx tailwind-safelist-generator@latest <patternsFile> [options]
```

- `<patternsFile>`: Path to a JavaScript file containing an array of regex patterns.

### Options
- `-o`, `--output` <outputFile>: Path to the output file (default: tailwind-safelist.txt).
  
### Example patterns.js

```js
module.exports = [
  '(sm:|md:|lg:)text-(blue|red)-500',
  '(hover:|)text-blue-500',
  'text\-blue', // Example with escaped hyphen
];
```

### Generating the safelist

To generate the safelist, run the following command:

```bash
npx tailwind-safelist-generator@latest ./patterns.js -o ./my-safelist.txt
```

This will read the patterns from `patterns.js` and write the generated safelist to `my-safelist.txt`. If you omit the `-o` option, the output will be written to `tailwind-safelist.txt`.

### Integrating with Tailwind CSS

1. **Generate the safelist:** Run `tailwind-safelist-generator` to generate the `tailwind-safelist.txt` file.
2. **Configure Tailwind CSS:** If you add `tailwind-safelist.txt` to your `.gitignore` file, you need to [manually specify it as a source](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources) in your css file.

## Regex Pattern Restrictions

To prevent potentially dangerous regular expressions (or in other words: prevent infinite loops while generating the safelist), the following restrictions are enforced:

- The following metacharacters are disallowed unless escaped: `*`, `+`, `?`, `{`, `}`, `[`, `]`, `^`, `$`, `.`
- Lookarounds `((?=...)`, `(?!...)`, `(?<=...)`, `(?<!...))` are disallowed.
- Backreferences (`\1`, `\2`, etc.) are disallowed.

These restrictions are in place to prevent the generator from infinite loops while generating the safelist.

## Error Handling

The tool will display an error message if it encounters an invalid regex pattern in the patterns.js file. It will also exit with a non-zero exit code to indicate that an error occurred.

## Contributing
Contributions are welcome! Please submit a pull request with your changes.

## License
MIT