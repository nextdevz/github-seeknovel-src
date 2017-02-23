<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    function register() {
        $fc = new c_function();
        $sql = new c_query();
        $result = 0;
        $date = explode('/', $_POST['birthday']);
        if(checkdate($date['1'], $date['0'], $date['2']) === true && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && preg_match('/^[0-2]{1}$/', $_POST['gender'])) {
            $ip = $fc->get_real_ip(true);
            $data = array(
                'real_name' => $_POST['realname'],
                'email_address' => $_POST['email'],
                'birthdate' => $date['2'].'-'.$date['1'].'-'.$date['0'],
                'gender' => $_POST['gender'],
                'date_register' => time(),
                'member_ip' => $ip['0'],
                'member_ip2' => $ip['1']
            );
            if($_POST['retype'] == 'self') {
                $data['member_name'] = $_POST['username'];
                $data['passwd'] = $_POST['password'];
                $sql->pre_sel('id_member', 'nv_members', 'member_name=? || email_address=?', array($_POST['username'], $_POST['email']));
                if($sql->num_rows() == 0) {
                    $sql->pre_ins('nv_members', $sql->data2exec($data));
                }
                else {
                    $result = 2;
                }
            }
            else {
                $hashId = ($_POST['retype'] == 'self' ? '' : hash_hmac('sha256', $_POST['idcode'], $_POST['link']));
                if($_POST['hash'] == $hashId) {
                    if($_POST['retype'] == 'facebook') {
                        $data['id_facebook'] = $_POST['idcode'];
                        $data['link_facebook'] = $_POST['link'];
                        $sql->pre_sel('id_member', 'nv_members', 'id_facebook=?', $_POST['idcode']);
                        if($sql->num_rows() == 0) {
                            $sql->pre_ins('nv_members', $sql->data2exec($data));
                        }
                        else {
                            $result = 2;
                        }
                    }
                }
                else {
                    $result = 1;
                }
            }
        }
        else {
            $result = 1;
        }
        echo $sql->json($result);
    }
?>