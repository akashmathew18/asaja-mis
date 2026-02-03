<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
  'firm_code',
  'expense_date',
  'expense_title',
  'amount',
  'created_by'
];

foreach ($required as $f) {
  if (!isset($data[$f])) {
    echo json_encode(["success" => false, "message" => "Missing field: $f"]);
    exit;
  }
}

$sql = "
INSERT INTO pmu_other_expense
(firm_code, expense_date, expense_title, amount, remarks, created_by)
VALUES (?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
  echo json_encode(["success" => false, "error" => $conn->error]);
  exit;
}

$stmt->bind_param(
  "sssdss",
  $data['firm_code'],
  $data['expense_date'],
  $data['expense_title'],
  $data['amount'],
  $data['remarks'],
  $data['created_by']
);

echo json_encode(
  $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
