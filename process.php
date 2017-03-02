<?php
    include_once(__DIR__.'/settings.php');
    if(isset($_GET['layout']) === true) {
        include_once($phpLayout.$_GET['layout'].'.php');
    }
    else if(isset($_GET['php']) === true) {
        include_once($phpProcess.$_GET['php'].'.php');
        if(function_exists($_POST['process'])) {
            call_user_func($_POST['process']);
        }
    }
?>