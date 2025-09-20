document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".exchange-form");
  const inputs = form.querySelectorAll(".form__field");
  const submitBtn = document.querySelector(".home-btn");
  const menuBtn = document.querySelectorAll(".excharge-menu__btn");
  const formOuter = document.querySelector(".applications");
  axios
    .get("https://shamex.online/api/v1/user/get-forms/all")
    .then((res) => {
      res.data.forEach((item) => {
        let imgsrc = "";
        let statusLabel = "";
        switch (item.stusus) {
          case "processing":
            imgsrc = "./assets/images/hourglass.svg";
            statusLabel = "Заявка в обработке";
            break;
          case "success":
            imgsrc = "./assets/images/check-circle.svg";
            statusLabel = "Успешно";
            break;
          case "rejected":
            imgsrc = "./assets/images/times-circle.svg";
            statusLabel = "Заявка отклонена";
            break;
          default:
            imgsrc = "./assets/images/hourglass.svg";
            statusLabel = "В обработке";
        }
        switch (item.type) {
          case "buy-usdt":
            typelabel = "Покупка USDT";
            break;
          case "sell-usdt":
            typelabel = "Продажа USDT";
            break;
          case "buy-dollar":
            typelabel = "Покупка $";
            break;
          case "sell-dollar":
            typelabel = "Продажа $";
            break;
        }
        formOuter.innerHTML += `
          <div class="applications-card">
            <div class="applications-card__title">
              <img src="${imgsrc}" /> ${statusLabel}
              <div class="applications-card__title-action">
                <img onclick="editBtn(${item.id}, 'success', ${
          item.userId
        })" src="./assets/images/check-circle.svg" alt="">
                <img onclick="editBtn(${item.id}, 'rejected', ${
          item.userId
        })" src="./assets/images/times-circle.svg" alt="">
              </div>
            </div>
            <p>${typelabel}</p>
            <p>Номер заявки: <span>${item.id}</span></p>
            <p>Сумма: <span>${Number(item.price).toLocaleString(
              "ru-RU"
            )} ₽</span></p>
          </div>
        `;
      });
    })
    .catch((err) => {
      console.log(err);
    });

  axios
    .get("https://shamex.online/api/v1/user/get-curs")
    .then((res) => {
      console.log(res);
      document.querySelector('input[name="buy_usdt"]').value =
        res.data.buy_usdt;
      document.querySelector('input[name="sell_usdt"]').value =
        res.data.sell_usdt;
      document.querySelector('input[name="buy_dollar"]').value =
        res.data.buy_dollar;
      document.querySelector('input[name="sell_dollar"]').value =
        res.data.sell_dollar;
    })
    .catch((err) => {
      console.log(err);
    });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true;

    const type = localStorage.getItem("type");
    const token = localStorage.getItem("token");
    const data = {
      buy_usdt: document.querySelector('input[name="buy_usdt"]')?.value || "",
      sell_usdt: document.querySelector('input[name="sell_usdt"]')?.value || "",
      buy_dollar:
        document.querySelector('input[name="buy_dollar"]')?.value || "",
      sell_dollar:
        document.querySelector('input[name="sell_dollar"]')?.value || "",
    };

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderImage =
          "linear-gradient(90deg, #F7374C 0%, rgba(247, 55, 76, 0) 100%)";
        input.style.borderImageSlice = "1";
        isValid = false;
      } else {
        input.style.borderImage =
          "linear-gradient(90deg, #06c16a 0%, rgba(6, 193, 106, 0) 100%)";
        input.style.borderImageSlice = "1";
      }
    });

    if (isValid) {
      axios
        .post("https://shamex.online/api/v1/user/curs-create", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
  menuBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      menuBtn.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.getAttribute("data-type");
      localStorage.setItem("type", type);

      if (btn.classList.contains("sell")) {
        btn.querySelector("img").src = "./assets/images/sell_icon.svg";
      }
    });
  });

  const token = localStorage.getItem("token");
});

function editBtn(id, acction, userId) {
  axios
    .put(`https://shamex.online/api/v1/user/${id}/application-status`, {
      status: acction,
      userId: userId,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
