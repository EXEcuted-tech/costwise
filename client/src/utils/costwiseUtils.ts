export const formatHeader = (key: string, knownAcronyms?: string[]): string => {
    const defaultKnownAcronyms = ['gl'];
    const allKnownAcronyms = [...defaultKnownAcronyms, ...(knownAcronyms || [])];

    const words = key.split(/(?=[A-Z])|\s|_/).filter(word => word.length > 0);

    const formattedWords = words.map(word => {
        const lowerWord = word.toLowerCase();

        if (allKnownAcronyms.includes(lowerWord)) {
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

export const transformMonthYearToDate = (monthYearInt: number): string => {
    const year = Math.floor(monthYearInt / 100);
    const month = monthYearInt % 100;            
  
    if (month < 1 || month > 12) {
      throw new Error('Invalid month value in monthYear.');
    }
  
    const pad = (n: number): string => (n < 10 ? '0' + n : n.toString());
    const formattedDate = `${year}-${pad(month)}-01`;
  
    return formattedDate;
};