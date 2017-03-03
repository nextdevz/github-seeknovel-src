$('#user').enter(function(){
    if($('#user').val().trim() != '') {
        $('#passwd').select();
    }
}).select();

$('#passwd').enter(function(){
    if($('#user').val().trim() != '' && $('#passwd').val().trim() != '') {
        $('#btn-login').click();
    }
    else if($(this).val().trim() != '') {
        $('#user').select();
    }
});

$('#btn-login').click(function(){
    $.send(url+'?php=member' , $('.login').serializePHP('login'), function(data){
        if(data == 'unactivate') {
            showMsg('ยืนยันการลงทะเบียน', 'โปรดตรวจสอบอีเมลเพื่อยืนยันการลงทะเบียน', 'is-info');
        }
        else if(data == 'error') {
            showMsg('คำเตือน', 'ชื่อผู้ใช้งานหรืออีเมลหรือรหัสผ่านไม่ถูกต้อง', 'is-warning');
        }
        else {
            hideSignin(data);
        }
    });
});

$("#btn-register").click(function(){
    //resetSelf();
    //resetShare();
    //$('#actype').val('self');
    user = {};
    $.get(url+'?layout=register&actype=self', function(data){
        $('#menu-popup').html(data);
    });
});

$("#btn-facebook").click(function(){
    facebookLogin(checkAccount);
});

$('#btn-google').click(function(){
    googleLogin(checkAccount);
});

function checkAccount(data){
    user = data;
    $.send(url+'?php=member', 'process=account&idcode='+data.idcode+'&actype='+data.actype, function(d){
        if(d == 0) {
            $.get(url+'?layout=register&actype='+data.actype, function(data){
                $('#menu-popup').html(data);
            });
        }
        else {
            hideSignin(d);
        }
    });
}

