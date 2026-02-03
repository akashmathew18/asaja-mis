<?php
require_once "../middleware/bootstrap.php";

$stmt = $conn->prepare("
  SELECT
    firm_code,
    firm_name,
    module
  FROM firms
  WHERE status = 'active'
");

$stmt->execute();
$result = $stmt->get_result();

$firms = [];
while ($row = $result->fetch_assoc()) {
    $firms[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $firms
]);
