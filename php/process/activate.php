<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    $fc = new c_function();
    $sql = new c_query();

    echo '<div>';
    if(isset($_GET['id']) && isset($_GET['time']) && isset($_GET['code'])) {
        $sql->pre_sel('*', 'nv_members', 'id_member=? AND date_register=?', array($_GET['id'], $_GET['time']));
        if($_GET['code'] == $fc->hash256($_GET['id'].$_GET['time'], 'ND-Novel-ACT') && $sql->num_rows() == 1 && $sql->v('is_activated') == 0) {
            $sql->pre_upd('nv_members', 'is_activated=?', 'id_member=?', array('1', $_GET['id']));
            echo 'คุณได้ยืนยันการสมัครเป็นเป็นสมาชิกกับทางเว็บไซต์ของเราเรียบร้อยแล้วขอให้สนุกกับการใช้งาน<br>';
        }
        else {
            echo 'ID สมาชิกของคุณไม่มีอยู่หรือลิงค์ยืนยันการสมัครสมาชิกไม่ถูกต้อง<br>';
        }
        echo '<a target="_blank" href="'.$rootUrl.'">หากเบราว์เซอร์ของคุณไม่มีการตอบสนองใดๆ กรุณาคลิกที่ลิงก์นี้</a>';
    }
    echo '<article class="message is-success">
            <div class="message-header">
                <p>Success</p>
            </div>
            <div class="message-body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
            </div>
        </article>
    </div>';
?>