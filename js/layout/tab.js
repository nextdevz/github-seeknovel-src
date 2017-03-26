$('.tabs li').click(function(){
    $('.tabs li').removeClass('is-active');
    var obj = $(this);
    obj.addClass('is-active');
    $.get(url+'?layout='+obj.attr('id'), function(data){
        $('.tab-body').animate({
            opacity: 1,
        }, {
            duration:500,
            start:function() {
                $('.tab-body').html(data);
            }
        });
    });
    $('.tab-body').animate({
        opacity: 0,
    }, 500);
});

$(window).scroll(function(event) {
    if($(window).scrollTop() > 270) {
        $('.tabs').addClass('container');
    }
    else {
        $('.tabs').removeClass('container');
    }
});

