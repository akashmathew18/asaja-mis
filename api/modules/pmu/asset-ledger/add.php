<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
    'firm_code',
    'asset_name',
    'company_name',
    'purchase_date',
    'warranty',
    'asset_amount',
    'created_by'
];

foreach ($required as $f) {
    if (!isset($data[$f])) {
        echo json_encode(["success" => false, "message" => "Missing field: $f"]);
        exit;
    }
}

$warrantyExpiry = ($data['warranty'] === 'Yes')
    ? ($data['warranty_expiry'] ?? null)
    : null;

$sql = "
INSERT INTO pmu_asset_ledger
(firm_code, asset_name, company_name, purchase_date,
 warranty, warranty_expiry, asset_amount, remarks, created_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssssdsss",
    $data['firm_code'],
    $data['asset_name'],
    $data['company_name'],
    $data['purchase_date'],
    $data['warranty'],
    $warrantyExpiry,
    $data['asset_amount'],
    $data['remarks'],
    $data['created_by']
);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
