<?php
	/* debug */
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	
	require( 'config.php' );
	require( 'db_functions.php' );
	require( 'session.php' );
	
	

  	// ?SP=001
	
	$MESSAGE = '';
	$REQUEST = $_SERVER['QUERY_STRING'];

	$URL = '';
	
	if (preg_match('/(SP=){1}[DU0-9]{3,5}/', $REQUEST, $match)==0) {
		ErrorReplyAndDie(400, $MESSAGE . 'SP parameter is missing; REQUEST = '.$REQUEST.'');
	}
	$SP = str_replace('SP=','',$match[0]);
	if($Auth == false && $SP != '001'){
		ErrorReplyAndDie(500, 'Authentication Required');
	}

	$URL = '';
	if( array_key_exists('HTTP_REFERER', $_SERVER) && preg_match('/[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/', $_SERVER['HTTP_REFERER'], $match) != 0 ){
		$URL = $match[0];
	}
	
	$SPR = SpCheck($SP,$URL);
	
	
	if ($SPR == 0){
		ErrorReplyAndDie(400, 'No stored procedure with code '.$SP.' allowed from url '.$URL);
	}
	
	$SP_NAME = $SPR[0];
	$AU = $SPR[1];
	$RESPONSE = '';
	if(strpos($SP, 'D') !== false){
		if (preg_match('/(&ID=){1}[0-9]{1,7}/', $REQUEST, $matchID)==0) {
			ErrorReplyAndDie(400, $MESSAGE . 'file ID parameter is missing; REQUEST = '.$REQUEST.'');
		}
		$ID = str_replace('&ID=','',$matchID[0]);
		
		$R = GetFileName($SP_NAME, $AU, $UID, $URL, $ID);
		$FILE_NAME = $R[0];
		$CONTENT_TYPE = $R[1];
		$FILE_ID = $R[2];
		$filePath = "../FILES/" . $FILE_ID .'.'. pathinfo($FILE_NAME, PATHINFO_EXTENSION);
		if (file_exists($filePath)) {
			header('Content-Type: '.$CONTENT_TYPE);
			header("Cache-Control: no-store, no-cache");
			header('Content-Disposition: inline; filename="'.$FILE_NAME.'"');
			header('Content-Length: ' . filesize($filePath));
			readfile($filePath);
			exit;
		}
		ErrorReplyAndDie(400, 'File '.$FILE_NAME. ' was not found!');
	}
	if(strpos($SP, 'U') !== false ){
		$RESPONSE = ExecuteUploadSp($SP_NAME, $AU, $UID, $URL);
	}else{
		$RESPONSE = ExecuteSp($SP_NAME, $AU, $UID, $URL);
	}
	
	header('Content-Type: application/json');
	echo $RESPONSE;
	

 ?>