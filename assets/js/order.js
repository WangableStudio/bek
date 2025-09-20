const params = new URLSearchParams(window.location.search);

const title = params.get("title");
const id = params.get("id");
if (title) {
  document.querySelector(".order-title p").textContent = title;
  document.querySelector(".order-title span").textContent = id;
}
