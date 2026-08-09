"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const translations = {
  ru: {
    eyebrow: "Домашнее задание · Next.js",
    title: "Отчёт о прибыли",
    subtitle:
      "Данные загружаются через защищённый server route. Валюты считаются отдельно и никогда не смешиваются.",
    refresh: "Обновить данные",
    sourcesPage: "Источники и качество данных →",
    languageLabel: "Язык",
    themeLabel: "Тема",
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
    eyebrow: "Homework · Next.js",
    title: "Revenue report",
    subtitle:
      "Data is loaded through a secure server route. Currencies are calculated separately and are never mixed.",
    refresh: "Refresh data",
    sourcesPage: "Sources and data quality →",
    languageLabel: "Language",
    themeLabel: "Appearance",
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

function formatMoney(amount, currency, language) {
  return new Intl.NumberFormat(language === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function Totals({ totals, language }) {
  return Object.entries(totals).map(([currency, amount]) => (
    <article className="total-card" key={currency}>
      <span>{currency}</span>
      <strong>{formatMoney(amount, currency, language)}</strong>
    </article>
  ));
}

function Payments({ payments, language, text }) {
  if (payments.length === 0) {
    return <p className="empty">{text.noPayments}</p>;
  }

  return (
    <ul className="payment-list">
      {payments.map((payment, index) => (
        <li key={`${payment.currency}-${payment.amount}-${index}`}>
          <span>{payment.currency}</span>
          <strong>
            {formatMoney(payment.amount, payment.currency, language)}
          </strong>
        </li>
      ))}
    </ul>
  );
}

function Transactions({ transactions, text }) {
  return (
    <div className="transactions">
      <h3>{text.transactions}</h3>
      {transactions.map((transaction, index) => (
        <div className="transaction" key={`${transaction.type}-${index}`}>
          <span className={`badge badge--${transaction.type}`}>
            {text[transaction.type] ?? transaction.type}
          </span>
          <span>
            {transaction.amount} {transaction.currency}
          </span>
        </div>
      ))}
    </div>
  );
}

function SourceCard({ name, source, language, text, showTransactions = false }) {
  return (
    <article className="source-card">
      <div className="source-heading">
        <div>
          <p className="source-label">{name}</p>
          <h2>{source.address}</h2>
        </div>
        <div className="mini-totals">
          <Totals totals={source.totalsByCurrency} language={language} />
        </div>
      </div>
      <h3>{text.revenue}</h3>
      <Payments payments={source.payments} language={language} text={text} />
      {showTransactions && (
        <Transactions transactions={source.transactions} text={text} />
      )}
    </article>
  );
}

export default function FinanceDashboard() {
  const [language, setLanguage] = useState("ru");
  const [theme, setTheme] = useState("light");
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState({ type: "loading", key: "loading" });
  const text = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    const savedTheme = localStorage.getItem("theme");

    if (savedLanguage === "ru" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadRevenue = useCallback(async () => {
    setStatus({ type: "loading", key: "loading" });

    try {
      const response = await fetch("/api/finance", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
      }

      setReport(data);
      setStatus({
        type: "success",
        key:
          Object.keys(data.totalsByCurrency).length > 1
            ? "separateCurrencies"
            : "success",
      });
    } catch (error) {
      setReport(null);
      setStatus({
        type: "error",
        key: "error",
        detail: error instanceof Error ? error.message : "Unknown error.",
      });
    }
  }, []);

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  function selectLanguage(value) {
    setLanguage(value);
  }

  function selectTheme(value) {
    setTheme(value);
  }

  return (
    <main className="page">
      <nav className="toolbar" aria-label={text.settings}>
        <div className="control-group">
          <span className="control-label">{text.languageLabel}</span>
          <div className="segmented-control" role="group" aria-label="Language">
            {['ru', 'en'].map((value) => (
              <button
                className={`segment ${language === value ? "is-active" : ""}`}
                type="button"
                aria-pressed={language === value}
                key={value}
                onClick={() => selectLanguage(value)}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">{text.themeLabel}</span>
          <div className="segmented-control" role="group" aria-label="Theme">
            <button
              className={`segment theme-icon ${theme === "light" ? "is-active" : ""}`}
              type="button"
              aria-label="Light theme"
              aria-pressed={theme === "light"}
              onClick={() => selectTheme("light")}
            >
              ☀
            </button>
            <button
              className={`segment theme-icon ${theme === "dark" ? "is-active" : ""}`}
              type="button"
              aria-label="Dark theme"
              aria-pressed={theme === "dark"}
              onClick={() => selectTheme("dark")}
            >
              ☾
            </button>
          </div>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>
        <button
          id="refresh-button"
          type="button"
          disabled={status.type === "loading"}
          onClick={loadRevenue}
        >
          {text.refresh}
        </button>
        <Link className="secondary-link" href="/sources">
          {text.sourcesPage}
        </Link>
      </header>

      <section className={`status status--${status.type}`} aria-live="polite">
        {text[status.key]}
        {status.detail ? `: ${status.detail}` : ""}
      </section>

      {report && (
        <>
          <section className="summary" aria-label={text.summaryLabel}>
            <Totals totals={report.totalsByCurrency} language={language} />
          </section>
          <section className="sources" aria-label={text.sourcesLabel}>
            <SourceCard
              name={text.source1}
              source={report.source1}
              language={language}
              text={text}
              showTransactions
            />
            <SourceCard
              name={text.source2}
              source={report.source2}
              language={language}
              text={text}
            />
          </section>
        </>
      )}
    </main>
  );
}
