<?php

	class c_query {
        private $localhost;
		private $database = 'mysql';
        private $username;
        private $password;
		private $dbname;
		private $charset='utf8';
        private $main;
        private $pdo=false;
		private $qid=false;
		private $tid=false;
		private $fid=false;
		private $sql="";
		private $data=array();
        private $rowR=0;
		private $rowT=0;
		private $rowL=0;
		private $errde="";
		private $errno="";
		private $showTran="";
		private $transaction=false;
        private $transerror=false;
        private $record=array();
        private $table="";
        private $field=array();
		private $addSlashes = false;
        private $affected=0;
        private $error=false;
        private $show_error=true;

		public function c_query($real_string=true) {
            //$this->main = new c_function($real_string);
            if(defined('DB_HOST') === true && defined('DB_USER') === true && defined('DB_PWD') === true && defined('DB_NAME') === true) {
			    $this->setConfig(DB_HOST, DB_USER, DB_PWD, DB_NAME);
            }
			/*if(isset($_POST["real_string_check"]) === false && $real_string === true) {
				foreach ($_POST as $key => $value) {
					if($key != "query_sql" && $key != "check_sql") {
						$_POST[$key] = $this->main->array_real_string($value);
					}
				}
				$_POST["real_string_check"] = true;
			}*/
		}

//-------------------------------------------------------------------------------------------------------

        public function showError($v = true) {
			return $this->show_error = ($v === false ? false : true);
		}

//-------------------------------------------------------------------------------------------------------

        public function error() {
			return $this->error;
		}

//-------------------------------------------------------------------------------------------------------

        public function setConfig($host, $root, $pass, $dbname, $charset='') {
            $this->localhost = $host;
            $this->username = $root;
            $this->password = $pass;
            $this->dbname = $dbname;
            if(defined("DB_CHAR") === true && $charset == '') {
                $this->charset = DB_CHAR;
            }
            else if($charset != ''){
                $this->charset = $charset;
            }
            if($this->pdo != 0) {
                $this->pdo = 0;
            }
            $this->connect();
            $this->query("SET AUTOCOMMIT=1");
        }

//-------------------------------------------------------------------------------------------------------

		private function connect() {
			if(!$this->pdo) {
				$this->pdo = new PDO($this->database.':host='.$this->localhost.';charset='.$this->charset, $this->username, $this->password);
				if(!$this->pdo) {
					$this->halt("connect(".$this->localhost.",".$this->username.",PASSWORD) failed.");
				}
                $this->select_db($this->dbname);
			}
            mb_internal_encoding($this->charset);
			return $this->pdo;
		}

//-------------------------------------------------------------------------------------------------------

		private function select_db($db) {
            if(!@$this->pdo->query("USE ".$db)) {
                $this->halt("Can not connect DB ".$db);
            }
		}

//-------------------------------------------------------------------------------------------------------

		public function addSlashes($value=true) {
			$this->addSlashes = ($value === true ? true : false);
		}

//---------------------------------------------------------------------------------------------------------

		public function data2insert($insert, $replace='', $skip='') {
			$skip = $this->skip_data($skip);
            $field = $value = '';
            foreach($insert as $key => $data) {
                if(isset($skip[$key]) === false) {
                    $key = $replace.$key;
                    $field .= ", `{$key}`";
                    if($data === null) {
                        $value .= ', NULL';
					}
					else {
						if($this->addSlashes === true) {
                            $data = $this->main->array_real_string($data);
						}
                        $value .= ", '{$data}'";
					}
               }
            }
			return array('field' => substr($field, 2), 'value' => substr($value, 2));
		}

//------------------------------------------------------------------------------------------------------------

		public function data2update($data, $replace='', $skip='') {
            $skip = $this->skip_data($skip);
            $result = "";
            foreach($data as $key => $value) {
                if(isset($skip[$key]) === false) {
                    $key = $replace.$key;
					if($value === null) {
						$result .= ", `{$key}`=NULL";
					}
					else {
						if($this->addSlashes === true) {
							$value = $this->main->array_real_string($value);
						}
						$result .= ", `{$key}`='{$value}'";
					}
               }
            }
            $result = substr($result, 2);
			return $result;
		}

//------------------------------------------------------------------------------------------------------------

		public function data2exec($data, $skip='', $replace='') {
			$result = array('field'=>'', 'values'=>'', 'update'=>'', 'data'=>array());
			if(is_array($data)) {
				if(array_key_exists(0, $data)) $result['data'] = $data;
				else {
					$skip = $this->skip_data($skip);
					foreach($data as $key => $val) {
						if(isset($skip[$key]) === false) {
							if(isset($skip[':'.$key]) === false) {
								$key = ($replace != '' ? $replace : '').$key;
								$vkey = ($key[0] == ':' ? '' : ':').$key;
								$result['field'] .= ($result['field'] != '' ? ', ' : '').$key;
								$result['update'] .= ($result['update'] != '' ? ', ' : '').$key.'='.$vkey;
								$result['values'] .= ($result['values'] != '' ? ', ' : '').$vkey;
							}
							else $vkey = ':'.$key;
							$result['data'][$vkey] = $val;
						}
					}
				}
			}
			else {
				$result['data'] = array($data);
			}
			return $result;
		}

//-------------------------------------------------------------------------------------------------------

		private function skip_data($skip) {
			//$skip = str_replace(" ", "", $skip.($skip != '' ? ', ' : '').'real_string_check, process, percentProcess, pathProcess');
			//return $this->main->array_trim(array_flip(explode(',', $skip)));
			return array_flip(explode(',', $skip));
		}

//-------------------------------------------------------------------------------------------------------

		public function prepare($sql, $val=null, $skip='', $show_error=true) {
			$this->qid = @$this->pdo->prepare($this->sql = $sql);
			return ($val === null ? $this->qid : $this->execute($val, $skip));
		}

//-------------------------------------------------------------------------------------------------------

		public function execute($val=null, $skip='', $show_error=true) {
			if(!$this->data_exec($val)) $val = $this->data2exec($val, $skip);
			return $this->process($this->qid->execute($val['data']), $show_error=true);
		}

//-------------------------------------------------------------------------------------------------------

		public function query($sql, $show_error=true) {
			return (empty($sql) ? false : $this->process($this->qid = @$this->pdo->query($this->sql = $sql), $show_error));
		}

//-------------------------------------------------------------------------------------------------------

		private function process($process, $show_error=true) {
			if(!$this->connect()) return false;
            $this->rowR = 0;
			if($process) {
				$this->data['q'] = @$this->qid->fetchAll(PDO::FETCH_ASSOC);
	            $this->affected = @$this->qid->rowCount();
				$this->next_record();
				$this->rowR = 0;
				return true;
            }
			else {
				if($this->transaction === true) {
					$this->transerror = true;
					$this->showTran .= "ROLLBACK;\n<br/>\n<br/>";
				}
				$this->show_error = $show_error;
				return $this->halt("Invalid SQL: ".$this->sql);
			}
		}

//-------------------------------------------------------------------------------------------------------

        public function  affected_rows() {
            return $this->affected;
        }

//-------------------------------------------------------------------------------------------------------

		public function list_table($value='') {
			if($value == '') $value = DB_NAME;
            $this->tid = @$this->pdo->query('SHOW TABLES IN '.$value);
			$this->data['t'] = $this->tid->fetchAll(PDO::FETCH_COLUMN);
			$this->rowT = 0;
            return $this->tid;
		}

//-------------------------------------------------------------------------------------------------------

		public function next_table() {
            return $this->table = @$this->data['t'][$this->rowT++];
		}

//-------------------------------------------------------------------------------------------------------

		public function table() {
            return $this->table;
		}

//-------------------------------------------------------------------------------------------------------

		public function is_table($value='', $db='') {
            if(!$this->connect() || $value == '') return false;
            if($db != '') $this->select_db($db);
            return (@$this->pdo->query('SHOW COLUMNS FROM '.$value) ? true : false);
		}

//-------------------------------------------------------------------------------------------------------

		public function find_table($value='', $db='') {
            return $this->is_table($value, $db);
		}

//-------------------------------------------------------------------------------------------------------

        public function list_field($table='') {
			if($table == '' && is_string($this->table)) $table = $this->table;
            $this->fid= @$this->pdo->query('SHOW COLUMNS FROM '.$table);
			$this->data['l'] = $this->fid->fetchAll();
			$this->rowL = 0;
            return $this->tid;
		}

//-------------------------------------------------------------------------------------------------------

		public function next_field() {
			return $this->field = @$this->data['l'][$this->rowL++];
		}

//-------------------------------------------------------------------------------------------------------

		public function field() {
			return $this->field;
		}

//-------------------------------------------------------------------------------------------------------

		public function field_name() {
			return $this->field['Field'];
		}

//-------------------------------------------------------------------------------------------------------

		public function field_type() {
            $type = explode('(', $this->field['Type']);
            $type = $type[0];
            if($type == 'tinyint' || $type == 'int' || $type == 'smallint' || $type == 'mediumint' || $type == 'smallint') {
                $type = 'int';
            }
            else if($type == 'double' || $type == 'float' || $type == 'decimal' ) {
                $type = 'real';
            }
            else if($type == 'enum' || $type == 'varchar' || $type == 'char') {
                $type = 'string';
            }
            else if($type == 'blob' || $type == 'tinytext' || $type == 'mediumtext' || $type == 'longtext') {
                $type = 'blob';
            }
			return $type;
		}

//-------------------------------------------------------------------------------------------------------

		public function is_field($value='', $table='', $db='') {
            if(!$this->connect() || $value == '') {
				return false;
			}
            if($db != '') {
                $this->select_db($db);
            }
            if($table == '') {
                $table = $this->table;
            }
            if(!$this->is_table($table, $db)) {
				return $this->halt('No Table '.$table.'.');
            }
			$this->list_field($table);
            while($this->next_field()) {
                if($this->field_name() == $value) {
                    return true;
                }
            }
            return false;
		}

//-------------------------------------------------------------------------------------------------------

		public function find_field($table, $value='', $db='') {
            return $this->is_field($value, $table, $db);
		}

//-------------------------------------------------------------------------------------------------------

		private function sql_select($field,$table,$where="",$sub="") {
			$str = '';
			if(is_array($sub) === true) {
				foreach(array('group', 'having', 'order', 'limit') as $v)
					if(isset($sub[$v]) === true) $str .= ' '.strtoupper($v).($v == 'order' || $v == 'group' ? ' BY ' : ' ').$sub[$v];
				}
			else if($sub != '') {$str = ' ORDER BY '.$sub;}
			return $this->sql = "SELECT {$field} FROM {$table}".($where != "" ? " WHERE ".$where : "").$str;
		}

//-------------------------------------------------------------------------------------------------------

		public function select($field,$table,$where="",$sub="") {
            return $this->query($this->sql_select($field,$table,$where,$sub));
		}

//-------------------------------------------------------------------------------------------------------

		public function pre_sel($field,$table,$where='',$value=null,$sub='') {
			if($this->data_exec($value)) {
				$this->qid = @$this->pdo->prepare($this->sql_select($field,$table,$where,$sub));
				$result = $this->process($this->qid->execute($value['data']));
			}
			return $this->prepare($this->sql_select($field,$table,$where,$sub), $value);
		}

//-------------------------------------------------------------------------------------------------------

		private function sql_insert($table,$field,$value) {
			return $this->sql = "INSERT INTO {$table} ({$field}) VALUES ({$value})";
		}

//-------------------------------------------------------------------------------------------------------

		public function insert($table,$field,$value) {
			return $this->query($this->sql_insert($table,$field,$value));
		}

//-------------------------------------------------------------------------------------------------------

		public function pre_ins($table,$field,$value=null,$data=null) {
			if($this->data_exec($field)) {
				$this->qid = @$this->pdo->prepare($this->sql_insert($table,$field['field'],$field['values']));
				return $this->process($this->qid->execute($field['data']));
			}
			else return $this->prepare($this->sql_insert($table,$field,$value),$data);
		}

//-------------------------------------------------------------------------------------------------------

		private function sql_update($table,$value,$where) {
			return $this->sql = "UPDATE {$table} SET {$value}".($where!="" ? " WHERE ".$where : "");
		}

//-------------------------------------------------------------------------------------------------------

		public function update($table,$value,$where) {
			return $this->query($this->sql_update($table,$value,$where));
		}

//-------------------------------------------------------------------------------------------------------

		public function pre_upd($table,$value,$where,$data=null) {
			if($this->data_exec($where)) {
				$this->qid = @$this->pdo->prepare($this->sql_update($table,$where['update'],$value));
				return $this->process($this->qid->execute($where['data']));
			}
			else return $this->prepare($this->sql_update($table,$value,$where),$data);
		}

//-------------------------------------------------------------------------------------------------------

		private function sql_delete($table,$where) {
			return $this->sql = "DELETE FROM {$table} WHERE {$where}";
		}

//-------------------------------------------------------------------------------------------------------

		public function delete($table,$where) {
			return $this->query($this->sql_delete($table,$where));
		}

//-------------------------------------------------------------------------------------------------------

		public function pre_del($table,$where,$data=null) {
			if($this->data_exec($data)) {
				$this->qid = @$this->pdo->prepare($this->sql_delete($table,$where));
				return $this->process($this->qid->execute($data['data']));
			}
			return $this->prepare($this->sql_delete($table,$where),$data);
		}

//------------------------------------------------------------------------------------------------------

		private function data_exec($val) {
			return (isset($val['field']) && isset($val['values']) && isset($val['update']) && isset($val['data']) ? true : false);
		}

//-------------------------------------------------------------------------------------------------------

		public function insert_id() {
			return $this->pdo->lastInsertId();
		}

//-------------------------------------------------------------------------------------------------------

		public function begin() {
			$this->showTran = "SET AUTOCOMMIT=0;\n<br/>START TRANSACTION;\n<br/>";
			$this->query("SET AUTOCOMMIT=0");
			$this->query("START TRANSACTION");
			$this->transaction = true;
            $this->transerror = false;
		}

//-------------------------------------------------------------------------------------------------------

		public function commit() {
            if($this->transerror) {
                $this->rollback();
            }
            else {
                $this->query("COMMIT");
                $this->query("SET AUTOCOMMIT=1");
            }
            $this->transaction = false;
            $this->transerror = false;
            return !$this->transerror;
		}

//-------------------------------------------------------------------------------------------------------

		public function rollback() {
			$this->query("ROLLBACK");
            $this->query("SET AUTOCOMMIT=1");
		}

//-------------------------------------------------------------------------------------------------------

		public function show_sql() {
			$type = strtolower(substr($this->sql, 0, 6));
			if($type == 'select') {$pattern = array('/select /i', '/ from /i', '/ where /i'); $replacement = array("SELECT ", " <br>\nFROM ", " <br>\nWHERE ");}
			else if($type == 'insert') {$pattern = array('/insert /i', '/ values /i'); $replacement = array("INSERT ", " <br>\nVALUES ");}
			else if($type == 'update') {$pattern = array('/update /i', '/ set /i', '/ where /i'); $replacement = array("UPDATE ", " <br>\nSET ", " <br>\nWHERE ");}
			else if($type == 'delete') {$pattern = array('/delete /i', '/ where /i'); $replacement = array("DELETE ", " <br>\nWHERE ");}
			print '<p>'.($this->transaction === true ? "\n<br/>{$this->showTran}" : '').(isset($pattern) ? preg_replace($pattern, $replacement, $this->sql, 1) : $this->sql).';</p>';
			exit;
		}

//-------------------------------------------------------------------------------------------------------

		public function next_record() {
			if($this->qid === false) {
				$this->halt("No Data Request.");
				return false;
			}
			return $this->record = @$this->data['q'][$this->rowR++];
		}

//-------------------------------------------------------------------------------------------------------

        public function record() {
			return $this->record;
		}

//-------------------------------------------------------------------------------------------------------

        public function row($row=0) {
			$this->rowR = intval($row);
            if($row < 0) $this->rowR = 0;
			if($row > $this->num_rows()) $this->rowR = $this->num_rows() - 1;
            return $this->record = @$this->data['q'][$this->rowR];
		}

//-------------------------------------------------------------------------------------------------------

        public function v($field_name) {
			return $this->record[$field_name];
		}

//-------------------------------------------------------------------------------------------------------

		public function f($field_name) {
			return $this->stripslashes($this->record[$field_name]);
		}

//-------------------------------------------------------------------------------------------------------

		public function p($field_name) {
			print $this->stripslashes($this->record[$field_name]);
		}

//-------------------------------------------------------------------------------------------------------

		private function stripslashes($val) {
			return strtr($val, array('\\\\'=>'\\', '\\0'=>"\0", '\\n'=>"\n", '\\r'=>"\r", "\\'"=>"'", '\\"'=>'"', '\\Z'=>"\x1a"));
		}

//-------------------------------------------------------------------------------------------------------

		public function num_rows() {
			return ($this->qid ? @$this->qid->rowCount() : 0);
		}

//-------------------------------------------------------------------------------------------------------

		private function halt($msg) {
			$this->error = true;
			$errorInfo = @$this->pdo->errorInfo();
			$this->errno = $errorInfo[1];
			$this->errde = $errorInfo[2];
			if($this->transaction === true) $this->rollback();
			if($this->show_error === true) {
				$this->errde = preg_replace('/the.*right/', '', $this->errde);
				printf("</td></tr></table><b>Error:</b> %s\n<br/>",$msg);
				if($this->errno != '') printf("<b>".strtoupper($this->database)." Error </b>:%s (%s)\n<br/>",$this->errno,$this->errde);
				exit;
			}
			return false;
		}

//-------------------------------------------------------------------------------------------------------

		public function json($json = null, $length=true) {
            if($json == null && $this->num_rows() > 0) {
				$json = $this->data['q'];
                if($length == true) {
                    $len = dechex($this->num_rows());
				    echo 'DRL='.str_repeat('0', 6-strlen($len)).$len;
                }
            }
            if($json != null) {
				if(gettype($json) == 'string') {
					echo json_encode(array('0'=>$json));
				}
                else if(is_array($json) === true && count($json) > 50 && isset($_POST['percentProcess']) === true) {
                    $str = json_encode($json);
                    $len = strlen($str);
                    $file = fopen($_POST['percentProcess'], 'w');
                    $cut = ($len < 10000 ? 1: ($len < 100000 ? 10 : ($len < 250000 ? 25 : ($len < 500000 ? 50 : ($len < 1000000 ? 75 : 100)))));
                    $percent = 100 / $cut;
                    $len = intval($len / $cut) +1;
                    for($i = 0; $i < $cut;) {
                        echo substr($str, $i * $len, $len);
                        fseek($file, 0);
                        fwrite($file, (++$i * $percent)."\n");
                    }
                    fclose($file);
                    unlink($_POST['percentProcess']);
                }
                else {
                    echo json_encode($json);
                }
            }
			if($this->transaction) {
                $this->commit();
            }
        }
    }
?>
