export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

export function closeWithBtn(e) {
  const alert = e.target.parentNode;
  const alertParent = alert.parentNode;
  alertParent.removeChild(alert);
}

export function createAlert(type, title, message) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("alert--" + type);
  alert.innerHTML =
    '<span class="iconify alert__icon" data-icon="akar-icons:info"></span><div class="alert__content"><h3>' +
    title +
    "</h3><p>" +
    message +
    '</p></div><span class="alert__closeBtn">&times;</span><div class="alert__timer"></div>';
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.querySelector(".alert__timer").style.width = "100%";
  });
  alert
    .querySelector(".alert__closeBtn")
    .addEventListener("click", closeWithBtn);
  setTimeout(() => {
    if (!alert.parentNode) {
      return;
    }
    alert.parentNode.removeChild(alert);
  }, 5000);
}
