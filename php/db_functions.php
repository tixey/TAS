<?php

//Checking that exectution of stored procedure is allowed -->
function SpCheck($SP, $URL){
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if ($conn->connect_error) {
		ErrorReplyAndDie(500, 'Connection failed: '. $conn->connect_error);
	}
	
	$SP  = mysqli_real_escape_string($conn, $SP);
	$URL = mysqli_real_escape_string($conn, $URL);

  	$sql='CALL SP_CHECK (\''.$SP.'\',\''.$URL.'\');';
 
    $result  = $conn->query($sql);
  	$sp_name = '';
  	$auth    = 0;
  	if ($result) {
  		//$r = $result->fetch_array(MYSQLI_NUM);
		$r = $result->fetch_array(MYSQLI_ASSOC);
    	$sp_name = $r['SP_NAME'];
    	$auth    = $r['AU'];
	}
	
	$conn->close();
 
	return array($sp_name, $auth);
  
}
//Checking that exectution of stored procedure is allowed <--
function ExecuteUploadSp($SP_NAME, $AU, $UID, $URL){
	
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	$conn->set_charset("utf8");
	
	if ($conn->connect_error) {
		ErrorReplyAndDie(500, 'Connection failed: '. $conn->connect_error);
	}

	$PARAMS = prepareSpParams($conn, $AU, $UID, 'U', $URL, 1);

	$sql='CALL '.$SP_NAME.' ('.$PARAMS . ');';
    
  	$result  = $conn->query($sql);
	if (!$result) {
		ErrorReplyAndDie(200, 'Empty response for request:  '. $sql);
	
	}
	$r = $result->fetch_array(MYSQLI_ASSOC);
    $fileId = $r['ID'];
	return copyUploadedFile($fileId);

}

function copyUploadedFile($FILE_ID){
	$uploadfile = "../FILES/" . $FILE_ID .'.'. pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

	if(move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile))
	{
	   return "[{\"RESULT\": 200, \"MESSAGE\": \"File '".$_FILES['file']['name']."' was uploaded with ID: ". $FILE_ID."\", \"ID\": ". $FILE_ID."}]";
	}
	
	ErrorReplyAndDie(200, 'Unable to copy file:  '. $_FILES['file']['name']. ' to '. $uploadfile );
}
function GetFileName($SP_NAME, $AU, $UID, $URL, $ID){
	
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	$conn->set_charset("utf8");
	
	if ($conn->connect_error) {
		ErrorReplyAndDie(500, 'Connection failed: '. $conn->connect_error);
	}

	$sql='CALL '.$SP_NAME.' ('.$ID;
	if($AU != 0){
		$sql .=',\''.$UID.'\'';
	}
	
	$sql .= ',\''.mysqli_real_escape_string($conn,$URL).'\');';
    
  	$result  = $conn->query($sql);
	if (!$result) {
		ErrorReplyAndDie(200, 'Empty response for request:  '. $sql);
	}
	
	$r = $result->fetch_array(MYSQLI_ASSOC);
	/*echo json_last_error_msg();*/
	return array($r['FILE_NAME'],$r['CONTENT_TYPE'], $r['ID']);
}
function ExecuteSp($SP_NAME, $AU, $UID, $URL){
	
	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	$conn->set_charset("utf8");
	
	if ($conn->connect_error) {
		ErrorReplyAndDie(500, 'Connection failed: '. $conn->connect_error);
	}

	$PARAMS = prepareSpParams($conn, $AU, $UID, $SP_NAME, $URL, 0);

	$sql='CALL '.$SP_NAME.' ('.$PARAMS.');';
    
  	$result  = $conn->query($sql);
	if (!$result) {
		ErrorReplyAndDie(200, 'Empty response for request:  '. $sql);
	}
	
	
	/*echo json_last_error_msg();*/
	return json_encode(cast_query_results($result, $SP_NAME), JSON_UNESCAPED_UNICODE);
}

function prepareSpParams($conn, $AU, $UID, $SP_NAME, $URL, $HAS_FILE){
	
	$PARAMS ='';
	foreach ($_POST as $key => $val) {
		if($val == 'File_Name') continue;
		if($PARAMS != ""){
			$PARAMS  .= ',';
		}
		if($val == null){
			$PARAMS  .= 'null';
			continue;
		}
		
		if( $SP_NAME == 'SP_001_LOGIN' && $key=='pHash'){
			$PARAMS  .= '\'' . mysqli_real_escape_string($conn, getSaltedHash($val, $_POST['pUserName'])) . '\'';
			continue;
		}
    	$PARAMS  .= '\'' . mysqli_real_escape_string($conn, $val) . '\'';
	}
	if($HAS_FILE == 1){
		$PARAMS .=',\''.mysqli_real_escape_string($conn, $_FILES['file']['name']).'\'';
		$PARAMS .=',\''.mysqli_real_escape_string($conn, $_FILES['file']['type']).'\'';
		$PARAMS .=',\''.mysqli_real_escape_string($conn, $_FILES['file']['size']).'\'';
	}
	if($AU != 0){
		$PARAMS .=',\''.$UID.'\'';
	}
	
	return $PARAMS.',\''.mysqli_real_escape_string($conn,$URL).'\'';
}
function cast_query_results($result, $SP_NAME)
{
    $data = array();
    $fields = $result->fetch_fields();
    while ($row = $result->fetch_assoc()) {
    	foreach ($fields as $field) {
        	$fieldName = $field->name;
        	$fieldValue = $row[$fieldName];
		
        	if (!is_null($fieldValue)){
        		/*
        	    1=>'tinyint',
			    2=>'smallint',
			    3=>'int',
			    4=>'float',
			    5=>'double',
			    7=>'timestamp',
			    8=>'bigint',
			    9=>'mediumint',
			    10=>'date',
			    11=>'time',
			    12=>'datetime',
			    13=>'year',
			    16=>'bit',
			    //252 is currently mapped to all text and blob types (MySQL 5.0.51a)
			    253=>'varchar',
			    254=>'char',
			    246=>'decimal'
			*/
				switch ($field->type) {
				case 3:
					$row[$fieldName] = (int)$fieldValue;
					break;
				case 8:
					$row[$fieldName] = (int)$fieldValue;
					break;
				case 4:
					$row[$fieldName] = (float)$fieldValue;
					break;
				// Add other type conversions as desired.
				// Strings are already strings, so don't need to be touched.
				}
			} 
      
		}
      	array_push($data, $row);
    }

	if($SP_NAME == 'SP_001_LOGIN' && $data[0]['RESULT'] == '200'){
		createNewSession($data[0]['USER_ID'], $data[0]['USER_NAME']);
	}

    return $data;
}
function getSaltedHash($pHash, $pUserName){
	$c = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if ($c->connect_error) {
		ErrorReplyAndDie(500, 'Connection failed: '. $c->connect_error);
	}

  	$sql='CALL SP_GET_SALT (\''.mysqli_real_escape_string($c, $pUserName).'\');';
    $result  = $c->query($sql);
  	$salt = '';
  	if ($result) {
		$r = $result->fetch_array(MYSQLI_ASSOC);
    	$salt = $r['SALT']; 
	}
	$c->close();
	return md5($pHash.'+'.$salt);
}
function ErrorReplyAndDie($REPLY, $MESSAGE){
	header('Content-Type: application/json');
	echo '[{"REPLY":' . $REPLY . ',"MESSAGE":"'.$MESSAGE.'"}]';
	die('');
}
?>