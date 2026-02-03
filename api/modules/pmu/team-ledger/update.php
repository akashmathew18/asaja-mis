<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
    'id',
    'firm_code',
    'entry_date',
    'team_name',
    'entry_type',
    'amount'
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

/* ENUM VALIDATION */
$allowedTypes = ['ADVANCE', 'PAYMENT'];
if (!in_array($data['entry_type'], $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid entry type"]);
    exit;
}

$remarks = $data['remarks'] ?? null;

/* ---------- SQL ---------- */
$sql = "
UPDATE pmu_team_ledger SET
  entry_date=?,
  team_name=?,
  entry_type=?,
  amount=?,
  remarks=?
WHERE id=? AND firm_code=?
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
    "sssdsis",
    $data['entry_date'],
    $data['team_name'],
    $data['entry_type'],
    $data['amount'],
    $remarks,
    $data['id'],
    $data['firm_code']
);

/* ---------- EXECUTE ---------- */
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
