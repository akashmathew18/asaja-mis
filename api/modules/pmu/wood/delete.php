<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$sql = "DELETE FROM pmu_wood_expense WHERE id=? AND firm_code=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $data['id'], $data['firm_code']);
$stmt->execute();

echo json_encode(["success" => true]);
