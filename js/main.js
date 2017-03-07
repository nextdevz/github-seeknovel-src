function showMsg(title, data, type, width) {
    var bm = '.box-message ';
    if(type == undefined) type = 'is-info';
    if(width != undefined) $(bm+'.message').css('width', width+'px');
    $(bm).removeClass('is-hidden');
    $(bm+'.message').attr('class','message '+type);
    $(bm+'.message-header p').html(title);
    $(bm+'.message-body').html(data);
}

$('.box-message .delete').click(function() {
    $('.box-message').addClass('is-hidden');
});