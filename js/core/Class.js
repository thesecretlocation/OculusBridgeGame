///////////////////////////////////////////////////////////////////////////////////////////////////////////
// SUPPORT CODE - This is the base for the inheritance structure
// - Do not edit this class
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function CoreClass() {}
CoreClass.prototype.construct = function() {};
CoreClass.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== CoreClass) { this.construct.apply(this, arguments); }
    };
    
    var proto = new this(CoreClass);
    var superClass = this.prototype;
    
    for (var n in def) {
        var item = def[n];                        
        if (item instanceof Function) item.$ = superClass;
        proto[n] = item;
    }

    classDef.prototype = proto;
    
    classDef.extend = this.extend;        
    return classDef;
};

