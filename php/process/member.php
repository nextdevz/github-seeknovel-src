<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    function account($php=false) {
        $sql = new c_query();
        $sql->pre_sel('id_account', 'nv_account_'.$_POST['actype'], 'id_account=?', $_POST['idcode']);
        if($php === false) {
            $sql->json($sql->num_rows());
        }
        else {
            return $sql->num_rows();
        }
    }

    function password($pass, $key) {
        return hash_hmac('sha256', $pass, $key.'@ND-PWD');
    }

    function login() {
        $fc = new c_function();
        $sql = new c_query();
        $result = array();
        $sql->pre_sel('*', 'nv_members', 'member_name=? OR email_address=?', array($_POST['user'], $_POST['user']));
        if($sql->num_rows() == 1 && $sql->v('passwd') == $fc->hash256($_POST['passwd'], 'Novel-Club-PWD')) {
            if($sql->v('is_activated') == 0) {
                $result = 'unactivate';
            }
            else {
                $result = login_data($sql->record(), $fc);
            }
        }
        else {
            $result = 'error';
        }
        echo $sql->json($result);
    }

    function login_data($data, $fc) {
        $token = array(
            'id_member' => $data['id_member'],
            'exp' => time() + 3600
        );
        $gender = array('male', 'female', 'other');
        return array(
            'accessToken' => $fc->token_set($token, 'Novel-Club-User'),
            'real_name' => $data['real_name'],
            'introduce' => $data['introduce'],
            'email_address' => $data['email_address'],
            'birthdate' => $data['birthdate'],
            'gender' => $gender[$data['gender']],
            'silver_coin' => $data['silver_coin'],
            'gold_coin' => $data['gold_coin'],
        );
    }

    function register() {
        $fc = new c_function();
        $sql = new c_query();
        $result = 'susceed';
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
            if($_POST['actype'] == 'self') {
                $data['member_name'] = $_POST['username'];
                $data['passwd'] = $fc->hash256($_POST['password'], 'Novel-Club-PWD');
                $sql->pre_sel('member_name, email_address', 'nv_members', 'member_name=? || email_address=?', array($_POST['username'], $_POST['email']));
                $num = $sql->num_rows();
                if($num == 0) {
                    $sql->pre_ins('nv_members', $sql->data2exec($data));
                }
                else if($num > 1){
                    $result = 'duplicate name email';
                }
                else {
                    $result = 'duplicate';
                    if($sql->v('member_name') == $_POST['username']) {
                        $result .= ' name';
                    }
                    if($sql->v('email_address') == $_POST['email']) {
                        $result .= ' email';
                    }
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
                            $sql->pre_ins('nv_members', $sql->data2exec($data));
                            $account['id_member'] = $sql->insert_id();
                            $account['id_account'] = $_POST['idcode'];
                            $account['link_account'] = $_POST['link'];
                            $sql->pre_ins('nv_account_'.$_POST['actype'], $sql->data2exec($account));
                            $data['id_member'] = $account['id_member'];
                            $data['introduce'] = '';
                            $data['silver_coin'] = $data['gold_coin'] = 0;
                            $result = login_data($data, $fc);
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
        echo $sql->json($result);
    }
?>