/**
 * Visual Blocks Language
 *
 */

/**
 * @fileoverview BEGIN & END blocks for Blockly.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Language.p_begin = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_BEGIN_PROGRAM);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_BEGIN_PROGRAM_TOOLTIP);
  }
};
Blockly.JavaScript.p_begin = function() {
  // TODO: Assemble JavaScript into code variable.
  var code = ' ';
  return code;
};
Blockly.Language.p_end = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_END_PROGRAM);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.LANG_END_PROGRAM_TOOLTIP);
  }
};
Blockly.JavaScript.p_end = function() {
  // TODO: Assemble JavaScript into code variable.
  //var code = 'exit;\n';
  var code = 'step0();\n';
  return code;
};

Blockly.Language.p_goto = {
  init: function() {
    this.setColour(0);
    this.appendValueInput('NUM')
		.setCheck('Number')
        .appendTitle(Blockly.LANG_GOTO_PROGRAM);
    this.setPreviousStatement(true);
	this.setTooltip(Blockly.LANG_GOTO_PROGRAM_TOOLTIP);
  }
};
Blockly.JavaScript.p_goto = function() {
  // TODO: Assemble JavaScript into code variable.
  var b = Blockly.JavaScript.valueToCode(this, 'NUM',
      Blockly.JavaScript.ORDER_MEMBER) || 1;
  var code = 'step'+b+'();\n';
  return code;
};