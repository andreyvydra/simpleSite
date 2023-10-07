<?php
include "constants.php";
include "validation.php";

header('Content-Type: application/json; charset=utf-8');

function checkInArea($params) {
    $x = $params[0];
    $y = $params[1];
    $r = $params[2];
    $inArea = false;

    if ($x >= 0 && $y >= 0) {
        if ($x == 0) {
            $inArea = $y <= $r;
        } elseif ($y == 0) {
            $inArea = $x <= $r;
        } else {
            $inArea = $x * $y <= $r * $r;
        }
    } elseif ($x >= 0 && $y <= 0) {
        $inArea = $y >= $x - $r / 2;
    } elseif ($x <= 0 && $y <= 0) {
        $inArea = $x * $x + $y * $y <= ($r / 2) * ($r / 2);
    }
    return $inArea;
}

function sendJson($json) {
    echo json_encode($json);
}

date_default_timezone_set("Europe/Moscow");


$startTime = microtime(true);
$startDateTime = new DateTime();


try {
    $params = validator();
} catch (Exception $e) {
    $json = array(
        "message" => $e->getMessage(),
        "status" => ERROR_STATUS,
    );
    sendJson($json);
    exit(1);
}

$result = array();

$inArea = checkInArea($params);

$endTime = microtime(true);
$duration = round(($endTime - $startTime) * 1000, 5);


$value = array(
    "status" => OK_STATUS,
    "params" => $params,
    "inArea" => $inArea,
    "startTime" => $startDateTime->format("Y-m-d H:i:s"),
    "duration" => $duration
);
sendJson($value);

?>
