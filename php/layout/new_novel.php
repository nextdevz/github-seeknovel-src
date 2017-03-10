<?php
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
?>