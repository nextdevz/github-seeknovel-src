var tcu;
var tce;

$('.show-pass').click(function(){
    var p = $('#password');
    var i = $('.show-pass .fa');
    if(p.attr('type') == 'text') {
        p.attr('type', 'password');
        i.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        p.attr('type', 'text');
        i.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

$('#birthday').click(function(){
    $('#birthday-i').addClass('is-hidden');
    $('#birthday-s').removeClass('is-hidden');
});

$('.register input[id!="birthday"], button').focusin(function(){
    if($('#birthday-s').hasClass('is-hidden') === false) {
        var y = $('#year').val(), m = $('#month').val(), d = $('#day').val();
        if($.checkDate(y, m, d) === true) {
            $('#birthday').val($.date('d/m/Y', 'en', {y:y, m:m, d:d})).removeClass('is-danger');
        }
    }
    $('#birthday-s').addClass('is-hidden');
    $('#birthday-i').removeClass('is-hidden');
});

$('#btn-regis').click(function() {
    var error = '';
    var cng = 0;
    var slt = '.register ';
    slt += ($(slt+'.self').hasClass('is-hidden') === false ? '.self' : '.other');
    $(slt+' input, .register .share input').each(function(i, v){
        var min = $(this).attr('minlength');
        var rx = $(this).attr('regexp');
        var val = $(this).val().trim();
        if(rx != undefined) rx = new RegExp(rx);
        if(val == '' || (min != undefined && val.length < min) || (rx != undefined && rx.test(val) === false)) {
            $(this).addClass('is-danger');
            if(min != undefined) {
                error += '<span class="is-danger">'+$(this).attr('placeholder')+'</span> กรอกอักขระอย่างน้อย <span class="is-danger">' + min + '</span> ตัวอักษร<br/>' ;
            }
            else if(rx != undefined) {
                error += '<span class="is-danger">'+$(this).attr('placeholder')+'</span> กรอกรูปแบบข้อมูลไม่ถูกต้อง<br/>' ;
            }
            else {
                error += '<span class="is-danger">'+$(this).attr('placeholder')+'</span> กรอกข้อมูลวันเดือนปีไม่ถูกต้อง<br/>' ;
            }
        }
        else if($(this).attr('type') == 'radio' && $(this).prop('checked') == false) {
            cng++;
        }
        else {
            $(this).removeClass('is-danger');
        }
    });
    if(cng == 3) {
        error += '<span class="is-danger">เพศ</span> กรุณาระบุเพศของผู้เข้าใช้งาน<br/>' ;
    }
    if(error === '') {
        $.send(url+'?php=member' , $('.register').serializePHP('register'), function(data){
            var actype = $('#actype').val();
            if(data == 'susceed') {
                $('.register').addClass('is-hidden');
                if(actype == 'self') {
                    showMsg('ยืนยันการลงทะเบียน', 'ลงทะเบียนเรียบร้อยแล้วกรุณาตรวจสอบอีเมลเพื่อยืนยันการใช้งาน', 'is-success', 270);
                }
                else {
                    hideSignin();
                }
            }
            else if(data == 'error'){
                showMsg('คำเตือน', 'พบข้อผิดพลาดในข้อมูลที่ลงทะเบียน', 'is-warning');
            }
            else {
                var inx = {id:'ไอดี '+actype+' ', name:'ชื่อผู้ใช้งาน', email:'อีเมล'};
                data = data.toString().split(' ');
                var str = inx[data[1]];
                for(var i=2; i<data.length; i++) {
                    str += 'หรือ' + inx[data[i]];
                }
                showMsg('รายละเอียด', str+'มีการลงทะเบียนเรียบร้อยแล้ว', 'is-info');
            }

        });
    }
    else {
        showMsg('คำเตือน', error, 'is-warning', 320);
    }
});

function resetSelf() {
    var regis = ".register ";
    $(regis+'.self').removeClass('is-hidden');
    $(regis+'.other').addClass('is-hidden');
    $(regis+'.share input').removeClass('is-disabled');
    $(regis+'.radio').removeClass('is-disabled');
}

function resetOther(actype) {
    var regis = ".register ";
    $(regis+'.self').addClass('is-hidden');
    $(regis+'.other').removeClass('is-hidden');
    $(regis+'.share input').addClass('is-disabled');
    if(actype == 'google') {
        $(regis+'.share #birthday').removeClass('is-disabled');
    }
    $(regis+'.radio').addClass('is-disabled');
}

function resetShare() {
    var regis = ".register ";
    $(regis+'input[type!=radio]').val('').removeClass('is-danger')
    $(regis+'input[type=radio]').prop('checked', false);
    $(regis+'select').val('0');
    $(regis+'#birthday-i').removeClass('is-hidden');
    $(regis+'#birthday-s').addClass('is-hidden');
    $('.login').addClass('is-hidden');
    $(regis).removeClass('is-hidden');
}

function dataRegis(data){
    resetOther(data.actype);
    resetShare();
    if(data != undefined) {
        $('.register').dataToObject(data);
    }
}