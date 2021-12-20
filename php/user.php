<?php
	header('Content-Type: application/json');
    echo $_SERVER['QUERY_STRING'];
    if($_SERVER['QUERY_STRING'] == 'terminateSession' )
    {
        session_start();
    	if(isset($_SESSION["USER_ID"])){
    		unset($_SESSION["USER_ID"]);
    	}
    	if(isset($_SESSION["USER_NAME"])){
    		unset($_SESSION["USER_NAME"]);
    	}
        session_destroy();
        die('');
    }
    session_start();
    if(isset($_SESSION["USER_ID"])){
        echo '{"UserId": '.$_SESSION["USER_ID"].',"UserName":"'. $_SESSION["USER_NAME"].'", "Auth": true}';
    }else{
        echo '{"UserId": null,"UserName":null, "Auth": false}';
    }
?>