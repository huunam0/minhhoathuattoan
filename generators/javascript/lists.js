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
 * @fileoverview Generating JavaScript for list blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.JavaScript.lists = {}

Blockly.JavaScript.lists_create_empty = function() {
  // Create an empty list.
  return ['[]', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.JavaScript.valueToCode(this, 'ADD' + n,
        Blockly.JavaScript.ORDER_COMMA) || 'null';
  }
  code = '[' + code.join(', ') + ']';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.lists_repeat = function() {
  // Create a list with one element repeated.
  if (!Blockly.JavaScript.definitions_['lists_repeat']) {
    // Function copied from Closure's goog.array.repeat.
    var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
        'lists_repeat', Blockly.Generator.NAME_TYPE);
    Blockly.JavaScript.lists_repeat.repeat = functionName;
    var func = [];
    func.push('function ' + functionName + '(value, n) {');
    func.push('  var array = [];');
    func.push('  for (var i = 0; i < n; i++) {');
    func.push('    array[i] = value;');
    func.push('  }');
    func.push('  return array;');
    func.push('}');
    Blockly.JavaScript.definitions_['lists_repeat'] = func.join('\n');
  }
  var argument0 = Blockly.JavaScript.valueToCode(this, 'ITEM',
      Blockly.JavaScript.ORDER_COMMA) || 'null';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'NUM',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var code = Blockly.JavaScript.lists_repeat.repeat +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
//begin thnam#20130902 code for Nhap day so
Blockly.JavaScript.lists_input_n = function() {
  // Create a list by enter values
  
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST',Blockly.JavaScript.ORDER_COMMA) || '[]';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'NUM',Blockly.JavaScript.ORDER_COMMA) || '1';
  var code = argument0+"=[0];\n";
  code += "for (var _li=1;_li<="+argument1+";_li++)\n\t "+argument0+".push(window.parseInt(window.prompt('Nhap phan tu "+argument0+"['+_li+']')));\n";
  //window.parseInt(window.prompt('"+Blockly.LANG_VARIABLES_INPUT_VALUE_TOOLTIP+' '+argument0+"["+_li+"]))
  return code;
};
//end thnam#20130902
//begin thnam#20130904 code for Xuat day so
Blockly.JavaScript.lists_output_n = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST',Blockly.JavaScript.ORDER_COMMA) || '[]';
  var code = "window.alert("+argument0+".join(', ').substr(3));\n";
  return code;
};
//end thnam#20130904
Blockly.JavaScript.lists_length = function() {
  // List length.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\'';
  return [argument0 + '.length', Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript.lists_isEmpty = function() {
  // Is the list empty?
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  return ['!' + argument0 + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
};

Blockly.JavaScript.lists_indexOf = function() {
  // Find an item in the list.
  var operator = this.getTitleValue('END') == 'FIRST' ?
      'indexOf' : 'lastIndexOf';
  var argument0 = Blockly.JavaScript.valueToCode(this, 'FIND',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript.lists_getIndex = function() {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.JavaScript.valueToCode(this, 'AT',
      Blockly.JavaScript.ORDER_UNARY_NEGATION) || '1';
  var list = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '[0]';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.shift()';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.shift();\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '.slice(-1)[0]';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.pop()';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    } else if (mode == 'REMOVE') {
      return list + '.pop();\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseFloat(at) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at += ' - 1';
    }
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    } else if (mode == 'GET_REMOVE') {
      var code = list + '.splice(' + at + ', 1)[0]';
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    } else if (mode == 'REMOVE') {
      return list + '.splice(' + at + ', 1);\n';
    }
  } else if (where == 'FROM_END') {
    if (mode == 'GET') {
      var code = list + '.slice(-' + at + ')[0]';
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    } else if (mode == 'GET_REMOVE' || mode == 'REMOVE') {
      if (!Blockly.JavaScript.definitions_['lists_remove_from_end']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'lists_remove_from_end', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.lists_getIndex.lists_remove_from_end = functionName;
        var func = [];
        func.push('function ' + functionName + '(list, x) {');
        func.push('  x = list.length - x;');
        func.push('  return list.splice(x, 1)[0];');
        func.push('}');
        Blockly.JavaScript.definitions_['lists_remove_from_end'] =
            func.join('\n');
      }
      code = Blockly.JavaScript.lists_getIndex.lists_remove_from_end +
          '(' + list + ', ' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + ';\n';
      }
    }
  } else if (where == 'RANDOM') {
    if (!Blockly.JavaScript.definitions_['lists_get_random_item']) {
      var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
          'lists_get_random_item', Blockly.Generator.NAME_TYPE);
      Blockly.JavaScript.lists_getIndex.random = functionName;
      var func = [];
      func.push('function ' + functionName + '(list, remove) {');
      func.push('  var x = Math.floor(Math.random() * list.length);');
      func.push('  if (remove) {');
      func.push('    return list.splice(x, 1)[0];');
      func.push('  } else {');
      func.push('    return list[x];');
      func.push('  }');
      func.push('}');
      Blockly.JavaScript.definitions_['lists_get_random_item'] =
          func.join('\n');
    }
    code = Blockly.JavaScript.lists_getIndex.random +
        '(' + list + ', ' + (mode != 'GET') + ')';
    if (mode == 'GET' || mode == 'GET_REMOVE') {
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    } else if (mode == 'REMOVE') {
      return code + ';\n';
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};
//BEGIN thnam#20130904 implement code for A[i]
Blockly.JavaScript.lists_getElement = function() {
  // Get element at index.
  var at = Blockly.JavaScript.valueToCode(this, 'NUM',
      Blockly.JavaScript.ORDER_UNARY_NEGATION) || '1';
  var list = Blockly.JavaScript.valueToCode(this, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var code = list + '[' + at + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};
//END thnam#20130904 
//BEGIN thnam#20130908 implement code for A[i]=x
Blockly.JavaScript.lists_setElement = function() {
  // Set element at index i.
  var at = Blockly.JavaScript.valueToCode(this, 'NUM',
      Blockly.JavaScript.ORDER_UNARY_NEGATION) || '1';
  var vto = Blockly.JavaScript.valueToCode(this, 'TO',
      Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';

  var list = Blockly.JavaScript.valueToCode(this, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var code = list + '[' + at + ']='+vto;
  return code;
};
//END thnam#20130908 
Blockly.JavaScript.lists_setIndex = function() {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.JavaScript.valueToCode(this, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var mode = this.getTitleValue('MODE') || 'GET';
  var where = this.getTitleValue('WHERE') || 'FROM_START';
  var at = Blockly.JavaScript.valueToCode(this, 'AT',
      Blockly.JavaScript.ORDER_NONE) || '1';
  var value = Blockly.JavaScript.valueToCode(this, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'tmp_list', Blockly.Variables.NAME_TYPE);
    var code = 'var ' + listVar + ' = ' + list + ';\n';
    list = listVar;
    return code;
  }
  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.unshift(' + value + ');\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      var code = cacheList();
      code += list + '[' + list + '.length - 1] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      return list + '.push(' + value + ');\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseFloat(at) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at += ' - 1';
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + ';\n';
    } else if (mode == 'INSERT') {
      return list + '.splice(' + at + ', 0, ' + value + ');\n';
    }
  } else if (where == 'FROM_END') {
    var code = cacheList();
    if (mode == 'SET') {
      code += list + '[' + list + '.length - ' + at + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      code += list + '.splice(' + list + '.length - ' + at + ', 0, ' + value +
          ');\n';
      return code;
    }
  } else if (where == 'RANDOM') {
    var code = cacheList();
    var xVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'tmp_x', Blockly.Variables.NAME_TYPE);
    code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
        '.length);\n';
    if (mode == 'SET') {
      code += list + '[' + xVar + '] = ' + value + ';\n';
      return code;
    } else if (mode == 'INSERT') {
      code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
      return code;
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};

Blockly.JavaScript.lists_getSublist = function() {
  // Get sublist.
  var list = Blockly.JavaScript.valueToCode(this, 'LIST',
      Blockly.JavaScript.ORDER_MEMBER) || '[]';
  var where1 = this.getTitleValue('WHERE1');
  var where2 = this.getTitleValue('WHERE2');
  var at1 = Blockly.JavaScript.valueToCode(this, 'AT1',
      Blockly.JavaScript.ORDER_NONE) || '1';
  var at2 = Blockly.JavaScript.valueToCode(this, 'AT2',
      Blockly.JavaScript.ORDER_NONE) || '1';
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = list + '.concat()';
  } else {
    if (!Blockly.JavaScript.definitions_['lists_get_sublist']) {
      var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
          'lists_get_sublist', Blockly.Generator.NAME_TYPE);
      Blockly.JavaScript.lists_getSublist.func = functionName;
      var func = [];
      func.push('function ' + functionName +
          '(list, where1, at1, where2, at2) {');
      func.push('  function getAt(where, at) {');
      func.push('    if (where == \'FROM_START\') {');
      func.push('      at--;');
      func.push('    } else if (where == \'FROM_END\') {');
      func.push('      at = list.length - at;');
      func.push('    } else if (where == \'FIRST\') {');
      func.push('      at = 0;');
      func.push('    } else if (where == \'LAST\') {');
      func.push('      at = list.length - 1;');
      func.push('    } else {');
      func.push('      throw \'Unhandled option (lists_getSublist).\';');
      func.push('    }');
      func.push('    return at;');
      func.push('  }');
      func.push('  at1 = getAt(where1, at1);');
      func.push('  at2 = getAt(where2, at2) + 1;');
      func.push('  return list.slice(at1, at2);');
      func.push('}');
      Blockly.JavaScript.definitions_['lists_get_sublist'] =
          func.join('\n');
    }
    var code = Blockly.JavaScript.lists_getSublist.func + '(' + list + ', \'' +
        where1 + '\', ' + at1 + ', \'' + where2 + '\', ' + at2 + ')';
  }
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
