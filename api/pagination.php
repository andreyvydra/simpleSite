<?php
include "constants.php";

header('Content-Type: application/json; charset=utf-8');

/**
 * @throws ErrorException
 */
function checkMethodAndFields ()
{
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        http_response_code(METHOD_NOT_ALLOWED);
        throw new ErrorException("Доступен только POST метод.");
    }
    if (!isset($_POST["pageNumber"]) || !is_numeric($_POST["pageNumber"])) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("pageNumber не был передан или тип данных некорректный.");
    }
}


try {
    checkMethodAndFields();
    $jsonFile = json_decode(file_get_contents("data.json"), true);
    $chunkCount = ceil(sizeof($jsonFile) / CHUNK_LIMIT);
    $pageNumber = intval($_POST["pageNumber"]);
    if ($pageNumber > $chunkCount) {
        $pageNumber = $chunkCount;
    }
    if ($pageNumber < 1) {
        $pageNumber = 1;
    }
    $json = array(
        "data" => array_chunk($jsonFile, CHUNK_LIMIT)[$pageNumber - 1],
        "pagesCount" => $chunkCount,
        "currentPage" => $pageNumber,
    );
} catch (ErrorException $e) {
    $json = array(
        "message" => $e->getMessage(),
        "status" => ERROR_STATUS,
    );
}
echo json_encode($json);
?>
