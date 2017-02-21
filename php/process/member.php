<?php
    include_once($phpClass.'c_function.class.php');
    include_once($phpClass.'c_query.class.php');

    function register() {
        $fc = new c_function();
        $sql = new c_query();
        $error = false;
        $data = array(
            'real_name' => $_POST['realname'],
            'email_address' => $_POST['email'],
            'birthdate' => $fc->date('Y-m-d', $_POST['birthday']),
            'gender' => $_POST['gender']
        );
        if($_POST['retype'] == 'facebook') {
            $data['id_facebook'] = $_POST['idcode'];
            $data['link_facebook'] = $_POST['link'];
            $sql->pre_sel('id_facebook', 'nv_members', 'id_facebook=:id_facebook', array(':id_facebook'=>$_POST['idcode']));
            print_r($sql->record());
            //$sql->pre_ins('nv_members', $sql->data2exec($data));
        }
    }
?>