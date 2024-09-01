export const formatHeader = (key: string, knownAcronyms?: string[]): string => {
    // const knownAcronyms = ['rm', 'total'];

    const words = key.split(/(?=[A-Z])|\s|_/).filter(word => word.length > 0);

    const formattedWords = words.map(word => {
        const lowerWord = word.toLowerCase();

        if (knownAcronyms?.includes(lowerWord)) {
            return lowerWord.toUpperCase();
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return formattedWords.join(' ').trim();
};
