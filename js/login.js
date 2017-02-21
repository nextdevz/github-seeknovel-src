function register(type, user, passwd, name, email, gender, birthday, fb_id, fb_link) {
}

$('#username, #realname, #password').focusout(function(){
    chkFocus(($(this).val().length < $(this).attr('minlength')),
        $(this)
    );
});
$('#email').focusout(function(){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    chkFocus(($(this).val().trim() == '' || re.test($(this).val()) === false),
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
$('#birthday-i').click(function(){
    $('#birthday-i').addClass('is-hidden');
    $('#birthday-s').removeClass('is-hidden');
});
$('.register input[id!="birthday"], button').focusin(function(){
    if($('#birthday-s').hasClass('is-hidden') === false) {
        var y = $('#year').val(), m = $('#month').val(), d = $('#day').val();
        if($.checkDate(y, m, d) === true) {
            $('#birthday').val($.date('d/m/Y', 'th', {y:y, m:m, d:d})).removeClass('is-danger');
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