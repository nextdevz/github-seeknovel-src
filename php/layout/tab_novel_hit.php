<?php
    include_once($phpClass.'c_query.class.php');
    $qc = new c_query();
    $qnv = new c_query();
    $qc->select('*', 'nv_category Order By Rand() limit 10');
    while($qc->next_record()) {
        echo '<div class="label">'.$qc->v('category_name').'<hr></div>
            <div class="list cover-card">';
            for($i=0; $i < 4; $i++) {
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
        echo '</div>
        </div>';
    }
?>