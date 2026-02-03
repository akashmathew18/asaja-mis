<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$required = [
    'asset_id',
    'firm_code',
    'asset_name',
    'company_name',
    'purchase_date',
    'warranty',
    'asset_amount'
];

foreach ($required as $f) {
    if (!isset($data[$f])) {
        echo json_encode(["success" => false, "message" => "Missing $f"]);
        exit;
    }
}

$warrantyExpiry = ($data['warranty'] === 'Yes')
    ? ($data['warranty_expiry'] ?? null)
    : null;

$sql = "
UPDATE pmu_asset_ledger SET
 asset_name = ?,
 company_name = ?,
 purchase_date = ?,
 warranty = ?,
 warranty_expiry = ?,
 asset_amount = ?,
 remarks = ?
WHERE asset_id = ? AND firm_code = ?
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssssdsis",
    $data['asset_name'],
    $data['company_name'],
    $data['purchase_date'],
    $data['warranty'],
    $warrantyExpiry,
    $data['asset_amount'],
    $data['remarks'],
    $data['asset_id'],
    $data['firm_code']
);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
