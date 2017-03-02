<?php
	ini_set('display_errors', 0);
	set_error_handler("myErrorHandler");
	include('teste2.php');
	function myErrorHandler($errno, $errstr, $errfile, $errline) {
		$code = array(
			'E_ERROR',
			'E_WARNING',
			'E_PARSE',
			'E_NOTICE',
			'E_CORE_ERROR',
			'E_CORE_WARNING',
			'E_COMPILE_ERROR',
			'E_COMPILE_WARNING',
			'E_USER_ERROR',
			'E_USER_WARNING',
			'E_USER_NOTICE',
			'E_STRICT',
			'E_RECOVERABLE_ERROR',
			'E_DEPRECATED',
			'E_USER_DEPRECATED',
			'E_ALL'
		);
		$str = '<b>';
		switch($errno) {
            case E_ERROR: // 1 //
                $str .= 'Error';
				break;
            case E_WARNING: // 2 //
                $str .= 'Warning';
				break;
            case E_PARSE: // 4 //
                $str .= 'Parse';
				break;
            case E_NOTICE: // 8 //
                $str .= 'Notice';
				break;
            case E_CORE_ERROR: // 16 //
                $str .= 'Core_Error';
				break;
            case E_CORE_WARNING: // 32 //
                $str .= 'Core_Warning';
				break;
            case E_CORE_ERROR: // 64 //
                $str .= 'Compile_Error';
				break;
            case E_CORE_WARNING: // 128 //
                $str .= 'Compile_Warning';
				break;
            case E_USER_ERROR: // 256 //
                $str .= 'User_Error';
				break;
            case E_USER_WARNING: // 512 //
                $str .= 'User_Warning';
				break;
            case E_USER_NOTICE: // 1024 //
                $str .= 'User_Notice';
				break;
            case E_STRICT: // 2048 //
                $str .= 'Strict';
				break;
            case E_RECOVERABLE_ERROR: // 4096 //
                $str .= 'Recoverable_Error';
				break;
            case E_DEPRECATED: // 8192 //
                $str .= 'Deprecated';
				break;
            case E_USER_DEPRECATED: // 16384 //
                $str .= 'User_Deprecated';
				break;
        }
		$str = $str."</b>: $errstr in <b>$errfile</b> on line <b>$errline</b> ";
		//echo $str;
		return true;
	}
?>