"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const translations = {
  ru: {
    back: "← Отчёт о прибыли",
    eyebrow: "Прозрачность данных",
    title: "Источники расчётов",
    subtitle:
      "Здесь показаны внешние API, их формат и результаты текущей автоматической проверки качества данных.",
    refresh: "Проверить снова",
    loading: "Проверяем текущие ответы API…",
    error: "Не удалось проверить источники",
    healthy: "Проблем не найдено",
    warning: "Есть замечания",
    broken: "Найдены ошибки",
    format: "Ожидаемый формат",
    endpoint: "Endpoint",
    issues: "Потенциальные проблемы",
    noIssues: "Текущий ответ соответствует проверяемому контракту.",
    generated: "Проверено",
    languageLabel: "Язык",
    themeLabel: "Тема",
    settings: "Настройки страницы",
    severityError: "Ошибка",
    severityWarning: "Предупреждение",
  },
  en: {
    back: "← Revenue report",
    eyebrow: "Data transparency",
    title: "Calculation sources",
    subtitle:
      "This page shows the external APIs, their expected format, and the latest automated data-quality results.",
    refresh: "Check again",
    loading: "Checking current API responses…",
    error: "Could not check the sources",
    healthy: "No problems found",
    warning: "Review recommended",
    broken: "Errors detected",
    format: "Expected format",
    endpoint: "Endpoint",
    issues: "Potential problems",
    noIssues: "The current response matches the checked contract.",
    generated: "Checked",
    languageLabel: "Language",
    themeLabel: "Appearance",
    settings: "Page settings",
    severityError: "Error",
    severityWarning: "Warning",
  },
};

function SourceStatus({ status, text }) {
  const label =
    status === "error"
      ? text.broken
      : status === "warning"
        ? text.warning
        : text.healthy;

  return <span className={`source-status source-status--${status}`}>{label}</span>;
}

function SourceAuditCard({ source, audit, text }) {
  const sourceAudit = audit.sources.find((item) => item.sourceId === source.id);
  const issues = audit.issues.filter((issue) => issue.sourceId === source.id);
  const status = sourceAudit?.status ?? "error";

  return (
    <article className="audit-card">
      <div className="audit-card__heading">
        <div>
          <p className="source-label">{source.id}</p>
          <h2>{source.name}</h2>
        </div>
        <SourceStatus status={status} text={text} />
      </div>

      <dl className="source-contract">
        <div>
          <dt>{text.endpoint}</dt>
          <dd>
            <a href={source.endpoint} target="_blank" rel="noreferrer">
              {source.endpoint}
            </a>
          </dd>
        </div>
        <div>
          <dt>{text.format}</dt>
          <dd>{source.format}</dd>
        </div>
      </dl>

      <div className="issue-section">
        <h3>{text.issues}</h3>
        {issues.length === 0 ? (
          <p className="empty">{text.noIssues}</p>
        ) : (
          <ul className="issue-list">
            {issues.map((issue, index) => (
              <li key={`${issue.code}-${issue.path}-${index}`}>
                <div>
                  <span className={`issue-severity issue-severity--${issue.severity}`}>
                    {issue.severity === "error"
                      ? text.severityError
                      : text.severityWarning}
                  </span>
                  <code>{issue.code}</code>
                </div>
                <strong>{issue.path}</strong>
                <p>{issue.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function SourcesDashboard() {
  const [language, setLanguage] = useState("ru");
  const [theme, setTheme] = useState("light");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ type: "loading" });
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

  const loadAudit = useCallback(async () => {
    setStatus({ type: "loading" });

    try {
      const response = await fetch("/api/finance/audit", { cache: "no-store" });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error ?? "Request failed.");
      }

      setData(responseData);
      setStatus({ type: "success" });
    } catch (error) {
      setData(null);
      setStatus({
        type: "error",
        detail: error instanceof Error ? error.message : "Unknown error.",
      });
    }
  }, []);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  return (
    <main className="page sources-page">
      <nav className="page-navigation" aria-label={text.settings}>
        <Link className="back-link" href="/">
          {text.back}
        </Link>
        <div className="toolbar toolbar--inline">
          <div className="control-group">
            <span className="control-label">{text.languageLabel}</span>
            <div className="segmented-control" role="group" aria-label="Language">
              {["ru", "en"].map((value) => (
                <button
                  className={`segment ${language === value ? "is-active" : ""}`}
                  type="button"
                  aria-pressed={language === value}
                  key={value}
                  onClick={() => setLanguage(value)}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <span className="control-label">{text.themeLabel}</span>
            <div className="segmented-control" role="group" aria-label="Theme">
              {[
                ["light", "☀"],
                ["dark", "☾"],
              ].map(([value, icon]) => (
                <button
                  className={`segment theme-icon ${theme === value ? "is-active" : ""}`}
                  type="button"
                  aria-label={`${value} theme`}
                  aria-pressed={theme === value}
                  key={value}
                  onClick={() => setTheme(value)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <header className="hero hero--sources">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="subtitle">{text.subtitle}</p>
        <button
          className="primary-button"
          type="button"
          disabled={status.type === "loading"}
          onClick={loadAudit}
        >
          {text.refresh}
        </button>
      </header>

      {status.type === "loading" && (
        <section className="status" aria-live="polite">
          {text.loading}
        </section>
      )}
      {status.type === "error" && (
        <section className="status status--error" aria-live="polite">
          {text.error}: {status.detail}
        </section>
      )}

      {data && (
        <>
          <section className="audit-summary" aria-label={text.issues}>
            <div>
              <span>{text.generated}</span>
              <strong>{new Date(data.audit.generatedAt).toLocaleString(language)}</strong>
            </div>
            <div>
              <span>{text.severityError}</span>
              <strong>{data.audit.summary.errors}</strong>
            </div>
            <div>
              <span>{text.severityWarning}</span>
              <strong>{data.audit.summary.warnings}</strong>
            </div>
          </section>
          <section className="audit-grid">
            {data.sources.map((source) => (
              <SourceAuditCard
                source={source}
                audit={data.audit}
                text={text}
                key={source.id}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
