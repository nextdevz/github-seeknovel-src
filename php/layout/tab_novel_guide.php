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
            echo '<div class="list cover-row">';
            for($i=0; $i < 10; $i++) {
                echo '<div class="box">
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-48x64">
                                <img src="'.$imgDir.'/blank-cover.jpg" alt="Image">
                            </figure>
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
    }
?>