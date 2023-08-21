const dateUI = function (date: any) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    if (date) {
        return date.toLocaleString();
    }

    return '';
}

const dateTimeUI = function (date: string | Date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    if (date) {
        return date.toLocaleString();
    }

    return '';
}

export { dateUI, dateTimeUI }