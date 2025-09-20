document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".exchange-form");
  const inputs = form.querySelectorAll(".form__field");
  const checkbox = document.getElementById("allow-doc");
  const checkboxLabel = checkbox.closest(".round").querySelector("label");
  const submitBtn = document.querySelector(".home-btn");
  const menuBtn = document.querySelectorAll(".excharge-menu__btn");
  const params = new URLSearchParams(window.location.search);

  const type = params.get("type");
  if (type) {
    document.querySelector(".exchange h1").textContent = type;

    const buyBtn = document.querySelector(".excharge-menu__btn.buy");
    const sellBtn = document.querySelector(".excharge-menu__btn.sell");
    if (type === "Обмен USDT") {
      localStorage.setItem("type", "buy-usdt");
      if (buyBtn) buyBtn.setAttribute("data-type", "buy-usdt");
      if (sellBtn) sellBtn.setAttribute("data-type", "sell-usdt");
    } else {
      localStorage.setItem("type", "buy-dollar");
      if (buyBtn) buyBtn.setAttribute("data-type", "buy-dollar");
      if (sellBtn) sellBtn.setAttribute("data-type", "sell-dollar");
    }
  }
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true;

    const type = localStorage.getItem("type");
    const token = localStorage.getItem("token");
    const data = {
      type: type,
      price: document.querySelector('input[name="price"]')?.value || "",
      first_name: document.querySelector('input[name="name"]')?.value || "",
      second_name: document.querySelector('input[name="surname"]')?.value || "",
      third_name:
        document.querySelector('input[name="otchestvo"]')?.value || "",
      wallet: document.querySelector('input[name="wallet"]')?.value || "",
      allow: document.querySelector('input[name="allow"]')?.value || "",
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

    // проверяем чекбокс
    if (!checkbox.checked) {
      checkboxLabel.style.border = "2px solid red";
      isValid = false;
    } else {
      checkboxLabel.style.border = "1px solid #ccc";
    }

    if (isValid) {
      axios
        .post("https://shamex.online/api/v1/user/form", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          let title;
          switch (type) {
            case "buy-usdt":
              title = "Номер заявки на покупку USDT:";
              break;
            case "sell-usdt":
              title = "Номер заявки на продажу USDT:";
              break;
            case "buy-dollar":
              title = "Номер заявки на покупку $:";
              break;
            case "sell-dollar":
              title = "Номер заявки на продажу $:";
              break;

            default:
              title = "Ошибка";
              break;
          }
          window.location.href = `/order.html?title=${title}&id=${res.data.id}`;
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
});
