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
 * @fileoverview List blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.Language.lists_create_empty = {
  // Create an empty list.
  helpUrl: Blockly.LANG_LISTS_CREATE_EMPTY_HELPURL,
  init: function() {
    this.setColour(260);
    this.setOutput(true, 'Array');
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_LISTS_CREATE_EMPTY_TITLE);
    this.setTooltip(Blockly.LANG_LISTS_CREATE_EMPTY_TOOLTIP);
  }
};

Blockly.Language.lists_create_with = {
  // Create a list with any number of elements of any type.
  helpUrl: '',
  init: function() {
    this.setColour(260);
    this.appendValueInput('ADD0')
        .appendTitle(Blockly.LANG_LISTS_CREATE_WITH_INPUT_WITH);
    this.appendValueInput('ADD1');
    this.appendValueInput('ADD2');
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.LANG_LISTS_CREATE_WITH_TOOLTIP);
    this.itemCount_ = 3;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(container) {
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
    this.itemCount_ = window.parseInt(container.getAttribute('items'), 10);
    for (var x = 0; x < this.itemCount_; x++) {
      var input = this.appendValueInput('ADD' + x);
      if (x == 0) {
        input.appendTitle(Blockly.LANG_LISTS_CREATE_WITH_INPUT_WITH);
      }
    }
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendTitle(Blockly.LANG_LISTS_CREATE_EMPTY_TITLE);
    }
  },
  decompose: function(workspace) {
    var containerBlock = new Blockly.Block(workspace,
                                           'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock = new Blockly.Block(workspace, 'lists_create_with_item');
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
        input.appendTitle(Blockly.LANG_LISTS_CREATE_WITH_INPUT_WITH);
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
          .appendTitle(Blockly.LANG_LISTS_CREATE_EMPTY_TITLE);
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

Blockly.Language.lists_create_with_container = {
  // Container.
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_LISTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.LANG_LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Language.lists_create_with_item = {
  // Add items.
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_LISTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Language.lists_repeat = {
  // Create a list with one element repeated.
  helpUrl: Blockly.LANG_LISTS_REPEAT_HELPURL,
  init: function() {
    this.setColour(260);
    this.setOutput(true, 'Array');
    this.appendValueInput('ITEM')
        .appendTitle(Blockly.LANG_LISTS_REPEAT_INPUT_WITH);
    this.appendValueInput('NUM')
        .setCheck('Number')
        .appendTitle(Blockly.LANG_LISTS_REPEAT_INPUT_REPEATED);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_LISTS_REPEAT_INPUT_TIMES);
    this.setInputsInline(true);
    this.setTooltip(Blockly.LANG_LISTS_REPEAT_TOOLTIP);
  }
};
Blockly.Language.lists_input_n = {
  // Create a list with n elements entered. thnam#20130902
  helpUrl: Blockly.LANG_LISTS_REPEAT_HELPURL,
  init: function() {
    this.setColour(260);
	this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_INPUT_N_ENTER);
	this.appendValueInput('NUM')
        .setCheck('Number')
		.appendTitle(Blockly.LANG_LISTS_INPUT_N_INCLUDE);
	this.appendDummyInput()
		.appendTitle(Blockly.LANG_LISTS_INPUT_N_ELEMENT);
    this.setInputsInline(true);
	this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_INPUT_N_TOOLTIP);
  }
};
//BEGIN thnam#20130904 make block print Array
Blockly.Language.lists_output_n = {
  helpUrl: Blockly.LANG_LISTS_REPEAT_HELPURL,
  init: function() {
    this.setColour(260);
	this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_OUTPUT_N);
	this.setPreviousStatement(true);
	this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_OUTPUT_N_TOOLTIP);
  }
};
//END thnam#20130904
Blockly.Language.lists_length = {
  // List length.
  helpUrl: Blockly.LANG_LISTS_LENGTH_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('VALUE')
        .setCheck(['Array', 'String'])
        .appendTitle(Blockly.LANG_LISTS_LENGTH_INPUT_LENGTH);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.LANG_LISTS_LENGTH_TOOLTIP);
  }
};

Blockly.Language.lists_isEmpty = {
  // Is the list empty?
  helpUrl: Blockly.LANG_LISTS_IS_EMPTY_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('VALUE')
        .setCheck(['Array', 'String']);
    this.appendDummyInput()
        .appendTitle(Blockly.LANG_LISTS_INPUT_IS_EMPTY);
    this.setInputsInline(true);
    this.setOutput(true, 'Boolean');
    this.setTooltip(Blockly.LANG_LISTS_TOOLTIP);
  }
};

Blockly.Language.lists_indexOf = {
  // Find an item in the list.
  helpUrl: Blockly.LANG_LISTS_INDEX_OF_HELPURL,
  init: function() {
    this.setColour(260);
    this.setOutput(true, 'Number');
    this.appendValueInput('VALUE')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_INDEX_OF_INPUT_IN_LIST);
    this.appendValueInput('FIND')
        .appendTitle(new Blockly.FieldDropdown(this.OPERATORS), 'END');
    this.setInputsInline(true);
    this.setTooltip(Blockly.LANG_LISTS_INDEX_OF_TOOLTIP);
  }
};

Blockly.Language.lists_indexOf.OPERATORS =
    [[Blockly.LANG_LISTS_INDEX_OF_FIRST, 'FIRST'],
     [Blockly.LANG_LISTS_INDEX_OF_LAST, 'LAST']];

Blockly.Language.lists_getIndex = {
  // Get element at index.
  helpUrl: Blockly.LANG_LISTS_GET_INDEX_HELPURL,
  init: function() {
    this.setColour(260);
    var modeMenu = new Blockly.FieldDropdown(this.MODE, function(value) {
      var isStatement = (value == 'REMOVE');
      this.sourceBlock_.updateStatement(isStatement);
    });
    this.appendValueInput('VALUE')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_GET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
        .appendTitle(modeMenu, 'MODE')
        .appendTitle('');
    this.appendDummyInput('AT');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.updateAt(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var combo = thisBlock.getTitleValue('MODE') + '_' +
          thisBlock.getTitleValue('WHERE');
      return Blockly['LANG_LISTS_GET_INDEX_TOOLTIP_' + combo];
    });
  },
  mutationToDom: function() {
    // Save whether the block is a statement or a value.
    // Save whether there is an 'AT' input.
    var container = document.createElement('mutation');
    var isStatement = !this.outputConnection;
    container.setAttribute('statement', isStatement);
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  domToMutation: function(xmlElement) {
    // Restore the block shape.
    // Note: Until January 2013 this block did not have mutations,
    // so 'statement' defaults to false and 'at' defaults to true.
    var isStatement = (xmlElement.getAttribute('statement') == 'true');
    this.updateStatement(isStatement);
    var isAt = (xmlElement.getAttribute('at') != 'false');
    this.updateAt(isAt);
  },
  updateStatement: function(newStatement) {
    // Switch between a value block and a statement block.
    var oldStatement = !this.outputConnection;
    if (newStatement != oldStatement) {
      this.unplug(true, true);
      if (newStatement) {
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      } else {
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      }
    }
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
Blockly.Language.lists_getElement = {
  // Get element at index. thnam@20130903
  helpUrl: Blockly.LANG_LISTS_GET_INDEX_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('LIST')
        .setCheck('Array');
    this.appendValueInput('NUM')
		.setCheck('Number')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/squarebracket0.png', 12, 24));
    this.appendDummyInput()
		.appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/squarebracket1.png', 12, 24));
	this.setInputsInline(true);
    this.setOutput(true, 'Number');
	this.setTooltip(Blockly.LANG_LISTS_GET_INDEX_TOOLTIP);
  }
};
Blockly.Language.lists_getIndex.MODE =
    [[Blockly.LANG_LISTS_GET_INDEX_GET, 'GET'],
     [Blockly.LANG_LISTS_GET_INDEX_GET_REMOVE, 'GET_REMOVE'],
     [Blockly.LANG_LISTS_GET_INDEX_REMOVE, 'REMOVE']];

Blockly.Language.lists_getIndex.WHERE =
    [[Blockly.LANG_LISTS_GET_INDEX_FROM_START, 'FROM_START'],
     [Blockly.LANG_LISTS_GET_INDEX_FROM_END, 'FROM_END'],
     [Blockly.LANG_LISTS_GET_INDEX_FIRST, 'FIRST'],
     [Blockly.LANG_LISTS_GET_INDEX_LAST, 'LAST'],
     [Blockly.LANG_LISTS_GET_INDEX_RANDOM, 'RANDOM']];

Blockly.Language.lists_setIndex = {
  // Set element at index.
  helpUrl: Blockly.LANG_LISTS_SET_INDEX_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(this.MODE), 'MODE')
        .appendTitle('');
    this.appendDummyInput('AT');
    this.appendValueInput('TO')
        .appendTitle(Blockly.LANG_LISTS_SET_INDEX_INPUT_TO);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_SET_INDEX_TOOLTIP);
    this.updateAt(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var combo = thisBlock.getTitleValue('MODE') + '_' +
          thisBlock.getTitleValue('WHERE');
      return Blockly['LANG_LISTS_SET_INDEX_TOOLTIP_' + combo];
    });
  },
  mutationToDom: function() {
    // Save whether there is an 'AT' input.
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT').type == Blockly.INPUT_VALUE;
    container.setAttribute('at', isAt);
    return container;
  },
  domToMutation: function(xmlElement) {
    // Restore the block shape.
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
    this.moveInputBefore('AT', 'TO');
    this.getInput('AT').appendTitle(menu, 'WHERE');
  }
};

Blockly.Language.lists_setIndex.MODE =
    [[Blockly.LANG_LISTS_SET_INDEX_SET, 'SET'],
     [Blockly.LANG_LISTS_SET_INDEX_INSERT, 'INSERT']];

Blockly.Language.lists_setIndex.WHERE = Blockly.Language.lists_getIndex.WHERE;
//BEGIN thnam#20130908 Thay the manh setIndex
Blockly.Language.lists_setElement = {
  // Set A[i]=5 .
  helpUrl: Blockly.LANG_LISTS_SET_INDEX_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_SET_ELEMENT_INPUT_IN_LIST);
    this.appendValueInput('NUM')
		.setCheck('Number')
        .appendTitle('[');
    this.appendValueInput('TO')
        .appendTitle('] =');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_SET_INDEX_TOOLTIP);
  }
};
//END thnam#20130908
//BEGIN thnam#20130908 Hoan doi 2 phan tu
Blockly.Language.lists_swap2 = {
  // Swap  A[i] and A[j] .
  helpUrl: Blockly.LANG_LISTS_SET_INDEX_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('NUM1')
		.setCheck('Number')
        .appendTitle(Blockly.LANG_LISTS_SWAP_ELEMENTS);
    this.appendValueInput('NUM2')
		.setCheck('Number')
        .appendTitle(',');
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_SWAP_OF_LIST);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_SWAP_TOOLTIP);
  }
};
//END thnam#20130908
Blockly.Language.lists_getSublist = {
  // Get sublist.
  helpUrl: Blockly.LANG_LISTS_GET_SUBLIST_HELPURL,
  init: function() {
    this.setColour(260);
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendTitle(Blockly.LANG_LISTS_GET_SUBLIST_INPUT_IN_LIST);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    this.setInputsInline(true);
    this.setOutput(true, 'Array');
    this.updateAt(1, true);
    this.updateAt(2, true);
    this.setTooltip(Blockly.LANG_LISTS_GET_SUBLIST_TOOLTIP);
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
        .appendTitle(Blockly['LANG_LISTS_GET_SUBLIST_INPUT_AT' + n])
        .appendTitle(menu, 'WHERE' + n);
    if (n == 1) {
      this.moveInputBefore('AT1', 'AT2');
    }
  }
};

Blockly.Language.lists_getSublist.WHERE1 = Blockly.Language.lists_getIndex.WHERE
    .filter(function(tuple) {return tuple[1] == 'FROM_START' ||
            tuple[1] == 'FROM_END' || tuple[1] == 'FIRST';});
Blockly.Language.lists_getSublist.WHERE2 = Blockly.Language.lists_getIndex.WHERE
    .filter(function(tuple) {return tuple[1] == 'FROM_START' ||
            tuple[1] == 'FROM_END' || tuple[1] == 'LAST';});
