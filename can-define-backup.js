//allows you to backup and restore a map instance
var compute = require('can-compute');
var DefineMap = require('can-define/map/map');
var compare = require('can-set/src/compare');
var assign = require("can-util/js/assign/assign");

var flatProps = function (a, cur) {
	var obj = {};
	for (var prop in a) {
		if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
			obj[prop] = a[prop];
		} else {
			obj[prop] = cur[prop];//cur.attr(prop);
		}
	}
	return obj;
};


// var oldSetup = DefineMap.prototype.init;

assign(DefineMap.prototype, {

	_backupStore: compute(),

	backup: function () {
		this._backupStore(this.serialize());
		return this;
	},

	isDirty: function (checkAssociations) {
		var backupStore = this._backupStore();
		if(!backupStore){
			return false;
		}
		var currentValue = this.serialize();
		var aParent, bParent, parentProp;
		var compares = {};
		var options = { deep: !! checkAssociations };

		return !compare.equal(currentValue, backupStore, aParent, bParent, parentProp, compares, options);
	},

	restore: function (restoreAssociations) {
		var props = restoreAssociations ? this._backupStore() : flatProps(this._backupStore(), this);
		if (this.isDirty(restoreAssociations)) {
			for(var prop in props) {
				this[prop] = props[prop];
			}
		}
		return this;
	}
});
module.exports = exports = DefineMap;
