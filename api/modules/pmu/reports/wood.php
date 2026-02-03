<?php
require_once "../../../middleware/bootstrap.php";
$d=json_decode(file_get_contents("php://input"),true);
$stmt=$conn->prepare("SELECT * FROM pmu_wood_expense WHERE firm_code=? ORDER BY expense_date");
$stmt->bind_param("s",$d['firm_code']);
$stmt->execute();
$r=$stmt->get_result();
$data=[];
while($x=$r->fetch_assoc())$data[]=$x;
echo json_encode(["success"=>true,"data"=>$data]);
