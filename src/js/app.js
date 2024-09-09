import HelpDesk from "./HelpDesk";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  const app = new HelpDesk(root);

  app.init();
});
