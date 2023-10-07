import ErrorNotify from "./notifications/errorNotify";

export function errorNotifies(xhr) {
    if (xhr.status == 400) {
        new ErrorNotify(
            "Ошибка запроса",
            JSON.parse(xhr.responseText)["message"]
        )
    } else if (xhr.status == 500) {
        new ErrorNotify(
            "Ошибка сервера",
            xhr.responseText
        )
    } else if (xhr.status == 404) {
        new ErrorNotify(
            "Ошибка",
            "Сервер не найден"
        )
    }
}
