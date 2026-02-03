<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
DELETE FROM pmu_plywood_purchase
WHERE id=? AND firm_code=?
");

$stmt->bind_param("is", $data['id'], $data['firm_code']);
$stmt->execute();

echo json_encode(["success" => true]);
