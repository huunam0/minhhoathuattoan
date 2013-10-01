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
 * @fileoverview Generating Pascal for logic blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.logic = {};

Blockly.Pascal.controls_if = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Pascal.valueToCode(this, 'IF' + n,
      Blockly.Pascal.ORDER_NONE) || 'False';
  var branch = Blockly.Pascal.statementToCode(this, 'DO' + n) || '  pass\n';
  var code = 'if ' + argument + ':\n' + branch;
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = Blockly.Pascal.valueToCode(this, 'IF' + n,
        Blockly.Pascal.ORDER_NONE) || 'False';
    branch = Blockly.Pascal.statementToCode(this, 'DO' + n) || '  pass\n';
    code += 'elif ' + argument + ':\n' + branch;
  }
  if (this.elseCount_) {
    branch = Blockly.Pascal.statementToCode(this, 'ELSE') || '  pass\n';
    code += 'else:\n' + branch;
  }
  return code;
};

Blockly.Pascal.logic_compare = function() {
  // Comparison operator.
  var mode = this.getTitleValue('OP');
  var operator = Blockly.Pascal.logic_compare.OPERATORS[mode];
  var order = Blockly.Pascal.ORDER_RELATIONAL;
  var argument0 = Blockly.Pascal.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Pascal.valueToCode(this, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Pascal.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

Blockly.Pascal.logic_operation = function() {
  // Operations 'and', 'or'.
  var operator = (this.getTitleValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.Pascal.ORDER_LOGICAL_AND :
      Blockly.Pascal.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Pascal.valueToCode(this, 'A', order) || 'False';
  var argument1 = Blockly.Pascal.valueToCode(this, 'B', order) || 'False';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Pascal.logic_negate = function() {
  // Negation.
  var argument0 = Blockly.Pascal.valueToCode(this, 'BOOL',
      Blockly.Pascal.ORDER_LOGICAL_NOT) || 'False';
  var code = 'not ' + argument0;
  return [code, Blockly.Pascal.ORDER_LOGICAL_NOT];
};

Blockly.Pascal.logic_boolean = function() {
  // Boolean values true and false.
  var code = (this.getTitleValue('BOOL') == 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.logic_null = function() {
  // Null data type.
  return ['None', Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.logic_ternary = function() {
  // Ternary operator.
  var value_if = Blockly.Pascal.valueToCode(this, 'IF',
      Blockly.Pascal.ORDER_CONDITIONAL) || 'False';
  var value_then = Blockly.Pascal.valueToCode(this, 'THEN',
      Blockly.Pascal.ORDER_CONDITIONAL) || 'None';
  var value_else = Blockly.Pascal.valueToCode(this, 'ELSE',
      Blockly.Pascal.ORDER_CONDITIONAL) || 'None';
  var code = value_then + ' if ' + value_if + ' else ' + value_else
  return [code, Blockly.Pascal.ORDER_CONDITIONAL];
};
