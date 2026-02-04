<?php
require_once "../../../middleware/bootstrap.php";

$data = json_decode(file_get_contents("php://input"), true);

$firmCode = $data['firm_code'] ?? '';
$teamName = $data['team_name'] ?? '';
$search   = $data['search'] ?? '';
$fromDate = $data['from_date'] ?? '';
$toDate   = $data['to_date'] ?? '';

/* ---------------- CONDITIONS ---------------- */
$whereTeam = $teamName ? "AND team_name = ?" : "";
$whereSearch = $search ? "AND (
    team_name LIKE ? OR
    remarks LIKE ? OR
    transaction_id LIKE ? OR
    particulars LIKE ?
)" : "";

/* ---------------- QUERY ---------------- */
$sql = "
SELECT * FROM (

    /* CREDIT : LABOUR COST (WE OWE THEM) */
    SELECT
        work_date AS entry_date,
        transaction_id,
        team_name,
        'Labour Cost' AS particulars,
        remarks,
        total_amount AS credit,
        0 AS debit
    FROM pmu_labour_cost
    WHERE firm_code = ?
    $whereTeam
    " . (($fromDate && $toDate) ? "AND work_date BETWEEN ? AND ?" : "") . "

    UNION ALL

    /* DEBIT : PAYMENTS (WE PAID THEM) */
    SELECT
        entry_date,
        transaction_id,
        team_name,
        entry_type AS particulars,
        remarks,
        0 AS credit,
        amount AS debit
    FROM pmu_team_payments
    WHERE firm_code = ?
    $whereTeam
    " . (($fromDate && $toDate) ? "AND entry_date BETWEEN ? AND ?" : "") . "

) t
WHERE 1=1
$whereSearch
ORDER BY entry_date ASC
";

$stmt = $conn->prepare($sql);

/* ---------------- BIND PARAMS ---------------- */
$params = [];
$types = "";

/* LABOUR */
$params[] = $firmCode; $types .= "s";
if ($teamName) { $params[] = $teamName; $types .= "s"; }
if ($fromDate && $toDate) { $params[] = $fromDate; $params[] = $toDate; $types .= "ss"; }

/* PAYMENTS */
$params[] = $firmCode; $types .= "s";
if ($teamName) { $params[] = $teamName; $types .= "s"; }
if ($fromDate && $toDate) { $params[] = $fromDate; $params[] = $toDate; $types .= "ss"; }

/* SEARCH */
if ($search) {
    $like = "%$search%";
    array_push($params, $like, $like, $like, $like);
    $types .= "ssss";
}

$stmt->bind_param($types, ...$params);
$stmt->execute();

/* ---------------- RUNNING BALANCE ---------------- */
$res = $stmt->get_result();
$rows = [];
$balance = 0;

while ($r = $res->fetch_assoc()) {
    $balance += ($r['credit'] - $r['debit']);
    $r['balance'] = $balance;
    $rows[] = $r;
}

echo json_encode([
    "success" => true,
    "data" => $rows
]);
