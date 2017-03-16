<?php
    function send_activate($data) {
        $fc = new c_function();
        global $rootUrl, $title, $subtitle, $smtpFrom, $smtpHost, $smtpPort, $smtpAuth, $smtpUser, $smtpPass;

        $link = $rootUrl.'index.php?php=activate&id='.$data['id_member'].'&time='.$data['date_register'].'&code='.$fc->hash256($data['id_member'].$data['date_register'], 'ND-Novel-ACT');
        $mail = new PHPMailer;
        $mail->CharSet = "utf-8";
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->Port = $smtpPort;
        $mail->SMTPAuth = $smtpAuth;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;

        $mail->setFrom($smtpFrom, 'Admin-'.$title);
        $mail->addAddress($data['email_address'], $data['member_name']);

        $mail->isHTML(true);
        $mail->Subject = 'อีเมล์ยืนยันการสมัครสมาชิก';
        $mail->Body = '<div><p>เรียนคุณ'.$data['member_name'].', อีเมล์นี้ส่งมาจาก '.$title.' ['.$subtitle.']</p>
            <p>คุณได้รับอีเมล์ฉบับนี้เนื่องจาก คุณหรือมีผู้ใช้อีเมล์นี้สมัครเป็นสมาชิกกับทางเว็บไซต์ของเรา ระบบจึงส่งลิงค์ยืนยันการลงทะเบียน มายังอีเมล์นี้<br>
            ถ้าคุณไม่ได้เป็นผู้สมัครสมาชิกกับทางเว็บไซต์ของเรา กรุณาเพิกเฉยต่ออีเมล์ฉบับนี้ ถ้าคุณเป็นผู้ใช้อีเมล์นี้สมัครสมาชิกกับทางเว็บไซต์ของเรา<br>
            กรุณาอ่านวิธีการยืนยันสมาชิก</p>
            <br>
            <div style="display:inline-block;">
            <div style="background-color: #5b3729; color:white; padding:16px; border-radius: 6px;">
                <strong>วิธีการยืนยันสมาชิก</strong>
            </div>
            <div style="padding:16px;">
                <p>คุณเป็นสมาชิกใหม่ในเว็บไซต์ของเราและได้ใช้อีเมล์นี้ในการสมัครสมาชิก เราต้องการให้คุณยืนยันว่าอีเมล์นี้มีผู้ใช้งานอยู่จริงไม่ใช่ <strong>สแปม</strong></p>
                <p>คลิกที่ลิงค์ด้านล่างเพื่อยืนยันแอคเคานท์ของคุณ:<br>
                <a target="_blank" href="'.$link.'">'.$link.'</a> <br>
                (หากลิงค์นี้ไม่ทำงาน โปรดคัดลอกลิงค์แล้วนำไปวางในแถบที่อยู่ของเบราว์เซอร์ด้วยตนเอง)</p>
                <p>ขอบคุณสำหรับการสมัครเป็นสมาชิกกับทางเว็บไซต์ของเราขอให้สนุกกับการใช้งาน!</p>
                <p>ขอแสดงความนับถือ<br>
                ทีมงาน '.$title.' ['.$subtitle.'].<br>
                '.$rootUrl.'</p>
            </div>
            </div>
            </div>';
        return $mail->send();
    }
?>