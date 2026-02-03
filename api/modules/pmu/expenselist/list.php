<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  SELECT list_code, name
  FROM pmu_expense_title_master
  WHERE firm_code = ?
    AND status = 'Active'
  ORDER BY name
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;

echo json_encode([
  "success" => true,
  "data" => $rows
]);
