var _Implementations = function() {
    this.implementations = {}
}

_Implementations.prototype.get = function(implementation) {
    return this.implementations[implementation];
}

_Implementations.prototype.getClass = function(implementation) {
    return this.implementations[implementation].class;
}

_Implementations.prototype._register = function(downloaderClass, onlyDefinition) {
    console.log(downloaderClass);
    var definition = downloaderClass.definition;
    if (!onlyDefinition) {
        definition.class = downloaderClass;
    }
    return this.implementations[downloaderClass.definition.id] = definition;
}

DownloadersImplementations = new _Implementations();
