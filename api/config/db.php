<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "asaja_mis1";   // database name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "DB Connection Failed"
    ]));
}
?>