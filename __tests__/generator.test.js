const { generateMatches } = require('../generator');

describe('generateMatches', () => {
    it('should generate matches for a simple pattern', () => {
        const pattern = 'text-blue-500';
        const matches = generateMatches(pattern);
        expect(matches).toEqual([pattern]);
    });

    it('should generate matches for a pattern with alternatives', () => {
        const pattern = 'text-(blue|red)-500';
        const matches = generateMatches(pattern);
        expect(matches).toEqual(['text-blue-500', 'text-red-500']);
    });

    it('should handle (hover:|) correctly', () => {
        const pattern = '(hover:|)text-blue-500';
        const matches = generateMatches(pattern);
        expect(matches).toEqual(expect.arrayContaining(['text-blue-500', 'hover:text-blue-500']));
    });

    it('should allow escaped hyphens', () => {
        const pattern = 'text\\-blue';
        const matches = generateMatches(pattern);
        expect(matches).toEqual(['text\\-blue']);
    });

    it('should throw an error for lookarounds', () => {
        const pattern = 'text(?=blue)';
        expect(() => generateMatches(pattern)).toThrowError();
    });

    it('should handle multiple groups', () => {
        const pattern = '(sm:|md:|lg:|)text-(blue|red)-500';
        const matches = generateMatches(pattern);
        expect(matches).toEqual(expect.arrayContaining([
            'text-blue-500',
            'text-red-500',
            'sm:text-blue-500',
            'sm:text-red-500',
            'md:text-blue-500',
            'md:text-red-500',
            'lg:text-blue-500',
            'lg:text-red-500',
        ]));
        expect(matches.length).toBe(8); // Ensure the correct number of matches
    });
});