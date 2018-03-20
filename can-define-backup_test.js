var DefineMap = require('can-define/map/map');
var Observation = require('can-observation');
var canReflect = require('can-reflect');
var defineBackup = require('can-define-backup');
defineBackup(DefineMap);

require('steal-qunit');

var Recipe;

QUnit.module('can/define/backup', {
	setup: function () {
		Recipe = DefineMap.extend('Recipe', {
			name: 'string'
		});
	}
});

test('backing up', function () {
	var recipe = new Recipe({
		name: 'cheese'
	});
	ok(!recipe.isDirty(), 'not backedup, but clean');
	recipe.backup();
	ok(!recipe.isDirty(), 'backedup, but clean');
	recipe.name = 'blah';
	ok(recipe.isDirty(), 'dirty');
	recipe.restore();
	ok(!recipe.isDirty(), 'restored, clean');
	equal(recipe.name, 'cheese', 'name back');
});

test('backup / restore with associations', function () {
	var Instruction = DefineMap.extend('Instruction', {
		description: 'string'
	});
	var Cookbook = DefineMap.extend('Cookbook', {
		title: 'string'
	});
	var Recipe = DefineMap.extend('Recipe', {
		instructions: {
			Type: Instruction.List
		},
		cookbook: {
			Type: Cookbook
		}
	});
	var recipe = new Recipe({
		name: 'cheese burger',
		instructions: [{
			description: 'heat meat'
		}, {
			description: 'add cheese'
		}],
		cookbook: {
			title: 'Justin\'s Grillin Times'
		}
	});
	//test basic is dirty
	ok(!recipe.isDirty(), 'not backedup, but clean');
	recipe.backup();
	ok(!recipe.isDirty(), 'backedup, but clean');
	//recipe.attr('name', 'blah');
	recipe.name = 'blah';
	ok(recipe.isDirty(), 'dirty');
	recipe.restore();
	ok(!recipe.isDirty(), 'restored, clean');
	equal(recipe.name, 'cheese burger', 'name back');
	// test belongs too

	//ok(recipe.cookbook.isDirty(), 'cookbook not backedup, but clean');
	recipe.cookbook.backup();
	recipe.cookbook.title = 'Brian\'s Burgers';
	// ok(!recipe.isDirty(), 'recipe itself is clean');
	ok(recipe.isDirty(true), 'recipe is dirty if checking associations');
	recipe.cookbook.restore();
	// ok(!recipe.isDirty(true), 'recipe is now clean with checking associations');
	equal(recipe.cookbook.title, 'Justin\'s Grillin Times', 'cookbook title back');
	//try belongs to recursive restore
	recipe.cookbook.title = 'Brian\'s Burgers';
	recipe.restore();
	ok(recipe.isDirty(true), 'recipe is dirty if checking associations, after a restore');
	recipe.restore(true);
	// ok(!recipe.isDirty(true), 'cleaned all of recipe and its associations');
});

test('backup restore nested observables', function () {
	var observe = new DefineMap({
		nested: {
			test: 'property'
		}
	});
	equal(observe.nested.test, 'property', 'Nested object got converted');
	observe.backup();

	observe.nested.test = 'changed property';

	equal(observe.nested.test, 'changed property', 'Nested property changed');

	ok(observe.isDirty(true), 'Observe is dirty');
	observe.restore(true);
	equal(observe.nested.test, 'property', 'Nested object got restored');
});

test('backup removes properties that were added (#607)', function () {
	var map = new DefineMap({
		foo: 'string'
	});
	map.backup();
	map.foo = 'bar';
	ok(map.isDirty(), 'the map with an additional property is dirty');
	map.restore();
	ok(map.foo, undefined, 'there is no foo property');
});

test('isDirty wrapped in an observation should trigger changes #1417', function() {
	expect(2);
	var recipe = new Recipe({
		name: 'bread'
	});

	recipe.backup();

	var obs = new Observation(function(){
		return recipe.isDirty();
	});

	ok(!obs.get(), 'isDirty is false');

	canReflect.onValue(obs, function(){
		ok(obs.get(), 'isDirty is true and a change has occurred');
	});

	recipe.name = 'cheese';
});
