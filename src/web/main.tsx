import React, {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import {
  ArrowRight,
  ArrowSquareOut,
  Bell,
  ChartLine,
  CheckCircle,
  Clock,
  Copy,
  Database,
  FloppyDisk,
  GearSix,
  Lightning,
  MagnifyingGlass,
  Play,
  Plus,
  Pulse,
  SquaresFour,
  Stack,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import type {
  AlertInput,
  AlertRule,
  QueryResult,
  QuerySpec,
  PresetQuerySpec,
  SqlQuerySpec,
  Snapshot,
  VisualizationKind,
  VisualizationMapping,
} from "../shared/types";
import { isSqlQuery } from "../shared/types";
import { Visualization, formatNumber } from "./Visualization";
import { previewResult } from "./demo";
import { alertSql, parseParameters, sqlExample } from "./sql";
import "@cloudflare/kumo/styles/standalone";
import "./styles.css";

const templates: {
  id: PresetQuerySpec["template"];
  title: string;
  description: string;
  kind: VisualizationKind;
}[] = [
  {
    id: "request_rate",
    title: "Request rate",
    description: "Incoming requests over time",
    kind: "line",
  },
  {
    id: "latency_heatmap",
    title: "Latency distribution",
    description: "Find patterns across span durations",
    kind: "heatmap",
  },
  {
    id: "trace_waterfall",
    title: "Trace waterfall",
    description: "Follow a request across services",
    kind: "waterfall",
  },
  {
    id: "recent_logs",
    title: "Recent logs",
    description: "Structured logs in context",
    kind: "table",
  },
  {
    id: "error_rate",
    title: "Error rate",
    description: "Failed requests in a fixed time window",
    kind: "line",
  },
];
const initialQuery = (): PresetQuerySpec => ({
  template: "request_rate",
  from: new Date(Date.now() - 3600000).toISOString(),
  to: new Date().toISOString(),
  limit: 1000,
});
const dateText = (value: string) =>
  new Date(value).toLocaleString("en", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
const templateFor = (query: QuerySpec) =>
  isSqlQuery(query)
    ? {
        title: "SQL query",
        description: "Returned directly from your ClickHouse query",
        kind: "table" as const,
      }
    : templates.find((item) => item.id === query.template)!;
type Api = <T>(path: string, init?: RequestInit) => Promise<T>;
type Summary = Pick<
  Snapshot,
  "id" | "title" | "visualization" | "createdAt" | "url"
>;

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("o11y-api-token") ?? "",
  );
  const [path, setPath] = useState(location.pathname);
  const [notice, setNotice] = useState("");
  const preview = !token;
  const navigate = useCallback((next: string) => {
    history.pushState({}, "", next);
    setPath(location.pathname);
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const listener = () => setPath(location.pathname);
    addEventListener("popstate", listener);
    return () => removeEventListener("popstate", listener);
  }, []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  const api = useCallback(
    async <T,>(endpoint: string, init: RequestInit = {}): Promise<T> => {
      const response = await fetch(endpoint, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...init.headers,
        },
      });
      const body = (await response.json().catch(() => null)) as {
        error?: string | { message?: string };
      } | null;
      if (!response.ok)
        throw new Error(
          typeof body?.error === "string"
            ? body.error
            : (body?.error?.message ?? `Request failed (${response.status})`),
        );
      return body as T;
    },
    [token],
  );
  const active = path.startsWith("/s/") ? "/saved" : path;
  const links = [
    { path: "/", label: "Overview", icon: SquaresFour },
    { path: "/explore", label: "Explore", icon: MagnifyingGlass },
    { path: "/saved", label: "Saved views", icon: Stack },
    { path: "/alerts", label: "Alerts", icon: Bell },
  ];
  function NavLink({
    to,
    children,
    icon: Icon,
  }: {
    to: string;
    children: ReactNode;
    icon: typeof Stack;
  }) {
    return (
      <a
        href={to}
        className={`nav-item ${active === to ? "active" : ""}`}
        aria-current={active === to ? "page" : undefined}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            navigate(to);
          }
        }}
      >
        <Icon size={19} weight={active === to ? "fill" : "regular"} />
        {children}
      </a>
    );
  }
  return (
    <div className="app-shell">
      <header className="global-header">
        <a
          href="/"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          <span className="brand-mark">
            <Pulse size={24} weight="bold" />
          </span>
          <strong>
            mvp<span>o11y</span>
          </strong>
        </a>
        <div className="workspace-label">
          Workspace <span>/</span> Observability
        </div>
        <div className="header-right">
          <span className={`connection-pill ${preview ? "preview" : ""}`}>
            <i />
            {preview ? "Preview mode" : "API configured"}
          </span>
          <a
            className="github-link"
            href="https://github.com/jmorrell/mvp-o11y"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowSquareOut size={14} />
          </a>
          <span className="avatar">JM</span>
        </div>
      </header>
      <aside className="sidebar">
        <div className="workspace-card">
          <span className="workspace-icon">
            <Database size={20} />
          </span>
          <div>
            <strong>My workspace</strong>
            <small>Observability platform</small>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} icon={link.icon}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mcp-callout">
            <span className="mcp-icon">
              <Lightning size={18} weight="fill" />
            </span>
            <strong>Built for your conversations</strong>
            <p>Explore your telemetry through MCP and interactive apps.</p>
            <a
              href="/settings"
              onClick={(event) => {
                event.preventDefault();
                navigate("/settings");
              }}
            >
              Connect an AI client <ArrowRight size={14} />
            </a>
          </div>
          <NavLink to="/settings" icon={GearSix}>
            Settings
          </NavLink>
          <div className="sidebar-footer">
            <i /> Powered by Cloudflare
          </div>
        </div>
      </aside>
      <main className="main-content">
        {preview && (
          <div className="preview-banner">
            <span>
              <span className="preview-label">PREVIEW</span> You're exploring
              example telemetry. Connect your workspace to query real data.
            </span>
            <button onClick={() => navigate("/settings")}>
              Connect workspace <ArrowRight size={14} />
            </button>
          </div>
        )}
        {path === "/" ? (
          <Overview api={api} preview={preview} navigate={navigate} />
        ) : path === "/explore" ? (
          <Explore
            api={api}
            preview={preview}
            navigate={navigate}
            notify={setNotice}
          />
        ) : path === "/saved" ? (
          <SavedViews api={api} preview={preview} navigate={navigate} />
        ) : path === "/alerts" ? (
          <Alerts
            api={api}
            preview={preview}
            notify={setNotice}
            navigate={navigate}
          />
        ) : path === "/settings" ? (
          <Settings
            token={token}
            save={(next) => {
              if (next) sessionStorage.setItem("o11y-api-token", next);
              else sessionStorage.removeItem("o11y-api-token");
              setToken(next);
              setNotice(
                next
                  ? "API token saved for this browser session."
                  : "Disconnected. Preview mode is active.",
              );
            }}
            notify={setNotice}
          />
        ) : path.startsWith("/s/") ? (
          <SnapshotPage
            id={path.slice(3)}
            api={api}
            preview={preview}
            navigate={navigate}
            notify={setNotice}
          />
        ) : (
          <Empty
            title="Page not found"
            text="Choose a page from the sidebar to continue."
          />
        )}
        <footer className="page-footer">
          <span>mvp o11y</span>
          <span>Telemetry in. Answers out.</span>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle size={18} />
          {notice}
        </div>
      )}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="error-box" role="alert">
      <WarningCircle size={19} />
      <span>{message}</span>
    </div>
  );
}
function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Stack size={30} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
function ResultMeta({ result }: { result: QueryResult }) {
  return (
    <div className="result-meta">
      <span>
        <Clock size={13} />
        {isSqlQuery(result.query)
          ? `Executed ${dateText(result.executedAt)} UTC`
          : `${dateText(result.query.from)} — ${dateText(result.query.to)} UTC`}
      </span>
      <span>
        {result.rows.length.toLocaleString()} rows
        {result.truncated ? " · limit reached" : ""}
      </span>
    </div>
  );
}
function Overview({
  api,
  preview,
  navigate,
}: {
  api: Api;
  preview: boolean;
  navigate: (path: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const queries = [
      query,
      { ...query, template: "latency_heatmap" as const },
      { ...query, template: "error_rate" as const },
    ];
    (preview
      ? Promise.resolve(queries.map(previewResult))
      : Promise.all(
          queries.map((item) =>
            api<QueryResult>("/api/query", {
              method: "POST",
              body: JSON.stringify(item),
            }),
          ),
        )
    )
      .then((value) => {
        if (active) setResults(value);
      })
      .catch((err) => {
        if (active) {
          setError(String(err.message));
          setResults([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, preview, query]);
  const requestValues = results[0]?.rows.map((row) => Number(row.value)) ?? [];
  const average = requestValues.length
    ? (requestValues.reduce((a, b) => a + b, 0) * 60000) /
      (new Date(query.to).valueOf() - new Date(query.from).valueOf())
    : null;
  const errors = results[2]?.rows[0]?.value;
  return (
    <>
      <PageHeading
        eyebrow="YOUR SYSTEM, AT A GLANCE"
        title="Overview"
        description="Understand what's happening across your services."
      >
        <Button variant="secondary" onClick={() => setQuery(initialQuery())}>
          <Clock size={16} /> Last hour · Refresh
        </Button>
        <Button variant="primary" onClick={() => navigate("/explore")}>
          <MagnifyingGlass size={16} /> Explore data
        </Button>
      </PageHeading>
      {error && <ErrorBox message={error} />}
      <div className="metric-grid">
        <div className="metric-card">
          <span>
            Average request rate <ChartLine size={17} />
          </span>
          <strong>
            {loading ? "—" : average === null ? "—" : formatNumber(average)}
            <small>req/s</small>
          </strong>
          <p>Across the selected hour</p>
        </div>
        <div className="metric-card">
          <span>
            Error rate <WarningCircle size={17} />
          </span>
          <strong>
            {loading || errors === undefined
              ? "—"
              : formatNumber(Number(errors))}
            <small>%</small>
          </strong>
          <p>Requests marked as errors</p>
          <div className="metric-foot">
            {preview ? "Example telemetry" : "From recorded traces"}
          </div>
        </div>
        <div className="metric-card preserve-card">
          <span>
            Keep the evidence <Stack size={17} />
          </span>
          <h3>A moment, preserved.</h3>
          <p>
            Save a query result with its exact time range and a permanent URL.
          </p>
          <button onClick={() => navigate("/saved")}>
            View saved results <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Request rate</h2>
            <p>Requests per second, grouped by service</p>
          </div>
          <span className="subtle-badge">
            {preview ? "Example data" : "ClickHouse"}
          </span>
        </div>
        {loading ? (
          <div className="loading-chart">Loading telemetry…</div>
        ) : results[0] ? (
          <>
            <Visualization result={results[0]} kind="line" compact />
            <ResultMeta result={results[0]} />
          </>
        ) : (
          <Empty
            title="Telemetry unavailable"
            text="Check your connection and try refreshing."
          />
        )}
      </section>
      <div className="overview-bottom">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Latency distribution</h2>
              <p>Spot slow requests and changing patterns</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/explore")}
            >
              Explore <ArrowRight size={14} />
            </Button>
          </div>
          {loading ? (
            <div className="loading-chart">Loading distribution…</div>
          ) : results[1] ? (
            <Visualization result={results[1]} kind="heatmap" compact />
          ) : (
            <Empty
              title="No distribution"
              text="Run a query to inspect your spans."
            />
          )}
        </section>
        <section className="panel explore-card">
          <div className="panel-header">
            <div>
              <h2>Start investigating</h2>
              <p>A useful view for every question</p>
            </div>
          </div>
          {templates.slice(1, 4).map((template, index) => (
            <button
              key={template.id}
              className="investigate-item"
              onClick={() => navigate(`/explore?template=${template.id}`)}
            >
              <span className={`investigate-icon tone-${index}`}>
                {index === 0 ? (
                  <SquaresFour size={20} />
                ) : index === 1 ? (
                  <Pulse size={20} />
                ) : (
                  <Stack size={20} />
                )}
              </span>
              <span>
                <strong>{template.title}</strong>
                <small>{template.description}</small>
              </span>
              <ArrowRight size={17} />
            </button>
          ))}
        </section>
      </div>
    </>
  );
}
function MappingFields({
  kind,
  columns,
  mapping,
  onChange,
}: {
  kind: VisualizationKind;
  columns: string[];
  mapping: VisualizationMapping;
  onChange: (mapping: VisualizationMapping) => void;
}) {
  const fields: [keyof VisualizationMapping, string][] =
    kind === "line"
      ? [
          ["time", "Time"],
          ["value", "Value"],
          ["series", "Series (optional)"],
        ]
      : kind === "heatmap"
        ? [
            ["time", "Time"],
            ["bucket", "Bucket start"],
            ["count", "Count"],
          ]
        : kind === "waterfall"
          ? [
              ["startTime", "Start time (UTC or epoch ms)"],
              ["durationMs", "Duration (ms)"],
              ["name", "Operation"],
              ["service", "Service"],
              ["spanId", "Span ID"],
              ["parentSpanId", "Parent span ID"],
              ["status", "Status"],
            ]
          : [];
  if (!fields.length) return null;
  return (
    <details className="mapping-controls" open>
      <summary>Chart columns</summary>
      <div className="mapping-fields">
        {fields.map(([field, label]) => (
          <label key={field}>
            <span>{label}</span>
            <select
              aria-label={`${label} column`}
              value={String(mapping[field] ?? "")}
              onChange={(event) =>
                onChange({
                  ...mapping,
                  [field]: event.target.value || undefined,
                })
              }
            >
              <option value="">Automatic</option>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>
        ))}
        {(kind === "line" || kind === "heatmap") && (
          <label>
            <span>Time bucket (ms)</span>
            <Input
              aria-label="Time bucket in milliseconds"
              type="number"
              min={0.001}
              step="any"
              placeholder="Infer from result"
              value={mapping.timeBucketMs ?? ""}
              onChange={(event) =>
                onChange({
                  ...mapping,
                  timeBucketMs: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
            />
          </label>
        )}
        {kind === "heatmap" && (
          <label>
            <span>Value bucket size</span>
            <Input
              aria-label="Value bucket size"
              type="number"
              min={0.001}
              step="any"
              placeholder="Infer from result"
              value={mapping.valueBucketSize ?? ""}
              onChange={(event) =>
                onChange({
                  ...mapping,
                  valueBucketSize: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
            />
          </label>
        )}
      </div>
    </details>
  );
}
function Explore({
  api,
  preview,
  navigate,
  notify,
}: {
  api: Api;
  preview: boolean;
  navigate: (path: string) => void;
  notify: (message: string) => void;
}) {
  const [example] = useState(() => {
    const id = new URLSearchParams(location.search).get("template");
    return sqlExample(
      templates.some((t) => t.id === id)
        ? (id as PresetQuerySpec["template"])
        : "request_rate",
    );
  });
  const [query, setQuery] = useState<SqlQuerySpec>(example.query);
  const [parameterText, setParameterText] = useState(
    JSON.stringify(example.query.parameters, null, 2),
  );
  const [kind, setKind] = useState<VisualizationKind>(example.kind);
  const [mapping, setMapping] = useState<VisualizationMapping>(example.mapping);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [showSql, setShowSql] = useState(false),
    [title, setTitle] = useState(""),
    [showSave, setShowSave] = useState(false);
  let changed = false;
  if (result) {
    try {
      changed =
        query.sql !== result.sql ||
        query.limit !== result.query.limit ||
        JSON.stringify(parseParameters(parameterText)) !==
          JSON.stringify(result.parameters);
    } catch {
      changed = true;
    }
  }
  function loadExample(id: PresetQuerySpec["template"]) {
    const next = sqlExample(id);
    setQuery(next.query);
    setParameterText(JSON.stringify(next.query.parameters, null, 2));
    setKind(next.kind);
    setMapping(next.mapping);
    setError("");
  }
  async function run(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (preview) {
      setError("Connect your workspace to execute SQL against ClickHouse.");
      return;
    }
    setLoading(true);
    try {
      const parameters = parseParameters(parameterText);
      const next = await api<QueryResult>("/api/query", {
        method: "POST",
        body: JSON.stringify({
          sql: query.sql,
          parameters,
          limit: query.limit,
        }),
      });
      setResult(next);
      setMapping((current) =>
        Object.fromEntries(
          Object.entries(current).filter(
            ([, value]) =>
              typeof value === "number" || next.columns.includes(String(value)),
          ),
        ),
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!result || preview) return;
    setError("");
    setSaving(true);
    try {
      const snapshot = await api<Snapshot>("/api/snapshots", {
        method: "POST",
        body: JSON.stringify({
          query: result.query,
          title: title.trim() || "SQL query",
          visualization: kind,
          mapping: kind === "table" ? undefined : mapping,
        }),
      });
      notify("Query result preserved in R2.");
      navigate(`/s/${snapshot.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="FROM SIGNAL TO ANSWER"
        title="Explore"
        description="Write ClickHouse SQL. Visualize the result. Keep the evidence."
      />
      <form className="panel query-panel" onSubmit={run}>
        <div className="query-topline">
          <span className="field-label">
            <Database size={16} /> SQL editor
          </span>
          <span className="subtle-badge">ClickHouse SQL</span>
        </div>
        <div className="template-picker" aria-label="SQL examples">
          <span className="example-label">Start from an example</span>
          {templates.map((template) => (
            <button
              type="button"
              key={template.id}
              onClick={() => loadExample(template.id)}
            >
              {template.title}
            </button>
          ))}
        </div>
        <label className="sql-editor-label">
          <span>Query</span>
          <textarea
            className="sql-editor"
            aria-label="SQL query"
            required
            rows={10}
            spellCheck={false}
            value={query.sql}
            onChange={(event) =>
              setQuery({ ...query, sql: event.target.value })
            }
          />
        </label>
        <div className="sql-options">
          <label className="parameter-editor">
            <span>Parameters (JSON)</span>
            <textarea
              className="sql-editor"
              aria-label="SQL parameters"
              rows={5}
              spellCheck={false}
              value={parameterText}
              onChange={(event) => setParameterText(event.target.value)}
            />
            <small>
              Use typed placeholders such as {"{service:String}"} or{" "}
              {"{count:UInt64}"} in SQL.
            </small>
          </label>
          <div className="sql-run-options">
            <label>
              <span>Result limit</span>
              <Input
                aria-label="Result limit"
                type="number"
                required
                min={1}
                max={10000}
                value={query.limit ?? 1000}
                onChange={(event) =>
                  setQuery({ ...query, limit: Number(event.target.value) })
                }
              />
            </label>
            <Button variant="primary" type="submit" disabled={loading}>
              <Play size={15} weight="fill" />
              {loading ? "Running…" : "Run query"}
            </Button>
            {preview && (
              <button
                type="button"
                className="text-link"
                onClick={() => navigate("/settings")}
              >
                Connect workspace <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="sql-help">
          Use fixed time values and a stable ORDER BY to make results
          reproducible. Tables include otel_traces, otel_logs, and
          otel_metrics_*.
        </p>
      </form>
      {error && <ErrorBox message={error} />}
      <section className="panel result-panel">
        <div className="panel-header">
          <div>
            <h2>
              Query result{" "}
              {changed && (
                <span className="subtle-badge">
                  Query changed · run to update
                </span>
              )}
            </h2>
            <p>
              {result
                ? "Choose how to display the returned columns"
                : "Run SQL to inspect your data"}
            </p>
          </div>
          <div className="panel-actions">
            <label className="visualization-selector">
              <span>Display</span>
              <select
                aria-label="Visualization"
                value={kind}
                onChange={(event) =>
                  setKind(event.target.value as VisualizationKind)
                }
              >
                <option value="table">Table</option>
                <option value="line">Line graph</option>
                <option value="heatmap">Heatmap</option>
                <option value="waterfall">Trace waterfall</option>
              </select>
            </label>
            {result && (
              <Button
                variant="secondary"
                onClick={() => setShowSave(!showSave)}
              >
                <FloppyDisk size={16} /> Save view
              </Button>
            )}
          </div>
        </div>
        {result && (
          <MappingFields
            kind={kind}
            columns={result.columns}
            mapping={mapping}
            onChange={setMapping}
          />
        )}
        {loading ? (
          <div className="loading-chart">Querying ClickHouse…</div>
        ) : result ? (
          <>
            <Visualization result={result} kind={kind} mapping={mapping} />
            <ResultMeta result={result} />
          </>
        ) : (
          <Empty
            title={
              preview
                ? "Connect to run your SQL"
                : "Your next answer starts here"
            }
            text={
              preview
                ? "The SQL editor is ready. Connect your workspace to execute queries and save their results."
                : "Write a query or edit an example, then choose a visualization for its columns."
            }
          />
        )}
        {showSave && !preview && (
          <form className="save-form" onSubmit={save}>
            <label>
              <span>View title</span>
              <Input
                aria-label="View title"
                maxLength={160}
                placeholder="SQL query"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <p>
              Runs the last executed SQL and parameters again and stores its
              result and chart columns permanently in R2.
            </p>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save permanent view"}
            </Button>
          </form>
        )}
      </section>
      {result && (
        <section className="panel sql-panel">
          <button
            className="sql-toggle"
            onClick={() => setShowSql(!showSql)}
            aria-expanded={showSql}
          >
            <span>
              <span className="code-icon">SQL</span> Executed query details
            </span>
            <span>
              {showSql ? "Hide" : "Show"} SQL {showSql ? "−" : "+"}
            </span>
          </button>
          {showSql && (
            <>
              <pre>{result.sql}</pre>
              <pre>{JSON.stringify(result.parameters, null, 2)}</pre>
            </>
          )}
        </section>
      )}
      <div className="info-line">
        <CheckCircle size={16} /> Saved views capture the SQL, parameters, chart
        columns, and result together. Opening a saved view never reruns its
        query.
      </div>
    </>
  );
}
function SavedViews({
  api,
  preview,
  navigate,
}: {
  api: Api;
  preview: boolean;
  navigate: (path: string) => void;
}) {
  const [snapshots, setSnapshots] = useState<Summary[]>([]),
    [loading, setLoading] = useState(!preview),
    [error, setError] = useState(""),
    [cursor, setCursor] = useState<string | undefined>(),
    [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    if (preview) {
      setSnapshots([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    api<{ snapshots: Summary[]; cursor?: string }>("/api/snapshots")
      .then((data) => {
        if (active) {
          setSnapshots(data.snapshots);
          setCursor(data.cursor);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, preview]);
  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    setError("");
    try {
      const data = await api<{ snapshots: Summary[]; cursor?: string }>(
        `/api/snapshots?cursor=${encodeURIComponent(cursor)}`,
      );
      setSnapshots((previous) => [...previous, ...data.snapshots]);
      setCursor(data.cursor);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingMore(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="ANSWERS THAT LAST"
        title="Saved views"
        description="Immutable results with permanent links. The same evidence, every time."
      >
        <Button variant="primary" onClick={() => navigate("/explore")}>
          <Plus size={16} /> New view
        </Button>
      </PageHeading>
      {error && <ErrorBox message={error} />}
      <section className="panel">
        {loading ? (
          <div className="loading-chart">Loading saved views…</div>
        ) : snapshots.length ? (
          <div className="saved-list">
            {snapshots.map((snapshot) => (
              <button
                key={snapshot.id}
                onClick={() => navigate(`/s/${snapshot.id}`)}
              >
                <span className="saved-icon">
                  {snapshot.visualization === "line" ? (
                    <ChartLine size={23} />
                  ) : (
                    <Stack size={23} />
                  )}
                </span>
                <span>
                  <strong>{snapshot.title}</strong>
                  <small>
                    {snapshot.visualization} · Saved{" "}
                    {dateText(snapshot.createdAt)} UTC
                  </small>
                </span>
                <span className="subtle-badge">Preserved in R2</span>
                <ArrowRight size={18} />
              </button>
            ))}
            {cursor && (
              <div className="pagination-footer">
                <Button
                  variant="secondary"
                  disabled={loadingMore}
                  onClick={loadMore}
                >
                  {loadingMore ? "Loading…" : "Load more views"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Empty
            title="Save your first finding"
            text="Run a query in Explore, then save its result. Every saved view gets a permanent URL and can be opened in an MCP app."
          >
            <Button variant="primary" onClick={() => navigate("/explore")}>
              Explore your data <ArrowRight size={15} />
            </Button>
          </Empty>
        )}
      </section>
    </>
  );
}
function SnapshotPage({
  id,
  api,
  preview,
  navigate,
  notify,
}: {
  id: string;
  api: Api;
  preview: boolean;
  navigate: (path: string) => void;
  notify: (message: string) => void;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    setSnapshot(null);
    setError("");
    if (preview) return;
    let active = true;
    api<Snapshot>(`/api/snapshots/${encodeURIComponent(id)}`)
      .then((data) => {
        if (active) setSnapshot(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [api, id, preview]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(location.href);
      notify("Permanent URL copied.");
    } catch {
      notify("Copy the permanent URL from your address bar.");
    }
  }
  if (preview)
    return (
      <Empty
        title="Connect to open this view"
        text="This saved result belongs to your workspace. Add its API token to open the permanent view."
      >
        <Button variant="primary" onClick={() => navigate("/settings")}>
          Connect workspace
        </Button>
      </Empty>
    );
  if (error) return <ErrorBox message={error} />;
  if (!snapshot)
    return <div className="loading-chart">Opening preserved result…</div>;
  return (
    <>
      <PageHeading
        eyebrow="PERMANENT VIEW"
        title={snapshot.title}
        description={`Preserved ${dateText(snapshot.createdAt)} UTC · This result never changes.`}
      >
        <Button variant="secondary" onClick={copy}>
          <Copy size={16} /> Copy link
        </Button>
      </PageHeading>
      <section className="panel">
        <div className="panel-header">
          <h2>{templateFor(snapshot.query).title}</h2>
          <span className="preserved-badge">
            <CheckCircle size={14} /> Preserved in R2
          </span>
        </div>
        <Visualization
          result={snapshot}
          kind={snapshot.visualization}
          mapping={snapshot.mapping}
        />
        <ResultMeta result={snapshot} />
      </section>
      <details className="panel snapshot-details">
        <summary>Query and integrity details</summary>
        <pre>{snapshot.sql}</pre>
        <pre>{JSON.stringify(snapshot.parameters, null, 2)}</pre>
        {snapshot.mapping && (
          <pre>{JSON.stringify(snapshot.mapping, null, 2)}</pre>
        )}
        <div className="hash">
          SHA-256 <code>{snapshot.sha256}</code>
        </div>
      </details>
    </>
  );
}
const emptyAlert: AlertInput = {
  name: "",
  sql: alertSql,
  parameters: {},
  valueColumn: "value",
  windowMinutes: 5,
  threshold: 1,
  comparison: "gt",
  webhookUrl: "",
  cooldownMinutes: 15,
  enabled: true,
};
function Alerts({
  api,
  preview,
  notify,
  navigate,
}: {
  api: Api;
  preview: boolean;
  notify: (message: string) => void;
  navigate: (path: string) => void;
}) {
  const [alerts, setAlerts] = useState<AlertRule[]>([]),
    [form, setForm] = useState<AlertInput>(emptyAlert),
    [parameterText, setParameterText] = useState("{}"),
    [editing, setEditing] = useState<string | null>(null),
    [open, setOpen] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(!preview),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (preview) {
      setAlerts([]);
      setLoading(false);
      return;
    }
    let active = true;
    api<{ alerts: AlertRule[] }>("/api/alerts")
      .then((data) => {
        if (active) setAlerts(data.alerts);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, preview]);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (preview) {
      navigate("/settings");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const payload =
        form.sql !== undefined
          ? { ...form, parameters: parseParameters(parameterText) }
          : form;
      const alert = await api<AlertRule>(
        editing ? `/api/alerts/${editing}` : "/api/alerts",
        { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) },
      );
      setAlerts((current) =>
        editing
          ? current.map((rule) => (rule.id === editing ? alert : rule))
          : [...current, alert],
      );
      setOpen(false);
      setEditing(null);
      setForm(emptyAlert);
      setParameterText("{}");
      notify("Alert rule saved.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(rule: AlertRule) {
    if (!confirm(`Delete alert “${rule.name}”?`)) return;
    setBusy(true);
    try {
      await api(`/api/alerts/${rule.id}`, { method: "DELETE" });
      setAlerts((current) => current.filter((item) => item.id !== rule.id));
      notify("Alert deleted.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="KNOW WHEN IT MATTERS"
        title="Alerts"
        description="Evaluate a query on a schedule. Send a webhook when a threshold is crossed."
      >
        <Button
          variant="primary"
          onClick={() => {
            setForm(emptyAlert);
            setParameterText("{}");
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus size={16} /> Create alert
        </Button>
      </PageHeading>
      {error && <ErrorBox message={error} />}
      {open && (
        <form className="panel alert-form" onSubmit={save}>
          <div className="panel-header">
            <h2>{editing ? "Edit alert" : "Create an alert"}</h2>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
          <div className="form-grid">
            <label>
              <span>Alert name</span>
              <Input
                aria-label="Alert name"
                required
                placeholder="High request count"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </label>
            <label>
              <span>Query source</span>
              <select
                aria-label="Alert query source"
                value={form.sql !== undefined ? "sql" : "preset"}
                onChange={(event) => {
                  const {
                    sql: _sql,
                    template: _template,
                    parameters: _parameters,
                    valueColumn: _valueColumn,
                    service: _service,
                    ...base
                  } = form;
                  setForm(
                    event.target.value === "sql"
                      ? {
                          ...base,
                          sql: alertSql,
                          parameters: {},
                          valueColumn: "value",
                        }
                      : { ...base, template: "error_rate" },
                  );
                  setParameterText("{}");
                }}
              >
                <option value="sql">SQL query</option>
                <option value="preset">Preset query</option>
              </select>
            </label>
            {form.sql !== undefined ? (
              <>
                <label className="wide-field">
                  <span>SQL query</span>
                  <textarea
                    aria-label="Alert SQL query"
                    className="sql-editor"
                    rows={7}
                    required
                    spellCheck={false}
                    value={form.sql}
                    onChange={(event) =>
                      setForm({ ...form, sql: event.target.value })
                    }
                  />
                  <small className="sql-help">
                    Return exactly one row. The selected value column must be
                    numeric. Reserved {"{from:String}"} and {"{to:String}"}{" "}
                    parameters receive the evaluation window in UTC.
                  </small>
                </label>
                <label>
                  <span>Parameters (JSON)</span>
                  <textarea
                    aria-label="Alert SQL parameters"
                    className="sql-editor"
                    rows={4}
                    spellCheck={false}
                    value={parameterText}
                    onChange={(event) => setParameterText(event.target.value)}
                  />
                </label>
                <label>
                  <span>Value column</span>
                  <Input
                    aria-label="Alert value column"
                    required
                    value={form.valueColumn ?? "value"}
                    onChange={(event) =>
                      setForm({ ...form, valueColumn: event.target.value })
                    }
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  <span>Service</span>
                  <Input
                    aria-label="Alert service"
                    placeholder="All services"
                    value={form.service ?? ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        service: event.target.value || undefined,
                      })
                    }
                  />
                </label>
                <label>
                  <span>Query</span>
                  <select
                    value={form.template}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        template: event.target.value as AlertInput["template"],
                      })
                    }
                  >
                    <option value="error_rate">Error rate (%)</option>
                    <option value="request_rate">Request rate (req/s)</option>
                  </select>
                </label>
              </>
            )}
            <label>
              <span>Evaluation window (minutes)</span>
              <Input
                aria-label="Evaluation window in minutes"
                type="number"
                min={1}
                max={1440}
                required
                value={form.windowMinutes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    windowMinutes: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              <span>Condition</span>
              <select
                value={form.comparison}
                onChange={(event) =>
                  setForm({
                    ...form,
                    comparison: event.target.value as AlertInput["comparison"],
                  })
                }
              >
                <option value="gt">Greater than</option>
                <option value="gte">Greater than or equal to</option>
                <option value="lt">Less than</option>
                <option value="lte">Less than or equal to</option>
              </select>
            </label>
            <label>
              <span>
                Threshold{" "}
                {form.sql !== undefined
                  ? ""
                  : form.template === "error_rate"
                    ? "(%)"
                    : "(req/s)"}
              </span>
              <Input
                aria-label="Threshold"
                type="number"
                min={form.sql !== undefined ? undefined : 0}
                step="any"
                required
                value={form.threshold}
                onChange={(event) =>
                  setForm({ ...form, threshold: Number(event.target.value) })
                }
              />
            </label>
            <label className="wide-field">
              <span>Webhook URL</span>
              <Input
                aria-label="Webhook URL"
                type="url"
                required
                placeholder="https://your-service.example/alerts"
                value={form.webhookUrl}
                onChange={(event) =>
                  setForm({ ...form, webhookUrl: event.target.value })
                }
              />
            </label>
            <label>
              <span>Cooldown (minutes)</span>
              <Input
                aria-label="Cooldown in minutes"
                type="number"
                min={0}
                max={10080}
                required
                value={form.cooldownMinutes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    cooldownMinutes: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) =>
                  setForm({ ...form, enabled: event.target.checked })
                }
              />{" "}
              Alert enabled
            </label>
          </div>
          <div className="form-footer">
            <p>
              Rules run on the Worker's polling schedule. Cooldowns limit
              repeated notifications.
            </p>
            <Button type="submit" variant="primary" disabled={busy}>
              {preview
                ? "Connect to save alert"
                : busy
                  ? "Saving…"
                  : "Save alert"}
            </Button>
          </div>
        </form>
      )}
      <section className="panel">
        {loading ? (
          <div className="loading-chart">Loading alerts…</div>
        ) : alerts.length ? (
          <div className="alert-list">
            {alerts.map((rule) => (
              <div className="alert-row" key={rule.id}>
                <span
                  className={`alert-status ${rule.enabled ? "enabled" : ""}`}
                >
                  <Bell size={20} />
                </span>
                <div>
                  <strong>{rule.name}</strong>
                  <p>
                    {rule.sql !== undefined
                      ? `SQL · ${rule.valueColumn || "value"}`
                      : rule.template === "error_rate"
                        ? "Error rate"
                        : "Request rate"}{" "}
                    {{ gt: ">", gte: "≥", lt: "<", lte: "≤" }[rule.comparison]}{" "}
                    {rule.threshold}
                    {rule.sql !== undefined
                      ? ""
                      : rule.template === "error_rate"
                        ? "%"
                        : " req/s"}{" "}
                    · {rule.windowMinutes} min
                    {rule.sql !== undefined
                      ? ""
                      : ` · ${rule.service || "All services"}`}
                  </p>
                  <small>
                    {rule.lastEvaluatedAt
                      ? `Last evaluated ${dateText(rule.lastEvaluatedAt)} UTC`
                      : "Waiting for first evaluation"}
                  </small>
                </div>
                <span className="subtle-badge">
                  {rule.enabled ? "Enabled" : "Paused"}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const {
                      id: _id,
                      createdAt: _createdAt,
                      lastEvaluatedAt: _lastEvaluatedAt,
                      lastTriggeredAt: _lastTriggeredAt,
                      ...input
                    } = rule;
                    setForm(input);
                    setParameterText(
                      JSON.stringify(rule.parameters ?? {}, null, 2),
                    );
                    setEditing(rule.id);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  shape="square"
                  aria-label={`Delete ${rule.name}`}
                  disabled={busy}
                  onClick={() => remove(rule)}
                >
                  <Trash size={17} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title="Stay ahead of the unexpected"
            text="Create a threshold alert from any SQL query that returns one numeric value. We'll send your webhook the query and observed value."
          >
            <Button variant="secondary" onClick={() => setOpen(true)}>
              <Plus size={16} /> Create your first alert
            </Button>
          </Empty>
        )}
      </section>
    </>
  );
}
function Settings({
  token,
  save,
  notify,
}: {
  token: string;
  save: (token: string) => void;
  notify: (message: string) => void;
}) {
  const [draft, setDraft] = useState(token);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify("Copied to clipboard.");
    } catch {
      notify("Select the endpoint and copy it manually.");
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="YOUR WORKSPACE"
        title="Settings"
        description="Connect your telemetry and bring observability to your AI tools."
      />
      <section className="panel settings-panel">
        <div className="panel-header">
          <div>
            <h2>Workspace connection</h2>
            <p>Use the API token configured on your Worker.</p>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save(draft.trim());
          }}
        >
          <label>
            <span>API token</span>
            <Input
              aria-label="API token"
              type="password"
              autoComplete="off"
              placeholder="Enter your workspace API token"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
          <p className="help-text">
            Stored for this browser session and sent as a Bearer token.
            Permanent URLs contain no credentials.
          </p>
          <div className="settings-actions">
            <Button type="submit" variant="primary">
              Save connection
            </Button>
            {token && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setDraft("");
                  save("");
                }}
              >
                Disconnect
              </Button>
            )}
          </div>
        </form>
      </section>
      <section className="panel settings-panel">
        <div className="panel-header">
          <div>
            <h2>MCP & interactive apps</h2>
            <p>
              Query telemetry, preserve results, and manage alerts from your
              conversations.
            </p>
          </div>
          <Lightning size={23} className="orange" />
        </div>
        <div className="settings-body">
          <span className="field-label">Streamable HTTP endpoint</span>
          <div className="copy-row">
            <code>{location.origin}/mcp</code>
            <Button
              variant="ghost"
              shape="square"
              aria-label="Copy MCP endpoint"
              onClick={() => copy(`${location.origin}/mcp`)}
            >
              <Copy size={17} />
            </Button>
          </div>
          <p>
            Add this endpoint to an MCP client with your API token as a Bearer
            Authorization header. Clients that support MCP Apps can display
            saved charts directly in the conversation.
          </p>
          <div className="capability-tags">
            <span>Query telemetry</span>
            <span>Interactive charts</span>
            <span>Saved snapshots</span>
            <span>Alert rules</span>
          </div>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="panel-header">
          <div>
            <h2>Send OpenTelemetry data</h2>
            <p>Point your OTLP HTTP exporter at this Worker.</p>
          </div>
        </div>
        <div className="settings-body">
          <div className="copy-row">
            <code>{location.origin}</code>
            <Button
              variant="ghost"
              shape="square"
              aria-label="Copy OTLP base endpoint"
              onClick={() => copy(location.origin)}
            >
              <Copy size={17} />
            </Button>
          </div>
          <p>
            Traces, logs, and metrics use <code>/v1/traces</code>,{" "}
            <code>/v1/logs</code>, and <code>/v1/metrics</code>. Authenticate
            with your ingestion token. Configure exporter protocol as{" "}
            <code>http/protobuf</code> or <code>http/json</code>.
          </p>
          <a
            className="text-link"
            href="https://github.com/jmorrell/mvp-o11y#readme"
            target="_blank"
            rel="noreferrer"
          >
            Setup and deployment guide <ArrowSquareOut size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
