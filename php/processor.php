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
	
	if (preg_match('/(SP=){1}[0-9]{3,5}/', $REQUEST, $match)==0) {
		ErrorReplyAndDie(400, $MESSAGE . 'SP parameter is missing; REQUEST = '.$REQUEST.'');
	}
	$SP = str_replace('SP=','',$match[0]);

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
		
	$RESPONSE = ExecuteSp($SP_NAME, $AU, $UID, $URL);
	header('Content-Type: application/json');
	echo $RESPONSE;
	

 ?>