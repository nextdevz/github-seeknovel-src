<?php
    include_once(__DIR__.'/settings.php');
    include_once($phpProcess.$_GET['php'].'.php');
    if(function_exists($_POST['process'])) {
        call_user_func($_POST['process']);
    }
?>