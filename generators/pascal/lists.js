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
 * @fileoverview Generating Pascal for list blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.lists = {};

Blockly.Pascal.lists_create_empty = function() {
  // Create an empty list.
  return ['[]', Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Pascal.valueToCode(this, 'ADD' + n,
        Blockly.Pascal.ORDER_NONE) || 'None';
  }
  code = '[' + code.join(', ') + ']';
  return [code, Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.lists_repeat = function() {
  // Create a list with one element repeated.
  var argument0 = Blockly.Pascal.valueToCode(this, 'ITEM',
      Blockly.Pascal.ORDER_NONE) || 'None';
  var argument1 = Blockly.Pascal.valueToCode(this, 'NUM',
      Blockly.Pascal.ORDER_MULTIPLICATIVE) || '0';
  var code = '[' + argument0 + '] * ' + argument1;
  return [code, Blockly.Pascal.ORDER_MULTIPLICATIVE];
};

Blockly.Pascal.lists_length = function() {
  // List length.
  var argument0 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_NONE) || '[]';
  return ['len(' + argument0 + ')', Blockly.Pascal.ORDER_FUNCTION_CALL];
};

Blockly.Pascal.lists_isEmpty = function() {
  // Is the list empty?
  var argument0 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_NONE) || '[]';
  var code = 'not len(' + argument0 + ')';
  return [code, Blockly.Pascal.ORDER_LOGICAL_NOT];
};

Blockly.Pascal.lists_indexOf = function() {
  // Find an item in the list.
  var argument0 = Blockly.Pascal.valueToCode(this, 'FIND',
      Blockly.Pascal.ORDER_NONE) || '[]';
  var argument1 = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_MEMBER) || '\'\'';
  var code;
  if (this.getTitleValue('END') == 'FIRST') {
    var functionName = Blockly.Pascal.provideFunction_(
        'first_index',
        ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(myList, elem):',
         '  try: theIndex = myList.index(elem) + 1',
         '  except: theIndex = 0',
         '  return theIndex']);
    code = functionName + '(' + argument1 + ', ' + argument0 + ')';
    return [code, Blockly.Pascal.ORDER_MEMBER];
  } else {
    var functionName = Blockly.Pascal.provideFunction_(
        'last_index',
        ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(myList, elem):',
         '  try: theIndex = len(myList) - myList[::-1].index(elem)',
         '  except: theIndex = 0',
         '  return theIndex']);
    code = functionName + '(' + argument1 + ', ' + argument0 + ')';
    return [code, Blockly.Pascal.ORDER_MEMBER];
  }
};

Blockly.Pascal.lists_getIndex = function() {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Pascal.valueToCode(this, 'AT',
      Blockly.Pascal.ORDER_UNARY_SIGN) || '1';
  var list = Blockly.Pascal.valueToCode(this, 'VALUE',
      Blockly.Pascal.ORDER_MEMBER) || '[]';

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '[0]';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    } else {
      var code = list + '.pop(0)';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '[-1]';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    } else {
      var code = list + '.pop()';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = 'int(' + at + ' - 1)';
    }
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    } else {
      var code = list + '.pop(' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'FROM_END') {
    if (mode == 'GET') {
      var code = list + '[-' + at + ']';
      return [code, Blockly.Pascal.ORDER_MEMBER];
    } else {
      var code = list + '.pop(-' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'RANDOM') {
    Blockly.Pascal.definitions_['import_random'] = 'import random';
    if (mode == 'GET') {
      code = 'random.choice(' + list + ')';
      return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
    } else {
      var functionName = Blockly.Pascal.provideFunction_(
          'lists_remove_random_item',
          ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
           '  x = int(random.random() * len(myList))',
           '  return myList.pop(x)']);
      code = functionName + '(' + list + ')';
      if (mode == 'GET' || mode == 'GET_REMOVE') {
        return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};

Blockly.Pascal.lists_setIndex = function() {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.Pascal.valueToCode(this, 'LIST',
      Blockly.Pascal.ORDER_MEMBER) || '[]';
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.Pascal.valueToCode(this, 'AT',
      Blockly.Pascal.ORDER_NONE) || '1';
  var value = Blockly.Pascal.valueToCode(this, 'TO',
      Blockly.Pascal.ORDER_NONE) || 'None';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.Pascal.variableDB_.getDistinctName(
        'tmp_list', Blockly.Variables.NAME_TYPE);
    var code = listVar + ' = ' + list + '\n';
    list = listVar;
    return code;
  }
  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.insert(0, ' + value + ')\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      return list + '[-1] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.append(' + value + ')\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = 'int(' + at + ' - 1)';
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.insert(' + at + ', ' + value + ')\n';
    }
  } else if (where == 'FROM_END') {
    if (mode == 'SET') {
      return list + '[-' + at + '] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.insert(-' + at + ', ' + value + ')\n';
    }
  } else if (where == 'RANDOM') {
    Blockly.Pascal.definitions_['import_random'] = 'import random';
    var code = cacheList();
    var xVar = Blockly.Pascal.variableDB_.getDistinctName(
        'tmp_x', Blockly.Variables.NAME_TYPE);
    code += xVar + ' = int(random.random() * len(' + list + '))\n';
    if (mode == 'SET') {
      code += list + '[' + xVar + '] = ' + value + '\n';
      return code;
    } else if (mode == 'INSERT') {
      code += list + '.insert(' + xVar + ', ' + value + ')\n';
      return code;
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};

Blockly.Pascal.lists_getSublist = function() {
  // Get sublist.
  var list = Blockly.Pascal.valueToCode(this, 'LIST',
      Blockly.Pascal.ORDER_MEMBER) || '[]';
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
      // Add special case for -0.
      at2 = 1 - parseInt(at2, 10);
      if (at2 == 0) {
        at2 = '';
      }
    } else {
      // If the index is dynamic, increment it in code.
      Blockly.Pascal.definitions_['import_sys'] = 'import sys';
      at2 = 'int(1 - ' + at2 + ') or sys.maxsize';
    }
  }
  var code = list + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Pascal.ORDER_MEMBER];
};
