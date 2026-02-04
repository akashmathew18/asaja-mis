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
  'created_by'
];

foreach ($required as $f) {
  if (empty($data[$f])) {
    echo json_encode(["success" => false, "message" => "Missing field: $f"]);
    exit;
  }
}

/* ---------------- ENUM VALIDATION ---------------- */
if (!in_array($data['basis'], ['COT', 'Daily'])) {
  echo json_encode(["success" => false, "message" => "Invalid basis"]);
  exit;
}

/* ---------------- AUTO TRANSACTION ID (LCxxxx) ---------------- */
$prefix = "LC";

$res = $conn->query("
  SELECT transaction_id 
  FROM pmu_labour_cost 
  WHERE transaction_id IS NOT NULL
  ORDER BY id DESC 
  LIMIT 1
");

$lastNo = 0;
if ($row = $res->fetch_assoc()) {
  $lastNo = (int) substr($row['transaction_id'], 2);
}

$transactionId = $prefix . str_pad($lastNo + 1, 2, "0", STR_PAD_LEFT);

/* ---------------- CONDITIONAL FIELDS ---------------- */
$cotCount = $ratePerCot = $labourCount = $ratePerLabour = null;

if ($data['basis'] === 'COT') {
  $cotCount = $data['cot_count'] ?? null;
  $ratePerCot = $data['rate_per_cot'] ?? null;
} else {
  $labourCount = $data['labour_count'] ?? null;
  $ratePerLabour = $data['rate_per_labour'] ?? null;
}

$remarks = $data['remarks'] ?? null;

/* ---------------- INSERT ---------------- */
$stmt = $conn->prepare("
  INSERT INTO pmu_labour_cost (
    transaction_id,
    firm_code,
    work_date,
    team_name,
    basis,
    cot_count,
    rate_per_cot,
    labour_count,
    rate_per_labour,
    total_amount,
    remarks,
    created_by
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
");

$stmt->bind_param(
  "sssssididdss",
  $transactionId,
  $data['firm_code'],
  $data['work_date'],
  $data['team_name'],
  $data['basis'],
  $cotCount,
  $ratePerCot,
  $labourCount,
  $ratePerLabour,
  $data['total_amount'],
  $remarks,
  $data['created_by']
);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "transaction_id" => $transactionId
  ]);
} else {
  echo json_encode([
    "success" => false,
    "error" => $stmt->error
  ]);
}
