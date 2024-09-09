/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor(parentEl) {
    this.parentEl = parentEl;

    this.renderAddForm = this.renderAddForm.bind(this);
  }

  renderTicketForm() {
    const tecketForm = `
      <h1 class="app-title">App HelpDesk</h1>
      <button class="root__ticket-add-btn">Добавить тикет</button>
      <ul class="root__ticket-list ticket-list"></ul>
    `;

    this.parentEl.insertAdjacentHTML("beforeEnd", tecketForm);
  }

  renderAddForm() {
    const addForm = `
      <form class="add-form">
        <h2 class="add-form__title">Добавить тикет</h2>
        <label class="add-form__input-container">
          <span class="input-container__title">Краткое описание:</span>
          <input type="text" name="name" class="input-container__name">
        </label>
        <label class="add-form__input-container input-container">
          <span class="input-container__title">Подробное описание:</span>
          <textarea name="description" class="input-container__description"></textarea>
          <div class="input-container__mirror-description"></div>
        </label>
        <div class="add-form-btns form-btns">
          <button type="button" class="form-btns__cancel form-btn">Отмена</button>
          <button name="submit" type="button" class="form-btns__submit form-btn">Ok</button>
        </div>
      </form>
    `;

    if (document.querySelector(".add-form")) return;

    document.querySelector("body").insertAdjacentHTML("beforeEnd", addForm);

    document
      .querySelector(".input-container__description")
      .addEventListener("input", this.stretchDescriptionInput);
    document
      .querySelector(".form-btns__cancel")
      .addEventListener("click", this.removeAddForm);
  }

  removeAddForm() {
    if (document.querySelector(".add-form")) {
      document.querySelector(".add-form").remove();
    }
  }

  stretchDescriptionInput() {
    document.querySelector(".input-container__mirror-description").textContent =
      this.value;
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
}
