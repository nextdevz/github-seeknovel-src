<?php
    include_once(__DIR__.'/settings.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="th" lang="th">
    <head>
        <title><?php echo $fulltitle;?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
        <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
        <meta name="Author" content="Thawatchai Kaosol">
        <meta name="License" content="License: Copyright 2014, NextDEV, All Rights Reserved.">

        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="https://apis.google.com/js/api:client.js"></script>
        <!--<script src="https://apis.google.com/js/platform.js" async defer></script>
        <meta name="google-signin-client_id" content="6246343810-usvdud7a236bnrvabf2f7ro02scq1qjc.apps.googleusercontent.com">-->

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.3.1/css/bulma.css"/>
    	  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="<?php echo $cssDir;?>jqueryPlugins.css">
        <link rel="stylesheet" href="<?php echo $cssDir;?>main.css">
    </head>
    <body>
        <div class="menu">
            <div class="container">
                <nav class="nav">
                	<div class="nav-left">
                		<a href="<?php echo $root;?>" class="nav-item is-brand">
                			<img alt="<?php echo $fulltitle;?>" src="<?php echo $imgDir;?>logo.png">
                		</a>
                		<div class="title-name">
                			<h2 class="title is-4"><?php echo $title;?></h3>
                			<h1 class="subtitle is-6">เว็บไซต์สำหรับคนรักนิยาย</h4>
                		</div>
                	</div>
                	<div class="nav-right nav-menu" id="nav-menu">
                        <p class="nav-item control has-icon has-icon-righ">
                            <input id="search" class="input placeholder-center" type="text" placeholder="ค้นหานิยาย">
                            <span class="icon">
                                <i class="fa fa-search"></i>
                            </span>
                        </p>
                        <?php echo showIcon('book', '', 'หมวดนิยาย', 1);?>
                        <?php echo showIcon('pencil', '', 'เขียนนิยาย', 1);?>
                        <?php echo showIcon('bookmark', '', 'ห้องเก็บนิยาย', 1);?>
                    </div>
                    <?php echo showIcon('comment', 'notifi', '<span class="num-notification">2</span>');?>
                    <?php echo showIcon('user-plus', 'login');?>
                    <span class="nav-toggle" id="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <div id="box-comment">
                        <?php include_once($phpLayout.'notification.php');?>
                        <?php include_once($phpLayout.'login.php');?>
                        <?php include_once($phpLayout.'register.php');?>
                    </div>
                </nav>
            </div>
        </div>
        <div class="body container">
          <div class="g-signin2" data-onsuccess="onSignIn"></div>

            <div id="status"></div>
            <?php
                for($i=0; $i < 200; $i++) {
                    echo $i.'<br>';
                }
            ?>
        </div>
        <script><?php include_once($jsDir.'javascript.php');?></script>
    </body>
</html>
<?php
    function showIcon($icon, $btn, $name='', $mobile=false, $data='') {
        if($mobile !== false) {
            $hmobile = ' is-hidden-mobile';
            $tablet = ($name != '' ? "<a class='nav-item is-hidden-tablet'>{$name}</a>" : '');
        }
        else {
            $hmobile = '';
            $tablet = $name;
        }
        $btn = ($btn != '' ? 'btn-'.$btn : '');
        echo "<a class='nav-item{$hmobile} {$btn}' id='{$btn}'><span class='icon{$hmobile}'><i class='fa fa-{$icon}'></i></span>{$tablet}{$data}</a>";
    }
    //152054098638718
    //14487da1ccf3dad9c61809deabfed74f

    //6246343810-usvdud7a236bnrvabf2f7ro02scq1qjc.apps.googleusercontent.com
    //Be16h3-gaRpzpcowWChaosWk
?>