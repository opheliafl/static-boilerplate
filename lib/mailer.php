<?php
// fill in recipient below
	$recipient = "address@email.io";
// expects 'sender', 'reply', 'subject', 'message' as POST data
	$sender = $_POST["sender"];
	$senderEmail = $_POST["reply"];
	$subject = $_POST["subject"];
	$message = $_POST["message"];
	$mailBody = "Name: $sender\nEmail: $senderEmail\n\n$message";

	mail($recipient, $subject, $mailBody, "From: $sender <$senderEmail>");
