<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
    'id',
    'firm_code',
    'purchase_date',
    'accessory_name',
    'amount',
    'transportation',
    'other_expense',
    'total_expense',
    'paid',
    'remarks'
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

$remarks = $data['remarks'] ?? null;

$sql = "
UPDATE pmu_accessories_purchase SET
 purchase_date=?,
 accessory_name=?,
 amount=?,
 transportation=?,
 other_expense=?,
 total_expense=?,
 paid=?,
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
    "ssddddssis",
    $data['purchase_date'],
    $data['accessory_name'],
    $data['amount'],
    $data['transportation'],
    $data['other_expense'],
    $data['total_expense'],
    $data['paid'],
    $remarks,
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
