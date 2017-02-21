$('#username, #realname, #password').focusout(function(){
    chkFocus(($(this).val().length < $(this).attr('minlength')),
        $(this)
    );
});

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

$('#email').focusout(function(){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    chkFocus(($(this).val().trim() == '' || re.test($(this).val()) === false),
        $(this)
    );
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
        else {
            $('#birthday').val('').addClass('is-danger');
        }
    }
    $('#birthday-s').addClass('is-hidden');
    $('#birthday-i').removeClass('is-hidden');
});

$('#btn-regis').click(function() {
    var sand = new Array();
    var error = new Array()
    $('.register input[type!="radio"]').each(function() {
        if($(this).hasClass('is-danger') === true) {
            error.push($(this));
        }
    });
    alert(123);
    //alert($('input[name="gender"]:checked').val());
    //var send = {member_name:$('#username').val(), real_name:('#realname').val(), passwd:$('#password').val(); email:$('#email').val();
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
    var regis = ".register ";
    $(regis+'#idCode').val(data.id);
    $(regis+'#link').val(data.link);
    $(regis+'#realname').val(data.name);
    $(regis+'#email').val(data.email);
    $(regis+'#birthday').val(data.birthday);
    var gender = (data.gender == 'male' ? 0 : 1);
    $(regis+'.radio [value='+gender+']').prop('checked', true);
}