<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id']) || empty($data['firm_code'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing id or firm_code"
    ]);
    exit;
}

$sql = "DELETE FROM pmu_accessories_purchase WHERE id=? AND firm_code=?";
$stmt = $conn->prepare($sql);

$stmt->bind_param("is", $data['id'], $data['firm_code']);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Delete failed",
        "error" => $stmt->error
    ]);
}
