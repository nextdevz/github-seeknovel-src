var googleUser = {};
var startApp = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '6246343810-usvdud7a236bnrvabf2f7ro02scq1qjc.apps.googleusercontent.com',
            cookiepolicy: 'localhost',
            // Request scopes in addition to 'profile' and 'email'
            scope: 'profile email'
        });
        attachSignin(document.getElementById('btn-google'));
    });
};
function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
            document.getElementById('status').innerText = "Signed in: " +
            googleUser.getBasicProfile().getName();
        }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
    });
}
startApp();


$('#btn-google').click(function(){
  //var auth2 = gapi.auth2.getAuthInstance();
  /*auth2.signIn().then(function(googleUser) {
    var profile = googleUser.getBasicProfile();
    $.print(profile);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  });*/
  /*if (auth2.isSignedIn.get()) {
    var profile = auth2.currentUser.get().getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  }*/
});