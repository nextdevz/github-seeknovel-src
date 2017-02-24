$('#btn-login').click(function(){
    alert(123);
});

$("#btn-register").click(function(){
  resetSelf();
  resetShare();
  $('#actype').val('self');
});

$("#btn-facebook").click(function(){
  facebookLogin(checkAccount);
});

$('#btn-google').click(function(){
    googleLogin(dataRegis);
});

function checkAccount(data){
    $.send(url+'?php=member', 'process=account&idcode='+data.idcode+'&actype='+data.actype, function(d){
        if(d == 0) {
            dataRegis(data);
        }
        else {
            hideSignin();
        }
    });
}

function hideSignin() {
    status.login = true;
    $('.login').addClass('is-hidden');
    $('#btn-sign-in').addClass('is-hidden');
    $('#btn-user').removeClass('is-hidden');
}
