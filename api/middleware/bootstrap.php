<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// DB
require_once __DIR__ . "/../config/db.php";

// Later:
// require_once "auth_check.php";
// require_once "firm_access.php";
?>