/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  async list(callback) {
    document.documentElement.insertAdjacentHTML(
      "beforeEnd",
      `<div class="preloader"><div>`
    );

    const response = await callback(`http://localhost:7070?method=allTickets`);

    return await this.handlerResponse(response);
  }

  async get(id, callback) {
    const response = await callback(
      `http://localhost:7070?method=ticketById&id=${id}`
    );

    return await this.handlerResponse(response);
  }

  async create(data, callback) {
    await callback(`http://localhost:7070?method=createTicket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  }

  async update(id, data, callback) {
    await callback(`http://localhost:7070?method=updateById&id=${id}`, {
      method: "POST",
      body: data,
    });
  }

  async delete(id, callback) {
    await callback(`http://localhost:7070?method=deleteById&id=${id}`);
  }

  async handlerResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      try {
        return await response.json();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
