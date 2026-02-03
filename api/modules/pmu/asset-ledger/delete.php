<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['asset_id']) || empty($data['firm_code'])) {
    echo json_encode(["success" => false, "message" => "Missing id"]);
    exit;
}

$sql = "DELETE FROM pmu_asset_ledger WHERE asset_id = ? AND firm_code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $data['asset_id'], $data['firm_code']);

echo json_encode(
    $stmt->execute() ? ["success" => true] : ["success" => false]
);
