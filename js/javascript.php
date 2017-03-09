var url='<?php echo $rootUrl;?>process.php';
<?php
    include_once($jsDir.'publicVar.js');
    include_once($jsDir.'jqueryPlugins.js');
    include_once($jsApi.'facebook.js');
    include_once($jsApi.'google.js');
    include_once($jsDir.'menu.js');
    include_once($jsLayout.'tab.js');
    //include_once($jsLayout.'login.js');
    //include_once($jsLayout.'register.js');

    include_once($jsDir.'main.js');
    if(isset($_COOKIE['accessToken'])) {
        include_once($phpClass.'c_function.class.php');
        $fc = new c_function();
        $token = $fc->token_get($_COOKIE['accessToken'], 'Novel-Club-User');
        if($token['verify'] == 1 && $token['data']['exp'] > time()) {
            echo "hideSignin({});";
        }
    }
?>