IndexersImplementations = function() {
    this.implementations = {
        'newznab': {
            name: 'Newznab',
            id: 'newznab',
            rss: true,
            search: true,
            settings: {
                url: {
                    name: 'URL',
                    field_name: 'url',
                    type: 'text'
                },
                api_key: {
                    name: 'API Key',
                    field_name: 'api_key',
                    type: 'text'
                }
            },
            class: Newznab
        }
    }
}
