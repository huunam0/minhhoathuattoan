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
 * @fileoverview Generating Pascal for procedure blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.procedures = {};

Blockly.Pascal.procedures_defreturn = function() {
  // Define a procedure with a return value.
  // First, add a 'global' statement for every variable that is assigned.
  var globals = Blockly.Variables.allVariables(this);
  for (var i = globals.length - 1; i >= 0; i--) {
    var varName = globals[i];
    if (this.arguments_.indexOf(varName) == -1) {
      globals[i] = Blockly.Pascal.variableDB_.getName(varName,
          Blockly.Variables.NAME_TYPE);
    } else {
      // This variable is actually a parameter name.  Do not include it in
      // the list of globals, thus allowing it be of local scope.
      globals.splice(i, 1);
    }
  }
  globals = globals.length ? '  global ' + globals.join(', ') + '\n' : '';
  var funcName = Blockly.Pascal.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Pascal.statementToCode(this, 'STACK');
  if (Blockly.Pascal.INFINITE_LOOP_TRAP) {
    branch = Blockly.Pascal.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + this.id + '"') + branch;
  }
  var returnValue = Blockly.Pascal.valueToCode(this, 'RETURN',
      Blockly.Pascal.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + '\n';
  } else if (!branch) {
    branch = '  pass';
  }
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Pascal.variableDB_.getName(this.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'def ' + funcName + '(' + args.join(', ') + '):\n' +
      globals + branch + returnValue;
  code = Blockly.Pascal.scrub_(this, code);
  Blockly.Pascal.definitions_[funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Pascal.procedures_defnoreturn =
    Blockly.Pascal.procedures_defreturn;

Blockly.Pascal.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Pascal.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Pascal.valueToCode(this, 'ARG' + x,
        Blockly.Pascal.ORDER_NONE) || 'None';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
};

Blockly.Pascal.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Pascal.variableDB_.getName(this.getTitleValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Pascal.valueToCode(this, 'ARG' + x,
        Blockly.Pascal.ORDER_NONE) || 'None';
  }
  var code = funcName + '(' + args.join(', ') + ')\n';
  return code;
};

Blockly.Pascal.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.Pascal.valueToCode(this, 'CONDITION',
      Blockly.Pascal.ORDER_NONE) || 'False';
  var code = 'if ' + condition + ':\n';
  if (this.hasReturnValue_) {
    var value = Blockly.Pascal.valueToCode(this, 'VALUE',
        Blockly.Pascal.ORDER_NONE) || 'None';
    code += '  return ' + value + '\n';
  } else {
    code += '  return\n';
  }
  return code;
};
