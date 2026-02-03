<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* ---------------- REQUIRED FIELDS ---------------- */
$required = [
  'firm_code',
  'work_date',
  'team_name',
  'basis',
  'total_amount',
  'paid',
  'created_by'
];

foreach ($required as $f) {
  if (!isset($data[$f])) {
    echo json_encode(["success" => false, "message" => "Missing field: $f"]);
    exit;
  }
}

/* ---------------- ENUM VALIDATION ---------------- */
if (!in_array($data['basis'], ['COT', 'Daily'])) {
  echo json_encode(["success" => false, "message" => "Invalid basis"]);
  exit;
}

if (!in_array($data['paid'], ['Yes', 'No'])) {
  echo json_encode(["success" => false, "message" => "Invalid paid value"]);
  exit;
}

/* ---------------- CONDITIONAL FIELDS ---------------- */
$cotCount = $ratePerCot = $dailyCount = $ratePerDay = null;

if ($data['basis'] === 'COT') {
  $cotCount = $data['cot_count'];
  $ratePerCot = $data['rate_per_cot'];
} else {
  $dailyCount = $data['daily_count'];
  $ratePerDay = $data['rate_per_day'];
}

/* ---------------- INSERT ---------------- */
$stmt = $conn->prepare("
INSERT INTO pmu_labour_cost (
 firm_code, work_date, team_name, basis,
 cot_count, rate_per_cot,
 daily_count, rate_per_day,
 total_amount, paid, remarks, created_by
)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
");

$stmt->bind_param(
  "ssssiddidsss",
  $data['firm_code'],
  $data['work_date'],
  $data['team_name'],
  $data['basis'],
  $cotCount,
  $ratePerCot,
  $dailyCount,
  $ratePerDay,
  $data['total_amount'],
  $data['paid'],
  $data['remarks'],
  $data['created_by']
);

echo json_encode(
  $stmt->execute()
  ? ["success" => true]
  : ["success" => false, "error" => $stmt->error]
);
