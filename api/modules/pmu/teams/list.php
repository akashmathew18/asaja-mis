<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['firm_code'])) {
  echo json_encode(["success" => false, "message" => "firm_code required"]);
  exit;
}

$stmt = $conn->prepare("
  SELECT team_id, team_name
  FROM pmu_teams
  WHERE firm_code = ?
    AND status = 'Active'
  ORDER BY team_name
");

$stmt->bind_param("s", $data['firm_code']);
$stmt->execute();

$res = $stmt->get_result();
$rows = [];

while ($r = $res->fetch_assoc()) {
  $rows[] = $r;
}

echo json_encode([
  "success" => true,
  "data" => $rows
]);
