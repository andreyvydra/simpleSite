<?php
function floatCompare($x, $y) {
    $epsilon = 0.0000001;
    $res = ($x - $y);
    if (abs($res) < $epsilon) {
        return 0;
    }
    if ($res < 0) {
        return -1;
    }
    return 1;
}

function inArrayForFloat($param, $arr) {
    $cnt = count($arr);
    for ($i = 0; $i < $cnt; $i++) {
        if (floatCompare($arr[$i], $param) == 0) {
            return true;
        }
    }
    return false;
}

/**
 * @throws ErrorException
 */
function valueValidator() {
    $x = getX();
    $y = getY();
    $r = getR();
    if (!inArrayForFloat($x, X_VALUES)) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Координата X некорректная.");
    }
    if (floatCompare($y, MAX_Y) >= 0 || floatCompare(MIN_Y, $y) >= 0) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Координата Y некорректная.");
    }
    if (!inArrayForFloat($r, R_VALUES)) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Координата R некорректная.");
    }
    return array($x, $y, $r);
}

/**
 * @throws ErrorException
 */
function existValidator() {
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        http_response_code(METHOD_NOT_ALLOWED);
        throw new ErrorException("Доступен только POST метод.");
    }

    if (!isset($_POST[FIELD_X]) || !is_numeric($_POST[FIELD_X]) || !is_float(getX())) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Не передан X.");
    }
    if (!isset($_POST[FIELD_Y]) || !is_numeric($_POST[FIELD_Y]) || !is_float(getY())) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Не передан Y.");
    }
    if (!isset($_POST[FIELD_R]) || !is_numeric($_POST[FIELD_R]) || !is_float(getR())) {
        http_response_code(BAD_REQUEST);
        throw new ErrorException("Не передан R.");
    }
    return true;
}

function getX() {
    return getFloat(FIELD_X);
}

function getY() {
    return getFloat(FIELD_Y);
}

function getR() {
    return getFloat(FIELD_R);
}

function getFloat($field) {
    $number = str_replace(",", ".", strval($_POST[$field]));
    $pointPos = strrpos($number, '.');
    $leftPart =  substr($number, 0, $pointPos + 6);
    if ($pointPos === false) {
        return floatval($leftPart);
    }
    $lastChar = "";
    for ($i = $pointPos + 6; $i < strlen($number); $i++) {
        $lastChar = $number[$i];
        if ($lastChar != 0) {
            break;
        }
    }
    return floatval($leftPart . $lastChar);
}

/**
 * @throws ErrorException
 */
function validator() {
    if (existValidator()) {
        return valueValidator();
    }
    return false;
}
?>