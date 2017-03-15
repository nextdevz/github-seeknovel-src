<div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card login">
        <header class="modal-card-head is-brown-bold">
            <p class="modal-card-title">เข้าใช้งาน <?php echo $title;?></p>
            <button class="delete" onclick="deletePopup()"></button>
        </header>
        <section class="modal-card-body foot">
            <p class="control has-icon has-icon-left">
                <input id="user" name="user" class="input" type="text" placeholder="ชื่อผู้ใช้งานหรืออีเมล">
                <span class="icon">
                    <i class="fa fa-user"></i>
                </span>
            </p>
            <p class="control has-icon has-icon-left">
                <input id="passwd" name="passwd" class="input" type="password" placeholder="รหัสผ่าน">
                <span class="icon">
                    <i class="fa fa-unlock-alt"></i>
                </span>
            </p>
            <p class="control center">
                <a>ลืมรหัสผ่าน</a> | <a id="btn-register">สมัครสมาชิก</a>
            </p>
            <p class="control">
                <button id="btn-login" class="button is-dark">เข้าสู่ระบบ</button>
            </p>
            <p class="control text-line">
                <span>หรือ</span>
            </p>
            <a id="btn-facebook" class="button is-info">
                <span class="icon">
                    <i class="fa fa-facebook"></i>
                </span>
                <span>เข้าสู่ระบบด้วย Facebook</span>
            </a>
            <a id="btn-google" class="button is-danger">
                <span class="icon">
                    <i class="fa fa-google-plus"></i>
                </span>
                <span>เข้าสู่ระบบด้วย Google+</span>
            </a>
        </section>
    </div>
</div>
<script>
    <?php include_once($jsLayout.'login.js');?>
</script>