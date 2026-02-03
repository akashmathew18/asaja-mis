<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$conn = new mysqli("localhost", "root", "", "asaja_mis1");
$conn->set_charset("utf8mb4");

$username = readline("Username: ");
$userid = readline("UserID: ");
$fullname = readline("Full Name: ");
$password = readline("Password: ");
$role = readline("Role (Admin/User): ");

$hash = password_hash($password, PASSWORD_BCRYPT);

// normalize role to match ENUM exactly
$role = ucfirst(strtolower($role)); // Admin / User

$sql = "
INSERT INTO users (userid, username, full_name, password, role, status)
VALUES (?, ?, ?, ?, ?, 'Active')
";

$stmt = $conn->prepare($sql); // THIS is failing

$stmt->bind_param(
    "sssss",
    $userid,
    $username,
    $fullname,
    $hash,
    $role
);

$stmt->execute();

echo "User created successfully\n";
