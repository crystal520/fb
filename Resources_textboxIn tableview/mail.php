<?php

ini_set('display_errors', 1);
header('Access-Control-Allow-Origin:*');
header('Content-type: application/json');

if( isset($_REQUEST['to']) && isset($_REQUEST['from']) && isset($_REQUEST['msg']) )
{
	if( ( $_REQUEST['to'] != null && $_REQUEST['to'] != "" ) && ( $_REQUEST['from'] != null && $_REQUEST['from'] != "" ) && ( $_REQUEST['msg'] != null && $_REQUEST['msg'] != "" ) )
	{
		
		$response = sendMail_credentials( $_REQUEST['to'] , $_REQUEST['from'] , $_REQUEST['sub'], $_REQUEST['msg'] );
	}
	else 
	{	
		$response = array ( 'result' => 'false' , 'error' => 'Null or improper data');	
	}
}
else 
{	
	$response = array ( 'result' => 'false' , 'error' => 'Null or improper data');	
}

echo json_encode($response);


function sendMail_credentials( $to , $from , $sub , $msg )
{
	$subject = $sub;
	$message = $msg;
	$from = $from;
	
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
	$headers .= "From:" . $from. "\r\n" . 'Reply-To: '.$to;

	$out = mail($to,$subject,$message,$headers);
	
	if($out)
	{
		$response = array ( 'result' => 'true' , 'msg' => 'Mail send');	
	}
	else 
	{
		$response = array ( 'result' => 'false' , 'msg' => 'Mail not send by server');		
	}
	
	return $response;
}


?>