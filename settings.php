<?php
	$webName = 'localhost/seeknovel/src/';
	//$webName = 'nextdev.noip.me/seeknovel/src/';
	//$root = 'http://'.$webName;
	$root = '';
	$title = 'Kuma Baka';
	$subtitle = ' เว็บไซต์สำหรับคนรักนิยาย';
	$fulltitle = $title.' '.$subtitle;
	$global_vars = array (
		"DB_HOST"	=>	"localhost",
		"DB_NAME"	=>	"novel",
		"DB_USER"	=>	"root",
		"DB_PWD"	=>	"",
		"CK_TIME" 	=>	7 * 24 * 3600,
	);
	while(list($key, $value) = each($global_vars)) {
		define($key, $value);
	}
	ini_set('memory_limit', '-1');
	//ini_set('display_errors', 0);
	//set_error_handler("sqlErrorHandler");

	if(isset($_SERVER['HTTP_REFERER'])) {
		$rootUrl = $_SERVER['HTTP_REFERER'];
	}
	else {
		$rootUrl = 'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
	}
	$cssDir = $rootUrl.'css/';
	$imgDir = $rootUrl.'images/';
	$rootDir = __DIR__.'/';
	$jsDir = $rootDir.'js/';
	$jsApi = $jsDir.'api/';
	$jsLayout = $jsDir.'layout/';
	$phpDir = $rootDir.'php/';
	$phpClass = $phpDir.'class/';
	$phpLayout = $phpDir.'layout/';
	$phpProcess = $phpDir.'process/';
?>
