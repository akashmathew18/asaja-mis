<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

/* ---------- VALIDATE ---------- */
if (empty($data['firm_code'])) {
    echo json_encode([
        "success" => false,
        "message" => "Firm code missing"
    ]);
    exit;
}

$firm_code = $data['firm_code'];

/* ---------- HELPER ---------- */
function getTotal($conn, $sql, $firm_code)
{
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        return 0;
    }

    $stmt->bind_param("s", $firm_code); // STRING
    $stmt->execute();

    $res = $stmt->get_result()->fetch_assoc();
    return $res['total'] ?? 0;
}

/* ---------- TOTALS ---------- */
$totalWood = getTotal(
    $conn,
    "SELECT IFNULL(SUM(total_expense),0) AS total
     FROM pmu_wood_expense
     WHERE firm_code = ?",
    $firm_code
);

$totalPlywood = getTotal(
    $conn,
    "SELECT IFNULL(SUM(total_expense),0) AS total
     FROM pmu_plywood_purchase
     WHERE firm_code = ?",
    $firm_code
);

$totalAccessories = getTotal(
    $conn,
    "SELECT IFNULL(SUM(total_expense),0) AS total
     FROM pmu_accessories_purchase
     WHERE firm_code = ?",
    $firm_code
);

$totalLabour = getTotal(
    $conn,
    "SELECT IFNULL(SUM(total_amount),0) AS total
     FROM pmu_labour_cost
     WHERE firm_code = ?",
    $firm_code
);

$totalOtherExpense = getTotal(
    $conn,
    "SELECT IFNULL(SUM(amount),0) AS total
     FROM pmu_other_expense
     WHERE firm_code = ?",
    $firm_code
);

/* ---------- RESPONSE ---------- */
echo json_encode([
    "success" => true,
    "wood" => $totalWood,
    "plywood" => $totalPlywood,
    "accessories" => $totalAccessories,
    "labour" => $totalLabour,
    "other_expense" => $totalOtherExpense
]);
