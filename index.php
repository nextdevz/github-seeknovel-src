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
        <meta name="google-signin-client_id" content="6246343810-usvdud7a236bnrvabf2f7ro02scq1qjc.apps.googleusercontent.com"></meta>

        <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/core.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/hmac.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/sha256.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.3.1/css/bulma.css"/>
    	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="<?php echo $cssDir;?>jqueryPlugins.css">
        <link rel="stylesheet" href="<?php echo $cssDir;?>main.css">
    </head>
    <body class="day">
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
                        <?php
                            echo showIcon('list', 'category', 'หมวดนิยาย', '', 'is-hidden-mobile')
                            .showIcon('pencil', 'write', 'เขียนนิยาย', 'is-hidden', 'is-hidden-mobile')
                            .showIcon('tags', 'tags', 'ที่คั่นนิยาย', 'is-hidden', 'is-hidden-mobile');
                        ?>
                    </div>
                    <?php
                        echo showIcon('comment', 'notifi', '<span class="num-notification">2</span>', 'is-hidden')
                        .showIcon('user', 'user', '', 'is-hidden')
                        .showIcon('sign-in', 'sign-in');
                    ?>
                    <span class="nav-toggle" id="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <div id="menu-popup"></div>
                </nav>
            </div>
        </div>
        <div class="body container day">
            <div>
                <div class="list cover-random">
                    <?php
                        $num_random = 8;
                        for($i=0; $i < $num_random; $i++) {
                            echo '<figure class="image is-h150">
                                <img src="'.$imgDir.'/blank-cover.jpg">
                            </figure>';
                        }
                    ?>
                </div>
                <div class="list control-left">
                    <span class="icon is-hidden-mobile">
                        <i class="fa fa-angle-left"></i>
                    </span>
                </div>
                <div class="list control-random">
                    <?php
                        for($i=0; $i < $num_random; $i++) {
                            echo '<span></span>';
                        }
                    ?>
                </div>
            </div>
            <div class="tabs is-centered has-shadow">
                <ul>
                    <li class="is-active"><a>นิยายแนะนำ</a></li>
                    <li><a>นิยายยอดนิยม</a></li>
                    <li><a>นิยายอัพเดท</a></li>
                </ul>
            </div>
            <div class="tab-body">
            <?php
                $page = array(
                    array('label'=>'อัปเดทล่าสุด', 'page'=>''),
                    array('label'=>'ท็อปนิยายแต่ง', 'page'=>''),
                    array('label'=>'ท็อปนิยายแปล', 'page'=>''),
                    array('label'=>'ท็อปนิยายแต่ละหมวด', 'page'=>''),
                    array('label'=>'นิยายมาใหม่', 'page'=>'new_novel.php')
                );
                for($r=0; $r < count($page); $r++) {
                    echo '<div class="label">'.$page[$r]['label'].'<hr></div>';
                    if($r < 4) {
                        echo '<div class="list cover-card">';
                        for($i=0; $i < 8; $i++) {
                            echo '<div class="box">
                                <article class="media">
                                    <div class="media-left">
                                        <figure class="image is-90x120">
                                            <img src="'.$imgDir.'/blank-cover.jpg" alt="Image">
                                        </figure>
                                        <nav class="level">
                                            <a class="level-item">
                                                <span class="icon is-small"><i class="fa fa-share-alt"></i></span>
                                            </a>
                                            <a class="level-item">
                                                <span class="icon is-small"><i class="fa fa-heart"></i></span>
                                            </a>
                                            <a class="level-item">
                                                <span class="icon is-small"><i class="fa fa-tag"></i></span>
                                            </a>
                                        </nav>
                                    </div>
                                    <div class="media-content">
                                        <div class="content">
                                            <div class="detail">
                                                <p>
                                                    <strong>ชื่อนิยาย: </strong>John Smith'.$i.'
                                                </p>
                                                <p>
                                                    <strong>ผู้แต่ง: </strong>@johnsmith
                                                </p>
                                                <p>
                                                    <strong>เรื่องย่อ: </strong>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                                                </p>
                                            </div>
                                            <nav class="level-left">
                                                <a class="level-item">
                                                    <span class="icon is-small"><i class="fa fa-eye"></i></span>
                                                    <span class="count">123</span>
                                                </a>
                                                <a class="level-item">
                                                    <span class="icon is-small"><i class="fa fa-comment"></i></span>
                                                    <span class="count">123</span>
                                                </a>
                                            </nav>
                                        </div>
                                    </div>
                                </article>
                            </div>';
                        }
                        echo '</div>';
                    }
                    else {
                        include_once($phpLayout.$page[$r]['page']);
                    }
                }
            ?>
            </div>
        </div>
        <div class="box-message is-hidden">
            <div class="box-message-v">
                <article class="message is-info">
                    <div class="message-header">
                        <p></p>
                        <button class="delete"></button>
                    </div>
                    <div class="message-body">
                    </div>
                </article>
            </div>
        </div>
        <script src="https://apis.google.com/js/client:platform.js?onload=startApp"></script>
        <script><?php include_once($jsDir.'javascript.php');?></script>
    </body>
</html>
<?php
    function showIcon($icon, $btn, $data='', $rClass='', $sClass='') {
        if($sClass == 'is-hidden-mobile') {
            $data = ($data != '' ? "<span class='is-hidden-tablet-only'>{$data}</span>" : '');
        }
        $btn = ($btn != '' ? 'btn-'.$btn : '');
        echo "<a class='nav-item {$rClass} {$btn}' id='{$btn}'><span class='icon {$sClass}'><i class='fa fa-{$icon}'></i></span>{$data}</a>";
    }
?>