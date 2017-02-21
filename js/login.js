$("#btn-register").click(function(){
  resetSelf();
  resetShare();
});

$("#btn-facebook").click(function(){
  facebookLogin(dataRegis);
});

$("#btn-google").click(function(){
  facebookLogin(dataRegis);
});
