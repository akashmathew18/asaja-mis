<?php
require_once "../../../middleware/bootstrap.php";
$d=json_decode(file_get_contents("php://input"),true);
$firm_code=$d['firm_code'];

$files=['general','wood','plywood','accessories','labour','team','assets','other-expense'];
$out=[];

foreach($files as $f){
  include "$f.php";
}
