// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof codepage == 'undefined') { var codepage = {}; }


codepage.start = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="MSG" style="display: none"><span id="httpRequestError">Hoạt động bị trục trặc, không thực hiện được yêu cầu của bạn.</span><span id="linkAlert">Dùng liên kết này để chia sẽ chương trình của bạn:\n\n%1</span><span id="hashError">Không tìm thấy chương trình được lưu ở \'%1\'.</span><span id="xmlError">Không mở được chương trình của bạn.  Có thể nó nằm trong một phiên bản khác của Blockly?</span><span id="badXml">Lỗi khi đọc XML:\n%1\n\nNên hủy các mảnh đã tạo?</span><span id="badCode">\'Lỗi chương trình:\n%1</span><span id="timeout">Đã vượt quá số lần lặp cho phép.</span><span id="discard">Xóa hết %1 mảnh?</span></div><table width="100%" height="100%"><tr><td><h1><span id="title">Blockly : Thuật toán</span></h1></td><td class="farSide"><select id="languageMenu" onchange="BlocklyApps.changeLanguage();"></select></td></tr><tr><td colspan=2><table><tr id="tabRow" height="1em"><td id="tab_blocks" class="tabon" onclick="tabClick(this.id)">Các mảnh</td><td class="tabmin">&nbsp;</td><td id="tab_javascript" class="taboff" onclick="tabClick(this.id)">JavaScript</td><td class="tabmin">&nbsp;</td><td id="tab_python" class="taboff" onclick="tabClick(this.id)">Pascal</td><td class="tabmin">&nbsp;</td><td id="tab_xml" class="taboff" onclick="tabClick(this.id)">XML</td><td class="tabmax"><button title="Xóa tất cả mọi mảnh." onclick="discard(); renderContent();"><img src=\'../../media/1x1.gif\' class="trash icon21"></button> <button id="linkButton" title="Lưu và lấy địa chỉ liên kết." onclick="BlocklyStorage.link()"><img src=\'../../media/1x1.gif\' class="link icon21"></button> <button title="Chạy chương trình." class="launch" onclick="runJS()"><img src=\'../../media/1x1.gif\' class="run icon21"></button></td></tr></table></td></tr><tr><td height="99%" colspan=2>' + codepage.toolbox(null, null, opt_ijData) + '<iframe id="content_blocks" src="frame.html?' + soy.$$escapeHtml(opt_ijData.langSrc) + '"></iframe><pre id="content_javascript" class="content" style="visibility: visible; top: 89px; left: 0px; height: 100%; width: 100%;"></pre><pre id="content_python"></pre><div id="content_xml"><textarea id="textarea_xml"></textarea></div></td><td><div id="content_variable">Bien hien o day</div></td></tr></table>';
};


codepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><category name="Đặc biệt"><block type="p_goto"></block><block type="p_end"></block></category><category name="Lôgit"><block type="controls_if"></block><block type="logic_compare"></block><block type="logic_operation"></block><block type="logic_negate"></block></category><category name="Lặp"><block type="controls_whileUntil"></block><block type="controls_for"><value name="FROM"><block type="math_number"><title name="NUM">1</title></block></value><value name="TO"><block type="math_number"><title name="NUM">10</title></block></value></block></category><category name="Toán"><block type="math_number"></block><block type="math_arithmetic"></block><block type="math_single"></block><block type="math_trig"></block><block type="math_constant"></block><block type="math_number_property"></block><block type="math_change"><value name="DELTA"><block type="math_number"><title name="NUM">1</title></block></value></block><block type="math_modulo"></block></category><category name="Văn bản"><block type="text"></block><block type="text_print"></block><block type="text_prompt"></block><block type="text_prompt_variable"></block></category><category name="Dãy số"><block type="lists_input_n"><value name="LIST"><block type="variables_get"><title name="VAR">day</title></block></value></block><block type="lists_output_n"><value name="LIST"><block type="variables_get"><title name="VAR">day</title></block></value></block><block type="lists_getElement"><value name="LIST"><block type="variables_get"><title name="VAR">day</title></block></value></block><block type="lists_setElement"><value name="LIST"><block type="variables_get"><title name="VAR">list</title></block></value></block><block type="lists_swap2"></block></category><category name="Biến" custom="VARIABLE"></category></xml>';
};
