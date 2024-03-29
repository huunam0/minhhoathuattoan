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
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.JavaScript.variables = {};

Blockly.JavaScript.variables_get = function() {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript.variables_input_value = function() {
  // Variable Enter . thnam#20130825
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = window.parseInt(window.prompt("'+Blockly.LANG_VARIABLES_INPUT_VALUE_TOOLTIP+varName+'"));\n';
};
//BEGIN thnam#20130904 Print value of variable
Blockly.JavaScript.variables_output_value = function() {
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return 'window.alert("'+Blockly.LANG_VARIABLES_OUTPUT_VALUE_MSG+varName+': "+'+varName+');\n';
};
//END thnam#20130904