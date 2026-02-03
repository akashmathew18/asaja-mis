<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

// ---------- VALIDATION ----------
$required = [
  'firm_code',
  'purchase_date',
  'square_feet',
  'rate_per_sqft',
  'sqft_amount',
  'transportation',
  'total_expense',
  'paid',
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

// ---------- SQL ----------
$sql = "
 INSERT INTO pmu_plywood_purchase
(
  firm_code,
  purchase_date,
  square_feet,
  rate_per_sqft,
  sqft_amount,
  transportation,
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

// ---------- BIND ----------
$stmt->bind_param(
  "ssdddddsss",
  $data['firm_code'],        // s
  $data['purchase_date'],   // s
  $data['square_feet'],            // d
  $data['rate_per_sqft'],          // d
  $data['sqft_amount'],            // d
  $data['transportation'],         // d          
  $data['total_expense'],          // d
  $data['paid'],                   // s
  $data['remarks'],                 // s
  $data['created_by'],             // s

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
