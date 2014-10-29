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
    if (typeof value == 'object') {
        return value.count();
    }

    return value.length;
});

UI.registerHelper('eq', function(value1, value2) {
    return value1 == value2;
});

UI.registerHelper('in', function(list, value) {
    return list.indexOf(value) >= 0;
});

UI.registerHelper('humanSize', function(size, unit) {
    size = parseInt(size);
    var i = Math.floor( Math.log(size) / Math.log(1024) );

    return ( size / Math.pow(1024, i) ).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});


// Validation forms
UI.registerHelper('hasError', function(validated, name) {
    if (validated == undefined || validated.errors == undefined) {
        return false;
    }

    return validated.errors[name] != undefined;
});


UI.registerHelper('error', function(validated, name) {
    if (validated.errors[name] == undefined) {
        return null
    }

    return validated.errors.name.message;
});


UI.registerHelper('arrayify', function(obj){
    result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});
