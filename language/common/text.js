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
 * @fileoverview Text blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.Language.text = {
  // Text value.
  helpUrl: Blockly.LANG_TEXT_TEXT_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.LANG_TEXT_TEXT_TOOLTIP);
  }
};

Blockly.Language.text_join = {
  // Create a string made up of any number of elements of any type.
  helpUrl: Blockly.LANG_TEXT_JOIN_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('ADD0')
        .appendTitle(Blockly.LANG_TEXT_JOIN_TITLE_CREATEWITH);
    this.appendValueInput('ADD1');
    this.setOutput(true, 'String');
    this.setMutator(new Blockly.Mutator(['text_create_join_item']));
    this.setTooltip(Blockly.LANG_TEXT_JOIN_TOOLTIP);
    this.itemCount_ = 2;
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(xmlElement) {
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
    this.itemCount_ = window.parseInt(xmlElement.getAttribute('items'), 10);
    for (var x = 0; x < this.itemCount_; x++) {
      var input = this.appendValueInput('ADD' + x);
      if (x == 0) {
        input.appendTitle(Blockly.LANG_TEXT_JOIN_TITLE_CREATEWITH);
      }
    }
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote0.png', 12, 12))
          .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote1.png', 12, 12));
    }
  },
  decompose: function(workspace) {
    var containerBlock = new Blockly.Block(workspace,
                                           'text_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock = new Blockly.Block(workspace, 'text_create_join_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect all input blocks and remove all inputs.
    if (this.itemCount_ == 0) {
      this.removeInput('EMPTY');
    } else {
      for (var x = this.itemCount_ - 1; x >= 0; x--) {
        this.removeInput('ADD' + x);
      }
    }
    this.itemCount_ = 0;
    // Rebuild the block's inputs.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    while (itemBlock) {
      var input = this.appendValueInput('ADD' + this.itemCount_);
      if (this.itemCount_ == 0) {
        input.appendTitle(Blockly.LANG_TEXT_JOIN_TITLE_CREATEWITH);
      }
      // Reconnect any child blocks.
      if (itemBlock.valueConnection_) {
        input.connection.connect(itemBlock.valueConnection_);
      }
      this.itemCount_++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote0.png', 12, 12))
          .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
          'media/quote1.png', 12, 12));
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + x);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      x++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Language.text_create_join_container = {
  // Container.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_TEXT_CREATE_JOIN_TITLE_JOIN);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.LANG_TEXT_CREATE_JOIN_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Language.text_create_join_item = {
  // Add items.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_TEXT_CREATE_JOIN_ITEM_TITLE_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_TEXT_CREATE_JOIN_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Language.text_append = {
  // Append to a variable in place.
  helpUrl: Blockly.LANG_TEXT_APPEND_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('TEXT')
        .appendTitle(Blockly.LANG_TEXT_APPEND_TO)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.LANG_TEXT_APPEND_VARIABLE), 'VAR')
        .appendTitle(Blockly.LANG_TEXT_APPEND_APPENDTEXT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.LANG_TEXT_APPEND_TOOLTIP.replace('%1',
          thisBlock.getTitleValue('VAR'));
    });
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Language.text_length = {
  // String length.
  helpUrl: Blockly.LANG_TEXT_LENGTH_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('VALUE')
        .setCheck(['String', 'Array'])
        .appendTitle(Blockly.LANG_TEXT_LENGTH_INPUT_LENGTH);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.LANG_TEXT_LENGTH_TOOLTIP);
  }
};

Blockly.Language.text_isEmpty = {
  // Is the string null?
  helpUrl: Blockly.LANG_TEXT_ISEMPTY_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('VALUE')
        .setCheck(['String', 'Array']);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_TEXT_ISEMPTY_INPUT_ISEMPTY);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.LANG_TEXT_ISEMPTY_TOOLTIP);
  }
};

Blockly.Language.text_indexOf = {
  // Find a substring in the text.
  helpUrl: Blockly.LANG_TEXT_INDEXOF_HELPURL,
  init: function() {
    this.setColour(160);
    this.setOutput(true, 'Number');
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendTitle(Blockly.LANG_TEXT_INDEXOF_INPUT_INTEXT);
    this.appendValueInput('FIND')
        .setCheck('String')
        .appendTitle(new Blockly.FieldDropdown(this.OPERATORS), 'END');
    this.setInputsInline(true);
    this.setTooltip(Blockly.LANG_TEXT_INDEXOF_TOOLTIP);
  }
};

Blockly.Language.text_indexOf.OPERATORS =
    [[Blockly.LANG_TEXT_INDEXOF_OPERATOR_FIRST, 'FIRST'],
     [Blockly.LANG_TEXT_INDEXOF_OPERATOR_LAST, 'LAST']];

Blockly.Language.text_charAt = {
  // Get a character from the string.
  helpUrl: Blockly.LANG_TEXT_CHARAT_HELPURL,
  init: function() {
    this.setColour(160);
    this.setOutput(true, 'String');
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendTitle(Blockly.LANG_TEXT_CHARAT_INPUT_INTEXT);
    this.appendDummyInput('AT');
    this.setInputsInline(true);
    this.updateAt(true);
    this.setTooltip(Blockly.LANG_TEXT_CHARAT_TOOLTIP);
  },
  mutationToDom: function() {
    // Save whether there is an 'AT' input.
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  domToMutation: function(xmlElement) {
    // Restore the 'AT' input.
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = (xmlElement.getAttribute('at') != 'false');
    this.updateAt(isAt);
  },
  updateAt: function(isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' input.
    this.removeInput('AT');
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT').setCheck('Number');
    } else {
      this.appendDummyInput('AT');
    }
    var menu = new Blockly.FieldDropdown(this.WHERE, function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setTitleValue(value, 'WHERE');
        return null;
      }
      return undefined;
    });
    this.getInput('AT').appendTitle(menu, 'WHERE');
  }
};

Blockly.Language.text_charAt.WHERE =
    [[Blockly.LANG_TEXT_CHARAT_FROM_START, 'FROM_START'],
     [Blockly.LANG_TEXT_CHARAT_FROM_END, 'FROM_END'],
     [Blockly.LANG_TEXT_CHARAT_FIRST, 'FIRST'],
     [Blockly.LANG_TEXT_CHARAT_LAST, 'LAST'],
     [Blockly.LANG_TEXT_CHARAT_RANDOM, 'RANDOM']];

Blockly.Language.text_getSubstring = {
  // Get substring.
  helpUrl: Blockly.LANG_TEXT_SUBSTRING_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('STRING')
        .setCheck('String')
        .appendTitle(Blockly.LANG_TEXT_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.updateAt(1, true);
    this.updateAt(2, true);
    this.setTooltip(Blockly.LANG_TEXT_SUBSTRING_TOOLTIP);
  },
  mutationToDom: function() {
    // Save whether there are 'AT' inputs.
    var container = document.createElement('mutation');
    var isAt1 = this.getInput('AT1').type == Blockly.INPUT_VALUE;
    container.setAttribute('at1', isAt1);
    var isAt2 = this.getInput('AT2').type == Blockly.INPUT_VALUE;
    container.setAttribute('at2', isAt2);
    return container;
  },
  domToMutation: function(xmlElement) {
    // Restore the block shape.
    var isAt1 = (xmlElement.getAttribute('at1') == 'true');
    var isAt2 = (xmlElement.getAttribute('at1') == 'true');
    this.updateAt(1, isAt1);
    this.updateAt(2, isAt2);
  },
  updateAt: function(n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' input.
    this.removeInput('AT' + n);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck('Number');
    } else {
      this.appendDummyInput('AT' + n);
    }
    var menu = new Blockly.FieldDropdown(this['WHERE' + n], function(value) {
      var newAt = (value == 'FROM_START') || (value == 'FROM_END');
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.sourceBlock_;
        block.updateAt(n, newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setTitleValue(value, 'WHERE' + n);
        return null;
      }
      return undefined;
    });
    this.getInput('AT' + n)
        .appendTitle(Blockly['LANG_TEXT_SUBSTRING_INPUT_AT' + n])
        .appendTitle(menu, 'WHERE' + n);
    if (n == 1) {
      this.moveInputBefore('AT1', 'AT2');
    }
  }
};

Blockly.Language.text_getSubstring.WHERE1 =
    [[Blockly.LANG_TEXT_SUBSTRING_FROM_START, 'FROM_START'],
     [Blockly.LANG_TEXT_SUBSTRING_FROM_END, 'FROM_END'],
     [Blockly.LANG_TEXT_SUBSTRING_FIRST, 'FIRST']];

Blockly.Language.text_getSubstring.WHERE2 =
    [[Blockly.LANG_TEXT_SUBSTRING_FROM_START, 'FROM_START'],
     [Blockly.LANG_TEXT_SUBSTRING_FROM_END, 'FROM_END'],
     [Blockly.LANG_TEXT_SUBSTRING_LAST, 'LAST']];

Blockly.Language.text_changeCase = {
  // Change capitalization.
  helpUrl: Blockly.LANG_TEXT_CHANGECASE_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendTitle(new Blockly.FieldDropdown(this.OPERATORS), 'CASE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.LANG_TEXT_CHANGECASE_TOOLTIP);
  }
};

Blockly.Language.text_changeCase.OPERATORS =
    [[Blockly.LANG_TEXT_CHANGECASE_OPERATOR_UPPERCASE, 'UPPERCASE'],
     [Blockly.LANG_TEXT_CHANGECASE_OPERATOR_LOWERCASE, 'LOWERCASE'],
     [Blockly.LANG_TEXT_CHANGECASE_OPERATOR_TITLECASE, 'TITLECASE']];

Blockly.Language.text_trim = {
  // Trim spaces.
  helpUrl: Blockly.LANG_TEXT_TRIM_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('TEXT')
        .setCheck('String')
        .appendTitle(new Blockly.FieldDropdown(this.OPERATORS), 'MODE');
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.LANG_TEXT_TRIM_TOOLTIP);
  }
};

Blockly.Language.text_trim.OPERATORS =
    [[Blockly.LANG_TEXT_TRIM_OPERATOR_BOTH, 'BOTH'],
     [Blockly.LANG_TEXT_TRIM_OPERATOR_LEFT, 'LEFT'],
     [Blockly.LANG_TEXT_TRIM_OPERATOR_RIGHT, 'RIGHT']];

Blockly.Language.text_print = {
  // Print statement.
  helpUrl: Blockly.LANG_TEXT_PRINT_HELPURL,
  init: function() {
    this.setColour(160);
    this.appendValueInput('TEXT')
        .appendTitle(Blockly.LANG_TEXT_PRINT_TITLE_PRINT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_TEXT_PRINT_TOOLTIP);
  }
};

Blockly.Language.text_prompt = {
  // Prompt function.
  helpUrl: Blockly.LANG_TEXT_PROMPT_HELPURL,
  init: function() {
    // Assign 'this' to a variable for use in the closure below.
    var thisBlock = this;
    this.setColour(160);
    var dropdown = new Blockly.FieldDropdown(this.TYPES, function(newOp) {
      if (newOp == 'NUMBER') {
        thisBlock.outputConnection.setCheck('Number');
      } else {
        thisBlock.outputConnection.setCheck('String');
      }
    });
    this.appendDummyInput()
        .appendTitle(dropdown, 'TYPE')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12));
    this.setOutput(true, 'String');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      return (thisBlock.getTitleValue('TYPE') == 'TEXT') ?
          Blockly.LANG_TEXT_PROMPT_TOOLTIP_TEXT :
          Blockly.LANG_TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  }
};

Blockly.Language.text_prompt.TYPES =
    [[Blockly.LANG_TEXT_PROMPT_TYPE_TEXT, 'TEXT'],
     [Blockly.LANG_TEXT_PROMPT_TYPE_NUMBER, 'NUMBER']];

Blockly.Language.text_prompt_variable = {
  // Alert a text + variable.
  helpUrl: Blockly.LANG_TEXT_PROMPT_HELPURL,
  init: function() {
    // Assign 'this' to a variable for use in the closure below.
    var thisBlock = this;
    this.setColour(160);
    this.appendDummyInput()
		.appendTitle(Blockly.LANG_TEXT_OUT_VARIABLE)
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12))
		.appendTitle(new Blockly.FieldVariable(Blockly.LANG_VARIABLES_SET_ITEM), 'VAR');
    // Assign 'this' to a variable for use in the tooltip closure below.
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.setTooltip(Blockly.LANG_TEXT_OUT_VARIABLE_TOOLTIP_TEXT);
  }
};