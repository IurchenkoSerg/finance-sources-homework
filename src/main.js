import "./style.css";
import { fetchFinanceSources } from "./api.js";
import { calculateRevenue } from "./revenue.js";

const statusElement = document.querySelector("#status");
const summaryElement = document.querySelector("#summary");
const sourcesElement = document.querySelector("#sources");
const refreshButton = document.querySelector("#refresh-button");
const languageButton = document.querySelector("#language-button");
const themeButton = document.querySelector("#theme-button");

const translations = {
  ru: {
    eyebrow: "Домашнее задание · 23.07",
    title: "Отчёт о прибыли",
    subtitle:
      "Данные загружаются из двух API. Валюты считаются отдельно и никогда не смешиваются.",
    refresh: "Обновить данные",
    lightTheme: "Светлая тема",
    darkTheme: "Тёмная тема",
    settings: "Настройки страницы",
    loading: "Загрузка данных…",
    success: "Данные успешно загружены.",
    separateCurrencies:
      "Найдены разные валюты. Итоги показаны отдельно — суммы не смешаны.",
    error: "Ошибка",
    source1: "Источник 1",
    source2: "Источник 2",
    revenue: "Прибыль",
    transactions: "Все транзакции",
    noPayments: "Нет оплаченных операций",
    summaryLabel: "Итог по валютам",
    sourcesLabel: "Источники данных",
    paid: "оплачено",
    pending: "ожидает",
    rejected: "отклонено",
  },
  en: {
    eyebrow: "Homework · 23.07",
    title: "Revenue report",
    subtitle:
      "Data is loaded from two APIs. Currencies are calculated separately and are never mixed.",
    refresh: "Refresh data",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    settings: "Page settings",
    loading: "Loading data…",
    success: "Data loaded successfully.",
    separateCurrencies:
      "Different currencies found. Totals are shown separately and are not mixed.",
    error: "Error",
    source1: "Source 1",
    source2: "Source 2",
    revenue: "Revenue",
    transactions: "All transactions",
    noPayments: "No paid transactions",
    summaryLabel: "Totals by currency",
    sourcesLabel: "Data sources",
    paid: "paid",
    pending: "pending",
    rejected: "rejected",
  },
};

let currentLanguage = localStorage.getItem("language") === "en" ? "en" : "ru";
let currentTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
let currentReport = null;

function translate(key) {
  return translations[currentLanguage][key];
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function renderTotals(totalsByCurrency) {
  return Object.entries(totalsByCurrency)
    .map(
      ([currency, amount]) => `
        <article class="total-card">
          <span>${currency}</span>
          <strong>${formatMoney(amount, currency)}</strong>
        </article>
      `,
    )
    .join("");
}

function renderPayments(payments) {
  if (payments.length === 0) {
    return `<p class="empty">${translate("noPayments")}</p>`;
  }

  return `
    <ul class="payment-list">
      ${payments
        .map(
          (payment) => `
            <li>
              <span>${payment.currency}</span>
              <strong>${formatMoney(payment.amount, payment.currency)}</strong>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderTransactions(transactions) {
  return `
    <div class="transactions">
      <h3>${translate("transactions")}</h3>
      ${transactions
        .map(
          (transaction) => `
            <div class="transaction">
              <span class="badge badge--${transaction.type}">
                ${translate(transaction.type) ?? transaction.type}
              </span>
              <span>${transaction.amount} ${transaction.currency}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderSource(name, source, showTransactions = false) {
  return `
    <article class="source-card">
      <div class="source-heading">
        <div>
          <p class="source-label">${name}</p>
          <h2>${source.address}</h2>
        </div>
        <div class="mini-totals">${renderTotals(source.totalsByCurrency)}</div>
      </div>
      <h3>${translate("revenue")}</h3>
      ${renderPayments(source.payments)}
      ${showTransactions ? renderTransactions(source.transactions) : ""}
    </article>
  `;
}

function renderReport(report) {
  summaryElement.innerHTML = renderTotals(report.totalsByCurrency);
  sourcesElement.innerHTML = [
    renderSource(translate("source1"), report.source1, true),
    renderSource(translate("source2"), report.source2),
  ].join("");
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelector(".toolbar").ariaLabel = translate("settings");
  summaryElement.ariaLabel = translate("summaryLabel");
  sourcesElement.ariaLabel = translate("sourcesLabel");
  languageButton.textContent = currentLanguage === "ru" ? "EN" : "RU";
  languageButton.ariaLabel = currentLanguage === "ru"
    ? "Switch to English"
    : "Переключить на русский";
  themeButton.textContent =
    currentTheme === "dark" ? translate("lightTheme") : translate("darkTheme");

  if (currentReport) {
    const currencyCount = Object.keys(currentReport.totalsByCurrency).length;
    statusElement.textContent =
      currencyCount > 1 ? translate("separateCurrencies") : translate("success");
    renderReport(currentReport);
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
  themeButton.textContent =
    currentTheme === "dark" ? translate("lightTheme") : translate("darkTheme");
  themeButton.setAttribute("aria-pressed", String(currentTheme === "dark"));
}

async function loadRevenue() {
  refreshButton.disabled = true;
  statusElement.className = "status";
  statusElement.textContent = translate("loading");
  summaryElement.innerHTML = "";
  sourcesElement.innerHTML = "";

  try {
    const { source1, source2 } = await fetchFinanceSources();
    const report = calculateRevenue(source1, source2);
    currentReport = report;
    const currencyCount = Object.keys(report.totalsByCurrency).length;

    statusElement.className = "status status--success";
    statusElement.textContent =
      currencyCount > 1
        ? translate("separateCurrencies")
        : translate("success");

    renderReport(report);
  } catch (error) {
    currentReport = null;
    statusElement.className = "status status--error";
    statusElement.textContent = `${translate("error")}: ${error.message}`;
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadRevenue);
languageButton.addEventListener("click", () => {
  currentLanguage = currentLanguage === "ru" ? "en" : "ru";
  localStorage.setItem("language", currentLanguage);
  applyLanguage();
});
themeButton.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme();
});

applyTheme();
applyLanguage();
loadRevenue();
