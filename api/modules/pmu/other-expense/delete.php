<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['firm_code'])) {
    echo json_encode(["success" => false, "message" => "Missing id or firm_code"]);
    exit;
}

$sql = "DELETE FROM pmu_other_expense WHERE id = ? AND firm_code = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit;
}

$stmt->bind_param("is", $data['id'], $data['firm_code']);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
