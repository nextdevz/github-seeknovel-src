$('.fa-sign-out').click(function(){
    user = {};
    $('.popup').html('');
    $('#btn-sign-in').addClass('is-hidden');
    $('#btn-user, #btn-notifi, #btn-write, #btn-tags').removeClass('is-hidden');
});