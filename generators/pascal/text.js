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
 * @fileoverview Generating Pascal for text blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.text = {};

Blockly.Pascal.text = function() {
  // Text value.
  var code = Blockly.Pascal.quote_(this.getTitleValue('TEXT'));
  return [code, Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.text_join = function() {
  // Create a string made up of any number of elements of any type.
  //Should we allow joining by '-' or ',' or any other characters?
  var code;
  if (this.itemCount_ == 0) {
    return ['\'\'', Blockly.Pascal.ORDER_ATOMIC];
  } else if (this.itemCount_ == 1) {
    var argument0 = Blockly.Pascal.valueToCode(this, 'ADD0',
        Blockly.Pascal.ORDER_NONE) || '\'\'';
    code = 'str(' + argument0 + ')';
    return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
  } else if (this.itemCount_ == 2) {
    var argument0 = Blockly.Pascal.valueToCode(this, 'ADD0',
        Blockly.Pascal.ORDER_NONE) || '\'\'';
    var argument1 = Blockly.Pascal.valueToCode(this, 'ADD1',
        Blockly.Pascal.ORDER_NONE) || '\'\'';
    var code = 'str(' + argument0 + ') + str(' + argument1 + ')';
    return [code, Blockly.Pascal.ORDER_UNARY_SIGN];
  } else {
    var code = [];
    for (var n = 0; n < this.itemCount_; n++) {
      code[n] = Blockly.Pascal.valueToCode(this, 'ADD' + n,
          Blockly.Pascal.ORDER_NONE) || '\'\'';
    }
    var tempVar = Blockly.Pascal.variableDB_.getDistinctName('temp_value',
        Blockly.Variables.NAME_TYPE);
    code = '\'\'.join([str(' + tempVar + ') for ' + tempVar + ' in [' +
        code.join(', ') + ']])';
    return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
  }
};

Blockly.Pascal.text_append = function() {
  // Append to a variable in place.
  var varName = Blockly.Pascal.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Pascal.valueToCode(this, 'TEXT',
      Blockly.Pascal.ORDER_NONE) || '\'\'';
  return varName + ' = str(' + varName + ') + str(' + argument0 + ')\n';
};

Blockly.Pascal.text_length = function() {
  // String length.
  var argument0 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_NONE) || '\'\'';
  return ['len(' + argument0 + ')', Blockly.Pascal.ORDER_FUNCTION_CALL];
};

Blockly.Pascal.text_isEmpty = function() {
  // Is the string null?
  var argument0 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_NONE) || '\'\'';
  var code = 'not len(' + argument0 + ')';
  return [code, Blockly.Pascal.ORDER_LOGICAL_NOT];
};

Blockly.Pascal.text_indexOf = function() {
  // Search the text for a substring.
  // Should we allow for non-case sensitive???
  var operator = this.getTitleValue('END') == 'FIRST' ? 'find' : 'rfind';
  var argument0 = Blockly.Pascal.valueToCode(this, 'FIND',
      Blockly.Pascal.ORDER_NONE) || '\'\'';
  var argument1 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.Pascal.ORDER_MEMBER];
};

Blockly.Pascal.text_charAt = function() {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Pascal.valueToCode(this, 'AT',
      Blockly.Pascal.ORDER_UNARY_SIGN) || '1';
  var text = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = text + '[0]';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    case 'LAST':
      var code = text + '[-1]';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    case 'FROM_START':
      // Blockly uses one-based indicies.
      if (Blockly.isNumber(at)) {
        // If the index is a naked number, decrement it right now.
        at = parseInt(at, 10) - 1;
      } else {
        // If the index is dynamic, decrement it in code.
        at = 'int(' + at + ' - 1)';
      }
      var code = text + '[' + at + ']';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    case 'FROM_END':
      var code = text + '[-' + at + ']';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    case 'RANDOM':
      Blockly.Pascal.definitions_['import_random'] = 'import random';
      var functionName = Blockly.Pascal.provideFunction_(
          'text_random_letter',
          ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(text):',
           '  x = int(random.random() * len(text))',
           '  return text[x];']);
      code = functionName + '(' + text + ')';
      return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
  }
  throw 'Unhandled option (text_charAt).';
};

Blockly.Pascal.text_getSubstring = function() {
  // Get substring.
  var text = Blockly.Pascal.valueToCode(this, 'STRING',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  var where1 = this.getTitleValue('WHERE1');
  var where2 = this.getTitleValue('WHERE2');
  var at1 = Blockly.Pascal.valueToCode(this, 'AT1',
      Blockly.Pascal.ORDER_ADDITIVE) || '1';
  var at2 = Blockly.Pascal.valueToCode(this, 'AT2',
      Blockly.Pascal.ORDER_ADDITIVE) || '1';
  if (where1 == 'FIRST' || (where1 == 'FROM_START' && at1 == '1')) {
    at1 = '';
  } else if (where1 == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at1)) {
      // If the index is a naked number, decrement it right now.
      at1 = parseInt(at1, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at1 = 'int(' + at1 + ' - 1)';
    }
  } else if (where1 == 'FROM_END') {
    if (Blockly.isNumber(at1)) {
      at1 = -parseInt(at1, 10);
    } else {
      at1 = '-int(' + at1 + ')';
    }
  }
  if (where2 == 'LAST' || (where2 == 'FROM_END' && at2 == '1')) {
    at2 = '';
  } else if (where1 == 'FROM_START') {
    if (Blockly.isNumber(at2)) {
      at2 = parseInt(at2, 10);
    } else {
      at2 = 'int(' + at2 + ')';
    }
  } else if (where1 == 'FROM_END') {
    if (Blockly.isNumber(at2)) {
      // If the index is a naked number, increment it right now.
      at2 = 1 - parseInt(at2, 10);
      if (at2 == 0) {
        at2 = '';
      }
    } else {
      // If the index is dynamic, increment it in code.
      // Add special case for -0.
      Blockly.Pascal.definitions_['import_sys'] = 'import sys';
      at2 = 'int(1 - ' + at2 + ') or sys.maxsize';
    }
  }
  var code = text + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Pascal.ORDER_MEMBER];
};

Blockly.Pascal.text_changeCase = function() {
  // Change capitalization.
  var mode = this.getTitleValue('CASE');
  var operator = Blockly.Pascal.text_changeCase.OPERATORS[mode];
  var argument0 = Blockly.Pascal.valueToCode(this, 'TEXT',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  var code = argument0 + operator;
  return [code, Blockly.Pascal.ORDER_MEMBER];
};

Blockly.Pascal.text_changeCase.OPERATORS = {
  UPPERCASE: '.upper()',
  LOWERCASE: '.lower()',
  TITLECASE: '.title()'
};

Blockly.Pascal.text_trim = function() {
  // Trim spaces.
  var mode = this.getTitleValue('MODE');
  var operator = Blockly.Pascal.text_trim.OPERATORS[mode];
  var argument0 = Blockly.Pascal.valueToCode(this, 'TEXT',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  var code = argument0 + operator;
  return [code, Blockly.Pascal.ORDER_MEMBER];
};

Blockly.Pascal.text_trim.OPERATORS = {
  LEFT: '.lstrip()',
  RIGHT: '.rstrip()',
  BOTH: '.strip()'
};

Blockly.Pascal.text_print = function() {
  // Print statement.
  var argument0 = Blockly.Pascal.valueToCode(this, 'TEXT',
      Blockly.Pascal.ORDER_NONE) || '\'\'';
  return 'print(' + argument0 + ')\n';
};

Blockly.Pascal.text_prompt = function() {
  // Prompt function.
  var functionName = Blockly.Pascal.provideFunction_(
      'text_prompt',
      ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(msg):',
       '  try:',
       '    return raw_input(msg)',
       '  except NameError:',
       '    return input(msg)']);
  var msg = Blockly.Pascal.quote_(this.getTitleValue('TEXT'));
  var code = functionName + '(' + msg + ')';
  var toNumber = this.getTitleValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = 'float(' + code + ')';
  }
  return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
};
