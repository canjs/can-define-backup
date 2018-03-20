//allows you to backup and restore a map instance
var compare = require('can-set/src/compare');
var assign = require('can-assign');
var canReflect = require('can-reflect');
var SimpleObservable = require('can-simple-observable');

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

var observables = new WeakMap();

function getBackup(map) {
	var obs = observables.get(map);
	if(!obs) {
		obs = new SimpleObservable();
		observables.set(map, obs);
	}
	return obs;
}

function defineBackup(Map) {
	assign(Map.prototype, {

		backup: function () {
			var store = getBackup(this);
			canReflect.setValue(store, this.serialize());
			return this;
		},

		isDirty: function (checkAssociations) {
			var store = getBackup(this);
			var backupStore = canReflect.getValue(store);
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
			var store = getBackup(this);
			var curVal = canReflect.getValue(store);
			var props = restoreAssociations ? curVal : flatProps(curVal, this);
			if (this.isDirty(restoreAssociations)) {
				for(var prop in props) {
					this[prop] = props[prop];
				}
			}
			return this;
		}
	});
	return;
}

module.exports = exports = defineBackup;
