<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    $fc = new c_function();
    $sql = new c_query();

    echo '<div align="center" class="activate">';
    if(isset($_GET['id']) && isset($_GET['time']) && isset($_GET['code'])) {
        $sql->pre_sel('*', 'nv_members', 'id_member=? AND date_register=?', array($_GET['id'], $_GET['time']));
        if($_GET['code'] == $fc->hash256($_GET['id'].$_GET['time'], 'ND-Novel-ACT') && $sql->num_rows() == 1 && $sql->v('is_activated') == 0) {
            $sql->pre_upd('nv_members', 'is_activated=?', 'id_member=?', array('1', $_GET['id']));
            $header = 'ยืนยันการสมัครสมาชิกเรียบร้อย';
            $class = 'is-success';
            $str = 'คุณได้ยืนยันการสมัครเป็นสมาชิกกับทางเว็บไซต์ของเราเรียบร้อยแล้วขอให้สนุกกับการใช้งาน<br>';
        }
        else {
            $header = 'พบข้อผิดพลาด';
            $class = 'is-warning';
            $str = 'ไม่มีข้อมูลการสมาชิกของคุณหรือลิงค์ยืนยันการสมัครสมาชิกไม่ถูกต้องกรุณาตราจสอบข้อมูล<br>';
        }

        $str .= '<a target="_self" href="'.$rootUrl.'">หากเบราว์เซอร์ของคุณไม่มีการตอบสนองใดๆ กรุณาคลิกที่ลิงก์นี้</a>';
    }
    else {
        $header = 'พบข้อผิดพลาด';
        $class = 'is-warning';
        $str = 'ไม่มีหน้าที่คุณต้องการเข้าถึงข้อมูลกรุณาตรวจสอบลิงค์ที่ใช้ในการเข้าถึงข้อมูล<br><a target="_self" href="'.$rootUrl.'">หากเบราว์เซอร์ของคุณไม่มีการตอบสนองใดๆ กรุณาคลิกที่ลิงก์นี้</a>';
    }
    echo '<article class="message '.$class.'">
            <div class="message-header">
                <p>'.$header.'</p>
            </div>
            <div class="message-body"><br>'.$str.'<br><br></div>
        </article>
    </div>
    <script>
        setTimeout(function(){
            window.location = "'.$rootUrl.'";
        }, 5000);
    </script>';
?>