UI.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});

UI.registerHelper('dayOfMonth', function(date) {
    console.log(typeof date);
    if (typeof date == 'number') {
        return moment.unix(date).format('DD');
    }
    return moment(date).format('DD');
});

UI.registerHelper('dayOfWeek', function(date) {
    if (typeof date == 'number') {
        return moment.unix(date).format('dddd');
    }
    return moment(date).format('dddd');
});

UI.registerHelper('shortMonth', function(date) {
    if (typeof date == 'number') {
        return moment.unix(date).format('MMM');
    }
    return moment(date).format('MMM');
});

UI.registerHelper('date', function(date) {
    if (typeof date == 'number') {
        return moment.unix(date).format('LLLL');
    }
    return moment(date).format('LLLL');
});

UI.registerHelper('shortDate', function(date) {
    if (typeof date == 'number') {
        return moment.unix(date).format('LL');
    }
    return moment(date).format('LL');
});

UI.registerHelper('humanTime', function(date, timeIn) {
    var timeIn = timeIn || 's'
    if (typeof date == 'number') {
        if (timeIn == 'ms') {
            date = date / 1000;
        }
        return moment.unix(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    }
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

UI.registerHelper('length', function(value) {
    console.log(typeof value);
    if (typeof value == 'object') {
        return value.count();
    }

    return value.length;
});
