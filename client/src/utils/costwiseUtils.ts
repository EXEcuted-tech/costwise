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

export const formatMonthYear = (yyyymm: number | undefined): string => {
    if (yyyymm === undefined || yyyymm === null) {
        return 'Invalid Date';
    }

    if (!Number.isInteger(yyyymm)) {
        return 'Invalid Date';
    }

    const year = Math.floor(yyyymm / 100);
    const month = yyyymm % 100;

    if (month < 1 || month > 12) {
        return 'Invalid Date';
    }

    const date = new Date(year, month - 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${year}`;
};
