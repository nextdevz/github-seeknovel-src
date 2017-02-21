<?php
  include_once(__DIR__.'/settings.php');
  $php = $_GET['php'];
  if($php == 'member') {
    include_once($phpDir.'/member.php');
  }
?>