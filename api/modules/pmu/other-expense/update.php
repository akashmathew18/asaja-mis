<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
  'id',
  'firm_code',
  'expense_date',
  'expense_title',
  'amount'
];

foreach ($required as $f) {
  if (!isset($data[$f])) {
    echo json_encode(["success" => false, "message" => "Missing field: $f"]);
    exit;
  }
}

$sql = "
UPDATE pmu_other_expense SET
  expense_date = ?,
  expense_title = ?,
  amount = ?,
  remarks = ?
WHERE id = ? AND firm_code = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
  echo json_encode(["success" => false, "error" => $conn->error]);
  exit;
}

$stmt->bind_param(
  "ssdsss",
  $data['expense_date'],
  $data['expense_title'],
  $data['amount'],
  $data['remarks'],
  $data['id'],
  $data['firm_code']
);

echo json_encode(
  $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
