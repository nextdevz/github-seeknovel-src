/* -----------------------------------------------------------------------------------------------------------------------
Plugins for jQuery
File Name: jqueryPlugins.js
Author: Thawatchai Kaosol
Date: 30/11/2011
License: Copyright 2011, NextDEV, All Rights Reserved.
----------------------------------------------------------------------------------------------------------------------- */
$(function(){
    $.send = function(u, d, s, op) {
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
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------------

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
});