<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);
$firm_code = $data['firm_code'] ?? '';

if (!$firm_code) {
  echo json_encode(["success" => false, "message" => "firm_code missing"]);
  exit;
}

$sql = "
SELECT *
FROM pmu_other_expense
WHERE firm_code = ?
ORDER BY expense_date DESC, id DESC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
  echo json_encode(["success" => false, "error" => $conn->error]);
  exit;
}

$stmt->bind_param("s", $firm_code);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];

while ($r = $res->fetch_assoc()) {
  $rows[] = $r;
}

echo json_encode(["success" => true, "data" => $rows]);
