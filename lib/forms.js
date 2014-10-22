// Formats
Mesosphere.registerFormat('true-boolean', function(val) {
    var regex = /^(yes|no|true|false|0|1|on|off)$/i
    return regex.test(val);
});

// Settings

// Indexers
Mesosphere({
    name: 'newznabForm',
    disableSubmit: true,
    fields: {
        name: {
            required: true,
            message: 'The name is required'
        },
        rss: {
            required: true,
            format: 'true-boolean'
        },
        search: {
            required: true,
            format: 'true-boolean'
        },
        url: {
            required: true,
            format: 'url'
        },
        api_key: {
            required: true
        }
    },
    onSuccess: function(formData, formHandle) {
    }
});
