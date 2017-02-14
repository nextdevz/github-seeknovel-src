<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="th" lang="th">
  <head>
    <title>โปรแกรมพิมพ์ 50 ทวิ/ภ.ง.ด.</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf8" />
    <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
    <meta name="Author" content="Thawatchai Kaosol">
    <meta name="License" content="License: Copyright 2014, NextDEV, All Rights Reserved.">
    <link type="text/css" href="css/smoothness/jquery-ui.css" rel="stylesheet" />
    <link type="text/css" href="css/jqueryPlugins.css" rel="stylesheet" />
    <link type="text/css" href="css/main.css<?php echo '?ts='.$ts;?>" rel="stylesheet" />
    <script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="js/jqueryPlugins.js"></script>
    <script type="text/javascript" src="js/public.js"></script>
    <script type="text/javascript" src="js/c_layout/main.js"></script>
    <?php
      if($menu == '') {
        echo '<script type="text/javascript"> $(function() {select_month();}); </script>';
      }?>
  </head>
  <body>
    <div class="menu-bar">
      <ul>
        <li>Menu 50Tvi</li>
        <li class="menu-link" php="customer" search="show">ชื่อผู้ถูกหัก</li>
        <li class="menu-link main" php="withholding_tax" search="show">หักภาษี ณ ที่จ่าย</li>
        <li class="menu-parent" sub="print">พิมพ์</li>
        <li class="menu-link child" main="print" php="print_name">พิมพ์ 50 ทวิ เฉพาะชื่อ</li>
        <li class="menu-link child" main="print" php="print_50tvi">พิมพ์ 50 ทวิ</li>
        <li class="menu-link child" main="print" php="print_detail">พิมพ์ ภ.ง.ด.</li>
        <!--<li class="menu-link child" main="print" >พิมพ์ ภ.ง.ด. ออก Laser</li>-->
        <li class="menu-link" php="format_text">ยื่นแบบด้วยสื่อ</li>
        <li class="menu-parent" sub="config">เครื่องมือ</li>
        <li class="menu-link child" main="config" php="change_month">ย้ายเดือน</li>
        <li class="menu-link child" main="config" php="new_month">ขึ้นเดือนใหม่</li>
        <li class="menu-link child" main="config" php="backup">สำรองฐานข้อมูล</li>
        <li class="menu-link child" main="config" php="restore">นำเข้าฐานข้อมูล</li>
        <li class="menu-link child" main="config" php="user">ผู้ใช้ระบบ</li>
        <li class="menu-link child" main="config" php="config">ตั้งค่า 50 ทวิ</li>
        <li class="menu-link" php="company">ข้อมูลบริษัท</li>
        <li class="menu-link" php="logout">ออกจากระบบ</li>
      </ul>
      <?php
      if(isset($config) && $config['type'] == 'agent') {
        echo '<div class="menu-type main" type="0">การทำงาน ของบริษัท</div>
          <div class="menu-type main" type="1">การทำงาน กระทำการแทน</div>';
      }
      ?>
      <div class="menu-footer">
        Copyright &#169; 2014<?php if(date('Y') > 2014) {echo '-'.date('Y');}?><br>
        Sum Systems Management Co.,Ltd.<br>
        All Rights Reserved.
      </div>
    </div>
    <div id="main">
      <div id="head">
        <div class="icon-menu <?php echo $menu;?>">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="menu-header"></span>
        <span id="show-log">โปรแกรมพิมพ์ 50 ทวิ/ภ.ง.ด.</span>
        <span id="show-work"></span>
      </div>
      <div id="top-search">
        <form method="post" onsubmit="return false;">
        </form>
      </div>
      <div id="desktop" align="center">
        <div id="error" style="background-color: #F3E3E6;color: #80001C;border: 1px solid #E599AA;font-size: 12px;height:46px;padding:10px;position: fixed;width:98%;left:0px;top:50%">
          <strong class="error-msg">Javascript Disabled Detected</strong>
          <p class="error-msg">You currently have javascript disabled. Several functions may not work. Please re-enable javascript to access full functionality.</p>
          <strong class="error-ie hide">Please Upgrade Your Browser</strong>
          <p class="error-ie hide">You're still using old version of Internet Explorer. Several functions may not work. Please update Internet Explorer 9 or more to access full functionality.</p>
        </div>
      </div>
      <div id="login-tab" align="center">
        <div id="login">
          <div id="login-form">
            <b>เข้าสู่ระบบ</b><br/>
            <input id="name" type="text"  placeholder="ชื่อผู้ใช้งาน" maxlength="20" autocorrect="off" autocapitalize="off"/><br/>
            <input id="pass" type="password"  placeholder="รหัสผ่าน" maxlength="20" autocorrect="off" autocapitalize="off"/><br/>
            <input id="btn-login" type="button" class="btn-dark-blue" value="เข้าสู่ระบบ"/>
          </div>
        </div>
      </div>
    </div>
    <div id="msg-tip">
    </div>
  </body>
</html>
