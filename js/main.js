function showMsg(title, data, type) {
    if(type == undefined) type = 'is-info';
    var bm = '.box-message ';
    $(bm).removeClass('is-hidden');
    $(bm+'.message').addClass(type);
    $(bm+'.message-header p').html(title);
    $(bm+'.message-body').html(data);
}

$('.box-message .delete').click(function() {
    $('.box-message').addClass('is-hidden');
});