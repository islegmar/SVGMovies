<?php
$data=$_POST["image"];
$ind=$_POST["ind"];
$file='/tmp/sequence/img' . $ind . '.png';
//file_put_contents($file, base64_decode(substr($data, strpos($data, ",")+1))); 
file_put_contents($file, $data); 
?>