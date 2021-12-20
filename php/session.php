<?php

$Auth = false;
$UID = 0;
$UNAME = '';


session_start();
if(isset($_SESSION["USER_ID"])){
    $UID = $_SESSION["USER_ID"];
    $UNAME = $_SESSION["USER_NAME"];
    $Auth = true;
}

function createNewSession($UID, $UNAME){
    if (  session_id() ) {
        session_destroy();
    }
    session_start();
    $_SESSION["USER_ID"]   = $UID;
	$_SESSION["USER_NAME"] = $UNAME;
}




?>