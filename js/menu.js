$("#btn-category").click(function(){
    $('.modal').addClass('is-active');
});

$("#btn-write").click(function(){
    $('.modal').show();
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
    if(layout.login =='') {
        $.get(url+'?layout=login', function(data){
            $('.popup').html(layout.login = data);
        });
    }
    else {
        $('.popup').html(layout.login);
    }
});

$("#btn-user").click(function(){
    onOffMenu('is-hidden', '.menu-popup');
});

function deletePopup() {
    $('.popup').html('');
}

$('#nav-toggle').click(function(){
    onOffMenu('is-active', this, '#nav-toggle, #nav-menu');
    $('.menu-popup').addClass('is-hidden');
});

function hideSignin(data) {
    user = data;
    $('.popup').html('');
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