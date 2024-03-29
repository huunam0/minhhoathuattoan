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
 * @fileoverview Helper functions for generating Pascal for blocks.
 * @author huunam0@gmail.com (Nam Tran)
 */
'use strict';

Blockly.Pascal = Blockly.Generator.get('Pascal');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Pascal.addReservedWords(
    // import keyword
    // print ','.join(keyword.kwlist)
    // http://docs.Pascal.org/reference/lexical_analysis.html#keywords
    'and,as,assert,break,class,continue,def,del,elif,else,except,exec,finally,for,from,global,if,import,in,is,lambda,not,or,pass,print,raise,return,try,while,with,yield,' +
    //http://docs.Pascal.org/library/constants.html
    'True,False,None,NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
    // http://docs.Pascal.org/library/functions.html
    'abs,divmod,input,open,staticmethod,all,enumerate,int,ord,str,any,eval,isinstance,pow,sum,basestring,execfile,issubclass,print,super,bin,file,iter,property,tuple,bool,filter,len,range,type,bytearray,float,list,raw_input,unichr,callable,format,locals,reduce,unicode,chr,frozenset,long,reload,vars,classmethod,getattr,map,repr,xrange,cmp,globals,max,reversed,zip,compile,hasattr,memoryview,round,__import__,complex,hash,min,set,apply,delattr,help,next,setattr,buffer,dict,hex,object,slice,coerce,dir,id,oct,sorted,intern');

/**
 * Order of operation ENUMs.
 * http://docs.Pascal.org/reference/expressions.html#summary
 */
Blockly.Pascal.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.Pascal.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.Pascal.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.Pascal.ORDER_MEMBER = 2;            // . []
Blockly.Pascal.ORDER_FUNCTION_CALL = 2;     // ()
Blockly.Pascal.ORDER_EXPONENTIATION = 3;    // **
Blockly.Pascal.ORDER_UNARY_SIGN = 4;        // + -
Blockly.Pascal.ORDER_BITWISE_NOT = 4;       // ~
Blockly.Pascal.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.Pascal.ORDER_ADDITIVE = 6;          // + -
Blockly.Pascal.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.Pascal.ORDER_BITWISE_AND = 8;       // &
Blockly.Pascal.ORDER_BITWISE_XOR = 9;       // ^
Blockly.Pascal.ORDER_BITWISE_OR = 10;       // |
Blockly.Pascal.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
                                            //     <, <=, >, >=, <>, !=, ==
Blockly.Pascal.ORDER_LOGICAL_NOT = 12;      // not
Blockly.Pascal.ORDER_LOGICAL_AND = 13;      // and
Blockly.Pascal.ORDER_LOGICAL_OR = 14;       // or
Blockly.Pascal.ORDER_CONDITIONAL = 15;      // if else
Blockly.Pascal.ORDER_LAMBDA = 16;           // lambda
Blockly.Pascal.ORDER_NONE = 99;             // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1)\n'
 * @type ?string
 */
Blockly.Pascal.INFINITE_LOOP_TRAP = null;

/**
 * This is used as a placeholder in functions defined using
 * Blockly.Pascal.provideFunction_.  It must not be legal code that could
 * legitimately appear in a function definition (or comment), and it must
 * not confuse the regular expression parser.
 */
Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_ = '{{{}}}';
Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_REGEXP_ =
    new RegExp(Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_, 'g');

/**
 * Initialise the database of variable names.
 */
Blockly.Pascal.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Pascal.definitions_ = {};
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Pascal.functionNames_ = {};

  if (Blockly.Variables) {
    if (!Blockly.Pascal.variableDB_) {
      Blockly.Pascal.variableDB_ =
          new Blockly.Names(Blockly.Pascal.RESERVED_WORDS_);
    } else {
      Blockly.Pascal.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = Blockly.Pascal.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' = None';
    }
    Blockly.Pascal.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Pascal.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Pascal.definitions_) {
    var def = Blockly.Pascal.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Pascal.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Pascal string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Pascal string.
 * @private
 */
Blockly.Pascal.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Pascal from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Pascal code created for this block.
 * @return {string} Pascal code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Pascal.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Generator.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Generator.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Define a function to be included in the generated code.
 * The first time this is called with a given desiredName, the code is
 * saved and an actual name is generated.  Subsequent calls with the
 * same desiredName have no effect but have the same return value.
 *
 * It is up to the caller to make sure the same desiredName is not
 * used for different code values.
 *
 * The code gets output when Blockly.Pascal.finish() is called.
 *
 * @param {string} desiredName The desired name of the function (e.g., isPrime).
 * @param {code} A list of Pascal statements.
 * @return {string} The actual name of the new function.  This may differ
 *     from desiredName if the former has already been taken by the user.
 * @private
 */
Blockly.Pascal.provideFunction_ = function(desiredName, code) {
  if (!Blockly.Pascal.definitions_[desiredName]) {
    var functionName = Blockly.Pascal.variableDB_.getDistinctName(
        desiredName, Blockly.Generator.NAME_TYPE);
    Blockly.Pascal.functionNames_[desiredName] = functionName;
    Blockly.Pascal.definitions_[desiredName] = code.join('\n').replace(
        Blockly.Pascal.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
  }
  return Blockly.Pascal.functionNames_[desiredName];
};
