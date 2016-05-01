// Evaluator.js
// ----------------------------------------
// Evaluates an AST

var exec = require('child_process').execSync;
var streamify = require('./streamify');

var Evaluator = function() {
  this.table = {};

  this._evaluate = function(command) {
    var stdout = exec(command);
    console.log(stdout.toString());
  }

  this._queue = function(node, scope) {
    node = JSON.parse(node);
    if (node.type === 'TaskDeclaration') {
      scope.table[node.id] = node.commands;
      return;
    }
    if (node.type === 'TaskInvocation') {
      var commands = scope.table[node.id];
      if (!commands) throw new Error('Unknown task');
      commands.forEach(this.push.bind(this));
      return;
    }
  }

  this.evaluate = streamify(this._evaluate);
  this.queue = streamify(this._queue, this);
}

module.exports = Evaluator;
