/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Pascal for loop blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.control = {};

Blockly.Pascal.controls_repeat = function() {
  // Repeat n times (internal number).
  var repeats = parseInt(this.getTitleValue('TIMES'), 10);
  var branch = Blockly.Pascal.statementToCode(this, 'DO') || '  pass\n';
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var loopVar = Blockly.Pascal.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
};

Blockly.Pascal.controls_repeat_ext = function() {
  // Repeat n times (external number).
  var repeats = Blockly.Pascal.valueToCode(this, 'TIMES',
      Blockly.Pascal.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'int(' + repeats + ')';
  }
  var branch = Blockly.Pascal.statementToCode(this, 'DO') || '  pass\n';
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var loopVar = Blockly.Pascal.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
};

Blockly.Pascal.controls_whileUntil = function() {
  // Do while/until loop.
  var until = this.getTitleValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Pascal.valueToCode(this, 'BOOL',
      until ? Blockly.Pascal.ORDER_LOGICAL_NOT :
      Blockly.Pascal.ORDER_NONE) || 'False';
  var branch = Blockly.Pascal.statementToCode(this, 'DO') || '  pass\n';
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + this.id + '"') + branch;
  }
  if (this.getTitleValue('MODE') == 'UNTIL') {
    if (!argument0.match(/^\w+$/)) {
      argument0 = '(' + argument0 + ')';
    }
    argument0 = 'not ' + argument0;
  }
  return 'while ' + argument0 + ':\n' + branch;
};

Blockly.Pascal.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Pascal.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Pascal.valueToCode(this, 'FROM',
      Blockly.Pascal.ORDER_NONE) || '0';
  var argument1 = Blockly.Pascal.valueToCode(this, 'TO',
      Blockly.Pascal.ORDER_NONE) || '0';
  var increment = Blockly.Pascal.valueToCode(this, 'BY',
      Blockly.Pascal.ORDER_NONE) || '1';
  var branch = Blockly.Pascal.statementToCode(this, 'DO') || '  pass\n';
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + this.id + '"') + branch;
  }

  var code = '';
  var range;

  // Helper functions.
  var defineUpRange = function() {
    return Blockly.Pascal.provideFunction_(
        'upRange',
        ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ +
            '(start, stop, step):',
         '  while start <= stop:',
         '    yield start',
         '    start += abs(step)']);
  };
  var defineDownRange = function() {
    return Blockly.Pascal.provideFunction_(
        'downRange',
        ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ +
            '(start, stop, step):',
         '  while start >= stop:',
         '    yield start',
         '    start -= abs(step)']);
  };
  // Arguments are legal Pascal code (numbers or strings returned by scrub()).
  var generateUpDownRange = function(start, end, inc) {
    return '(' + start + ' <= ' + end + ') and ' +
        defineUpRange() + '(' + start + ', ' + end + ', ' + inc + ') or ' +
        defineDownRange() + '(' + start + ', ' + end + ', ' + inc + ')';
  };

  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All parameters are simple numbers.
    argument0 = parseFloat(argument0);
    argument1 = parseFloat(argument1);
    increment = Math.abs(parseFloat(increment));
    if (argument0 % 1 === 0 && argument1 % 1 === 0 && increment % 1 === 0) {
      // All parameters are integers.
      if (argument0 <= argument1) {
        // Count up.
        argument1++;
        if (argument0 == 0 && increment == 1) {
          // If starting index is 0, omit it.
          range = argument1;
        } else {
          range = argument0 + ', ' + argument1;
        }
        // If increment isn't 1, it must be explicit.
        if (increment != 1) {
          range += ', ' + increment;
        }
      } else {
        // Count down.
        argument1--;
        range = argument0 + ', ' + argument1 + ', -' + increment;
      }
      range = 'range(' + range + ')';
    } else {
      // At least one of the parameters is not an integer.
      if (argument0 < argument1) {
        range = defineUpRange();
      } else {
        range = defineDownRange();
      }
      range += '(' + argument0 + ', ' +  argument1 + ', ' + increment + ')';
    }
  } else {
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var scrub = function(arg, suffix) {
      if (Blockly.isNumber(arg)) {
        // Simple number.
        arg = parseFloat(arg);
      } else if (arg.match(/^\w+$/)) {
        // Variable.
        arg = 'float(' + arg + ')';
      } else {
        // It's complicated.
        var varName = Blockly.Pascal.variableDB_.getDistinctName(
            variable0 + suffix, Blockly.Variables.NAME_TYPE);
        code += varName + ' = float(' + arg + ')\n';
        arg = varName;
      }
      return arg;
    };
    var startVar = scrub(argument0, '_start');
    var endVar = scrub(argument1, '_end');
    var incVar = scrub(increment, '_inc');

    if (typeof startVar == 'number' && typeof endVar == 'number') {
      if (startVar < endVar) {
        range = defineUpRange(startVar, endVar, increment);
      } else {
        range = defineDownRange(startVar, endVar, increment);
      }
    } else {
      // We cannot determine direction statically.
      range = generateUpDownRange(startVar, endVar, increment);
    }
  }
  code += 'for ' + variable0 + ' in ' + range + ':\n' + branch;
  return code;
};

Blockly.Pascal.controls_forEach = function() {
  // For each loop.
  var variable0 = Blockly.Pascal.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Pascal.valueToCode(this, 'LIST',
      Blockly.Pascal.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Pascal.statementToCode(this, 'DO') || '  pass\n';
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + this.id + '"') + branch;
  }
  var code = 'for ' + variable0 + ' in ' + argument0 + ':\n' + branch;
  return code;
};

Blockly.Pascal.controls_flow_statements = function() {
  // Flow statements: continue, break.
  switch (this.getTitleValue('FLOW')) {
    case 'BREAK':
      return 'break\n';
    case 'CONTINUE':
      return 'continue\n';
  }
  throw 'Unknown flow statement.';
};
