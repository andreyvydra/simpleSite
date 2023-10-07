import $ from "jquery";
import ErrorNotify from "./notifications/errorNotify";
import * as sound from "./sound"
import * as constants from "./constants"

class PaginationTable {
    table = document.getElementById("pagination-table-body")
    buttonsContainer = document.getElementById("pagination-button-container")
    buttons = document.getElementsByClassName("pagination-button")

    constructor() {
        this.addButtonListeners();
        let page = parseInt(window.sessionStorage.getItem("page") ?? 1)
        this.changeSelectedButton(page)
        this.doRequest(page);

    }

    addButtonListeners() {
        for (let button of this.buttons) {
            button.addEventListener("click", this.getPage.bind(this));
        }
    }

    changeSelectedButton(value) {
        for (let x = 0; x < this.buttons.length; x++) {
            this.buttons[x].classList.remove("button-is-selected");
        }
        for (let x = 0; x < this.buttons.length; x++) {
            if (this.buttons[x].innerText === value) {
                this.buttons[x].classList.add("button-is-selected");
            }
        }
    }

    getPage(event) {
        event.preventDefault();
        let pageNumber = parseInt(event.currentTarget.innerText);
        let json = window.sessionStorage.setItem("page", pageNumber);
        this.doRequest(pageNumber)
        this.changeSelectedButton(pageNumber.toString())

    }

    doRequest(pageNumber) {
        $.ajax("api/pagination.php", {
            type: "POST",
            data: {
                "pageNumber": pageNumber,
            },
            success: (response) => {
                pageNumber = response.currentPage;
                this.updateBodyTable(response);
                this.updateButtons(response);
                window.sessionStorage.setItem("page", pageNumber)
                sound.sound.updateButtons();
                this.changeSelectedButton(pageNumber.toString())
            },
            error: (xhr, ajaxOptions, thrownError) => {
                errorNotifies(xhr)
            }
        })
    }

    updateBodyTable(response) {
        while(this.table.firstChild){
            this.table.removeChild(this.table.firstChild);
        }
        for (let item of response.data) {
            this.addBodyTable(item);
        }
    }


    updateButtons(response) {
        this.deleteButtons();
        let pageNumber = response.currentPage;
        if (response.pagesCount <= constants.minPageCount) {
            this.addMinimumButtonsWidget(response)
        } else if (pageNumber < constants.minPageCount) {
            this.addLeftButtonsWidget(response)
        } else if (response.pagesCount - pageNumber < constants.minPageCount - 1) {
            this.addRightButtonsWidget(response)
        } else {
            this.addMiddleButtonsWidget(response)
        }
        this.buttons = document.getElementsByClassName("pagination-button");
        this.addButtonListeners();
    }

    addMiddleButtonsWidget(response) {
        let pageNumber = parseInt(response.currentPage);
        this.addButton(1);
        this.addSpan();
        for (let i = pageNumber - 2; i <= pageNumber + 2; i++) {
            this.addButton(i)
        }
        this.addSpan();
        this.addButton(response.pagesCount)
    }

    addRightButtonsWidget(response) {
        this.addButton(1);
        this.addSpan();
        for (let i = response.pagesCount - 4; i <= response.pagesCount; i++) {
            this.addButton(i)
        }
    }

    addLeftButtonsWidget(response) {
        for (let i = 1; i <= 5; i++) {
            this.addButton(i)
        }
        this.addSpan();
        this.addButton(response.pagesCount)
    }

    addMinimumButtonsWidget(response) {
        for (let i = 1; i <= response.pagesCount; i++) {
            this.addButton(i)
        }
    }

    deleteButtons() {
        while(this.buttonsContainer.firstChild){
            this.buttonsContainer.removeChild(this.buttonsContainer.firstChild);
        }
    }

    addButton(pageNumber) {
        this.buttonsContainer.insertAdjacentHTML(
            'beforeend',
            "<button class='pagination-button'>" + pageNumber +"</button>"
        );
    }

    addSpan() {
        this.buttonsContainer.insertAdjacentHTML(
            'beforeend',
            "<span>...</span>"
        );
    }

    addBodyTable(values) {
        this.table.insertAdjacentHTML(
            'beforeend',
            "<tr><td>" + values["params"] +
            "</td><td>" + values["inArea"] +
            "</td><td>" + values["duration"]+
            "</td><td>" + values["startTime"] + "</td></tr>"
        );
    }

}

export const paginationTable = new PaginationTable();