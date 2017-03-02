<?php
    class c_function {
        public function c_function($real_string=true) {
            if(isset($_POST) && count($_POST) > 0) {
                $_POST = $this->array_trim($_POST);
                if(isset($_SESSION)) {
                    $flex = new c_flex();
                    $_SESSION = $flex->file_session($_SESSION,$_POST);
                }
            }
        }

//-------------------------------------------------------------------------------------------------------

		public function call($function, $array=null, $args=true) {
            $call = $function;
            if(!function_exists($call) && isset($_POST[$function])) {
                $call = $_POST[$function];
            }
            if(function_exists($call)) {
                if(is_array($array) && $args == true) {
                    return call_user_func_array($call, $array);
                }
                else {
                    return $call($array);
                }
            }
		}

//-------------------------------------------------------------------------------------------------------

        public static function array_trim($var) {
            if(is_array($var)) {
                return array_map(array('c_function', 'array_trim'), $var);
            }
            if(is_string($var)) {
                return trim($var);
            }
            return $var;
        }

//-------------------------------------------------------------------------------------------------------

        public static function array_real_string($var) {
            if(is_array($var)) {
                return array_map(__METHOD__, $var);
                //return array_map(array('c_function', 'array_real_string'), $var);
            }
            if(is_string($var)) {
                return strtr($var, array('\\'=>'\\\\', "\0"=>'\\0', "\n"=>'\\n', "\r"=>'\\r', "'"=>"\\'", '"'=>'\\"', "\x1a"=>'\\Z'));
                //return str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $var);
                //return mysql_real_escape_string($var);
            }
            return $var;
        }

//-------------------------------------------------------------------------------------------------------

        public function compareDateOver($date, $compare, $numDateCompare=0) {
            $date = explode("-", $date);
            $compare = explode("-", $compare);
            $date = mktime(0, 0, 0, $date[1], $date[2], $date[0]);
            $compare = mktime(0, 0, 0, $compare[1], $compare[2], $compare[0] + ($numDateCompare * 86400));
            if(($numDateCompare == 0 && $date_exp > $date_imp) || ($numDateCompare > 0 && $date_exp - $date_imp < $more)) {
                return true;
            }
            else {
                return false;
            }
        }


//-------------------------------------------------------------------------------------------------------

		public function get_real_ip($multi = false) {
            $result = array();
            $inx = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
            $l = count($inx);
            for($i=0; $i<$l; $i++) {
                if(isset($_SERVER[$inx[$i]]) === true) {
                    $ip = $_SERVER[$inx[$i]];
                    if(filter_var($ip, FILTER_VALIDATE_IP) && !in_array($ip, $result)) {
                        array_push($result, $ip);
                    }
                }
            }
            if($multi === false) {
                return (count($result) > 0 ? $result[0] : '');
            }
            else {
                if(isset($result[1]) === false) $result[1] = '';
                return $result;
            }
		}

//-------------------------------------------------------------------------------------------------------

        public static function array_stripslashes($var) {
            if (is_array($var)) {
                return array_map(array('c_function', 'array_stripslashes'), $var);
            }
            if (is_string($var)) {
                return stripslashes($var);
            }
            return $var;
        }

//-------------------------------------------------------------------------------------------------------

        public function return_bytes($val) {
            $val = trim($val);
            $last = strtolower($val{strlen($val)-1});
            switch($last) {
                case 'g':$val *= 1024;
                case 'm':$val *= 1024;
                case 'k':$val *= 1024;
            }
            return $val;
        }

//-------------------------------------------------------------------------------------------------------

        public function convert_byte($val) {
            $type = "";
			$d = 0;
            if($val < 1024) {
                $type = " Byte";
            }
            else if($val <= 1022976) {
                $val = intval($val / 1024);
                $type = " KB";
            }
            else if($val <= 1047527424) {
                $val = intval($val / 10485.76) / 100;
                $d = 2;
                $type = " MB";
            }
            else {
                $val = intval($val / 10737418.24) / 100;
                $d = 2;
                $type = " GB";
            }
			return number_format($val, $d, '.', '').$type;
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function check_page($session,$target) {			//function ตรวจสอบว่าผู้ที่เข้าใช้งาน login เข้ามารึปล่าว
			if(!isset($_SESSION[$session]) || $_SESSION[$session] == null) {
				echo "<script> document.location='".$target."'; </script>";
			}
		}

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function token_set($data, $key='') {
            $data = json_encode($data);
            return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=').'.'.$this->hash256($data, $key);
		}

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function token_get($data, $key='') {
            $data = explode('.', $data);
            $data[0] = json_decode(base64_decode(str_pad(strtr($data[0], '-_', '+/'), strlen($data[0]) % 4, '=', STR_PAD_RIGHT)));
            return array(
                'verify' => ($data[1] == $this->hash256($data[0], $key) ? true : false),
                'data' => json_decode($data[0], true)
            );
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function hash256($data, $key='') {
            return hash_hmac('sha256', $data, $key.'@ND-hash_hmac-256');
        }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function pass($pass, $user='') {
            if($user != '') {
			    return sha1($user.$pass.crc32($user));
            }
            else {
                $pass = $pass.crc32($pass).'@ND';
                return substr(sha1($pass), 0, 20).substr(sha1(strrev($pass)),20, 20);
            }
		}

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function diffDate($date1, $date2=null) {
            $date1 = $this->splitDate($date1);
            $date2 = $this->splitDate($date2);
            $year = $date2['y'] - $date1['y'];
            if($date2['m'].$date2['d'] < $date1['m'].$date1['d']) $year -= 1;
            $month = intval($date2['m']) - intval($date1['m']);
            if($date2['d'] < $date1['d']) $month -= 1;
            if($month < 0) $month += 12;
            $day = intval($date2['d']) - intval($date1['d']);
            if($date2['m'] > $date1['m']) $date2['m'] = ($date2['m'] == 1 ? 12 : $date2['m'] -1);
            if($day < 0) $day += $this->days_in_month($date2['m'], $date2['y']);
            if($year >= 0 && $month >= 0 && $day >= 0)
                return array('y' => $year, 'm' => $month, 'd' => $day);
            else
                return array('y'=>0, 'm'=>0, 'd'=>0);
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function splitDate($date=null) {
    		if($date === null) $date = date('Y-m-d');
    		return array('y' => $this->date('Y', $date), 'm' => $this->date('m', $date), 'd' => $this->date('d', $date));
    	}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function date($f='', $ln='', $d='') {
            $dD = array('1'=>'จ.', '2'=>'อ.', '3'=>'พ.', '4'=>'พฤ.', '5'=>'ศ.', '6'=>'ส.', '7'=>'อา.');
            $dl = array('1'=>'จันทร์', '2'=>'อังคาร', '3'=>'พุธ', '4'=>'พฤหัสบดี', '5'=>'ศุกร์', '6'=>'เสาร์', '7'=>'อาทิตย์');
            $dM = array('1'=>'ม.ค.', '2'=>'ก.พ.', '3'=>'มี.ค.', '4'=>'เม.ย.', '5'=>'พ.ค.', '6'=>'มิ.ย.', '7'=>'ก.ค.', '8'=>'ส.ค.', '9'=>'ก.ย.', '10'=>'ต.ค.', '11'=>'พ.ย.', '12'=>'ธ.ค.');
            $dF = array('1'=>'มกราคม', '2'=>'กุมภาพันธ์', '3'=>'มีนาคม', '4'=>'เมษายน', '5'=>'พฤษภาคม', '6'=>'มิถุนายน', '7'=>'กรกฎาคม', '8'=>'สิงหาคม', '9'=>'กันยายน', '10'=>'ตุลาคม', '11'=>'พฤศจิกายน', '12'=>'ธันวาคม');
            $y = 'Y'; $F = 'F'; $M = 'M'; $D = 'D'; $l = 'l';
            if($d == '' && strlen($ln) == 10) {$d = $ln; $ln = '';}
            if($d != '' && strlen($d) == 10) {
                if(substr($d,4, 1) == '-' || substr($d, 4, 1) == '/') {
                    $d = array('y'=>intval(substr($d, 0, 4)), 'm'=>intval(substr($d, 5, 2)), 'd'=>intval(substr($d, 8, 2)));
                }
                else {
                    $d = array('y'=>intval(substr($d, 6, 4)), 'm'=>intval(substr($d, 3, 2)), 'd'=>intval(substr($d, 0, 2)));
                }
                $d['y'] -= ($d['y'] - date('Y') > 500 ? 543 : 0);
                $n = mktime(0, 0, 0, $d['m'], $d['d'], $d['y']);
                if($ln == 'th') {$tN = date('N', $n); $y = $d['y'] + 543; $F = $dF[$d['m']]; $M = $dM[$d['m']]; $D = $dD[$tN]; $l = $dl[$tN];}
                else $y = $d['y'];
                //$y = ($l == 'th' ? $d['y'] + 543 : $d['y']);
            }
            else {
                if($ln == 'th') {$tm = date('n'); $tN = date('N'); $y = date('Y') + 543; $F = $dF[$tm]; $M = $dM[$tm]; $D = $dD[$tN]; $l = $dl[$tN];}
                else $y = $d['y'];
                //$y = ($l == 'th' ? date('Y') + 543 : date('Y'));
            }
            $f = ($f == '' ? ($ln == 'th' ? 'd/m/Y' : 'Y-m-d') : $f);
            $s = array('Y'=>$y, 'y'=>substr($y, 2, 2), 'F'=>$F, 'M'=>$M, 'D'=>$D, 'l'=>$l);
            if(isset($n) == true) {
               return date(strtr($f, $s), $n);
            }
            else {
               return date(strtr($f, $s));
            }
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function dmy($date) {
			if(strlen($date) < 10) {
				return "";
			}
			elseif(substr($date,4,1) == "-") {
				return substr($date,8,2)."-".substr($date,5,2)."-".substr($date,0,4);
			}
			else {
				return substr($date,6,4)."-".substr($date,3,2)."-".substr($date,0,2);
			}
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        private function BE2AD($date) {
            if(doubleval($date) == 0) {
                return '0000-00-00';
            }
            else {
                $date = explode('-', $date = trim($date));
                return ($date[2] - 543)."-".$date[1]."-".$date[0];
            }
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        private function AD2BE($date) {
            if(doubleval($date) == 0) {
                return '00-00-0000';
            }
            else {
                $date = explode('-', $date = trim($date));
                return $date[0]."-".$date[1]."-".($date[2] + 543);
            }
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function microtime_float() {
			list($usec, $sec) = explode(" ", microtime());
			return ((float)$usec + (float)$sec);
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function ceil_edit($number, $after=0) {
            if($dot = strpos($number, ".")) {
                if(substr($number, $dot + $after +1, 1) > 0) {
                    $number += (1 / pow(10, $after));
                }
                return doubleval(substr($number, 0, $dot + $after +1));
            }
            else {
                return  doubleval($number);
            }
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function floor_edit($number, $after=0) {
            if($dot = strpos($number, ".")) {
                return  doubleval(substr($number, 0, $dot + $after +1));
            }
            else {
                return  doubleval($number);
            }
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function format($v, $f, $n=null) {
            if($n !== null) {
                $f = str_repeat($f, $n);
            }
            return substr($f, 0, strlen($f) - strlen($v)).$v;
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function days_in_month($month, $year=null) {
            if($year == null) $year = date('Y');
            else $year = intval($year);
            $month = intval($month);
            return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31);
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function hex2bin($text) {
			$bin = "";
			for($i=0;$i<strlen($text);$i++) {
				$bin .= $this->format(decbin(hexdec($text[$i])),"0000");
			}
			return $bin;
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		public function readThaiBaht($v) {
			if($v !== '' && preg_match('/^-?[0-9,]*(\.[0-9]*)?$/', $v) == true) {
				$v = number_format(strtr($v, array(','=>'')), 2, '.', '');
				if(isset($v[0]) === true && $v[0] == '-') {$m = 'ลบ'; $v = substr($v, 1);}
				else $m = '';
				$v = explode('.', $v);
				$b = $this->numberThai($v[0]);
				$s = $this->numberThai($v[1]);
				if($b == '' && $s == '') return 'ศูนย์บาทถ้วน';
				if($b != '') $b .= 'บาท';
				$b .= ($s == '' ? 'ถ้วน' : $s.'สตางค์');
				return $m.$b;
			}
			else {
				return '';
			}
		}

		function numberThai($v) {
			$d = array('0'=>'', '1'=>'สิบ', '2'=>'ร้อย', '3'=>'พัน', '4'=>'หมื่น', '5'=>'แสน');
			$n = array('0'=>'', '1'=>'หนึ่ง', '2'=>'สอง', '3'=>'สาม', '4'=>'สี่', '5'=>'ห้า', '6'=>'หก', '7'=>'เจ็ด', '8'=>'แปด', '9'=>'เก้า');
			$s = array('0'=>'', '1'=>'', '2'=>'ยี่');
			$l = strlen($v) - 1;
			$r = '';
			for($i = 0; $i <= $l; $i++) {
				$c = $l - $i;
				$p = ($c % 6);
				$r .= ($p == 1 && $v[$i] < 3 ? $s[$v[$i]] : ($r != '' && $p == 0  && $v[$i] == 1? 'เอ็ด' : $n[$v[$i]]));
				$r .= ($r != '' && $c > 5 && $p == 0 ? 'ล้าน' : ($v[$i] > 0? $d[$p] : $d[0]));
			}
			return $r;
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

     function TIS620toUTF8($string) {

         if (!ereg("[\241-\377]", $string))
             return $string;

        $tis620 = array(
                                    "\xa1" => "\xe0\xb8\x81",
                                    "\xa2" => "\xe0\xb8\x82",
                                    "\xa3" => "\xe0\xb8\x83",
                                    "\xa4" => "\xe0\xb8\x84",
                                    "\xa5" => "\xe0\xb8\x85",
                                    "\xa6" => "\xe0\xb8\x86",
                                    "\xa7" => "\xe0\xb8\x87",
                                    "\xa8" => "\xe0\xb8\x88",
                                    "\xa9" => "\xe0\xb8\x89",
                                    "\xaa" => "\xe0\xb8\x8a",
                                    "\xab" => "\xe0\xb8\x8b",
                                    "\xac" => "\xe0\xb8\x8c",
                                    "\xad" => "\xe0\xb8\x8d",
                                    "\xae" => "\xe0\xb8\x8e",
                                    "\xaf" => "\xe0\xb8\x8f",
                                    "\xb0" => "\xe0\xb8\x90",
                                    "\xb1" => "\xe0\xb8\x91",
                                    "\xb2" => "\xe0\xb8\x92",
                                    "\xb3" => "\xe0\xb8\x93",
                                    "\xb4" => "\xe0\xb8\x94",
                                    "\xb5" => "\xe0\xb8\x95",
                                    "\xb6" => "\xe0\xb8\x96",
                                    "\xb7" => "\xe0\xb8\x97",
                                    "\xb8" => "\xe0\xb8\x98",
                                    "\xb9" => "\xe0\xb8\x99",
                                    "\xba" => "\xe0\xb8\x9a",
                                    "\xbb" => "\xe0\xb8\x9b",
                                    "\xbc" => "\xe0\xb8\x9c",
                                    "\xbd" => "\xe0\xb8\x9d",
                                    "\xbe" => "\xe0\xb8\x9e",
                                    "\xbf" => "\xe0\xb8\x9f",
                                    "\xc0" => "\xe0\xb8\xa0",
                                    "\xc1" => "\xe0\xb8\xa1",
                                    "\xc2" => "\xe0\xb8\xa2",
                                    "\xc3" => "\xe0\xb8\xa3",
                                    "\xc4" => "\xe0\xb8\xa4",
                                    "\xc5" => "\xe0\xb8\xa5",
                                    "\xc6" => "\xe0\xb8\xa6",
                                    "\xc7" => "\xe0\xb8\xa7",
                                    "\xc8" => "\xe0\xb8\xa8",
                                    "\xc9" => "\xe0\xb8\xa9",
                                    "\xca" => "\xe0\xb8\xaa",
                                    "\xcb" => "\xe0\xb8\xab",
                                    "\xcc" => "\xe0\xb8\xac",
                                    "\xcd" => "\xe0\xb8\xad",
                                    "\xce" => "\xe0\xb8\xae",
                                    "\xcf" => "\xe0\xb8\xaf",
                                    "\xd0" => "\xe0\xb8\xb0",
                                    "\xd1" => "\xe0\xb8\xb1",
                                    "\xd2" => "\xe0\xb8\xb2",
                                    "\xd3" => "\xe0\xb8\xb3",
                                    "\xd4" => "\xe0\xb8\xb4",
                                    "\xd5" => "\xe0\xb8\xb5",
                                    "\xd6" => "\xe0\xb8\xb6",
                                    "\xd7" => "\xe0\xb8\xb7",
                                    "\xd8" => "\xe0\xb8\xb8",
                                    "\xd9" => "\xe0\xb8\xb9",
                                    "\xda" => "\xe0\xb8\xba",
                                    "\xdf" => "\xe0\xb8\xbf",
                                    "\xe0" => "\xe0\xb9\x80",
                                    "\xe1" => "\xe0\xb9\x81",
                                    "\xe2" => "\xe0\xb9\x82",
                                    "\xe3" => "\xe0\xb9\x83",
                                    "\xe4" => "\xe0\xb9\x84",
                                    "\xe5" => "\xe0\xb9\x85",
                                    "\xe6" => "\xe0\xb9\x86",
                                    "\xe7" => "\xe0\xb9\x87",
                                    "\xe8" => "\xe0\xb9\x88",
                                    "\xe9" => "\xe0\xb9\x89",
                                    "\xea" => "\xe0\xb9\x8a",
                                    "\xeb" => "\xe0\xb9\x8b",
                                    "\xec" => "\xe0\xb9\x8c",
                                    "\xed" => "\xe0\xb9\x8d",
                                    "\xee" => "\xe0\xb9\x8e",
                                    "\xef" => "\xe0\xb9\x8f",
                                    "\xf0" => "\xe0\xb9\x90",
                                    "\xf1" => "\xe0\xb9\x91",
                                    "\xf2" => "\xe0\xb9\x92",
                                    "\xf3" => "\xe0\xb9\x93",
                                    "\xf4" => "\xe0\xb9\x94",
                                    "\xf5" => "\xe0\xb9\x95",
                                    "\xf6" => "\xe0\xb9\x96",
                                    "\xf7" => "\xe0\xb9\x97",
                                    "\xf8" => "\xe0\xb9\x98",
                                    "\xf9" => "\xe0\xb9\x99",
                                    "\xfa" => "\xe0\xb9\x9a",
                                    "\xfb" => "\xe0\xb9\x9b"
                                    );

         $string=strtr($string, $tis620);
         return $string;
     }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function utf8_substr($str,$from,$len) {
 		 	return preg_replace('#^(?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,'.$from.'}'.'((?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,'.$len.'}).*#s', '$1', $str);
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		function wordcut($text, $len, $end) {
			if (strlen(utf8_decode($text)) > $len) {
				$text = $this->utf8_substr($text,0,$len-strlen($end));
				return $text .$end;
			}
			else {
			   return $text;
			}
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		public function bahtRound($value, $type="", $mode="") {
			if($type == "baht") {
				if($mode == "up") {
					return ceil($value);
				}
				else if($mode == "down") {
					return floor($value);
				}
				else {
					return round($value);
				}
			}
			else {
				$valueInt = intval($value);
				$decimal = $value - $valueInt;
				if($decimal == 0) {
					return $value;
				}
				else {
					if($mode == "up") {
						if($decimal > 0 && $decimal <= 0.25) {
							return $valueInt + 0.25;
						}
						else if($decimal > 0.25 && $decimal <= 0.50) {
							return $valueInt + 0.50;
						}
						else if($decimal > 0.50 && $decimal <= 0.75) {
							return $valueInt + 0.75;
						}
						else {
							return $valueInt + 1;
						}
					}
					else if($mode == "down") {
						if($decimal > 0 && $decimal < 0.25) {
							return $valueInt;
						}
						else if($decimal >= 0.25 && $decimal < 0.50) {
							return $valueInt + 0.25;
						}
						else if($decimal >= 0.50 && $decimal < 0.75) {
							return $valueInt + 0.50;
						}
						else {
							return $valueInt + 0.75;
						}
					}
					else {
						if($decimal < 0.125) {
							return $valueInt;
						}
						else if($decimal < 0.375) {
							return $valueInt + 0.25;
						}
						else if($decimal < 0.625) {
							return $valueInt + 0.50;
						}
						else if($decimal < 0.875) {
							return $valueInt + 0.75;
						}
						else {
							return $valueInt + 1;
						}
					}
				}
			}
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

		public function decimalRound($value, $decimal=0, $mode="") {
			$mode = strtolower($mode);
			if($mode == "middle"){
				return round($value, $decimal);
			}
			else {
				if($decimal > 0) {
					$pow = pow(10, $decimal);
				}
				else {
					$pow = 1;
				}
				$value = doubleval($value) * $pow;
				if($mode == "up") {
					return ceil($value) / $pow;
				}
				else if($mode == "down") {
					return floor($value) / $pow;
				}
				else {
					return intval($value) / $pow;
				}
			}
		}

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function encode($input,$key) {
            $chars = $this->chose_char($key);
			$key = sha1($key);
			$keyLen = strlen($key);
            $output = "";
            $chr1 = $chr2 = $chr3 = $enc1 = $enc2 = $enc3 = $enc4 = null;
            $sha1 = base_convert($key, 36, 10);
            $sha1 = substr($sha1, 0, 2) + substr($sha1, 16, 2) + substr($sha1, 32, 2)+ substr($sha1, 48, 2) + substr($sha1, -2, 2);
            $sha1 = $sha1 % 256;
            $i = 0;
			$j = 0;

            $input = chr($sha1).$input;
            while($i < strlen($input)) {
                $chr1 = @ord($input[$i++]);
                $chr2 = @ord($input[$i++]);
                $chr3 = @ord($input[$i++]);

				$x = ord($key[$j++]) % 24;
				$temp = $chr1 << 16 | $chr2 << 8 | $chr3;
                $temp = ($temp << $x) & 16777215 | $temp >> (24 - $x);
				$chr1 = $temp >> 16;
                $chr2 = ($temp & 65535) >> 8;
                $chr3 = $temp & 255;
				if ($j == $keyLen) {
					$j = 0;
				}

                $enc1 = $chr1 >> 2;
                $enc2 = (($chr1 & 3) << 4) | ($chr2 >> 4);
                $enc3 = (($chr2 & 15) << 2) | ($chr3 >> 6);
                $enc4 = $chr3 & 63;

                if (is_nan($chr2)) {
                    $end = "";
                } else if (is_nan($chr3)) {
                    $end = $chars[$enc3];
                }
				else {
					$end = $chars[$enc3].$chars[$enc4];
				}

                $output .=  $chars[$enc1].$chars[$enc2].$end;
            }
            return $output;
        }

        public function utf8_encode($input) {
            $utftext = null;

            for ($n = 0; $n < strlen($input); $n++) {

                $c = ord($input[$n]);

                if ($c < 128) {
                    $utftext .= chr($c);
                } else if (($c > 128) && ($c < 2048)) {
                    $utftext .= chr(($c >> 6) | 192);
                    $utftext .= chr(($c & 63) | 128);
                } else {
                    $utftext .= chr(($c >> 12) | 224);
                    $utftext .= chr((($c & 6) & 63) | 128);
                    $utftext .= chr(($c & 63) | 128);
                }
            }

            return $utftext;
        }

	//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function decode($input,$key) {
            $chars = $this->chose_char($key);
			$key = sha1($key);
			$keyLen = strlen($key);
            $output = "";
            $sha1 = base_convert($key, 36, 10);
            $sha1 = substr($sha1, 0, 2) + substr($sha1, 16, 2) + substr($sha1, 32, 2)+ substr($sha1, 48, 2) + substr($sha1, -2, 2);
            $sha1 = $sha1 % 256;
            $chr1 = $chr2 = $chr3 = $enc1 = $enc2 = $enc3 = $enc4 = null;
            $f = 0;
            $i = 0;
			$j = 0;

            while($i < strlen($input)) {
                $enc1 = @strpos($chars, $input[$i++]);
                $enc2 = @strpos($chars, $input[$i++]);
                $enc3 = @strpos($chars, $input[$i++]);
                $enc4 = @strpos($chars, $input[$i++]);

				$chr1 = $enc1 << 2 | $enc2 >> 4;
                $chr2 = ($enc2 & 15) << 4 | $enc3 >> 2;
                $chr3 = ($enc3 & 3) << 6 | $enc4;

				$x = (ord($key[$j++]) + $f) % 24 ;
				$temp = $chr1 << 16 | $chr2 << 8 | $chr3;
                $temp = ($temp << (24 - $x)) &16777215 | $temp >> $x;
				$chr1 = $temp >> 16;
                $chr2 = ($temp & 65535) >> 8;
                $chr3 = $temp & 255;
				if ($j == $keyLen) {
					$j = 0;
				}

				if ($chr2 == 0) {
                    $end = "";
                } else if($chr3 == 0) {
                    $end = chr($chr2);
                }
				else {
					$end = chr($chr2).chr($chr3);
				}
                $output .=  chr($chr1).$end;

                if($i <=4) {
                    if($chr1 != $sha1) {
                        $f = 1;
                    }
                    $output = substr($output, 1);
                }
            }
            return $output;
        }

		//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        function chose_char($string) {
			$sha1 = base_convert(sha1($string), 36, 10);
            $sha1 = substr($sha1, 0, 1) + substr($sha1, 16, 1) + substr($sha1, 32, 1)+ substr($sha1, 48, 1) + substr($sha1, -1, 1);
			$char["0"] = "159-8420_376";
			$char["1"] = "AMDFGBHECIKJL";
			$char["2"] = "ZNORVQSPUTYWX";
			$char["3"] = "qscxawdzergnb";
			$char["4"] = "fthvyukjilmop";
			$chars = "";
			$index = "01234";
			for($i = 5;$i > 0;$i--) {
				$key = strpos($index,$index[$sha1 % $i]);
                $chars .= $char[$index[$key]];
                $index = substr($index, 0, $key).substr($index, $key+1);
			}
			return $chars;
		}
	}
?>
