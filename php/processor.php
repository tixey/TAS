<?php
	require( 'config.php' );
	require( 'db_functions.php' );
	header('Content-Type: application/json');

    $UID = 0;
    
    session_start();
    if(isset($_SESSION["USER_ID"])){
        $UID = $_SESSION["USER_ID"];
    }
// ?URL=&SP=001&PAR=1,2,3,5,6
$PARAMETERS_PRESENT = true;
$REPLY = '';
$REQUEST = $_SERVER['QUERY_STRING'];

$URL = '';
$SP  = '';
$PAR = '';

if (preg_match('/(URL=){1}.+(&SP){1}/', $REQUEST, $match)) {
	$URL = str_replace('URL=','',$match[0]);
	$URL = str_replace('&SP','',$URL);
} else {
    $PARAMETERS_PRESENT = false;
    $REPLY .= ' Parameter URL is not passed!';
}
if (preg_match('/(SP=){1}.+(&){1}/', $REQUEST, $match)) {
	$SP = str_replace('SP=','',$match[0]);
	$SP = str_replace('&','',$SP);	
} else {
    $PARAMETERS_PRESENT = false;
    $REPLY .= ' Parameter SP is not passed!';
}
if (preg_match('/(PAR=){1}.+/', $REQUEST, $match)) {
	$PAR = str_replace('PAR=','',$match[0]);
} else {
    $PARAMETERS_PRESENT = false;
    $REPLY .= ' Parameter PAR is not passed!';
}

if($PARAMETERS_PRESENT){
		
		$SP_NAME = SP_check($SP,$URL);
		if($SP_NAME != 'NOT_ALLOWED'){
			if($SP_NAME[1]=='1'){$SP_NAME[1]=$UID;}else{$SP_NAME[1]='';}
			if($PAR == "POST"){
				//POST -->
				execute_sp_post_update($SP_NAME);
				//POST <--
			}else{
				//GET -->
				execute_sp_with_json_output($SP_NAME,$PAR);
				//GET <--
			}
		}else{
			echo '[{"REPLY":"ERROR","MESSAGE":"Execution of stored procedure with code '.$SP.' from URL '.$URL.' is not allowed!"}]';
		}
		
	
}else{
	echo '[{"REPLY":"ERROR","MESSAGE":"Missing required parameters. '.$REPLY.' REQUEST: '.$REQUEST.'"}]';
}


/*
$sth = mysqli_query("SELECT ...");
$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
    $rows[] = $r;
}
print json_encode($rows);
*/


?>