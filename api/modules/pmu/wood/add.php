<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

// ---------- VALIDATION ----------
$required = [
  'firm_code',
  'expense_date',
  'wood_type',
  'cubic',
  'rate_per_cubic',
  'cutting_expense',
  'planing_expense',
  'transportation_expense',
  'team_name',
  'total_expense',
  'created_by',

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
  INSERT INTO pmu_wood_expense
  (
    firm_code,
    expense_date,
    wood_type,
    cubic,
    rate_per_cubic,
    cutting_expense,
    planing_expense,
    transportation_expense,
    team_name,
    total_expense,
    remarks,
    created_by
   
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
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
  "sssddddssdss",
  $data['firm_code'],        // s
  $data['expense_date'],    // s
  $data['wood_type'],              // s
  $data['cubic'],                  // d
  $data['rate_per_cubic'],         // d
  $data['cutting_expense'],        // d
  $data['planing_expense'],        // d
  $data['transportation_expense'], // d
  $data['team_name'],              // s
  $data['total_expense'],          // d
  $data['remarks'],                // s
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
?>