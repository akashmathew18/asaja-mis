<?php
require_once "../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT id, userid, username, full_name, password, role, status
    FROM users
    WHERE username = ?
    LIMIT 1
");

$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid username"]);
    exit;
}

$user = $result->fetch_assoc();

if ($user['status'] !== 'Active') {
    echo json_encode(["success" => false, "message" => "User inactive"]);
    exit;
}

if (!password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $user['id'],
        "userid" => $user['userid'],
        "username" => $user['username'],
        "full_name" => $user['full_name'],
        "role" => $user['role']
    ]
]);
