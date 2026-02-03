<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("DELETE FROM pmu_labour_cost WHERE id=?");
$stmt->bind_param("i", $data['id']);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false]
);
