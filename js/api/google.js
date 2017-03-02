var auth2 = {};
function startApp() {
    gapi.load('auth2', function() {
        gapi.client.load('plus','v1').then(function() {
            auth2 = gapi.auth2.init({
                client_id: '6246343810-usvdud7a236bnrvabf2f7ro02scq1qjc.apps.googleusercontent.com',
                fetch_basic_profile: false,
                scope:'https://www.googleapis.com/auth/plus.login email'
            });/*.then(function (){
                user.login=true;
                auth2 = gapi.auth2.getAuthInstance();
                auth2.isSignedIn.listen(updateSignIn);
                auth2.then(updateSignIn);
            });*/
        });
    });
}

var updateSignIn = function() {
    console.log('update sign in state');
    if (auth2.isSignedIn.get()) {
        console.log('signed in');
        //helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }
    else {
        console.log('signed out');
        //helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }
}

function googleLogin(callback) {
    auth2.signIn().then(function (){
        gapi.client.plus.people.get({
            'userId': 'me'
        }).then(function(res) {
            var data = {
                actype:'google',
                idcode:res.result.id,
                link:res.result.url,
                realname:res.result.displayName,
                email:res.result.emails[0].value,
                gender:(res.result.gender == 'male' ? 0 : 1),
                //day:10,
                hash:CryptoJS.HmacSHA256(res.result.id, res.result.url).toString()
            };
            callback.call(this, data);
        });
    });
}
startApp();