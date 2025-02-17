
function highlightIssue(regexStr, match) {
    const index = regexStr.indexOf(match);
    const start = Math.max(0, index - 5);
    const end = Math.min(regexStr.length, index + match.length + 5);
    return `...${regexStr.slice(start, end)}...`;
}

function generateMatches(regexStr) {
    // Forbidden pattern: Disallows most special characters but allows
    // escaped metacharacters and \| within non-capturing groups.
    const forbiddenPattern = /([*+?{}\[\]\^$.]|\(\?(?![:<]))/;

    const match = regexStr.match(forbiddenPattern);


    if (match) {
        throw new Error(
            `Unsupported regex feature at: ${highlightIssue(regexStr, match[0])}`
        );
    }

    const matchGroups = regexStr.match(/\(([^()]+)\)/g);
    let options = [];

    if (matchGroups) {
        let basePattern = regexStr;
        matchGroups.forEach((group) => {
            let choices = group.slice(1, -1).split('|');
            options.push(choices);
            basePattern = basePattern.replace(group, '%s');
        });

        const generateCombinations = (pattern, choices, index = 0) => {
            if (index >= choices.length) return [pattern];
            return choices[index].flatMap((option) =>
                generateCombinations(pattern.replace('%s', option), choices, index + 1)
            );
        };

        const combinations = generateCombinations(basePattern, options);
        return combinations;
    }

    return [regexStr];
}

module.exports = { generateMatches };