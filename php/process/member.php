<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    function account($php=false) {
        $sql = new c_query();
        $sql->pre_sel('id_member', 'nv_account_'.$_POST['actype'], 'id_account=?', $_POST['idcode']);
        if($php === false) {
            if($sql->num_rows() == 0) {
                $result = 0;
            }
            else {
                $sql->pre_sel('*', 'nv_members', 'id_member=?', $sql->v('id_member'));
                $fc = new c_function();
                $result = login_data($sql->record(), $sql, $fc);
            }
            $sql->json($result);
        }
        else {
            return $sql->num_rows();
        }
    }

    function login() {
        $fc = new c_function();
        $sql = new c_query();
        $result = array();
        $sql->pre_sel('*', 'nv_members', 'member_name=? OR email_address=?', array($_POST['user'], $_POST['user']));
        if($sql->num_rows() == 1 && $sql->v('passwd') == $fc->hash256(trim($_POST['passwd']), 'ND-Novel-PWD')) {
            if($sql->v('is_activated') == 0) {
                $result = 'unactivate';
            }
            else {
                $result = login_data($sql->record(), $sql, $fc);
            }
        }
        else {
            $result = 'error';
        }
        $sql->json($result);
    }

    function login_data($data, $sql, $fc, $login=true) {
        $exp = time() + CK_TIME;
        $token = array(
            'id_member' => $data['id_member'],
            'exp' => $exp
        );
        $token = $fc->token_set($token, 'ND-Novel-ACTK');
        $gender = array('1'=>'male', '2'=>'female', '3'=>'other');
        if($login === true) {
            $data['last_login'] = time();
            $sql->pre_upd('nv_members', 'last_login=?', "id_member=?", array($data['last_login'], $data['id_member']));
        }
        setcookie('accessToken', $token, $exp);
        return array(
            'accessToken' => $token,
            'real_name' => $data['real_name'],
            'introduce' => $data['introduce'],
            'email_address' => $data['email_address'],
            'birthdate' => $data['birthdate'],
            'gender' => $gender[$data['gender']],
            'white_paw' => $data['white_paw'],
            'black_paw' => $data['black_paw'],
            'gold_paw' => $data['gold_paw'],
        );
    }

    function register() {
        $fc = new c_function();
        $sql = new c_query();
        $result = 'susceed';
        $date = explode('/', $_POST['birthday']);
        if(checkdate($date['1'], $date['0'], $date['2']) === true && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && preg_match('/^[1-3]{1}$/', $_POST['gender'])) {
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
            if($_POST['actype'] == 'self') {
                if(preg_match('/^[A-Za-z0-9-]{3,20}$/', $_POST['username'])) {
                    $data['member_name'] = $_POST['username'];
                    $data['passwd'] = $fc->hash256(trim($_POST['password']), 'ND-Novel-PWD');
                    $sql->pre_sel('member_name, email_address', 'nv_members', 'member_name=? || email_address=?', array($_POST['username'], $_POST['email']));
                    $num = $sql->num_rows();
                    if($num == 0) {
                        global $phpMail, $phpProcess;
                        $sql->pre_ins('nv_members', $sql->data2exec($data));
                        $data['id_member'] = $sql->insert_id();
                        include_once($phpMail.'PHPMailerAutoload.php');
                        include_once($phpProcess.'mail.php');
                        if(!send_activate($data)) {
                            $result = 'email error';
                        }
                    }
                    else if($num > 1){
                        $result = 'duplicate name email';
                    }
                    else {
                        $result = 'duplicate';
                        if(strtolower($sql->v('member_name')) == strtolower($_POST['username'])) {
                            $result .= ' name';
                        }
                        if(strtolower($sql->v('email_address')) == strtolower($_POST['email'])) {
                            $result .= ' email';
                        }
                    }
                }
                else {
                    $result = 'error';
                }
            }
            else {
                $hashId = ($_POST['actype'] == 'self' ? '' : hash_hmac('sha256', $_POST['idcode'], $_POST['link']));
                if($_POST['hash'] == $hashId) {
                    if(account(true) == 0) {
                        $sql->begin();
                        $sql->pre_sel('id_member', 'nv_members', 'email_address=?', $_POST['email']);
                        if($sql->num_rows() == 0) {
                            $data['is_activated'] = '1';
                            $data['last_login'] = time();
                            $sql->pre_ins('nv_members', $sql->data2exec($data));
                            $account['id_member'] = $sql->insert_id();
                            $account['id_account'] = $_POST['idcode'];
                            $account['link_account'] = $_POST['link'];
                            $sql->pre_ins('nv_account_'.$_POST['actype'], $sql->data2exec($account));
                            $data['id_member'] = $account['id_member'];
                            $data['introduce'] = '';
                            $data['white_paw'] = $data['black_paw'] = $data['gold_paw'] = 0;
                            $result = login_data($data, $sql, $fc, false);
                        }
                        else {
                            $result = 'duplicate email';
                        }
                    }
                    else {
                        $result = 'duplicate id';
                    }
                }
                else {
                    $result = 'error';
                }
            }
        }
        else {
            $result = 'error';
        }
        $sql->json($result);
    }
?>