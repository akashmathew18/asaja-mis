<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
    'firm_code',
    'entry_date',
    'team_name',
    'entry_type',
    'amount',
    'created_by'
];

foreach ($required as $f) {
    if (!isset($data[$f])) {
        echo json_encode(["success" => false, "message" => "Missing field: $f"]);
        exit;
    }
}

/* ENUM VALIDATION */
$allowedTypes = ['ADVANCE', 'PAYMENT'];
if (!in_array($data['entry_type'], $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid entry type"]);
    exit;
}

/* OPTIONAL FIELD */
$remarks = $data['remarks'] ?? null;

$stmt = $conn->prepare("
 INSERT INTO pmu_team_ledger (
  firm_code,
  entry_date,
  team_name,
  entry_type,
  amount,
  remarks,
  created_by
 )
 VALUES (?,?,?,?,?,?,?)
");

$stmt->bind_param(
    "ssssdss",
    $data['firm_code'],
    $data['entry_date'],
    $data['team_name'],
    $data['entry_type'],
    $data['amount'],
    $remarks,
    $data['created_by']
);

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