<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* TOTALS */
$sql = "
SELECT
  (SELECT IFNULL(SUM(total_expense),0) FROM pmu_wood_expense WHERE firm_code=?) +
  (SELECT IFNULL(SUM(total_expense),0) FROM pmu_plywood_purchase WHERE firm_code=?) +
  (SELECT IFNULL(SUM(total_amount),0) FROM pmu_labour_cost WHERE firm_code=?) +
  (SELECT IFNULL(SUM(total_expense),0) FROM pmu_accessories_purchase WHERE firm_code=?) +
  (SELECT IFNULL(SUM(amount),0) FROM pmu_other_expense WHERE firm_code=?) AS grand_total
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss",
  $data['firm_code'],
  $data['firm_code'],
  $data['firm_code'],
  $data['firm_code'],
  $data['firm_code']
);

$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

echo json_encode(["success" => true, "data" => $res]);
