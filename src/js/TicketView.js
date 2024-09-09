/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
import moment from "moment";

export default class TicketView {
  constructor({ id, name, status, created }) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.created = created;
  }

  renderTicket() {
    const ticket = `
      <li id="${this.id}" class="ticket-list__ticket ticket">
        <div class="ticket__item item">
          <div class="item__left-container item-l-cont">
            <label class="item-l-cont__status-checkbox status-checkbox">
              <input type="checkbox" class="status-checkbox__input" ${this.validationStatus(
                this.status
              )}>
              <span class="status-checkbox__custom"></span>
            </label>
            <h3 class="item-l-cont__item-name item__name">${this.name}</h3>
          </div>
          <div class="item__right-container item-options">
            <span class="item-options__date-creation">${this.converterDate(
              this.created
            )}</span>
            <div class="item-options__edit-btn">&#9998;</div>
            <div class="item-options__delete-btn">&#10006;</div>
          </div>
        </div>
      </li>
    `;

    document
      .querySelector(".root__ticket-list")
      .insertAdjacentHTML("beforeEnd", ticket);
  }

  converterDate(date) {
    return moment(date, "x").format("DD.MM.YY HH:mm");
  }

  validationStatus(status) {
    if (status) {
      return "checked";
    } else {
      return "";
    }
  }

  static renderWidgetConfirmDelete() {
    const widget = `
      <div class="widget-confirm-delete">
        <h2 class="widget-confirm-delete__title">Удалить тикет</h2>
        <div class="widget-confirm-delete__text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
        <div class="widget-confirm-delete__btns widget-btn">
          <button class="widget-btn__cancel form-btn">Отмена</button>
          <button class="widget-btn__confirm form-btn">Ok</button>
        </div>
      </div>
    `;

    document.documentElement.insertAdjacentHTML("beforeEnd", widget);

    document
      .querySelector(".widget-btn__cancel")
      .addEventListener("click", () => {
        document.querySelector(".widget-confirm-delete").remove();
      });
  }
}
