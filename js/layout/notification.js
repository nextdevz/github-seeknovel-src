$('.notification .delete').click(function(){
    $(this).parent().remove();
    var num = $.intval($('.num-notification').html()) - 1;
    $('.num-notification').html(num);
    if(num == 0) {
        $('.num-notification, .notifi').addClass('is-hidden');
    }
});