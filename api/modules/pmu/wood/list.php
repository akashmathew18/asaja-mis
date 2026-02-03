<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);
$firm_code = $data['firm_code'] ?? '';

if (!$firm_code) {
  echo json_encode([
    "success" => false,
    "message" => "firm_code missing"
  ]);
  exit;
}

$sql = "
  SELECT *
  FROM pmu_wood_expense
  WHERE firm_code = ?
  ORDER BY expense_date DESC, id DESC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
  echo json_encode([
    "success" => false,
    "message" => "Prepare failed",
    "error" => $conn->error
  ]);
  exit;
}

$stmt->bind_param("s", $firm_code);
$stmt->execute();

$result = $stmt->get_result();
$rows = [];

while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}

echo json_encode([
  "success" => true,
  "data" => $rows
]);
