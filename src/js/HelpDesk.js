/**
 *  Основной класс приложения
 * */
import TicketService from "./TicketService";
import createRequest from "./api/createRequest";
import TicketForm from "./TicketForm";
import TicketView from "./TicketView";
import Ticket from "./Ticket";
import moment from "moment";

export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("This is not HTML element!");
    }

    this.container = container;

    this.ticketService = new TicketService();
    this.ticketForm = new TicketForm(this.container);

    this.createTicket = this.createTicket.bind(this);
    this.editTicket = this.editTicket.bind(this);
    this.onRequestDescription = this.onRequestDescription.bind(this);
    this.requestEditStatus = this.requestEditStatus.bind(this);
    this.requestDeleteTicket = this.requestDeleteTicket.bind(this);
  }

  async reloadTicketList() {
    const ticketListElement = document.querySelector(".ticket-list");

    try {
      const list = await this.ticketService.list(createRequest);

      ticketListElement.innerHTML = "";

      list.forEach((ticket) => {
        new TicketView(ticket).renderTicket();
      });

      document.querySelector(".preloader").remove();

      ticketListElement.addEventListener("click", this.onRequestDescription);
      document
        .querySelector(".root__ticket-add-btn")
        .addEventListener("click", this.createTicket);
      document.documentElement.addEventListener("click", this.editTicket);
      document.documentElement.addEventListener("click", this.requestEditStatus);
      document.documentElement.addEventListener(
        "click",
        this.requestDeleteTicket
      );
    } catch (e) {
      document.querySelector(".preloader").remove();

      alert('Сервер http://localhost:7070 недоступен!');

      setTimeout(() => {
        this.reloadTicketList();
      }, 5000);
    }
  }

  createTicket() {
    this.ticketForm.renderAddForm();

    const form = document.querySelector(".add-form");

    form.submit.addEventListener("click", async () => {
      const name = form.name.value;
      const description = form.description.value;

      const ticket = new Ticket({
        id: null,
        name: name,
        description: description,
        status: false,
        created: null,
      });

      const data = JSON.stringify(ticket);

      form.remove();

      await this.ticketService.create(data, createRequest);

      this.reloadTicketList();
    });
  }

  async editTicket(e) {
    const currentElement = e.target;

    if (currentElement.classList.contains("item-options__edit-btn")) {
      document.documentElement.insertAdjacentHTML(
        "beforeEnd",
        `<div class="preloader"><div>`
      );

      const currentTicket = currentElement.closest(".ticket");
      const nameTicket = currentTicket.querySelector(".item__name");

      const requestDescription = await this.ticketService.get(
        currentTicket.id,
        createRequest
      );

      const descriptionTicket = requestDescription.description;
      const status = currentTicket.querySelector(
        ".status-checkbox__input"
      ).checked;
      const created = currentTicket.querySelector(
        ".item-options__date-creation"
      );

      this.ticketForm.renderAddForm();

      const form = document.querySelector(".add-form");
      const formTitle = document.querySelector(".add-form__title");
      formTitle.textContent = "Изменить тикет";
      form.name.value = nameTicket.textContent;
      form.description.value = descriptionTicket;

      document.querySelector(".preloader").remove();

      form.submit.addEventListener("click", async () => {
        const ticket = new Ticket({
          id: currentTicket.id,
          name: form.name.value,
          description: form.description.value,
          status: status,
          created: moment(created.textContent, "DD.MM.YY HH:mm").format("x"),
        });

        const data = JSON.stringify(ticket);

        form.remove();

        await this.ticketService.update(currentTicket.id, data, createRequest);

        this.reloadTicketList();
      });
    }
  }

  async onRequestDescription(e) {
    const currentElement = e.target;

    if (e.target.classList.contains("status-checkbox__input")) return;
    if (e.target.classList.contains("status-checkbox__custom")) return;
    if (e.target.classList.contains("item-options__edit-btn")) return;
    if (e.target.classList.contains("item-options__delete-btn")) return;

    if (currentElement.closest(".ticket-list__ticket")) {
      const currentTicket = currentElement.closest(".ticket-list__ticket");

      const response = await this.ticketService.get(
        currentTicket.id,
        createRequest
      );

      // if (!response.description) return; // если нет description

      const descriptionElement = document.createElement("div");
      descriptionElement.classList.add("ticket__description");
      descriptionElement.textContent = response.description;

      if (!currentTicket.querySelector(".ticket__description")) {
        currentTicket.appendChild(descriptionElement);
      } else {
        currentTicket.querySelector(".ticket__description").remove();
      }
    }
  }

  async requestEditStatus(e) {
    const currentElement = e.target;

    if (currentElement.classList.contains("status-checkbox__input")) {
      const currentTicket = currentElement.closest(".ticket");
      const nameTicket = currentTicket.querySelector(".item__name");
      const requestDescription = await this.ticketService.get(
        currentTicket.id,
        createRequest
      );
      const descriptionTicket = requestDescription.description;
      const status = currentTicket.querySelector(
        ".status-checkbox__input"
      ).checked;
      const created = currentTicket.querySelector(
        ".item-options__date-creation"
      );

      const ticket = new Ticket({
        id: currentTicket.id,
        name: nameTicket.textContent,
        description: descriptionTicket,
        status: status,
        created: moment(created.textContent, "DD.MM.YY HH:mm").format("x"),
      });

      const data = JSON.stringify(ticket);

      await this.ticketService.update(currentTicket.id, data, createRequest);

      this.reloadTicketList();
    }
  }

  requestDeleteTicket(e) {
    const currentElement = e.target;

    if (currentElement.classList.contains("item-options__delete-btn")) {
      const currentTicket = currentElement.closest(".ticket");

      TicketView.renderWidgetConfirmDelete();

      document
        .querySelector(".widget-btn__confirm")
        .addEventListener("click", async () => {
          document.querySelector(".widget-confirm-delete").remove();

          await this.ticketService.delete(currentTicket.id, createRequest);

          this.reloadTicketList();
        });
    }
  }

  async init() {
    this.ticketForm.renderTicketForm();
    this.reloadTicketList();
  }
}
