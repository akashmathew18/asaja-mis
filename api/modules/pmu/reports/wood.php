<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  SELECT
    expense_date,
    wood_type,
    cubic,
    rate_per_cubic,
    cutting_expense,
    planing_expense,
    transportation_expense,
    total_expense,
    team_name,
    remarks
  FROM pmu_wood_expense
  WHERE firm_code = ?
  ORDER BY expense_date DESC
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;

echo json_encode(["success" => true, "data" => $rows]);
