$('#nav-toggle').click(function(){
    onOffMenu('is-active', this, '#nav-toggle, #nav-menu');
    $('.box-comment').addClass('is-hidden');
});

$("#btn-notifi").click(function(){
    //onOffBtn('.notifi', ($('.notifi .detail').html().trim() != ''));
    if($('#box-comment .box-comment').hasClass('notifi') == false) {
        $.get(url+'?layout=notification', function(data){
            $('#box-comment').html(data);
        });
    }
    else {
        $('#box-comment').html('');
    }
});

$("#btn-sign-in").click(function(){
    //onOffBtn('.login', $('.register').hasClass('is-hidden'));
    var obj = $('#box-comment .box-comment');
    if(obj.hasClass('login') == false && obj.hasClass('register') == false) {
        $.get(url+'?layout=login', function(data){
            $('#box-comment').html(data);
        });
    }
    else {
        $('#box-comment').html('');
    }
});

$('.notification .delete').click(function(){
    $(this).parent().remove();
    var num = $.intval($('.num-notification').html()) - 1;
    $('.num-notification').html(num);
    if(num == 0) {
        $('.num-notification, .notifi').addClass('is-hidden');
    }
});

function hideSignin() {
    user.login = true;
    $('#box-comment').html('');
    $('#btn-sign-in').addClass('is-hidden');
    $('#btn-user').removeClass('is-hidden');
}

function onOffMenu(pClass, obj, select) {
    if(select == undefined) select = obj;
    if($(obj).hasClass(pClass) === true) {
        $(select).removeClass(pClass);
    }
    else {
        $(select).addClass(pClass);
    }
}
function onOffBtn(pClass, val) {
    $('#nav-toggle, #nav-menu').removeClass('is-active');
    if($(pClass).hasClass('is-hidden') === true && val === true) {
        $('.box-comment').addClass('is-hidden');
        $(pClass).removeClass('is-hidden');
    }
    else {
        $('.box-comment').addClass('is-hidden');
    }
}