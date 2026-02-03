<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* ---------- VALIDATION ---------- */
$required = [
    'id',
    'firm_code',
    'purchase_date',
    'square_feet',
    'rate_per_sqft',
    'sqft_amount',
    'transportation',
    'paid',
    'total_expense'
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

/* ---------- SQL ---------- */
$sql = "
UPDATE pmu_plywood_purchase SET
  purchase_date=?,
  square_feet=?,
  rate_per_sqft=?,
  sqft_amount=?,
  transportation=?,
  paid=?,
  total_expense=?,
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
    "sddddsdsis",
    $data['purchase_date'],
    $data['square_feet'],
    $data['rate_per_sqft'],
    $data['sqft_amount'],
    $data['transportation'],
    $data['paid'],
    $data['total_expense'],
    $data['remarks'],
    $data['id'],
    $data['firm_code']
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
