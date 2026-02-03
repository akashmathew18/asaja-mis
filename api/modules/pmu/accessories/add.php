<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
  'firm_code',
  'purchase_date',
  'accessory_name',
  'amount',
  'transportation',
  'other_expense',
  'total_expense',
  'paid',
  'remarks',
  'created_by'

];

foreach ($required as $field) {
  if (!isset($data[$field])) {
    echo json_encode([
      "success" => false,
      "message" => "Missing field: $field"
    ]);
    exit;
  }
}

$sql = "
INSERT INTO pmu_accessories_purchase
(firm_code, 
purchase_date, 
accessory_name, 
amount, 
transportation, 
other_expense,
total_expense, 
paid, 
remarks,
created_by
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

$stmt->bind_param(
  "sssddddsss",
  $data['firm_code'],
  $data['purchase_date'],
  $data['accessory_name'],
  $data['amount'],
  $data['transportation'],
  $data['other_expense'],
  $data['total_expense'],
  $data['paid'],
  $data['remarks'],
  $data['created_by']

);

// ---------- EXECUTE ----------
if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Execute failed",
    "error" => $stmt->error
  ]);
}

?>