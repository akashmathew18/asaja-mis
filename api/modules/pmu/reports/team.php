<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  SELECT
    entry_date,
    team_name,
    entry_type,
    amount,
    remarks
  FROM pmu_team_payments
  WHERE firm_code = ?
  ORDER BY entry_date DESC
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;

echo json_encode(["success" => true, "data" => $rows]);
