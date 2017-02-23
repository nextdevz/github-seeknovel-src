$('#btn-login').click(function(){
    alert(123);
});

$("#btn-register").click(function(){
  resetSelf();
  resetShare();
  $('#retype').val('self');
});

$("#btn-facebook").click(function(){
  facebookLogin(dataRegis);
});

$("#btn-google").click(function(){
  //facebookLogin(dataRegis);
});
