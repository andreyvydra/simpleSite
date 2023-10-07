import * as constants from './constants'
import ErrorNotify from "./notifications/errorNotify";
import WarningNotify from "./notifications/warningNotify"
import errorNotify from "./error"
import $ from "jquery";

class App {
    tableBody = document.getElementById("table-body");
    form = document.getElementById("form");

    xInputs = document.getElementsByName("x");
    yInput = document.getElementById("y-input");
    buttonsR = document.getElementsByClassName("r");

    xValue = null;
    yValue = null;
    rValue = null;

    constructor() {
        this.init();
    }

    init() {
        this.initEventListeners()
        this.initTable();
        let formData = JSON.parse(window.sessionStorage.getItem("formData")) ?? {};
        this.initX(formData["xValue"]);
        this.initY(formData["yValue"])
        this.initR(formData["rValue"]);
    }

    initEventListeners() {
        this.form.addEventListener("submit", this.addNewTableEntry.bind(this));

        for (let r = 0; r < this.buttonsR.length; r++) {
            this.buttonsR[r].addEventListener("click", this.changeR.bind(this));
        }

        for (let x = 0; x < this.xInputs.length; x++) {
            this.xInputs[x].addEventListener("click", this.changeX.bind(this));
        }

        this.yInput.addEventListener("input", this.changeY.bind(this))
    }

    initTable() {
        let j = JSON.parse(window.sessionStorage.getItem("data")) ?? [];
        for (let a = 0; a < j.length; a++) {
            this.addBodyTable(j[a]);
        }
    }

    initX(xValue) {
        this.xValue = xValue;
        for (let x = 0; x < this.xInputs.length; x++) {
            if (this.xInputs[x].value == xValue) {
                this.xInputs[x].checked = true;
                return;
            }
        }
        this.xInputs[0].checked = true;
        this.xValue = this.xInputs[0].value
    }

    initY(yValue) {
        this.yValue = yValue;
        if (yValue != null) {
            this.yInput.value = this.yValue;
            return;
        }
        this.yValue = "1";
        this.yInput.value = "1";
    }

    initR(rValue) {
        this.rValue = rValue;
        for (let r = 0; r < this.buttonsR.length; r++) {
            if (this.buttonsR[r].value == rValue) {
                this.buttonsR[r].classList.add("button-is-selected");
                return;
            }
        }
        this.buttonsR[0].classList.add("button-is-selected");
        this.rValue = this.buttonsR[0].value
    }

    changeX(event) {
        this.xValue = event.currentTarget.value;
        let formData = JSON.parse(window.sessionStorage.getItem("formData")) ?? {};
        formData["xValue"] = this.xValue;
        window.sessionStorage.setItem("formData", JSON.stringify(formData));
    }

    changeY(event) {
        this.yValue = event.currentTarget.value;
        let formData = JSON.parse(window.sessionStorage.getItem("formData")) ?? {};
        formData["yValue"] = this.yValue;
        window.sessionStorage.setItem("formData", JSON.stringify(formData));
    }

    changeR(event) {
        this.rValue = event.currentTarget.value;
        let formData = JSON.parse(window.sessionStorage.getItem("formData")) ?? {};
        formData["rValue"] = this.rValue;
        window.sessionStorage.setItem("formData", JSON.stringify(formData));
        this.changeSelectedButtonR(this.rValue)
    }

    changeSelectedButtonR(rValue) {
        for (let x = 0; x < this.buttonsR.length; x++) {
            this.buttonsR[x].classList.remove("button-is-selected");
        }
        for (let x = 0; x < this.buttonsR.length; x++) {
            if (this.buttonsR[x].value == rValue) {
                this.buttonsR[x].classList.add("button-is-selected");
            }
        }
    }

    addNewTableEntry(event) {
        event.preventDefault();
        try {
            let x = this.xValue;
            let y = this.yValue;
            let r = this.rValue;
            const params = this.parseAndValidate(x, y, r);
            this.doRequest(params);
        } catch (err) {
            new WarningNotify("Ошибка валидации", err.message);
        }
    }

    doRequest(params) {
        $.ajax("api/result.php", {
            type: "POST",
            data: {
                "parsedX": params[0],
                "parsedY": params[1],
                "parsedR": params[2]
            },
            success: (response) => {
                let j = JSON.parse(window.sessionStorage.getItem("data")) ?? [];
                j.push(response);
                window.sessionStorage.setItem("data", JSON.stringify(j));
                this.addBodyTable(response)
            },
            error: (xhr, ajaxOptions, thrownError) => {
                errorNotifies(xhr);
            }
        })
    }

    parseAndValidate(x, y, r) {
        const px = parseFloat(x);
        if (px == null || px != x || !constants.xValues.includes(px)) {
            throw new Error("X не был выбран или не лежит в диапазоне допустимых значений.");
        }
        y = y.replace(",", ".");
        const py = parseFloat(y);
        if (py == null || py != y || py <= constants.yMin || py >= constants.yMax) {
            throw new Error("Y не введён или не лежит в диапазоне допустимых значений (-5, 3).");
        }
        const pr = parseFloat(r);
        if (pr == null || pr != r || !constants.rValues.includes(pr)) {
            throw new Error("R не введён или не лежит в диапазоне допустимых значений.");
        }
        return [px, py, pr];
    }

    addBodyTable(values) {
        this.tableBody.insertAdjacentHTML(
            'afterbegin',
            "<tr><td>" + values["params"] +
            "</td><td>" + values["inArea"] +
            "</td><td>" + values["duration"]+
            "</td><td>" + values["startTime"] + "</td></tr>"
        );
    }
}

export const app = new App();
