$("#btn-write").click(function(){
    if($('#menu-popup .menu-popup').hasClass('notifi') == false) {
        if(layout.login =='') {
            $.get(url+'?layout=login', function(data){
                $('#menu-popup').html(layout.login = data);
            });
        }
        else {
            $('#menu-popup').html(layout.login);
        }
    }
    else {
        $('#menu-popup').html('');
    }
});

$("#btn-notifi").click(function(){
    //onOffBtn('.notifi', ($('.notifi .detail').html().trim() != ''));
    if($('#menu-popup .menu-popup').hasClass('notifi') == false) {
        $.get(url+'?layout=notification', function(data){
            $('#menu-popup').html(data);
        });
    }
    else {
        $('#menu-popup').html('');
    }
});

$("#btn-sign-in").click(function(){
    //onOffBtn('.login', $('.register').hasClass('is-hidden'));
    var obj = $('#menu-popup .menu-popup');
    if(obj.hasClass('login') == false && obj.hasClass('register') == false) {
        if(layout.login =='') {
            $.get(url+'?layout=login', function(data){
                $('#menu-popup').html(layout.login = data);
            });
        }
        else {
            $('#menu-popup').html(layout.login);
        }
    }
    else {
        $('#menu-popup').html('');
    }
});

$('#nav-toggle').click(function(){
    onOffMenu('is-active', this, '#nav-toggle, #nav-menu');
    $('.menu-popup').addClass('is-hidden');
});

function hideSignin(data) {
    user = data;
    $('#menu-popup').html('');
    $('#btn-sign-in').addClass('is-hidden');
    $('#btn-user, #btn-notifi, #btn-write, #btn-tags').removeClass('is-hidden');
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
/*function onOffBtn(pClass, val) {
    $('#nav-toggle, #nav-menu').removeClass('is-active');
    if($(pClass).hasClass('is-hidden') === true && val === true) {
        $('.menu-popup').addClass('is-hidden');
        $(pClass).removeClass('is-hidden');
    }
    else {
        $('.menu-popup').addClass('is-hidden');
    }
}*/