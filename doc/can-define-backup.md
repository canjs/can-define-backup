@module {can-define} can-define-backup
@parent can-ecosystem
@group can-define-backup/can-define.prototype 0 can-define.prototype
@test src/test/test.html
@package ../package.json

@signature `require('can-define-backup')`

Adds a [can-define-backup/can-define/map/map.prototype.backup],
[can-define-backup/can-define/map/map.prototype.isDirty] and
[can-define-backup/can-define/map/map.prototype.restore] method to [can-define].

@return {can-define} Exports [can-define].

@body

`can-define-backup` is a plugin that provides a dirty bit for properties on an Map,
and lets you restore the original values of an Map's properties after they are changed.

## Overview

Here is an example showing how to use [can-define-backup/can-define.prototype.backup] to save values,
`[can-define-backup/can-define/map/map.prototype.restore restore]` to restore them, and `[can-define-backup/can-define/map/map.prototype.isDirty isDirty]`

to check if the Map has changed:

```js
var DefineMap = require("can-define/map/map");
var defineBackup = require('can-define-backup');

var recipe = new DefineMap({
  title: 'Pancake Mix',
  yields: '3 batches',
  ingredients: [{
    ingredient: 'flour',
    quantity: '6 cups'
  },{
    ingredient: 'baking soda',
    quantity: '1 1/2 teaspoons'
  },{
    ingredient: 'baking powder',
    quantity: '3 teaspoons'
  },{
    ingredient: 'salt',
    quantity: '1 tablespoon'
  },{
    ingredient: 'sugar',
    quantity: '2 tablespoons'
  }]
});

defineBackup(recipe);

recipe.backup();

recipe.title = 'Flapjack Mix';
recipe.title;     // 'Flapjack Mix'
recipe.isDirty(); // true

recipe.restore();
recipe.title;     // 'Pancake Mix'
```
