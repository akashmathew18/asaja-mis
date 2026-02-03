<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
  SELECT
    purchase_date,
    accessory_name,
    amount,
    transportation,
    other_expense,
    total_expense,
    paid,
    remarks
  FROM pmu_accessories_purchase
  WHERE firm_code = ?
  ORDER BY purchase_date DESC
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc())
    $rows[] = $r;

echo json_encode(["success" => true, "data" => $rows]);
