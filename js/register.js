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
    var error = false;
    var slt = '.register ';
    slt += ($(slt+'.self').hasClass('is-hidden') === false ? '.self' : '.other');
    $(slt+' input, .register .share input').each(function(i, v){
        var min = $(this).attr('minlength');
        var rx = $(this).attr('regexp');
        var val = $(this).val().trim();
        if(rx != undefined) rx = new RegExp(rx);
        if(val == '' || (min != undefined && val.length < min) || (rx != undefined && rx.test(val) === false)) {
            $(this).addClass('is-danger');
            error = true;
        } else {
            $(this).removeClass('is-danger');
        }
    });
    if(error === false) {
        $.send(url+'?php=member' , $('.register').serializePHP('register'), function(data){
            if(data == '0') {
                $('#btn-login, .register').addClass('is-hidden');
                $('#btn-user').removeClass('is-hidden');
            }
            else if(data == 1) {
                showMsg('คำเตือน', 'พบข้อผิดพลาดในข้อมูลที่ลงทะเบียน', 'is-warning');
            }
            else if(data == 2) {
                showMsg('รายละเอียด', 'ข้อมูลนี้มีการลงทะเบียนเรียบร้อยแล้ว', 'is-info');
            }
        });
    }
});

function chkFocus(cond, obj, obj2) {
    if(obj2 == undefined) obj2 = obj;
    if(cond == true) {
        obj.addClass('is-danger');
    }
    else {
        obj2.removeClass('is-danger');
    }
}

function resetSelf() {
  var regis = ".register ";
  $(regis+'.self').removeClass('is-hidden');
  $(regis+'.other').addClass('is-hidden');
  $(regis+'.share input').removeClass('is-disabled');
  $(regis+'.radio').removeClass('is-disabled');
}

function resetOther() {
  var regis = ".register ";
  $(regis+'.self').addClass('is-hidden');
  $(regis+'.other').removeClass('is-hidden');
  $(regis+'.share input').addClass('is-disabled');
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
  $('.register').removeClass('is-hidden');
}

function dataRegis(data){
  resetOther();
  resetShare();
  if(data != undefined) {
    $('.register').dataToObject(data);
    $('#retype').val('facebook');
  }
}