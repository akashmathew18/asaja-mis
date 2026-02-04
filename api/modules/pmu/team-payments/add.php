<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* ---------------- REQUIRED FIELDS ---------------- */
$required = [
    'firm_code',
    'entry_date',
    'team_name',
    'entry_type',
    'amount',
    'created_by'
];

foreach ($required as $f) {
    if (empty($data[$f])) {
        echo json_encode(["success" => false, "message" => "Missing field: $f"]);
        exit;
    }
}

/* ---------------- ENUM VALIDATION ---------------- */
if (!in_array($data['entry_type'], ['ADVANCE', 'PAYMENT'])) {
    echo json_encode(["success" => false, "message" => "Invalid entry type"]);
    exit;
}

/* ---------------- AUTO TRANSACTION ID (TPxxxx) ---------------- */
$prefix = "TP";

$res = $conn->query("
  SELECT transaction_id 
  FROM pmu_team_payments 
  WHERE transaction_id IS NOT NULL
  ORDER BY id DESC 
  LIMIT 1
");

$lastNo = 0;
if ($row = $res->fetch_assoc()) {
    $lastNo = (int) substr($row['transaction_id'], 2);
}

$transactionId = $prefix . str_pad($lastNo + 1, 2, "0", STR_PAD_LEFT);

$remarks = $data['remarks'] ?? null;

/* ---------------- INSERT ---------------- */
$stmt = $conn->prepare("
  INSERT INTO pmu_team_payments (
    transaction_id,
    firm_code,
    entry_date,
    team_name,
    entry_type,
    amount,
    remarks,
    created_by
  ) VALUES (?,?,?,?,?,?,?,?)
");

$stmt->bind_param(
    "sssssdss",
    $transactionId,
    $data['firm_code'],
    $data['entry_date'],
    $data['team_name'],
    $data['entry_type'],
    $data['amount'],
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
