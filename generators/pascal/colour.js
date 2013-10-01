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
 * @fileoverview Generating Pascal for colour blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal.colour = {};

Blockly.Pascal.colour_picker = function() {
  // Colour picker.
  var code = '\'' + this.getTitleValue('COLOUR') + '\'';
  return [code, Blockly.Pascal.ORDER_ATOMIC];
};

Blockly.Pascal.colour_random = function() {
  // Generate a random colour.
  Blockly.Pascal.definitions_['import_random'] = 'import random';
  var code = '\'#%06x\' % random.randint(0, 2**24 - 1)';
  return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
};

Blockly.Pascal.colour_rgb = function() {
  // Compose a colour from RGB components.
  var functionName = Blockly.Pascal.provideFunction_(
      'colour_rgb',
      [ 'def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ + '(r, g, b):',
        '  r = round(min(100, max(0, r)) * 2.55)',
        '  g = round(min(100, max(0, g)) * 2.55)',
        '  b = round(min(100, max(0, b)) * 2.55)',
        '  return \'#%02x%02x%02x\' % (r, g, b)']);
  var r = Blockly.Pascal.valueToCode(this, 'RED',
                                     Blockly.Pascal.ORDER_NONE) || 0;
  var g = Blockly.Pascal.valueToCode(this, 'GREEN',
                                     Blockly.Pascal.ORDER_NONE) || 0;
  var b = Blockly.Pascal.valueToCode(this, 'BLUE',
                                     Blockly.Pascal.ORDER_NONE) || 0;
  var code = functionName + '(' + r + ', ' + g + ', ' + b + ')';
  return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
};

Blockly.Pascal.colour_blend = function() {
  // Blend two colours together.
  var functionName = Blockly.Pascal.provideFunction_(
      'colour_blend',
      ['def ' + Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ +
          '(colour1, colour2, ratio):',
       '  r1, r2 = int(colour1[1:3], 16), int(colour2[1:3], 16)',
       '  g1, g2 = int(colour1[3:5], 16), int(colour2[3:5], 16)',
       '  b1, b2 = int(colour1[5:7], 16), int(colour2[5:7], 16)',
       '  ratio = min(1, max(0, ratio))',
       '  r = round(r1 * (1 - ratio) + r2 * ratio)',
       '  g = round(g1 * (1 - ratio) + g2 * ratio)',
       '  b = round(b1 * (1 - ratio) + b2 * ratio)',
       '  return \'#%02x%02x%02x\' % (r, g, b)']);
  var colour1 = Blockly.Pascal.valueToCode(this, 'COLOUR1',
      Blockly.Pascal.ORDER_NONE) || '\'#000000\'';
  var colour2 = Blockly.Pascal.valueToCode(this, 'COLOUR2',
      Blockly.Pascal.ORDER_NONE) || '\'#000000\'';
  var ratio = Blockly.Pascal.valueToCode(this, 'RATIO',
      Blockly.Pascal.ORDER_NONE) || 0;
  var code = functionName + '(' + colour1 + ', ' + colour2 + ', ' + ratio + ')';
  return [code, Blockly.Pascal.ORDER_FUNCTION_CALL];
};
