<div class="register box-comment is-hidden">
    <div class="up arrow-box">
        <div class="up arrow-show"></div>
    </div>
    <div class="detail">
        <p class="control center head">สมัครสมาชิก <?php echo $title;?></p>
        <p class="control has-icon has-icon-left">
            <input id="username" name="username" class="input" type="text" placeholder="ชื่อผู้ใช้งาน" maxlength="80" minlength="4">
            <span class="icon">
                <i class="fa fa-user"></i>
            </span>
        </p>
        <p class="control has-icon has-icon-left">
            <input id="password" name="ypassword" class="input" type="password" placeholder="รหัสผ่าน" maxlength="20" minlength="6">
            <span class="icon show-pass">
                <i class="fa fa-eye-slash"></i>
            </span>
        </p>
        <p class="control has-icon has-icon-left">
            <input id="realname" name="realname" class="input" type="text" placeholder="ชื่อจริง" maxlength="255" minlength="8">
            <span class="icon">
                <i class="fa fa-user-circle"></i>
            </span>
        </p>
        <p class="control has-icon has-icon-left">
            <input id="email"  name="email" class="input" type="text" placeholder="อีเมล">
            <span class="icon">
                <i class="fa fa-envelope"></i>
            </span>
        </p>
        <p id="birthday-i" class="control has-icon has-icon-left">
            <input id="birthday" name="birthday" class="input" type="text" placeholder="วันเกิด" readonly="true">
            <span class="icon">
                <i class="fa fa-calendar"></i>
            </span>
        </p>
        <p id="birthday-s" class="control has-addons has-addons-centered is-hidden">
          <span class="select">
            <select id="day" name="day">
                <option value='0'>วัน</option>
                <?php
                    for($i=1; $i<=31; $i++) {
                        echo "<option value='{$i}'>{$i}</option>";
                    }
                ?>
            </select>
          </span>
          <span class="select">
            <select id="month" name="month">
                <option value='0'>เดือน</option>
                <?php
                    $month = array('1'=>'ม.ค.', '2'=>'ก.พ.', '3'=>'มี.ค.', '4'=>'เม.ย.', '5'=>'พ.ค.', '6'=>'มิ.ย.', '7'=>'ก.ค.', '8'=>'ส.ค.', '9'=>'ก.ย.', '10'=>'ต.ค.', '11'=>'พ.ย.', '12'=>'ธ.ค.');
                    for($i=1; $i<=12; $i++) {
                        echo "<option value='{$i}'>{$month[$i]}</option>";
                    }
                ?>
            </select>
          </span>
          <span class="select">
            <select id="year" name="year">
                <option value='0'>ปี</option>
                <?php
                    $st = date('Y') - 13;
                    $ed = $st - 100;
                    for($i=$st; $i>$ed; $i--) {
                        echo "<option value='{$i}'>".($i+543)."</option>";
                    }
                ?>
            </select>
          </span>
        </p>
        <p class="control">
            <label class="radio">
                <input type="radio" value="0" name="sex">
                ชาย
            </label>
            <label class="radio">
                <input type="radio" value="1" name="sex">
                หญิง
            </label>
            <label class="radio">
                <input type="radio" value="2" name="sex">
                อื่นๆ
            </label>
        </p>
        <p class="control">
            <button id="btn-regis" class="button is-success">สมัครสมาชิก</button>
        </p>
    </div>
</div>