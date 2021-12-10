<?
	header('Content-Type: application/json');
    session_start();
    if(isset($_SESSION["USER_ID"]) && $_POST["userid"]==$_SESSION["USER_ID"]){
        echo '{"SESSION_ALIVE":true}';
    }else{
    	echo '{"SESSION_ALIVE":false}';
    }
?>