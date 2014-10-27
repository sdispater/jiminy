var _Implementations = function() {
    this.implementations = {}
}

_Implementations.prototype.get = function(implementation) {
    var definition = this.implementations[implementation];
    if (!definition) {
        throw new Error('Invalid implementation')
    }

    return definition;
}

_Implementations.prototype.getClass = function(implementation) {
    return this.get(implementation).class
}

_Implementations.prototype._register = function(downloaderClass, onlyDefinition) {
    var definition = downloaderClass.definition;
    if (!onlyDefinition) {
        definition.class = downloaderClass;
    }
    return this.implementations[downloaderClass.definition.id] = definition;
}

DownloadersImplementations = new _Implementations();
