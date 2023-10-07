import Notify from "simple-notify";
import * as constants from "../constants"

export default class WarningNotify extends Notify {
    constructor(title, text) {
        super({
            title: title,
            text: text,
            autotimeout: constants.timeout,
            autoclose: constants.autoClose,
            status: constants.warningStatus
        });
    }
}