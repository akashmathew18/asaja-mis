<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  SELECT
    work_date,
    team_name,
    basis,
    cot_count,
    rate_per_cot,
    daily_count,
    rate_per_day,
    total_amount,
    paid,
    remarks
  FROM pmu_labour_cost
  WHERE firm_code = ?
  ORDER BY work_date DESC
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;

echo json_encode(["success" => true, "data" => $rows]);
