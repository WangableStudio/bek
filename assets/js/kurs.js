document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://shamex.online/api/v1/user/get-curs")
    .then((res) => {
        console.log(res);
        
      document.querySelector('.buy-usdt').textContent = res.data.buy_usdt
      document.querySelector('.sell-usdt').textContent = res.data.sell_usdt
      document.querySelector('.buy-dollar').textContent = res.data.buy_dollar
      document.querySelector('.sell-dollar').textContent = res.data.sell_dollar
    })
    .catch((err) => {
      console.log(err);
    });
});
