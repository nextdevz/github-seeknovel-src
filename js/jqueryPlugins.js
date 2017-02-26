/* -----------------------------------------------------------------------------------------------------------------------
Plugins for jQuery
File Name: jqueryPlugins.js
Author: Thawatchai Kaosol
Date: 30/11/2011
License: Copyright 2011, NextDEV, All Rights Reserved.
----------------------------------------------------------------------------------------------------------------------- */
$(function(){
	$.cookie = function(n, v, e, op) {
		n = encodeURIComponent(n);
		if(v === undefined) {
			var i, x, y, c=document.cookie.split(';');
			var l = $.len(c);
			var reselt = new Object();
			for(i=0;i < l; i++) {
				x = c[i].substr(0, c[i].indexOf('='));
				y = c[i].substr(c[i].indexOf('=')+1);
				x = x.replace(/^\s+|\s+$/g, '');
				if(x == n) {
					return decodeURIComponent(y);
				}
				reselt[x] = y;
			}
			return reselt;
		}
		else {
			var op = $.extend({path:'', domain:'', secure:''}, op);
			var d = new Date();
			d.setDate(d.getDate() + ((v == null) ? -1: e));
			document.cookie = n + '=' + encodeURIComponent(v) + ((e != undefined) ? '; expires=' + d.toGMTString() : '') + ((op.path != '') ? '; path=' + op.path : '') + ((op.domain != '') ? '; domain='	+ domain : '') + ((op.secure != '') ? '; secure' : '');
		}
	}

	$.print = function(o, op){
		var op = $.extend({r: "Object (\n", t: '', s: 1}, op);
		op.t += "    ";
		if(typeof o == 'string' || typeof o == 'number' || typeof o == 'boolean' || o == null) {
			op.r += op.t + '[' + typeof o + "] => " + o + "\n";
		}
		else {
			$.each(o, function(i, v) {
				try {
					if(Object.prototype.toString.call(v) == '[object Object]') {
						op.r += op.t + '[' + i + "] => Object (\n";
						op.r += $.print(v, {r:'', t:op.t, s:0});
						op.r += op.t + ")\n";
					}
					else if(Object.prototype.toString.call(v) == '[object Array]') {
						op.r += op.t + '[' + i + "] => Array (\n";
						op.r += $.print(v, {r:'', t:op.t, s:0});
						op.r += op.t + ")\n";
					}
					else if(typeof v == 'function') {
						op.r += op.t + '[' + i + '] => ' + v.toString().replace(/\n/g, "\n" + op.t) + "\n";
					}
					else {
						op.r += op.t + '[' + i + '] => ' + v + "\n";
					}
				}
				catch(err) {
					op.r += op.t + '[' + i + "] => [Error]\n";
				}
			});
		}
		if(op.s == 1) {
			if(typeof o == 'string') {
				op.r = o;
			}
			else {
				op.r += ')';
			}
			var over = false;
			if($.len(op.r) > 150000) {
				over = true;
				op.r = op.r.substr(0, 150000) + '...';
			}
			var pattern = [/<p>/g, /</g, />/g, /\n/g, /\s/g];
			var replacement = ['', '&lt;', '&gt;', '<br>', '&nbsp;'];
			op.r = op.r.toString().replace(pattern, replacement);
			if(over == true) {
				op.r += '<br><span style="color:#ff0000;font-weight:bold;">Data is over 150,000 characters.<span>';
			}
			var id= 'print-' + (new Date()).getTime();
			//var options = {title:'PRINT DETAIL', btnClose:true, fadeIn:0, fadeOut:0, top:'center', left:'center'}
			//$('body').showPopup(id, '<div style="font-size:11px;padding:4px 4px 4px 4px;word-wrap: break-word;">' + op.r + '</div>', options);
			var div = $('<div id="' + id + '" class="div-print-background"></div>');
			var box = $('<div class="div-print-box"><div class="div-print-head"><div class="div-print-close"></div></div><div class="div-print-detail">' + op.r  + '</div></div>');
			box.find('.div-print-close').click(function(){
				div.remove();
			});
			$('body').append(div.html(box));
		}
		else {
			return op.r;
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.dataToObject = function(d, c){
		$(this).find('input[name], select[name], textarea[name]').each(function() {
			var n = $(this).attr('name');
			try {
				if(d == undefined) {
					if(this.tagName == 'SELECT') {
						this.selectedIndex = 0;
					}
					else {
						$(this).val(null);
					}
				}
				else if(d[n] != undefined) {
					if(this.tagName == 'INPUT') {
						if(this.type == 'checkbox' || this.type == 'radio') {
							$(this).prop('checked', ($(this).val() == d[n] ? true : false));
						} else {
							$(this).val([d[n]]);
						}
					}
					else {
						$(this).val(d[n]);
						if(c == undefined && this.tagName == 'SELECT') {
							$(this).change();
						}
					}
				}
			}
			catch(err) {
				return false;
			}
		});
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.addNameChild = function(find, name){
		var i = 0;
		var inx = name.search('[i]');
		$(this).find(find).each(function(){
			$(this).attr('name', name.substring(0, inx-1) + i + name.substring(inx+2));
			i++;
		})
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------
	$.fn.nameToId = function(){
		$(this).children().find('[name]').each(function(){
			$(this).attr('id', $(this).attr('name'));
		});
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.selection = function(e) {
		if(document.selection && (e.which == 8 || e.which > 47)) {
			var cr = document.selection.createRange();
			var s =  e.target.value;
			cr.text = ":st:" + cr.text + ":ed:";
			var st = e.target.value.search(/[st]/) -1;
			var ed = e.target.value.search(/[ed]/) - 5;
			e.target.value = s;
		}
		else {
			st = e.target.selectionStart;
			ed = e.target.selectionEnd;
		}
		return {start:st, end:ed};
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.inputDate = function(error) {
		$(this).on('keydown', function(e){
			var se = $(this).selection(e);
			if(e.which == 32 || e.which > 47) {
				var reg = new RegExp(/^(([0-3]|0[1-9]|[1-2][0-9]|3[0-1])?([0-9]{2}\/)?(\/(0[1-9]?|1[0-2]?))?([0-9]{2}\/)?(\/[0-9]{2}\/[1-2][0-9]{0,3})?)$/);
				if(e.which == 111) {
					var s = '/';
				}
				else if(e.which > 95 && e.which < 106) {
					s = e.which - 96;
				}
				else if(e.which > 47 && e.which < 58) {
					s = e.which - 48;
				}
				else {
					e.preventDefault();
				}
				if(se.start != se.end){
					this.value = this.value.substring(0, se.start);
					s = this.value + s;
				}
				else {
					s = this.value + s;
				}
				if(!reg.test(s)) {
					e.preventDefault();
				}
			}
			else if(e.which == 8) {
				if(se.start > 0) {
					this.value = this.value.substring(0, se.start);
				}
			}
		});
		$(this).on('keyup', function(e){
			$(this).checkDate(error);
		});
		$(this).checkDate(error);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.checkInputDate = function(error) {
		var result = true;
		//var reg = new RegExp(/^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[1-2])\/([1-2][0-9]{3})$/);
		var reg = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/);
		$(this).each(function(){
			var d = $(this).val().split('/');
			if($(this).val() != '' && $(this).val() != '00/00/0000' && (!reg.test($(this).val()) || !$.checkDate(d[2], d[1], d[0]))) {
				$(this).tooltip(error, {show:true, color: '#fff', background: '#ee0101', borderColor: '#ee0101'});
				result = false;
			}
			else {
				$(this).tooltip();
			}
		});
		return result;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.checkDate = function(y, m, d) {
		y = $.intval(y);
		m = $.intval(m);
		d = $.intval(d);
		if(y !== undefined && m !== undefined && d !== undefined && y > 1900 && m > 0 && m < 13 && d > 0 && d <= $.dayInMonth(y, m)) {
			return true;
		}
		else {
			return false;
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.checkIdCard = function(blank) {
		var c = r = chk = 0;
		$(this).each(function(){
			var str = $(this).val();
			var len = $.len(str);
			if(len == 13) {
				for($i=0; $i<12; $i++) {
					chk += $.intval(str.substr($i, 1)) * (13 - $i);
				}
				chk = (11 - (chk % 11)) % 10;
				if(str.substr(-1, 1) == chk) r++;
			}
			else if(blank == true && len == 0) r++;
			c++;
		});
		return (c > 0 && c == r ? true : false);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.inputFixRegExp = function(fix, reg, error, options) {
		var format = fix.toLowerCase();
		var lang = '';
		if(format == 'decimal') {
			fix = '^([0-9]|[1-9][0-9]+)(\\.[0-9]{0,' + (reg == undefined ? 10: $.intval(reg)) + '})?$';
		}
		else if(format == 'date') {
			if(reg != undefined && reg == 'th') {
				lang = 'th';
				fix = '^(0([1-9])?|[12]([0-9])?|3([01])?|[0-9]{2}\\/(0([1-9])?|1([0-2])?)?|[0-9]{2}\\/[0-9]{2}\\/(2[45]?|[0-9]{3,4})?)$';
			}
			else {
				lang = 'en';
				fix = '^(((19?|20?)|[0-9]{3,4})|[0-9]{4}-(0([1-9])?|1([0-2])?)?|[0-9]{4}-[0-9]{2}-(0([1-9])?|[12]([0-9])?|3([01])?)?)$';
			}
		}
		else if(format == 'hh:mm') {
			fix = '^([0-1][0-9]?|2[0-3]?)(:[0-5]?|:[0-5][0-9])?$';
		}
		else if(format == 'hh:mm:ss') {
			fix = '^([0-1][0-9]?|2[0-3]?)(:[0-5]?|:[0-5][0-9])?(:[0-5]?|:[0-5][0-9])?$';
		}
		else if(format == 'idcard') {
			fix = '^([0-9]{0,13})?$';
		}
		$(this).bind('keypress', function(e){
			var se = $(this).selection(e);
			if(e.which != 8) {
				var str = $(this).val().substr(0, se.start) + String.fromCharCode(e.which) + $(this).val().substr(se.end);
				fix = new RegExp(fix);
				if(!fix.test(str)) {
					e.preventDefault();
				}
			}
		});
		$(this).bind('keyup', function(e){
			if(e.which != 8) {
				var str = $(this).val();
				var len = $.len(str);
				if(format == 'date') {
					if(lang == 'th') {
						if(len == 2) $(this).val(str + '/');
						if(len == 5) $(this).val(str + '/');
					}
					else {
						if(len == 4) $(this).val(str + '-');
						if(len == 7) $(this).val(str + '-');
					}
				}
				else if(format.substr(0, 5) == 'hh:mm') {
					if(len == 2) $(this).val(str + ':');
					if(format == 'hh:mm:ss' && len == 5) $(this).val(str + ':');
				}
			}
		});
		if(error != undefined) {
			$(this).bind('keyup', function(e){
				$(this).validate(reg, error, options);
			});
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.inputValidate = function(r, v, options) {
		var options = $.extend({
			start:false
		}, options);
		$(this).each(function(i, c){
			$(c).validate(r, v, options);
			$(c).keyup(function(e) {
				$(c).validate(v);
			});
		});
		return this;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.validate = function(r, v, options) {
		var options = $.extend({
			background: '#fb6767',
			borderColor: '#9b5353',
			color: '#ffffff',
			fixed: true,
			replace:false,
			start:true,
			position:'up',
			type:'validate'
		}, (options !=  undefined ? options : v));
		var p = true;
		$(this).each(function(i, c){
			if(typeof v == 'string' && r != '' && $(c).attr('regexp') == undefined || options.replace == true) $(c).attr('regexp', r);
			if($(c).attr('regexp') != undefined) {
				if(r == '' && v == undefined) {
					$(c).css({borderColor: '', boxShadow: ''});
					if(c.tooltip != undefined) c.tooltip.div.addClass('hide');
				}
				else {
					$(c).tooltip((v == undefined || typeof v == 'object' ? r : v), options);
					var rx = new RegExp($(c).attr('regexp'));
					if(!rx.test($(c).val())) {
						if(options.start == true) {
							if(p == true) $(c).focus();
							p = false;
							$(c).tooltip(options).css({borderColor: options.background, boxShadow: '0px 0px 3px ' + options.background});
						}
					}
					else {
						$(c).tooltip('', options).css({borderColor: '', boxShadow: ''});
					}
				}
			}
		});
		return p;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.tooltip = function(v, options) {
		var options = $.extend({
			background: '#fbfbd7',
			borderColor: '#b7b786',
			color: '#808040',
			fixed: false,
			replace:false,
			position:'up',
			type:'tooltip'
		}, (options !=  undefined ? options : v));
		var opt = options.type
		$(this).each(function(i, c){
			if(c.tooltip != undefined) var ct = c.tooltip;
			else {
				if(options.position == 'up') {
					ct = c.tooltip = {div:$('<div class="up div-show-tooltip"><div class="msg-show"/><div class="up arrow-box"><div class="up arrow-show"/></div></div>'), layout:{}, type:''};
				}
				else {
					ct = c.tooltip = {div:$('<div class="down div-show-tooltip"><div class="down arrow-box"><div class="down arrow-show"/></div><div class="msg-show"/></div>'), layout:{}, type:''};
				}
				$(c).after(ct.div);
				$(c).hover(function(e) {
					if(ct.layout[ct.type].fixed == false) {
						ct.div.removeClass('show hide');
						show(e.pageX);
					}
				}, function(e) {
					if(ct.layout[ct.type].fixed == false) ct.div.addClass('hide');
				});
			}
			if(ct.layout[opt] == undefined) {
				ct.div.removeClass('show hide');
				ct.layout[opt] = options;
				ct.type = opt;
			}
			if(v == undefined || typeof v == 'object') {
				if(ct.type != opt || ct.div.hasClass('show') && ct.div.hasClass('hide')) ct.div.removeClass('show hide');
				ct.type = opt;
				show();
			}
			else if(v != '' && $(c).attr(opt) == undefined || options.replace == true) {
				$(this).attr(opt, v);
			}
			else if(v == '') {
				if(ct.layout[opt] != undefined) {
					ct.div.addClass('hide');
					delete ct.layout[opt];
				}
				if($.len(ct.layout) == 0) {
					delete c.tooltip;
					$(c).off('mouseenter mouseleave');
				}
				else {
					var k = Object.keys(ct.layout);
					ct.type = k[$.len(k) - 1];
				}
			}
			function show(x) {
				var op = ct.layout[ct.type];
				ct.div.children('.msg-show').html($(c).attr(c.tooltip.type)).css('color', op.color);
				ct.div.find('[class$=-show]').css({
					background:op.background,
					border: '2px solid ' + op.borderColor});
				if(x == undefined) {
					ct.div.css('left', $(c).position().left + (op.position != 'up' ? 0 : $(c).width() - 24));
				}
				else {
					ct.div.css('left', x - $(c).offset().left + $(c).position().left - 17);
				}
				ct.div.css('top', $(c).position().top + (op.position == 'up' ? (ct.div.height() + 3) * -1 : $(c).height() + 5));
				setTimeout(function(){ct.div.addClass('show')}, 10);
				if(ct.layout[ct.type].fixed == true) {
					$(c).one('focus, click', function(){ct.div.addClass('hide')});
					ct.div.one('focus, click', function(){ct.div.addClass('hide')});
				}
			}
		});
		return this;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.msgBox = function(value, type, time) {
		$.msgBox(value, type, time, $(this));
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.msgBox = function(value, type, time, obj) {
		var box = $('<div id="div-box-massage" style="display: none;">' + value + '</div>');
		if(time == undefined) {
			time = 2000;
		}
		if(value !== undefined) {
			if(type == 'ap') {
				box.addClass('div-box-massage-approve');
			}
			else if(type == 'at') {
				box.addClass('div-box-massage-active');
			}
			else if(type == 'hi') {
				box.addClass('div-box-massage-highlight');
			}
			else if(type == 'er') {
				box.addClass('div-box-massage-error');
			}
			else {
				box.addClass('div-box-massage-default');
			}
			if(obj == undefined) {
				$('body').append(box);
				box.css('top', ($(window).height() - box.outerHeight(true)) / 2).css('left', ($(window).width() - box.outerWidth(true)) / 2);
			}
			else {
				obj.append(box);
				box.css('top', ((obj.height() - box.outerHeight(true)) / 2) + obj.offset().top).css('left', ((obj.width() - box.outerWidth(true)) / 2) + obj.offset().left);
			}
			box.fadeIn(250);
			box.fadeOut(time, function(){
				$(this).remove();
			});
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.enter = function(fn){
		if(fn == undefined){
			$(this).trigger($.Event('keydown', {which:13}));
		}
		else if (typeof fn == 'function') {
			$(this).keydown(function(e){
				if(e.which == 13) {
					fn.call($(this));
				}
			});
		}
		return this;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.enterToTab = function(selector){
		if($.len($(this)) == 1 && $(this).get(0).tagName == 'FORM' && selector == undefined) selector = 'input, select';
		var obj = (selector == undefined ? $(this) : $(this).find(selector));
		obj.on('keydown', function(e){
			if(e.target.tagName != 'TEXTAREA' && e.which == 13) {
				var s = obj.index(e.target), n = s;
				do {
				    if(++n >= $.len(obj)) n = 0;
					var c = $(obj.get(n));
					c.focus().select();
				}
				while(s != n && !c.is(':visible'));
			}
		});
		return this;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.window = function(u, d, p) {
		if(u !== undefined) {
			var f = $('<form action="' + u + '" method="post" target="_blank" style="display:none"/>');
			addChild(f, d, p);
			$('body').append(f);
			f.submit().remove();
		}

		function addChild(f, d, p) {
			if(typeof d == 'object') {
				$.each(d, function(i, v) {
					if(p != undefined) {
						addChild(f, v, p+'[' + i+ ']');
					}
					else {
						addChild(f, v, i);
					}
				});
			}
			else {
				f.append('<input name="' + p + '" value="' + d + '">');
			}
		}
	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.upload = function(url, agr, callback){
		if($(this).get(0).tagName == 'FORM') {
			var form = $(this);
			var dt = (new Date()).getTime();
			if(typeof agr == 'function') {
				callback = agr;
			}
			else {
				$.each(agr, function(i, v){
					form.append('<input name="' + i + '" type="hidden" value="' + v + '" class="temp' + dt + '"></input>');
				});
			}
			var id = 'uploader' + dt;
			$(this).attr('action', url).attr('method', 'post').attr('enctype', 'multipart/form-data').attr('target', id).attr('onsubmit','');
			$('body').append('<iframe id="' + id + '" name="' + id + '" style="width:0px;height:0px;display:none"></iframe>');
			var popup =$('#' + id);
			$(this).submit();
			popup.load(function(){
				if(callback != undefined) {
					callback.call($(this), $.dataJSON(popup.contents().find('body').text()));
				}
				popup.remove();
				$('.temp' + dt).remove();
				//popup.abort();
			});
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.send = function(u, d, s, op) {
		$.post(u, d, function(d){
			if(d.substr(0, 4) == 'DRL='){
				var l = parseInt(d.substr(4, 6), 16);
				d = d.substr(10);
			}
			d = $.dataJSON(d);
			if(d === false) {
				return false;
			}
			s.call($(this), d, l);
		});
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.dataJSON = function(d){
		if(d == ''){
			return null;
		}
		else{
			var s = d.substring(0, 1);
			if(s == '[' || s == '{' || s == '"'){
				s = $.parseJSON(d);
				if(typeof s == 'object'){
					return s;
				}
			}
		}
		$.print(d);
		return false;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.serializePHP = function(v, o){
		if(this[0] instanceof HTMLElement === false) {
			return 'process=' + v + '&'+ $.param(this[0]);
		}
		else if(o === true) {
			var r = $(this).serializeObject(o);
			r['process'] = v;
			return r;
		}
		else {
			return 'process=' + v + '&'+ $(this).serializeObject();
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.serializeObject = function(o){
		var r = {};
		var i = 0;
		$(this).find('button[name], input[name], select[name], textarea[name]').each(function() {
			if($(this).attr('name') !== undefined) {
				if(this.type == 'radio' || this.type == 'checkbox') {
					if($(this).prop('checked') == true) {
						val($(this));
					}
				}
				else {
					val($(this));
				}
			}
		});
		function val(v) {
			if(v.attr('name') !== undefined) r[v.attr('name')] = v.val();
		}
		return (o === true ? r : $.param(r));
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.checkValue = function(o){
		if(o.attr('class') != undefined && o.attr('class').search(/inp-date/i) >= 0) {
			if($.len(o.val()) == 10) {
				return o.val().substring(6, 10) + '-' + o.val().substring(3, 5) + '-' + o.val().substring(0, 2);
			}
			else {
				return '0000-00-00';
			}
		}
		else {
			return o.val();
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.isObject = function(obj){
		return (typeof obj === 'object');
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.tab = function(callback){
		var id = 'div-tab' + (new Date()).getTime();
		$(this).before('<div id="' + id + '"></div>');
		var tab ='<div class="div-tab-head">';
		var i = 0;
		$(this).find('.tab-data').each(function(){
			if(i == 0) {
				tab += '<div class="tab-label tab-select">' + $(this).attr('label') + '</div>';
			}
			else {
				tab += '<div class="tab-label">' + $(this).attr('label') + '</div>';
				$(this).css('display', 'none');
			}
			i++;
		});
		$('#' + id).append(tab + '</div>');
		$('#' + id).append($(this));
		$(this).addClass('div-tab-data');
		$('#' + id).attr('selectIndex', 0);
		$('#' + id + ' .div-tab-data .tab-data').eq(0).addClass('tab-view');
		$('#' + id + ' .div-tab-head .tab-label').click(function(){
			$('#' + id + ' .div-tab-head .tab-select').removeClass('tab-select');
			$(this).addClass('tab-select');
			var inx = $('#' + id + ' .div-tab-head .tab-label').index($(this));
			$('#' + id).attr('selectIndex', inx);
			$('#' + id + ' .div-tab-data .tab-data').removeClass('tab-view');
			$('#' + id + ' .div-tab-data .tab-data').css('display', 'none');
			$('#' + id + ' .div-tab-data .tab-data').eq(inx).css('display', '');
			$('#' + id + ' .div-tab-data .tab-data').eq(inx).addClass('tab-view');
		});
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.rightMenu = function(data) {
		var mouseOver = true;
		$(this).on('mousedown', function(e){
			var obj = $(this);
			if(e.button == 2){
				document.oncontextmenu = function() {
					$('.rightMenu').remove()
					if(mouseOver == true && data != undefined) {
						var c = $('<div id="rightMenu" class="rightMenu" style="top:'+ e.pageY + 'px;left:' +e.pageX + 'px;"></div>');
						c.mouseOver = false;
						var addMenu = false;
						$.each(data, function(i, v) {
							addMenu = true;
							var r = $('<div class="rightMenu-row"><div class="rightMenu-icon"></div>' + v.label + '</div>');
							if(v.iconClass != undefined) {
								r.find('div.rightMenu-icon').addClass(v.iconClass);
							}
							if(v.click != undefined && typeof v.click == 'function') {
								r.click(function() {
									v.click.call($(this));
									remove();
								})
							}
							c.append(r).mouseover(function(){c.mouseOver = true;}).mouseout(function(){c.mouseOver = false;});
						});
						if(addMenu == true) {
							c.disableSelection();
							$('body').append(c);
							$('html').bind('mousedown.rightMenu', function(e){
								if(c.mouseOver == false) {
									remove();
								}
							});
							obj.unbind('remove').bind('remove', function() {
								remove();
							});
						}
					}
					function remove() {
						$('html').unbind('mousedown.rightMenu');
						document.oncontextmenu = null;
						c.remove();
					}
					return false;
				}
			}
		})
		.on('mouseover', function(){mouseOver = true;}).on('mouseout', function(){mouseOver = false;});
	}

	$.fn.showPopup = function(id, data, options){
		var options = $.extend({
			autoFocus:true,
			btnClose:false,
			drag:true,
			height:'auto',
			fadeIn:150,
			fadeOut:150,
			footer:'',
			parentRemove:true,
			show:'',
			left:'auto',
			width:'auto',
			title:'',
			top:'auto'
		}, options);
		var idSel = '#' + id;
		var newPopup = false;
		var mouseOver = true;
		var popup = $(idSel);
		if(popup.size() == 0) {
			newPopup = true;
			$('body').append('<div id="' + id + '" class="div-popup"></div>');
			popup = $(idSel);
			popup.html('<div class="div-popup-header"><div class="div-popup-header-title" style="float:left;">' + options.title + '</div></div><div class="div-popup-body" style="float:left;"></div><div class="div-popup-footer">' + options.footer + '</div>');
			if(options.btnClose === false) {
				$(this).mouseover(function(){mouseOver = true;}).mouseout(function(){mouseOver = false;});
				popup.mouseover(function(){mouseOver = true;}).mouseout(function(){mouseOver = false;});
				$('html').bind('click.showPopup touchend.showPopup', function(e){
					if(mouseOver == false || e.type == 'touchend') {
						popup.remove();
					}
				});
			}
			else {
				popup.find('.div-popup-header').append('<div class="div-popup-header-close"></div>');
				popup.find('.div-popup-header-close').click(function(){
					if(typeof options.btnClose == 'function') {
						options.btnClose.call($(this));
					}
					popup.remove();
				});
			}
			if(options.drag === true) {
				popup.find('.div-popup-header').bind('mousedown.showPopup', function(e){
					if(e.target.className != 'div-popup-header-close') {
						document.body.focus();
						document.onselectstart = function () { return false; };
						popup.ondragstart = function() { return false; };
						var y= $.intval(popup.offset().top - e.pageY);
						var x = $.intval(popup.offset().left - e.pageX);
						var h= $(window).height() + $(window).scrollTop() - popup.outerHeight();
						var w = $(window).width() - popup.outerWidth();
						if(!popup.hasClass('move')) popup.addClass('move');
						$('body').bind('mousemove.showPopup', function(e) {
							var l = position($.intval(x + e.pageX), w);
							var t = position($.intval(y + e.pageY), h);
							popup.css({left:l, top:t});
						})
						.bind('mouseup.showPopup', function(){
							document.onmousemove = null;
							document.onselectstart = null;
							popup.ondragstart = null;
							popup.removeClass('move');
							$('body').unbind('mousedown.showPopup mousemove.showPopup mouseup.showPopup');
						});
					}
				})
				.css('cursor', 'move').disableSelection();
			}

			popup.remove =function(e){
				popup.fadeOut(options.fadeOut, function(){
					$(this).remove();
				});
				$('html').unbind('click.showPopup touchend.showPopup');
			}

			if(options.parentRemove == true) {
				$(this).unbind('remove').bind('remove', function() {
					popup.remove();
				});
			}
		}
		if(data != undefined || data == true) {
			var body = popup.find('.div-popup-body');
			body[0].innerHTML = (typeof data == 'object' ? data[0].innerHTML : data);
			if(newPopup === true) {
				if(popup.height() > $(window).height() -100) {
					body.height($(window).height() - 140).css('overflow-y', 'scroll');
				}
				if(popup.width() > $(window).width() - 140) {
					body.width($(window).width() - 156);
				}
				if(options.top == 'auto') {
					var top = $(this).offset().top + $(this).outerHeight(true);
					if((top + popup.outerHeight(true)) > ($(document).scrollTop() + $(window).height())) {
						top = $(window).height() - (popup.outerHeight(true) + 40);
					}
				}
				else if(options.top == 'center') {
					top = ($(window).height() - popup.height()) / 2;
				}
				else {
					top = options.top;
				}
				var left = (options.left == 'auto' ? $(this).offset().left : (options.left == 'center' ? ($(window).width() - popup.width()) / 2 : options.left));
				popup.css('left', left).css('top', top).css('height', options.height).css('width', options.width);
			}
			body.enterToTab('input[type!=button][type!=file], select, textarea');
			popup.fadeIn(options.fadeIn, function() {
				if(typeof options.show == 'function') {
					options.show.call($(this));
				}
			});
		}
		else {
			popup.remove();
		}
		if(options.autoFocus === true) {
			popup.find('input[name], select[name], textarea[name]').first().focus();
		}
		else if(typeof options.autoFocus == 'string') {
			popup.find(options.autoFocus).focus();
		}
		body.html(data);
		return popup;

		function position(v, m) {
			if(v < 0) {
				return 0;
			}
			else if(v > m) {
				return m;
			}
			else {
				return v;
			}
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.drag = function(obj) {
		if($('body').data('_DragIndex') == undefined) {
			$('body').data('_DragIndex', 10000);
			$('body').append('<div id="ps"></div>');
		}
		$(this).bind('mousedown', function(e){
			if(obj == undefined) {
				obj = $(this);
			}
			$('body').data('_DragIndex', $('body').data('_DragIndex') + 1);
			obj.css({position: 'absolute',zIndex: $('body').data('_DragIndex')});
			document.body.focus();
			document.onselectstart = function () { return false; };
			obj.ondragstart = function() { return false; };
			//$.print(e);
			//$.print(obj.offset());
			var y= $.intval(obj.offset().top - e.pageY);
			var x = $.intval(obj.offset().left - e.pageX);
			//var x = $.intval(obj.offset().left);
			var h= $(window).height() + $(window).scrollTop() - obj.outerHeight();
			var w = $(window).width() - obj.outerWidth();
			$('#ps').html(y + ' : ' +obj.offset().top+' - '+e.pageY);
			$('body').bind('mousemove', function(e) {
				$('#ps').html(y + ' : ' +obj.offset().top+' - '+e.pageY);
				var l = fixScreen($.intval(x + e.pageX), w);
				var t = fixScreen($.intval(y + e.pageY), h);
				//var l = $.intval(x + e.pageX);
				//var t = $.intval(y + e.pageY);
				obj.css({left:l, top:t});
			})
			.bind('mouseup', function(){
				document.onselectstart = null;
				obj.ondragstart = null;
				$('body').unbind('mousemove');
				$('body').unbind('mouseup');
			});
		});

		function fixScreen(v, m) {
			return ((v<0)?0:(v>m)?m:v);
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.showSearch = function(data, options){
		if(data != undefined) {
			return $(this).showPopup('div-show-search', $.dataGrid(data, options), options);
		}
		else {
			data = '';
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.editPopup = function(data, options){
		if(data == null) {
			data = true;
		}
		return $(this).showPopup('div-edit-popup', $.dataGrid(data, options), options);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.loadSELECT = function(options){
		var obj = $(this);
		var options = $.extend({
			blank: false,
			value: 'value',
			label: 'label',
			tag: '',
			url: null,
			send: null,
			data: null
		}, options);
		if(options.data == null && options.url != null && options.send != null) {
			$.send(options.url, options.send, function(data){
				addOption(data);
			});
		}
		else {
			addOption(options.data);
		}

		function addOption(data){
			var str = (options.blank === false ? '' : '<option value="' + options.blank + '"></option>');
			$.each(data, function(i, v){
				if(v.selected != undefined && v.selected === true) {
					str += '<option value="' + v[options.value] + '" ' + options.tag + ' selected>' + v[options.label] + '</option>';
				}
				else {
					str += '<option value="' + v[options.value] + '" ' + options.tag + '>' + v[options.label] + '</option>';
				}
			});
			obj.html(str);
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.disable = function() {
		return this.attr('disabled', true).addClass('disabled');
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.enable = function() {
		return this.removeClass('disabled').attr('disabled', false);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.textWidth = function(text, size) {
		if(size != undefined) {
			size = 'font-size:' + size + 'px;';
		}
		else {
			size = '';
		}
		var div = $('<div style="float:left;' + size + '">' + text + '</div>');
		$('body').append(div);
		var width = div.width();
		div.remove();
		return width;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.copy = function() {
		return $(this).clone(true);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.copy = function(v) {
		if(v == null) {
			return null;
		}
		else {
			return $.extend(true, {}, v);
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.splice = function(v, i, n, a) {
		if(v != null && typeof v == 'object' && i !== undefined) {
			var r = {};
			i = $.intval(i);
			var d = c = 0;
			if(a === undefined && typeof n != 'object') {
				a = (n === undefined || n <= 0 ? 1 : $.intval(n));
				$.each(v, function(k){
					if(c >= i && c < (i + a)) {
						r[d++] = v[k];
						delete v[k];
					}
					else if(c > i) {
						v[c - d] = v[k];
						delete v[k];
					}
					else {
						v[c] = v[k];
					}
					c++;
				});
				if(n === undefined) {
					return r[0];
				}
				else {
					return r;
				}
			}
			else {
				$.each(v, function(k){
					if(c == i) {
						if(typeof n == 'object') {
							r[c + d++] = n;
						}
						else {
							$.each(a, function(x){r[c + d++] = a[x]});
						}
						r[c + d] = v[k];
						delete v[k];
					}
					else if(c > i) {
						r[c + d] = v[k];
						delete v[k];
					}
					c++;
				});
				if($.len(r) == 0) {
					if(typeof n == 'object') {
						v[c] = n;
					}
					else {
						$.each(a, function(x){v[c++] = a[x]});
					}
				}
				else {
					$.each(r, function(k){v[k] = r[k]});
				}
				return v;
			}
		}
		else if(a != undefined) {
			return v = [a];
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.checked = function(v) {
		return ($(this).prop('checked') ? $(this).val() : 0);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.len = function(v) {
		if(v == undefined) {
			return 0;
		}
		else if(typeof v == 'object') {
			return (v.length == undefined ? Object.keys(v).length : v.length);
		}
		else if(typeof v == 'number') {
			return v.toString().length;
		}
		else if(typeof v.length == 'number') {
			return v.length;
		}
		else {
			return 0;
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.enableSelection = function() {
		return this.each(function() {
			$(this).removeAttr('unselectable').css({'-moz-user-select':'', '-webkit-user-select':'', 'user-select':''}).each(function() {
				this.onselectstart = function() {return true;};
			});
		});
	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.disableSelection = function() {
		return this.each(function() {
			$(this).attr('unselectable', 'on').css({'-moz-user-select':'none', '-webkit-user-select':'none', 'user-select':'none'}).each(function() {
			   this.onselectstart = function() {return false;};
		   });
		});
	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.ceil = function(d) {
		$(this).val($.ceil($(this).val(), d));
		return($(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.ceil = function(v, d) {
		d = $.intval(d);
		if(d > 0) {
			var n = Math.pow(10, d);
			v = Math.ceil($.floatval(v) * n) / n;
		}
		return v.toFixed(d);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.round = function(d) {
		$(this).val($.round($(this).val(), d));
		return($(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.round = function(v, d) {
		d = $.intval(d);
		if(d > 0) {
			var n = Math.pow(10, d);
			v = Math.round($.floatval(v) * n) / n;
		}
		return v.toFixed(d);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.floor = function(d) {
		$(this).val($.floor($(this).val(), d));
		return($(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.floor = function(v, d) {
		d = $.intval(d);
		if(d > 0) {
			var n = Math.pow(10, d);
			v = Math.floor($.floatval(v) * n) / n;
		}
		return v.toFixed(d);
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.floatval = function() {
		return $.floatval($(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.floatval = function(v) {
		return (v == undefined || isNaN(v) === true || v == '' ? 0 : parseFloat(v));
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.intval = function() {
		return $.intval($(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.intval = function(v) {
		return (v == undefined || isNaN(v) === true || v == '' ? 0 : parseInt(v, 10));
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.repeat = function(v, l) {
		var r = v;
		if(l !== undefined && l > 0) for(var i=1; i < l; i++) r += v;
		return r;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.format = function(v, f, n) {
		if(n !== undefined) {
			f = $.repeat(f, n);
		}
		return f.substr(0, $.len(f) - $.len(v)) + v;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.date = function(f, l, d) {
		return $.date(f, l, $(this).val());
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.date = function(f, l, d) {
        var tD = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
        var tl = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        var tM = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'ม.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
		var tm = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
		var w = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var n = new Date();
		if(d == undefined && $.len(l) == 10) {d = l; l = ''}
		if(d != undefined && $.len(d) == 10) {
			if(d.substr(4, 1) == '-' || d.substr(4, 1) == '/') {
				d = {y:$.intval(d.substr(0, 4)), m:$.intval(d.substr(5, 2)), d:$.intval(d.substr(8, 2))};
			}
			else {
				d = {y:$.intval(d.substr(6, 4)), m:$.intval(d.substr(3, 2)), d:$.intval(d.substr(0, 2))};
			}
			n = new Date((d.y - n.getFullYear() > 500 ? d.y -543 : d.y), d.m - 1, d.d);
		}
		else if(d['y'] != undefined && d['m'] != undefined && d['d'] != undefined) {
			n = new Date(d['y'], d['m'] - 1, d['d']);
		}
		var y = (l == 'th' ? n.getFullYear() + 543 : n.getFullYear());
		n = {
			Y:y, M:$.format(n.getMonth(), '0', 2),
			y:y.toString().substr(-2, 2),
			n:n.getMonth() + 1,
			F:(l == 'th' ? tm[n.getMonth()] : m[n.getMonth()]),
			M:(l == 'th' ? tM[n.getMonth()] : m[n.getMonth()].substr(0, 3)),
			m:$.format(n.getMonth() + 1, '0', 2),
			w:n.getDay(),
			l:(l == 'th' ? tl[n.getDay()] : w[n.getDay()]),
			D:(l == 'th' ? tD[n.getDay()] : w[n.getDay()].substr(0, 3)),
			d:$.format(n.getDate(), '0', 2),
			t:$.dayInMonth(n.getFullYear(), n.getMonth() + 1),
			H:$.format(n.getHours(), '0', 2),
			h:$.format((n.getHours() > 12 ? n.getHours() - 12 : n.getHours()), '0', 2),
			i:$.format(n.getMinutes(), '0', 2),
			s:$.format(n.getSeconds(), '0', 2)
		};
		f = (f==undefined || f == '' ? (l == 'th' ? 'd/m/Y' : 'Y-m-d') : f);
		var r = '';
		for(var i=0, l=$.len(f); i<l; i++) {
			var c = f.substr(i, 1);
			if(n[c] !== undefined) {
				r += n[c];
			}
			else r += c;
		}
		return r;
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.dayInMonth = function(y, m) {
		if(y !== undefined && m !== undefined) {
			y = $.intval(y);
			m = $.intval(m);
			return m == 2 ? (y % 4 ? 28 : (y % 100 ? 29 : (y % 400 ? 28 : 29))) : ((m - 1) % 7 % 2 ? 30 : 31);
		}
		else {
			return false;
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.convertByte = function(v) {
		var type = '';
		if(v < 1024) {
			type = ' Byte';
		}
		else if(v <= 1022976) {
			v = $.intval(v / 1024);
			type = ' KB';
		}
		else if(v <= 1047527424) {
			v = $.intval(v / 10485.76) / 100;
			v = $.round(v, 2);
			type = ' MB';
		}
		else {
			v = $.intval(v / 10737418.24) / 100;
			v = $.round(v, 2);
			type = ' GB';
		}
		return v + type;
	};

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.browser = function(n) {
		ua = navigator.userAgent.toLowerCase();
		var rchrome = /(chrome)[ \/]([\w.]+)/
		var rwebkit = /(webkit)[ \/]([\w.]+)/
		var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/
		var rmsie = /(msie) ([\w.]+)/
		var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/

		var match = rchrome.exec(ua) || rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
		if(n == undefined) {
			return {browser: match[1] || "", version: match[2] || "0" };
		}
		else {
			return (match[1] == n ? match[2] : "0");
		}
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.checkAll = function(oa, op) {
		var op = $.extend({returnIndex:'no', returnData:null}, op);
		var o = $(this);
		var c = 'checked';
		oa = $(oa);
		$(this).click(function(){
			var selected = true;
			o.each(function(){
				if(this != oa.get(0) && $(this).attr(c) != c) {
					return selected = false;
				}
			});
			oa.attr(c, selected);
			if(this == oa.get(0)) {
				o.attr(c, !selected);
			}
			checkAllData();
		});
		checkAllData();

		function checkAllData() {
			if($.isArray(op.returnData)) {
				var i = 0;
				op.returnData[c] = 0;
				op.returnData['data'] = [];
				o.each(function(){
					if(this != oa.get(0)) {
						var inx = i;
						if(op.returnIndex == 'id' || op.returnIndex =='name') {
							inx = $(this).attr(op.returnIndex);
						}
						op.returnData['data'][inx] = [];
						if($(this).attr(c) != c) {
							op.returnData['data'][inx][c] = false;
						}
						else {
							op.returnData[c]++;
							op.returnData['data'][inx][c] = true;
						}
						op.returnData['data'][inx]['value'] = $(this).val();
						i++
					}
				});
				op.returnData['count'] = i;
			}
		}
	}

//---------------------------------------------------------------------------------------------------------------------------------------------------

	if (!Object.keys) {
		Object.keys = function(obj) {
			var k = [];
			for (var i in obj) if(obj.hasOwnProperty(i)) k.push(i);
			return k;
		};
	}
});
