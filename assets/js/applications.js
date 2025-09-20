document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const applicationsContainer = document.querySelector(".container");

  axios
    .get("https://shamex.online/api/v1/user/get-forms", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const data = res.data;

      // 1. Сортировка по дате (новые сверху)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 2. Группировка по датам
      const grouped = {};
      data.forEach((item) => {
        const date = new Date(item.createdAt)
          .toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      // 3. Рендер
      renderApplications(grouped, applicationsContainer);
    })
    .catch((err) => {
      console.log(err);
    });
});

// --- Функция рендера ---
function renderApplications(grouped, container) {
  Object.keys(grouped).forEach((date) => {
    const applicationsDiv = document.createElement("div");
    applicationsDiv.classList.add("applications");

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("applications-date");
    dateDiv.textContent = date;
    applicationsDiv.appendChild(dateDiv);

    grouped[date].forEach((app) => {
      const card = document.createElement("div");
      card.classList.add("applications-card");

      const title = document.createElement("div");
      title.classList.add("applications-card__title");

      // Иконка и текст статуса
      const img = document.createElement("img");
      const statusText = document.createElement("span");
      let statusLabel = "";
      switch (app.stusus) {
        case "processing":
          img.src = "./assets/images/hourglass.svg";
          statusLabel = "Заявка в обработке";
          break;
        case "success":
          img.src = "./assets/images/check-circle.svg";
          statusLabel = "Успешно";
          break;
        case "rejected":
          img.src = "./assets/images/times-circle.svg";
          statusLabel = "Заявка отклонена";
          break;
        default:
          img.src = "./assets/images/hourglass.svg";
          statusLabel = "В обработке";
      }

      title.appendChild(img);
      title.insertAdjacentText("beforeend", " " + statusLabel);

      card.appendChild(title);

      // Тип заявки
      const typeP = document.createElement("p");
      let typelabel = ''
      switch(app.type){
        case 'buy-usdt':
          typelabel = 'Покупка USDT'
          break
        case 'sell-usdt':
          typelabel = 'Продажа USDT'
          break
        case 'buy-dollar':
          typelabel = 'Покупка $'
          break
        case 'sell-dollar':
          typelabel = 'Продажа $'
          break
      }
      typeP.textContent = typelabel
      card.appendChild(typeP);

      // Номер заявки
      const idP = document.createElement("p");
      idP.innerHTML = `Номер заявки: <span>${app.id}</span>`;
      card.appendChild(idP);

      // Сумма
      const priceP = document.createElement("p");
      priceP.innerHTML = `Сумма: <span>${Number(app.price).toLocaleString("ru-RU")} ₽</span>`;
      card.appendChild(priceP);

      applicationsDiv.appendChild(card);
    });

    container.appendChild(applicationsDiv);
  });
}
