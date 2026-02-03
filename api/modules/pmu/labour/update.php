<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* ---------------- REQUIRED ---------------- */
$required = [
    'id',
    'firm_code',
    'work_date',
    'team_name',
    'basis',
    'total_amount',
    ];

foreach ($required as $f) {
    if (!isset($data[$f])) {
        echo json_encode(["success" => false, "message" => "Missing $f"]);
        exit;
    }
}

/* ---------------- CONDITIONAL ---------------- */
$cotCount = $ratePerCot = $dailyCount = $ratePerDay = null;

if ($data['basis'] === 'COT') {
    $cotCount = $data['cot_count'];
    $ratePerCot = $data['rate_per_cot'];
} else {
    $dailyCount = $data['labour_count'];
    $ratePerDay = $data['rate_per_labour'];
}

/* ---------------- UPDATE ---------------- */
$stmt = $conn->prepare("
UPDATE pmu_labour_cost SET
 firm_code=?,
 work_date=?,
 team_name=?,
 basis=?,
 cot_count=?,
 rate_per_cot=?,
 labour_count=?,
 rate_per_labour=?,
 total_amount=?,
 remarks=?
WHERE id=?
");

$stmt->bind_param(
    "ssssiddidsi",
    $data['firm_code'],
    $data['work_date'],
    $data['team_name'],
    $data['basis'],
    $cotCount,
    $ratePerCot,
    $dailyCount,
    $ratePerDay,
    $data['total_amount'],
    $data['remarks'],
    $data['id']
);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
