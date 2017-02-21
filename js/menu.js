$('#nav-toggle').click(function(){
    onOffMenu('is-active', this, '#nav-toggle, #nav-menu');
    $('.box-comment').addClass('is-hidden');
});

$("#btn-notifi").click(function(){
    onOffBtn('.notifi', ($('.notifi .detail').html().trim() != ''));
});

$("#btn-login").click(function(){
    onOffBtn('.login', $('.register').hasClass('is-hidden'));
});

$('.notification .delete').click(function(){
    $(this).parent().remove();
    var num = $.intval($('.num-notification').html()) - 1;
    $('.num-notification').html(num);
    if(num == 0) {
        $('.num-notification, .notifi').addClass('is-hidden');
    }
});

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