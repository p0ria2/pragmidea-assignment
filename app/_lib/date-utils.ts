export function getMonthName(date: Date, monthType: Intl.DateTimeFormatOptions['month']) {
    return new Intl.DateTimeFormat('en-US', { month: monthType }).format(date);
}