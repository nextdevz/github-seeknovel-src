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
				else {
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

	$.fn.checkIdCard = function(blank=false) {
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

	/*$.send = function(u, d, s, op) {
		op = $.extend({
			dataType:undefined,
			progressBar: 'normal',
			target: 'self'
		}, op);
		if(op.progressBar != 'none') {
			var file, process = false, si, dt = new Date().getTime();
			if($.cookie('PHPSESSID') === undefined) {
				file = 'NDprocess' + dt;
			}
			else {
				file = $.cookie('PHPSESSID') + dt;
			}
			if(typeof d == 'string') {
				d += '&percentProcess=' + file + '&pathProcess=' + location.pathname;
			}
			else {
				d.percentProcess = file;
			}
			var up = u.substring(0, u.lastIndexOf('/')) + '/' + file + '?dt='
			var loading = $('<div class="div-loading" size="1"><div class="div-loading-left-end"></div><div class="div-loading-left"><div class="div-loading-left-process"></div></div><div class="div-loading-center"></div><div class="div-loading-right"><div class="div-loading-right-process"></div></div><div class="div-loading-right-end"></div></div>');
			if($('.div-loading').size() == 0) {
				$('body').append(loading);
				$('.div-loading').disableSelection().rightMenu(true);
			}
			else {
				loading = $('.div-loading');
				loading.attr('size', $.intval(loading.attr('size')) + 1);
			}
			si = setInterval(function() {
				if(process === false) {
					process = true;
					$.get(up + new Date().getTime(), function(data) {
						if(data != '') {
							if(op.progressBar == 'reverse') {
								var percent = 100 - data;
							}
							else {
								var percent = data;
							}
							var width = $.intval(($.intval(percent) * loading.find('.div-loading-left').width()) / 100);
							loading.find('.div-loading-left-process, .div-loading-right-process').width(width);
							if(percent > 95) {
								loading.find('.div-loading-left-end, .div-loading-right-end').addClass('div-loading-process-end');
							}
							else {
								loading.find('.div-loading-left-end, .div-loading-right-end').removeClass('div-loading-process-end');
							}
							loading.find('.div-loading-center').html(data);
						}
						process = false;
					});
				}
			}, 250);
		}
		$.post(u, d, function(d){
			if(d.substr(0, 4) == 'DRL='){
				var l = parseInt(d.substr(4, 6), 16);
				d = d.substr(10);
			}
			d = $.dataJSON(d);
			if(op.progressBar != 'none') {
				clearInterval(si);
				if(loading.attr('size') == 1) {
					loading.remove();
				}
				else {
					loading.attr('size', $.intval(loading.attr('size')) - 1);
				}
			}
			if(d === false) {
				return false;
			}
			s.call($(this), d, l);
		}, op.dataType);
	}*/

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

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.fn.dataGrid = function(data, options){
		return $(this).html($.dataGrid(data, options));
	}

	//---------------------------------------------------------------------------------------------------------------------------------------------------

	$.dataGrid = function(data, options){
		if(options == undefined) {options = data; data = true};
		var options = $.extend({
			addRow: false,
			btnInsert: '',
			btnUpdate: '',
			btnDelete: '',
			class: 'div-datagrid',
			column: {},
			cookie: '',
			editRow: false,
			footer: {},
			height:'',
			length:$.len(data),
			mutiSelect: true,
			page: 1,
			loadPage: '',
			rows: 15,
			rowClick: '',
			rowDrag: false,
			rowTag: '',
			send:'',
			showControl: true,
			showNo: false,
			showScroll: 'auto',
			sort: '',
			sortField: '',
			url: ''
		}, options);
		var css = options.class;
		var id = css + (new Date()).getTime();
		var obj = $('<div id="' + id + '" class="' + css + '" style="float:left;position:absolute;top:-5000px"></div>');
		var div = $('<div class="' + css + '-table" style="float:left;"></div>');
		var divHeader = $('<div class="' + css + '-header" style="clear:left;float:left;"></div>');
		var divBody = $('<div class="' + css + '-body" style="clear:left;float:left;"></div>');
		var divFooter = $('<div class="' + css + '-footer" style="clear:left;float:left;"></div>');
		var header =$('<table class="' + css + '-table-header"></table>');
		var body =$('<table class="' + css + '-table-body"></table>');
		var footer =$('<table class="' + css + '-table-footer"></table>');
		var objTable = {};
		var control = $('<div class="' + css + '-control" style="clear:left;"></div>');
		var scollWidth = 17;
		var columnSort = null;
		var pageAll = 1;
		var footerData = {};
		if(options.editRow === true) {
			options.column.push({type:'btn-update', width:20});
			options.column.push({type:'btn-delete', width:20});
		}
		var columnField = {
			align: 'left',
			decimal: '',
			display: '',
			editable: false,
			field: 'field',
			renderer: '',
			sort: '',
			sortable: true,
			sortField: '',
			type:'string',
			width: 'auto'
		};
		$.each(options.column, function(i, v){
			options.column[i] = $.extend($.copy(columnField), v);
		});
		if(data == true && options.url != '') selectPage(1);
		var rowsSet = options.rows;
		var rowSetting = {};

		obj.selectAll = function() {
			var pr = firstRowPage();
			resetSelected();
			body.find('tr.' + css + '-row').each(function(i, v) {
				if(data[i + pr] != undefined) {
					$(this).addClass('row-selected');
					obj.selectedItems[obj.selectedSize++] = data[i + pr];
				}
			});
			obj.selectedItem[0] = data[pr];
		}
		obj.dataProvider = function(v, cd) {
			if(v === undefined || v === false) {
				var temp = $.copy(data);
				if(cd === undefined || cd !== false) {
					$.each(temp, function(i, v){
						temp[i] = checkData(v, true);
					});
				}
				return temp;
			}
			else if(typeof v == 'function') data = v.call(this, data);
			else data = v;
			options.length = $.len(data);
			resetSelected();
			if(columnSort != null)  sort(data, columnSort.inx);
			selectPage(1);
		}
		obj.addData = function(v, i) {
			data = obj.dataProvider(false, false);
			//$.splice(data, (i == undefined ? $.len(data) : i), checkData(v));
			$.splice(data, (i == undefined ? options.length : i), checkData(v));
			obj.dataProvider(data);
		}
		obj.editData = function(v, i) {
			data = obj.dataProvider(false, false);
			//data[(i == undefined ? $.len(data) : i)] = checkData(v);
			data[(i == undefined ? options.length : i)] = checkData(v);
			obj.dataProvider(data);
		}
		obj.spliceData = function(i, n) {
			data = obj.dataProvider(false, false);
			//var cut = $.splice(data, i, (n == undefined ? $.len(data) - i : n));
			var cut = $.splice(data, i, (n == undefined ? options.length - i : n));
			options.length = $.len(data)
			//if($.len(data) == 0 ) data = true;
			if(options.length == 0 ) data = true;
			else cut = cut[0];
			resetSelected();
			if(columnSort != null) sort(data, columnSort.inx);
			selectPage(options.page);
			return cut;
		}
		obj.dataCell = function(v, c) {
			var r = obj.selectedIndex;
			if(v == undefined) return data[r];
			if(typeof v == 'object') data[r] = $.extend(data[r], v);
			if(c !== undefined) {
				data[r][rowSetting[c].field] = v;
				createCell(objTable[r][c].empty(), objTable[r]['no'], rowSetting[c], data[r], obj.dataCell);
			}
			else {
				if(options.showNo === true) data[r]['no'] = objTable[r]['no'];
				createRow(objTable[r].tr.empty(), objTable[r]['no'], rowSetting, r, data[r], obj.dataCell);
			}
		}
		obj.footerCell = function(v, c) {
			if(v === undefined) return footerData;
			if(typeof v == 'object') footerData = $.extend(footerData, v);
			if(c !== undefined) {
				footerData[options.footer[c].field] = v;
				createCell(objTable['ft'][c].empty(), objTable['ft']['no'], options.footer[c], footerData, obj.footerCell);
			}
			else {
				createRow(objTable['ft'].tr.empty(), objTable['ft']['no'], options.footer, 'ft', footerData, obj.footerCell);
			}
		}
		obj.selectCell = function(r, c) {
			objTable[r].tr.mousedown();
			return (c == undefined ? objTable[r].tr : objTable[r][c]);
		}
		obj.selectPage = function(v) {
			if(v === undefined) return options.page;
			else if(v == 0) v = pageAll;
			selectPage(v);
		}
		$('body').append(obj);
		obj.attr('selectedIndex', obj.columnIndex = obj.selectedIndex = -1);
		obj.selectedSize = 0;
		obj.selectedItem = obj.selectedItems = null;
		obj.html(div.disableSelection());
		div.html(divHeader.html(header));
		div.append(divBody.html(body));
		createColumn(header);
		if(columnSort != null) columnSort.click();
		else createBody(body);
		if(options.editRow === true || $.len(options.footer) > 0) {
			$.each(rowSetting, function(i, v){
				options.footer[i] = $.extend($.copy(v), options.footer[i]);
				if(options.editRow === true) {
					if(options.footer[i].type == 'btn-update') options.footer[i].type = 'btn-insert';
					if(options.footer[i].type == 'btn-delete') options.footer[i].type = 'btn-clear';
				}
				if(options.footer[i].display !== undefined) footerData[options.footer[i].field] = options.footer[i].display;
			});
			createFooter(footer);
			div.append(divFooter.html(footer));
		}
		pageData();
		if(options.showControl === true) {
			obj.append(control);
			control.width((div.hasClass('div-datagrid-table-scoll') ? obj.width() - scollWidth : obj.width()));
			createSelectPage(control);
		}
		obj.css('position', '').css('top', '');
		return obj;

		function checkData(v, c) {
			var r = {};
			$.each(options.column, function(no, col){
				if(col.field != 'field' && col.type.substr(0, 4) != 'btn-') {
					r[col.field] = (v.hasOwnProperty(col.field) === true ? v[col.field] : '');
					if(c !== undefined) r[col.field] = checkDecimal(r[col.field], col.type, col.decimal);
				}
			});
			return r;
		}

		function checkDecimal(v, t, d) {
			if(t == 'number') {
				v = $.floatval(v);
				v = (d != undefined && $.intval(d) > 0 ? $.round(v, d) : $.intval(v));
			}
			return v;
		}

		function resetSelected() {
			obj.selectedItem = obj.selectedItems = {};
			obj.selectedSize =  0;
		}

		function pageData() {
			if(data === true) pageAll = 1;
			else {
				//var p = $.len(data) / options.rows;
				var p = options.length / options.rows;
				pageAll = $.intval(p);
				if(p > pageAll) pageAll++;
			}
		}

		function firstRowPage() {
			return (options.page - 1) * options.rows;
		}

		function createColumn(table) {
			var tr = $('<tr class="' + css + '-column"></tr>').disableSelection();
			table.html(tr);
			$.each(options.column, function(inx, col) {
				var style = 'style="';
				if(col.align != 'left') style += 'text-align:' + col.align + ';'
				if(col.display == 'none') style += 'display:none;';
				if(col.width != 'auto') style += 'width:' + col.width + 'px;';
				style += '"';
				if(col.sortField == '') col.sortField = col.field;
				if(col.decimal != '') col.decimal = $.intval(col.decimal);
				rowSetting[inx] = {'decimal':col.decimal, 'field':col.field, 'sortField':col.sortField, 'editable':col.editable, 'renderer':col.renderer, sort:col.sort, 'style':style, 'type':col.type, 'width':col.width};
				var td = $('<td ' + style + '><div class="header" style=width:' + col.width +'px;>' +  col.display + '</div></td>');
				td.inx = inx;
				td.align = col.align;
				tr.append(td);
				if(col.sortable == true) {
					td.addClass('column-sortable').click(function(){
						if(columnSort != null) {
							columnSort.find('.header').css('text-align', columnSort.align).css('text-indent', '0px').width(columnSort.width());
							columnSort.find('div.icon-sort').remove();
						}
						options.sort = rowSetting[inx]['sort'] = switchSort(rowSetting[inx]['sort']);
						if(rowSetting[inx]['sortField'] != 'no' || options.showNo == false) options.sortField = rowSetting[inx]['sortField'];
						td.find('.header').css('width', 'auto');
						td.append('<div class="icon-sort sort-' + rowSetting[inx]['sort'] + '"></div>');
						var isw = td.find('.icon-sort').width() + 2;
						if(td.css('text-align') == 'center') {
							if(td.find('.header').width() + isw > td.width() - isw) {
								td.find('.header').css('text-align', 'right');
							}
							else {
								td.find('.header').css('text-indent', isw);
							}
						}
						td.find('.header').width(td.width() - isw);
						columnSort = td;
						if(options.url != '') selectPage(options.page);
						else {
							sort(data, inx);
							createBody(body);
						}
					});
					if(col.sort != '') {
						rowSetting[inx]['sort'] = switchSort(rowSetting[inx]['sort']);
						columnSort = td;
					}
				}
			});
			tr.append('<td class="column-scoll" style="width:' + scollWidth + 'px;display:none;border-right:none;padding:0px"></td>');
		}

		function switchSort(v) {
			if(v == 'asc') {
				return 'desc';
			}
			else {
				return 'asc';
			}
		}

		function sort(data, inx) {
			if(typeof data != 'boolean') {
				data.sort(function(a, b){
					if(rowSetting[inx]['sort'] == 'asc') {
						return sortFunction(a[rowSetting[inx]['sortField']], b[rowSetting[inx]['sortField']]);
					}
					else {
						return sortFunction(b[rowSetting[inx]['sortField']], a[rowSetting[inx]['sortField']]);
					}
				});
			}
		}

		function sortFunction(a, b) {
			var va = $.floatval(a);
			var vb = $.floatval(b);
			if(va < vb) return -1;
			else if(va > vb) return 1;
			a = a.toString();
			b = b.toString();
			for(var i=0, l=$.len(a); i<l; i++){
				ca = thaiChar(a, i);
				cb = thaiChar(b, i);
				if(ca < cb) return -1;
				else if(ca > cb) return 1;
			}
			return ($.len(a) < $.len(b) ? -1 : 0);
		}

		function thaiChar(s, i) {
			var c = {3648:0.1, 3649:0.2, 3650:0.3, 3651:0.4, 3652:0.5};
			if(isNaN(s.charCodeAt(i))) return 0;
			return (s.charCodeAt(i) > 3647 && s.charCodeAt(i) < 3653 && !isNaN(s.charCodeAt(i+1)) ? s.charCodeAt(i+1) + c[s.charCodeAt(i)] : s.charCodeAt(i));
		}

		function createBody(table, n) {
			table.empty();
			if(options.height == '' || isNaN(options.height) == true) {
				table.html('<tr class="' + css + '-row-blank"><td>&nbsp;</td></tr>');
				divBody.height(options.height = table.find('tr').height() * options.rows);
				table.empty();
			}
			else {
				divBody.height(options.height);
			}
			if($.cookie('datagrid-' + options.cookie + '-item-page')) options.rows = $.cookie('datagrid-' + options.cookie + '-item-page');
			if(n == undefined) n = 0;
			var r = 0;
			var st = firstRowPage();
			var sp = options.page * options.rows;
			var temp = $.copy(data);
			var fn = obj.dataCell;
			if(options.addRow === true) temp[$.len(temp)] = {};
			if(data != null) {
				$.each(temp, function(no){
					if(options.showControl === true && n >= sp) {
						return false;
					}
					else if(n >= st) {
						objTable[r] = {};
						if(data[no] !== undefined) {
							var tr = $('<tr class="' + css + '-row" ' + options.rowTag + '></tr>');
							objTable[r]['no'] = n + 1 + '.';
						}
						else {
							tr = $('<tr class="' + css + '-row row-add-data" ' + options.rowTag + '></tr>');
							objTable[r]['no'] = 'a';
							fn = obj.addData;
						}
						objTable[r]['tr'] = tr;
						createRow(tr, objTable[r]['no'], rowSetting, r, data[no], fn);
						addRowEvent(tr, r, no);
						table.append(tr);
						r++;
					}
					n++;
				});
			}
			while(table.height() < divBody.height()) {
				tr = $('<tr class="' + css + '-row-blank"></tr>');
				$.each(rowSetting, function(i, v) {
					tr.append('<td ' + v.style + '>&nbsp;</td>');
				});
				addRowColor(tr, r);
				table.append(tr);
				r++;
			}
			if(options.showScroll === true || (options.showScroll == 'auto' && divBody.height() < body.height())) {
				divBody.width(body.width() + scollWidth).css('overflow-x', 'hidden').css('overflow-y', 'scroll');
				header.find('.column-scoll').css('display', '');
				div.removeClass('div-datagrid-table');
				div.addClass('div-datagrid-table-scoll');
			}
			else {
				divBody.width(body.width());
				header.find('.column-scoll').css('display', 'none');
				divBody.css('overflow', 'hidden');
				div.removeClass('div-datagrid-table-scoll');
				div.addClass('div-datagrid-table');
			}
		}

		function createRow(tr, n, column, r, rowData, fn) {
			var c = 0;
			$.each(column, function(i, v){
				if(rowData === undefined) rowData = {};
				rowData[v.field] = (rowData[v.field] === undefined ? '' : rowData[v.field]);
				var td = $('<td field="' + v.field + '" ' + v.style + '></td>');
				td.c = c;
				objTable[r][c] = {};
				objTable[r][c] = td;
				createCell(td, n, v, rowData, fn);
				td.mousedown(function() {
					obj.columnIndex = td.c;
				});
				tr.append(td);
				c++;
			});
		}

		function createCell(td, n, v, rowData, fn) {
			if(v.renderer != '') {
				if(typeof v.renderer == 'function') {
					td.html(v.renderer.call($(this), rowData, fn));
				}
				else if(typeof v.renderer == 'object') {
					td.html($(v.renderer).copy());
				}
				else {
					td.html(v.renderer);
				}
			}
			else if(v.editable != '') {
				var input = $('<input type="text" class="' + css + '-editable" ' + v.style + ' value="' + checkDecimal(rowData[v.field], v.type, v.decimal) + '"/>');
				input.focus(function(){
					td.addClass(css + '-edit-start');
				}).keyup(function(){
					rowData[v.field] = input.val();
				}).focusout(function(){
					td.removeClass(css + '-edit-start');
					rowData[v.field] = input.val();
					input.val(checkDecimal(input.val(), v.type, v.decimal));
				});
				if(typeof v.editable == 'function') {
					v.editable.call(input, rowData, fn);
				}
				td.html(input);
			}
			else if(n != 'a' && v.type.substr(0, 4) == 'btn-') {
				var btn = $('<input type="button" class="div-datagrid-btn ' + v.type + '"></input>');
				btn.click(function(){
					if(v.type == 'btn-update' && typeof options.btnUpdate == 'function') {
						options.btnUpdate.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-delete' && typeof options.btnDelete == 'function') {
						options.btnDelete.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-insert' && typeof options.btnInsert == 'function') {
						options.btnInsert.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-clear') {
						$.each(rowData, function(i, v){
							if(i != 'no') {
								rowData[i] = '';
							}
						});
						fn(rowData);
					}
				});
				td.html(btn);
			}
			else if(options.showNo === true && v.field == 'no') {
				if(n[0] == 'a') n = '<font size="4">&#8658;</font>';
				if(rowData['no'] == '') rowData['no'] = n;
				td.html(rowData['no']);
			}
			else {
				td.html(checkDecimal(rowData[v.field], v.type, v.decimal));
			}
		}

		function createFooter(table) {
			table.empty();
			var tr = $('<tr class="' + css + '-row" ' + options.rowTag + '></tr>');
			var n = '';
			if(options.editRow === true) {
				tr.addClass('row-add-data');
				n = 'ab';
			}
			objTable['ft'] = {};
			objTable['ft']['tr'] = tr;
			objTable['ft']['no'] = n;
			createRow(tr, n, options.footer, 'ft', footerData, obj.footerCell);
			table.append(tr);
		}

		function addRowColor(tr, r) {
			if(r % 2 == 1) {
				tr.addClass('row-sub-color');
			}
		}

		function addRowEvent(tr, r, no) {
			addRowColor(tr, r);
			tr.bind('click touchstart', function(e){
				if(typeof options.rowClick == 'function') {
					options.rowClick.call($(this), $.copy(data[no]));
				}
			}).mousedown(function(e) {
				var pr = firstRowPage();
				if(data[no] != undefined) {
					var s = obj.selectedIndex;
					obj.selectedItem = obj.selectedItems = new Object;
					var l = 0;
					if(options.mutiSelect == true && (e.ctrlKey == true || e.shiftKey == true)) {
						if(tr.hasClass('row-selected')) {
							tr.removeClass('row-selected');
						}
						else {
							tr.addClass('row-selected');
						}
						if(e.ctrlKey == true) {
							body.find('tr.' + css + '-row').each(function(i, v){
								if($(this).hasClass('row-selected')) {
									obj.selectedItems[l++] = $.copy(data[i + pr]);
								}
							});
						}
						else if(e.shiftKey == true) {
							if(r > s) {
								var ed = r;
							}
							else {
								ed = s;
								s = r;
							}
							body.find('tr.' + css + '-row').each(function(i, v){
								if(i >= s && i <= ed) {
									$(this).addClass('row-selected');
									obj.selectedItems[l++] = $.copy(data[i + pr]);
								}
								else {
									$(this).removeClass('row-selected').removeClass('row-hover');
								}
							});
						}
					}
					else {
						tr.addClass('row-selected');
						obj.attr('selectedIndex', obj.selectedIndex = r);
						body.find('tr.' + css + '-row').each(function(i, v){
							if(r != i) {
								$(this).removeClass('row-selected').removeClass('row-hover');
							}
						});
						obj.selectedItems[l++] = $.copy(data[r + pr]);
					}
					obj.selectedSize = l;
					obj.selectedDataIndex = no;
					obj.selectedItem = $.copy(data[no]);
				}
			}).mouseover(function() {
				$(this).addClass('row-hover');
			}).mouseout(function() {
				$(this).removeClass('row-hover');
			});
			if(options.rowDrag == true) {
				/*tr.mousedown(function(e){ --------------------drag move row----------------------------------
					$('body').mousemove(function(e){
						$('body').append((tr).clone());
					});
				});*/
			}
		}

		function createSelectPage(control) {
			var table = $('<div class="' + css + '-select-page"></div>').disableSelection();
			control.append(table);
			var itemPage = {};
			var add = false;
			var r = 0;
			$([{v:25}, {v:50}, {v:75}, {v:100}, {v:150}, {v:200}, {v:300}]).each(function(i, v) {
				if(add == false && rowsSet < v.v) {
					itemPage[r++] = {v:rowsSet, selected:true};
					add = true;
				}
				itemPage[r++] = {v:v.v, selected:(options.rows == v.v) ? true : false};
			});
			var tr = $('<div style="clear:both;" align="center"></div>');
			table.append(tr);
			var width = 140;
			var ctstyle = 'float:left;';
			if(divBody.width() < (width + 140)) ctstyle += 'margin-right:' + $.intval((divBody.width() - width) / 4) + 'px;';
			tr.append($('<div style="' + ctstyle + '" class="icon btn-first"></div>').click(function(){
				selectPage(1);
			})).append($('<div style="' + ctstyle + '" class="icon btn-prev"></div>').click(function(){
				selectPage(options.page - 1);
			})).append($('<div style="' + ctstyle + '" class="inp-page"><input type="text" value="' + options.page + '" style="height:16px;line-height:0px;text-align:right;width:30px;"/><span> of ' + pageAll + '</span></div>'))
			.append($('<div style="' + ctstyle + '" class="icon btn-next"></div>').click(function(){
				selectPage(options.page + 1);
			})).append($('<div style="float:left;" class="icon btn-last"></div>').click(function(){
				selectPage(pageAll);
			}));
			if(divBody.width() >= (width + 140)) {
				width += 140;
				ctstyle = (divBody.width() < (width + 180) ? '' : 'float:left;margin-left:' + $.intval((divBody.width() - (width + 180)) / 2) + 'px;');
				tr.append($('<div style="' + ctstyle + '" class="inp-per-page">Items per page <select class="cbb-item-page"></select></div>'));
				tr.find('.cbb-item-page').change(function() {
					options.rows = $(this).val();
					if(options.cookie != '') {
						$.cookie('datagrid-' + options.cookie + '-item-page', options.rows, 356);
					}
					selectPage(1);
				}).loadSELECT({label:'v', value:'v',data:itemPage});
			}
			if(divBody.width() >= (width + 180)) {
				tr.append($('<div style="float:right;width:180px;" class="display"></div>'));
			}
			tr.find('.inp-page input').enter(function(){
				selectPage($(this).val());
				$(this).select();
			});
			tr.find('.inp-page span, .inp-per-page, .display');
			selectPageEvant();
		}

		function selectPage(page) {
			page = $.intval(page);
			if(page < 1)  options.page = 1;
			else if(page > pageAll)  options.page = pageAll;
			else  options.page = page;
			if(options.url != '') {
				if(typeof options.send == 'object') options.send = $.param(options.send);
				var st = (options.page - 1) * options.rows;
				options.send += (options.send == '' ? '' : '&')+(options.sortField != ''?'option[order]='+options.sortField+' '+options.sort+'&':'')+'option[limit]='+st+','+options.rows;;
				$.send(options.url , options.send, function(d, l){
					data = d;
					createBody(body, st);
					options.length = l;
					editControl();
				});
			}
			else {
				createBody(body);
				editControl();
			}
		}

		function editControl() {
			pageData();
			control.find('.inp-page input').val(options.page);
			control.find('.inp-page span').html(' of ' + pageAll);
			selectPageEvant();
		}

		function displayPage() {
			//var len =$.len(data);
			var st = ((options.length == 0)? 0 : firstRowPage() + 1);
			var sp = options.page * options.rows;
			control.find('.' + css + '-select-page .display').html('Displaying ' + st + ' - ' + ((options.length < sp)? options.length : sp) + ' of ' + options.length);
		}

		function selectPageEvant() {
			displayPage();
			obj.attr('pageSelect', obj.pageSelect = options.page);
			if(typeof options.loadPage == 'function') {
				options.loadPage.call(obj);
			}
		}
	}

	/*$.dataGrid = function(data, options){
		var css = 'div-datagrid';
		var id = css + (new Date()).getTime();
		var obj = $('<div id="' + id + '" class="' + css + '" style="float:left;position:absolute;top:-5000px"></div>');
		var div = $('<div class="' + css + '-table" style="float:left;"></div>');
		var divHeader = $('<div class="' + css + '-header" style="clear:left;float:left;"></div>');
		var divBody = $('<div class="' + css + '-body" style="clear:left;float:left;"></div>');
		var divFooter = $('<div class="' + css + '-footer" style="clear:left;float:left;"></div>');
		var header =$('<table class="' + css + '-table-header"></table>');
		var body =$('<table class="' + css + '-table-body"></table>');
		var footer =$('<table class="' + css + '-table-footer"></table>');
		var objTable = {};
		var control = $('<div class="' + css + '-control" style="clear:left;"></div>');
		var scollWidth = 17;
		var columnSort = null;
		var pageAll = 1;
		var footerData = {};
		var options = $.extend({
			addRow: false,
			btnInsert: '',
			btnUpdate: '',
			btnDelete: '',
			column: {},
			cookie: '',
			editRow: false,
			footer: {},
			height:'',
			mutiSelect: true,
			page: 1,
			pageChange: '',
			rows: 15,
			rowClick: '',
			rowDrag: false,
			rowTag: '',
			send:'',
			showControl: true,
			showNo: false,
			showScroll: 'auto',
			url: '',
		}, options);
		if(options.editRow === true) {
			options.column.push({type:'btn-update', width:20});
			options.column.push({type:'btn-delete', width:20});
		}
		var columnField = {
			align: 'left',
			decimal: '',
			display: '',
			editable: false,
			field: 'field',
			renderer: '',
			sort: '',
			sortable: true,
			sortField: '',
			type:'string',
			width: 'auto'
		};
		$.each(options.column, function(i, v){
			options.column[i] = $.extend($.copy(columnField), v);
		});
		var rowsSet = options.rows;
		var rowSetting = {};

		obj.selectAll = function() {
			var pr = firstRowPage();
			resetSelected();
			body.find('tr.' + css + '-row').each(function(i, v) {
				if(data[i + pr] != undefined) {
					$(this).addClass('row-selected');
					obj.selectedItems[obj.selectedSize++] = data[i + pr];
				}
			});
			obj.selectedItem[0] = data[pr];
		}
		obj.dataProvider = function(v, cd) {
			if(v === undefined || v === false) {
				var temp = $.copy(data);
				if(cd === undefined || cd !== false) {
					$.each(temp, function(i, v){
						temp[i] = checkData(v, true);
					});
				}
				return temp;
			}
			else if(typeof v == 'function') {
				data = v.call(this, data);
			}
			else {
				data = v;
			}
			resetSelected();
			if(columnSort != null) {
				sort(data, columnSort.inx);
			}
			selectPage(1);
		}
		obj.addData = function(v, i) {
			data = obj.dataProvider(false, false);
			if(i === undefined) {
				i = $.len(data);
			}
			if(options.showNo === true) v['no'] = ($.len(data) + 1) + '.';
			$.splice(data, i, checkData(v));
			obj.dataProvider(data);
		}
		obj.editData = function(v, i) {
			data = obj.dataProvider(false, false);
			if(i === undefined) {
				i = $.len(data);
			}
			data[i] = checkData(v);
			obj.dataProvider(data);
		}
		obj.spliceData = function(i, n) {
			data = obj.dataProvider(false, false);
			if(n === undefined) {
				n = $.len(data) - i;
			}
			var cut = $.splice(data, i, n);
			if($.len(data) == 0 ) {
				data = true;
			}
			else {
				cut = cut[0];
			}
			resetSelected();
			if(columnSort != null) {
				sort(data, columnSort.inx);
			}
			pageData();
			selectPage(options.page);
			return cut;
		}
		obj.dataCell = function(v, c) {
			var r = obj.selectedIndex;
			if(v === undefined) return data[r];
			if(typeof v == 'object') {
				data[r] = $.extend(data[r], v);
			}
			if(c !== undefined) {
				data[r][rowSetting[c].field] = v;
				createCell(objTable[r][c].empty(), objTable[r]['no'], rowSetting[c], data[r], obj.dataCell);
			}
			else {
				if(options.showNo === true) data[r]['no'] = objTable[r]['no'];
				createRow(objTable[r].tr.empty(), objTable[r]['no'], rowSetting, r, data[r], obj.dataCell);
			}
		}
		obj.footerCell = function(v, c) {
			if(v === undefined) return footerData;
			if(typeof v == 'object') {
				footerData = $.extend(footerData, v);
			}
			if(c !== undefined) {
				footerData[options.footer[c].field] = v;
				createCell(objTable['ft'][c].empty(), objTable['ft']['no'], options.footer[c], footerData, obj.footerCell);
			}
			else {
				createRow(objTable['ft'].tr.empty(), objTable['ft']['no'], options.footer, 'ft', footerData, obj.footerCell);
			}
		}
		obj.selectCell = function(r, c) {
			objTable[r].tr.mousedown();
			 if(c === undefined) {
				return objTable[r].tr;
			}
			return objTable[r][c];
		}
		obj.selectPage = function(v) {
			if(v === undefined) {
				return options.page;
			}
			else if(v == 0) {
				v = pageAll;
			}
			selectPage(v);
		}

		$('body').append(obj);
		obj.attr('selectedIndex', obj.columnIndex = obj.selectedIndex = -1);
		obj.selectedSize = 0;
		obj.selectedItem = obj.selectedItems = null;
		obj.html(div.disableSelection());
		div.html(divHeader.html(header));
		div.append(divBody.html(body));
		createColumn(header);
		if(columnSort != null) {
			columnSort.click();
		}
		else {
			createBody(body);
		}
		if(options.editRow === true || $.len(options.footer) > 0) {
			$.each(rowSetting, function(i, v){
				options.footer[i] = $.extend($.copy(v), options.footer[i]);
				if(options.editRow === true) {
					if(options.footer[i].type == 'btn-update') options.footer[i].type = 'btn-insert';
					if(options.footer[i].type == 'btn-delete') options.footer[i].type = 'btn-clear';
				}
				if(options.footer[i].display !== undefined) footerData[options.footer[i].field] = options.footer[i].display;
			});
			createFooter(footer);
			div.append(divFooter.html(footer));
		}
		pageData();
		if(options.showControl === true) {
			obj.append(control);
			if(div.hasClass('div-datagrid-table-scoll')) {
				control.width(obj.width() - scollWidth);
			}
			else {
				control.width(obj.width());
			}
			createSelectPage(control);
		}
		obj.css('position', '').css('top', '');
		return obj;

		function checkData(v, c) {
			var r = {};
			$.each(options.column, function(no, col){
				if(col.field != 'field' && col.type.substr(0, 4) != 'btn-') {
					r[col.field] = (v.hasOwnProperty(col.field) === true ? v[col.field] : '');
					if(c !== undefined) {
						r[col.field] = checkDecimal(r[col.field], col.type, col.decimal);
					}
				}
			});
			return r;
		}

		function checkDecimal(v, t, d) {
			if(t == 'number') {
				v = $.floatval(v);
				if(d != undefined && $.intval(d) > 0) {
					v = $.round(v, d);
				}
				else {
					v = $.intval(v);
				}
			}
			return v;
		}

		function resetSelected() {
			obj.selectedItem = obj.selectedItems = {};
			obj.selectedSize =  0;
		}

		function pageData() {
			if(data === true) {
				pageAll = 1;
			}
			else {
				var p = $.len(data) / options.rows;
				pageAll = $.intval(p);
				if(p > pageAll) {
					pageAll++;
				}
			}
		}

		function firstRowPage() {
			return (options.page - 1) * options.rows;
		}

		function createColumn(table) {
			var tr = $('<tr class="' + css + '-column"></tr>').disableSelection();
			table.html(tr);
			$.each(options.column, function(inx, col) {
				var style = 'style="';
				if(col.align != 'left') {
					style += 'text-align:' + col.align + ';'
				}
				if(col.display == 'none') {
					style += 'display:none;';
				}
				if(col.width != 'auto') {
					style += 'width:' + col.width + 'px;';
				}
				style += '"';
				if(col.sortField == '') {
					col.sortField = col.field;
				}
				if(col.decimal != '') {
					col.decimal = $.intval(col.decimal);
				}
				rowSetting[inx] = {'decimal':col.decimal, 'field':col.field, 'sortField':col.sortField, 'editable':col.editable, 'renderer':col.renderer, sort:col.sort, 'style':style, 'type':col.type, 'width':col.width};
				var td = $('<td ' + style + '><div class="header" style=width:' + col.width +'px;>' +  col.display + '</div></td>');
				td.inx = inx;
				td.align = col.align;
				tr.append(td);
				if(col.sortable == true) {
					td.addClass('column-sortable').click(function(){
						if(columnSort != null) {
							columnSort.find('.header').css('text-align', columnSort.align).css('text-indent', '0px').width(columnSort.width());
							columnSort.find('div.icon-sort').remove();
						}
						rowSetting[inx]['sort'] = switchSort(rowSetting[inx]['sort']);
						td.find('.header').css('width', 'auto');
						td.append('<div class="icon-sort sort-' + rowSetting[inx]['sort'] + '"></div>');
						var isw = td.find('.icon-sort').width() + 2;
						if(td.css('text-align') == 'center') {
							if(td.find('.header').width() + isw > td.width() - isw) {
								td.find('.header').css('text-align', 'right');
							}
							else {
								td.find('.header').css('text-indent', isw);
							}
						}
						td.find('.header').width(td.width() - isw);
						columnSort = td;
						sort(data, inx);
						createBody(body);
					});
					if(col.sort != '') {
						rowSetting[inx]['sort'] = switchSort(rowSetting[inx]['sort']);
						columnSort = td;
					}
				}
			});
			tr.append('<td class="column-scoll" style="width:' + scollWidth + 'px;display:none;border-right:none;padding:0px"></td>');
		}

		function switchSort(v) {
			if(v == 'asc') {
				return 'desc';
			}
			else {
				return 'asc';
			}
		}

		function sort(data, inx) {
			if(typeof data != 'boolean') {
				data.sort(function(a, b){
					if(rowSetting[inx]['sort'] == 'asc') {
						return sortFunction(a[rowSetting[inx]['sortField']], b[rowSetting[inx]['sortField']]);
					}
					else {
						return sortFunction(b[rowSetting[inx]['sortField']], a[rowSetting[inx]['sortField']]);
					}
				});
			}
		}

		function sortFunction(a, b) {
			var va = $.floatval(a);
			var vb = $.floatval(b);
			if(va < vb) {
				return -1;
			}
			else if(va > vb) {
				return 1;
			}
			a = a.toString();
			b = b.toString();
			for(var i=0, l=$.len(a); i<l; i++){
				ca = thaiChar(a, i);
				cb = thaiChar(b, i);
				if(ca < cb) {
					return -1;
				}
				else if(ca > cb) {
					return 1;
				}
			}
			if($.len(a) < $.len(b)) {
				return -1;
			}
			else {
				return 0;
			}
		}

		function thaiChar(s, i) {
			var c = {3648:0.1, 3649:0.2, 3650:0.3, 3651:0.4, 3652:0.5};
			if(isNaN(s.charCodeAt(i))) {
				return 0;
			}
			if(s.charCodeAt(i) > 3647 && s.charCodeAt(i) < 3653 && !isNaN(s.charCodeAt(i+1))) {
				return s.charCodeAt(i+1) + c[s.charCodeAt(i)];
			}
			else{
				return s.charCodeAt(i);
			}
		}

		function createBody(table) {
			table.empty();
			if(options.height == '' || isNaN(options.height) == true) {
				table.html('<tr class="' + css + '-row-blank"><td>&nbsp;</td></tr>');
				divBody.height(options.height = table.find('tr').height() * options.rows);
				table.empty();
			}
			else {
				divBody.height(options.height);
			}
			if($.cookie('datagrid-' + options.cookie + '-item-page')) {
				options.rows = $.cookie('datagrid-' + options.cookie + '-item-page');
			}
			var n = 0;
			var r = 0;
			var st = firstRowPage();
			var sp = options.page * options.rows;
			var temp = $.copy(data);
			var fn = obj.dataCell;
			if(options.addRow === true) {
				temp[$.len(temp)] = {};
			}
			if(data != null) {
				$.each(temp, function(no){
					if(options.showControl === true && n >= sp) {
						return false;
					}
					else if(n >= st) {
						objTable[r] = {};
						if(data[no] !== undefined) {
							var tr = $('<tr class="' + css + '-row" ' + options.rowTag + '></tr>');
							objTable[r]['no'] = n+1+'.';
						}
						else {
							tr = $('<tr class="' + css + '-row row-add-data" ' + options.rowTag + '></tr>');
							objTable[r]['no'] = 'a';
							fn = obj.addData;
						}
						objTable[r]['tr'] = tr;
						createRow(tr, objTable[r]['no'], rowSetting, r, data[no], fn);
						addRowEvent(tr, r, no);
						table.append(tr);
						r++;
					}
					n++;
				});
			}
			while(table.height() < divBody.height()) {
				tr = $('<tr class="' + css + '-row-blank"></tr>');
				$.each(rowSetting, function(i, v){
					tr.append('<td ' + v.style + '>&nbsp;</td>');
				});
				addRowColor(tr, r);
				table.append(tr);
				r++;
			}
			if(options.showScroll === true || (options.showScroll == 'auto' && divBody.height() < body.height())) {
				divBody.width(body.width() + scollWidth).css('overflow-x', 'hidden').css('overflow-y', 'scroll');
				header.find('.column-scoll').css('display', '');
				div.removeClass('div-datagrid-table');
				div.addClass('div-datagrid-table-scoll');
			}
			else {
				divBody.width(body.width());
				header.find('.column-scoll').css('display', 'none');
				divBody.css('overflow', 'hidden');
				div.removeClass('div-datagrid-table-scoll');
				div.addClass('div-datagrid-table');
			}
		}

		function createRow(tr, n, column, r, rowData, fn) {
			var c = 0;
			$.each(column, function(i, v){
				if(rowData === undefined) rowData = {};
				rowData[v.field] = (rowData[v.field] === undefined ? '' : rowData[v.field]);
				var td = $('<td field="' + v.field + '" ' + v.style + '></td>');
				td.c = c;
				objTable[r][c] = {};
				objTable[r][c] = td;
				createCell(td, n, v, rowData, fn);
				td.mousedown(function() {
					obj.columnIndex = td.c;
				});
				tr.append(td);
				c++;
			});
		}

		function createCell(td, n, v, rowData, fn) {
			if(v.renderer != '') {
				if(typeof v.renderer == 'function') {
					td.html(v.renderer.call($(this), rowData, fn));
				}
				else if(typeof v.renderer == 'object') {
					td.html($(v.renderer).copy());
				}
				else {
					td.html(v.renderer);
				}
			}
			else if(v.editable != '') {
				var input = $('<input type="text" class="' + css + '-editable" ' + v.style + ' value="' + checkDecimal(rowData[v.field], v.type, v.decimal) + '"/>');
				input.focus(function(){
					td.addClass(css + '-edit-start');
				}).keyup(function(){
					rowData[v.field] = input.val();
				}).focusout(function(){
					td.removeClass(css + '-edit-start');
					rowData[v.field] = input.val();
					input.val(checkDecimal(input.val(), v.type, v.decimal));
				});
				if(typeof v.editable == 'function') {
					v.editable.call(input, rowData, fn);
				}
				td.html(input);
			}
			else if(n != 'a' && v.type.substr(0, 4) == 'btn-') {
				var btn = $('<input type="button" class="div-datagrid-btn ' + v.type + '"></input>');
				btn.click(function(){
					if(v.type == 'btn-update' && typeof options.btnUpdate == 'function') {
						options.btnUpdate.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-delete' && typeof options.btnDelete == 'function') {
						options.btnDelete.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-insert' && typeof options.btnInsert == 'function') {
						options.btnInsert.call($(this), rowData, fn);
					}
					else if(v.type == 'btn-clear') {
						$.each(rowData, function(i, v){
							if(i != 'no') {
								rowData[i] = '';
							}
						});
						fn(rowData);
					}
				});
				td.html(btn);
			}
			else if(options.showNo === true && v.field == 'no') {
				if(n[0] == 'a') n = '<font size="4">&#8658;</font>';
				if(rowData['no'] == '') rowData['no'] = n;
				td.html(rowData['no']);
			}
			else {
				td.html(checkDecimal(rowData[v.field], v.type, v.decimal));
			}
		}

		function createFooter(table) {
			table.empty();
			var tr = $('<tr class="' + css + '-row" ' + options.rowTag + '></tr>');
			var n = '';
			if(options.editRow === true) {
				tr.addClass('row-add-data');
				n = 'ab';
			}
			objTable['ft'] = {};
			objTable['ft']['tr'] = tr;
			objTable['ft']['no'] = n;
			createRow(tr, n, options.footer, 'ft', footerData, obj.footerCell);
			table.append(tr);
		}

		function addRowColor(tr, r) {
			if(r % 2 == 1) {
				tr.addClass('row-sub-color');
			}
		}

		function addRowEvent(tr, r, no) {
			addRowColor(tr, r);
			tr.click(function(e){
				if(typeof options.rowClick == 'function') {
					options.rowClick.call($(this), $.copy(data[no]));
				}
			}).mousedown(function(e) {
				var pr = firstRowPage();
				if(data[no] != undefined) {
					var s = obj.selectedIndex;
					obj.selectedItem = obj.selectedItems = new Object;
					var l = 0;
					if(options.mutiSelect == true && (e.ctrlKey == true || e.shiftKey == true)) {
						if(tr.hasClass('row-selected')) {
							tr.removeClass('row-selected');
						}
						else {
							tr.addClass('row-selected');
						}
						if(e.ctrlKey == true) {
							body.find('tr.' + css + '-row').each(function(i, v){
								if($(this).hasClass('row-selected')) {
									obj.selectedItems[l++] = $.copy(data[i + pr]);
								}
							});
						}
						else if(e.shiftKey == true) {
							if(r > s) {
								var ed = r;
							}
							else {
								ed = s;
								s = r;
							}
							body.find('tr.' + css + '-row').each(function(i, v){
								if(i >= s && i <= ed) {
									$(this).addClass('row-selected');
									obj.selectedItems[l++] = $.copy(data[i + pr]);
								}
								else {
									$(this).removeClass('row-selected').removeClass('row-hover');
								}
							});
						}
					}
					else {
						tr.addClass('row-selected');
						obj.attr('selectedIndex', obj.selectedIndex = r);
						body.find('tr.' + css + '-row').each(function(i, v){
							if(r != i) {
								$(this).removeClass('row-selected').removeClass('row-hover');
							}
						});
						obj.selectedItems[l++] = $.copy(data[r + pr]);
					}
					obj.selectedSize = l;
					obj.selectedDataIndex = no;
					obj.selectedItem = $.copy(data[no]);
				}
			}).mouseover(function() {
				$(this).addClass('row-hover');
			}).mouseout(function() {
				$(this).removeClass('row-hover');
			});
			if(options.rowDrag == true) {
				/*tr.mousedown(function(e){ --------------------drag move row----------------------------------
					$('body').mousemove(function(e){
						$('body').append((tr).clone());
					});
				});*/
			/*}
		}

		function createSelectPage(control) {
			var table = $('<div class="' + css + '-select-page"></div>');
			control.append(table);
			var itemPage = {};
			var add = false;
			var r = 0;
			$([{v:25}, {v:50}, {v:75}, {v:100}, {v:150}, {v:200}, {v:300}]).each(function(i, v) {
				if(add == false && rowsSet < v.v) {
					itemPage[r++] = {v:rowsSet, selected:true};
					add = true;
				}
				itemPage[r++] = {v:v.v, selected:(options.rows == v.v) ? true : false};
			});
			var tr = $('<div style="clear:both;" align="center"></div>');
			table.append(tr);
			var width = 140;
			var ctstyle = 'float:left;';
			if(divBody.width() < (width + 140)) {
				ctstyle += 'margin-right:' + $.intval((divBody.width() - width) / 4) + 'px;';
			}
			tr.append($('<div style="' + ctstyle + '" class="icon btn-first"></div>').click(function(){
				selectPage(1);
			})).append($('<div style="' + ctstyle + '" class="icon btn-prev"></div>').click(function(){
				selectPage(options.page - 1);
			})).append($('<div style="' + ctstyle + '" class="inp-page"><input type="text" value="' + options.page + '" style="height:16px;line-height:0px;text-align:right;width:30px;"/><span> of ' + pageAll + '</span></div>'))
			.append($('<div style="' + ctstyle + '" class="icon btn-next"></div>').click(function(){
				selectPage(options.page + 1);
			})).append($('<div style="float:left;" class="icon btn-last"></div>').click(function(){
				selectPage(pageAll);
			}));
			if(divBody.width() >= (width + 140)) {
				width += 140;
				if(divBody.width() < (width + 180)) {
					ctstyle = '';
				}
				else {
					ctstyle = 'float:left;margin-left:' + $.intval((divBody.width() - (width + 180)) / 2) + 'px;';
				}
				tr.append($('<div style="' + ctstyle + '" class="inp-per-page">Items per page <select class="cbb-item-page"></select></div>'));
				tr.find('.cbb-item-page').change(function() {
					options.rows = $(this).val();
					if(options.cookie != '') {
						$.cookie('datagrid-' + options.cookie + '-item-page', options.rows, 356);
					}
					selectPage(1);
				}).loadSELECT({label:'v', value:'v',data:itemPage});
			}
			if(divBody.width() >= (width + 180)) {
				tr.append($('<div style="float:right;width:180px;" class="display"></div>'));
			}
			tr.find('.inp-page input').enter(function(){
				selectPage($(this).val());
				$(this).select();
			});
			tr.find('.inp-page span, .inp-per-page, .display').disableSelection();
			selectPageEvant();
		}

		function selectPage(page) {
			page = $.intval(page);
			if(isNaN(page) || page < 1) {
				options.page = 1;
			}
			else if(page > pageAll) {
				options.page = pageAll;
			}
			else {
				options.page = page;
			}
			createBody(body);
			pageData();
			control.find('.inp-page input').val(options.page);
			control.find('.inp-page span').html(' of ' + pageAll);
			selectPageEvant();
		}

		function displayPage() {
			var len =$.len(data);
			var st = ((len == 0)? 0 : firstRowPage() + 1);
			var sp = options.page * options.rows;
			control.find('.' + css + '-select-page .display').html('Displaying ' + st + ' - ' + ((len < sp)? len : sp) + ' of ' + len);
		}

		function selectPageEvant() {
			displayPage();
			obj.attr('pageSelect', obj.pageSelect = options.page);
			if(typeof options.pageChange == 'function') {
				options.pageChange.call(obj);
			}
		}
	}*/

	//---------------------------------------------------------------------------------------------------------------------------------------------------

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
