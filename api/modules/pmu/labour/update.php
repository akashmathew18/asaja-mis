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
    'paid'
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
    $dailyCount = $data['daily_count'];
    $ratePerDay = $data['rate_per_day'];
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
 daily_count=?,
 rate_per_day=?,
 total_amount=?,
 paid=?,
 remarks=?
WHERE id=?
");

$stmt->bind_param(
    "ssssiddidssi",
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
    $data['id']
);

echo json_encode(
    $stmt->execute()
    ? ["success" => true]
    : ["success" => false, "error" => $stmt->error]
);
