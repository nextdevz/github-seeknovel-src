$('.tabs li').click(function(){
    $('.tabs li').removeClass('is-active');
    $(this).addClass('is-active');
    $.get(url+'?layout='+$(this).attr('id'), function(data){
        $('.tab-body').html(data);
    });
});

$(window).scroll(function(event) {
    if($(window).scrollTop() > 270) {
        $('.tabs').addClass('container');
    }
    else {
        $('.tabs').removeClass('container');
    }
});

