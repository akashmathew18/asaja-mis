<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);
$firm_code = $data['firm_code'] ?? '';

if (!$firm_code) {
  echo json_encode(["success"=>false,"message"=>"firm_code missing"]);
  exit;
}

$sql = "
SELECT expense_date AS date,'WOOD' AS category,
       CONCAT(wood_type,' ',team_name) AS description,
       total_expense AS amount
FROM pmu_wood_expense WHERE firm_code=?

UNION ALL
SELECT purchase_date,'PLYWOOD',remarks,total_expense
FROM pmu_plywood_purchase WHERE firm_code=?

UNION ALL
SELECT expense_date,'ACCESSORIES',accessory_name,total_expense
FROM pmu_accessories_purchase WHERE firm_code=?

UNION ALL
SELECT work_date,'LABOUR',description,total_amount
FROM pmu_labour_cost WHERE firm_code=?

UNION ALL
SELECT purchase_date,'ASSET',asset_name,amount
FROM pmu_asset_ledger WHERE firm_code=?

UNION ALL
SELECT entry_date,'TEAM_LEDGER',team_name,amount
FROM pmu_team_ledger WHERE firm_code=?

UNION ALL
SELECT expense_date,'OTHER_EXPENSE',description,amount
FROM pmu_other_expense WHERE firm_code=?

ORDER BY date ASC
";

$stmt=$conn->prepare($sql);
$stmt->bind_param("sssssss",
  $firm_code,$firm_code,$firm_code,
  $firm_code,$firm_code,$firm_code,$firm_code
);
$stmt->execute();

$res=$stmt->get_result();
$data=[];
while($r=$res->fetch_assoc()) $data[]=$r;

echo json_encode(["success"=>true,"data"=>$data]);
?>