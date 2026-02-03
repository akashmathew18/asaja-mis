<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);
$firm_code = $data['firm_code'] ?? null;
$from_date = $data['from_date'] ?? null;
$to_date = $data['to_date'] ?? null;

if (!$firm_code) {
  echo json_encode(["success" => false, "message" => "firm_code missing"]);
  exit;
}

/* ---------- DATE BLOCK ---------- */
function dateBlock($col, $from, $to)
{
  return ($from && $to) ? " AND $col BETWEEN '$from' AND '$to'" : "";
}

/* ---------- RESPONSE ---------- */
$data = [];

$data['accessories'] = $conn->query("
    SELECT purchase_date, accessory_name, total_expense
    FROM pmu_accessories_purchase
    WHERE firm_code = '$firm_code'
    " . dateBlock("purchase_date", $from_date, $to_date) . "
")->fetch_all(MYSQLI_ASSOC);

$data['assets'] = $conn->query("
    SELECT asset_name, asset_amount
    FROM pmu_asset_ledger
    WHERE firm_code = '$firm_code'
")->fetch_all(MYSQLI_ASSOC);

$data['labour'] = $conn->query("
    SELECT work_date, team_name, total_amount
    FROM pmu_labour_cost
    WHERE firm_code = '$firm_code'
    " . dateBlock("work_date", $from_date, $to_date) . "
")->fetch_all(MYSQLI_ASSOC);

$data['other_expense'] = $conn->query("
    SELECT expense_date, expense_title, amount
    FROM pmu_other_expense
    WHERE firm_code = '$firm_code'
    " . dateBlock("expense_date", $from_date, $to_date) . "
")->fetch_all(MYSQLI_ASSOC);

$data['wood'] = $conn->query("
    SELECT expense_date, wood_type, total_expense
    FROM pmu_wood_expense
    WHERE firm_code = '$firm_code'
    " . dateBlock("expense_date", $from_date, $to_date) . "
")->fetch_all(MYSQLI_ASSOC);

echo json_encode(["success" => true, "data" => $data]);
