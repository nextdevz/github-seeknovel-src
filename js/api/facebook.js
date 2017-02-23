function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        checkLogin();
    } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
        document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function facebookLogin(callback) {
  FB.login(function(response) {
    if(response.authResponse) {
      FB.api('/me?fields=id,link,name,email,gender,birthday', function(response) {
        var data = response;
        data.idcode = data.id;
        data.realname = data.name;
        var date = data.birthday.split('/');
        data.birthday = date['1']+'/'+date['0']+'/'+date['2'];
        data.gender = (data.gender == 'male' ? 0 : 1);
        data.hash = CryptoJS.HmacSHA256(data.id, data.link);
        callback.call(this, data);
      });
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
  },{scope: 'email, public_profile, user_friends, user_birthday'});
}

function Logout() {
    FB.logout(function(){document.location.reload();});
}

function getPhoto() {
	FB.api('/me/picture?type=normal', function(response) {
		var str="<br><center><img src='"+response.data.url+"'/><br></center>";
	  	document.getElementById("status").innerHTML+=str;
    });
}

function getUserInfo() {
	FB.api('/me?fields=id,name,email,gender,birthday,link', function(response) {
		var str="สวัสดีคุณ "+response.name+"<br><br>";
        str +="<b>Member Infprmation </b><br><br>";
        str +="Facebook Name: "+response.name+"<br>";
        str +="id: "+response.id+"<br>";
        str +="Email: "+response.email+"<br>";
        str +="Birthday: "+response.birthday+"<br>";
        str +="Gender: "+response.gender+"<br>";
        str +="Link: "+response.link+"<br><br>";
        str +="<input type='button' value='Logout' onclick='Logout();'/><br><br";
        document.getElementById("status").innerHTML+=str;
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '152054098638718',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLogin() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        status.login = true;
    });
}