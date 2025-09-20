function goBack() {
  // Проверяем, есть ли предыдущая страница в истории
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Если нет истории, перенаправляем на главную страницу
    window.location.href = "index.html"; // Замените на вашу главную страницу
  }
}

// Также можно добавить обработчик клавиши Escape для удобства
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    goBack();
  }
});