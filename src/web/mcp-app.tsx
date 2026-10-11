import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App, applyHostStyleVariables } from "@modelcontextprotocol/ext-apps";
import { Visualization } from "./Visualization";
import type { Snapshot } from "../shared/types";
import { isSqlQuery } from "../shared/types";
import "./styles.css";

const app = new App({ name: "mvp-o11y-visualization", version: "0.1.0" }, {});
function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Snapshot>;
  return (
    Array.isArray(candidate.rows) &&
    Array.isArray(candidate.columns) &&
    typeof candidate.query === "object" &&
    candidate.query !== null &&
    typeof candidate.title === "string" &&
    ["line", "table", "waterfall", "heatmap"].includes(
      candidate.visualization ?? "",
    )
  );
}
function SnapshotApp() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [table, setTable] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    app.ontoolresult = (result) => {
      if (result.isError) {
        setError(
          "The query could not be completed. See the tool response for details.",
        );
        return;
      }
      const data = result.structuredContent as
        | Record<string, unknown>
        | undefined;
      const candidate = data?.snapshot ?? data?.result ?? data;
      if (isSnapshot(candidate)) {
        setSnapshot(candidate);
        setError("");
        setTable(false);
        return;
      }
      for (const content of result.content ?? [])
        if (content.type === "text") {
          try {
            const parsed: unknown = JSON.parse(content.text);
            if (isSnapshot(parsed)) {
              setSnapshot(parsed);
              setError("");
              setTable(false);
              return;
            }
          } catch {
            /* Other text content is not snapshot JSON. */
          }
        }
      setError("This tool response did not include a visualization snapshot.");
    };
    app.onhostcontextchanged = (context) => {
      if (context.styles?.variables)
        applyHostStyleVariables(context.styles.variables);
    };
    app.ontoolcancelled = () => setError("The query was cancelled.");
    if (window.parent === window) {
      setError(
        "Open this visualization through an MCP Apps compatible client.",
      );
      return;
    }
    void app
      .connect()
      .then(() => {
        const context = app.getHostContext();
        if (context?.styles?.variables)
          applyHostStyleVariables(context.styles.variables);
      })
      .catch((err) =>
        setError(
          `Unable to connect to the MCP host: ${(err as Error).message}`,
        ),
      );
    return () => {
      void app.close();
    };
  }, []);
  async function openPermanentView() {
    if (!snapshot) return;
    try {
      const result = await app.openLink({ url: snapshot.url });
      if (result.isError)
        setError("The host could not open the permanent view.");
    } catch {
      setError("The host could not open the permanent view.");
    }
  }
  return (
    <main className="mcp-root">
      {snapshot ? (
        <>
          <div className="mcp-heading">
            <div>
              <div className="eyebrow">MVP O11Y · PRESERVED RESULT</div>
              <h1>{snapshot.title}</h1>
              <p>
                {new Date(snapshot.createdAt).toLocaleString("en", {
                  timeZone: "UTC",
                })}{" "}
                UTC
              </p>
            </div>
            <div className="segmented">
              <button aria-pressed={!table} onClick={() => setTable(false)}>
                Chart
              </button>
              <button aria-pressed={table} onClick={() => setTable(true)}>
                Data
              </button>
            </div>
          </div>
          <section className="panel">
            <Visualization
              result={snapshot}
              kind={table ? "table" : snapshot.visualization}
              mapping={snapshot.mapping}
            />
            <div className="result-meta">
              <span>
                {isSqlQuery(snapshot.query)
                  ? "SQL query · preserved result"
                  : `${snapshot.query.from} → ${snapshot.query.to}`}
              </span>
              <span>
                {snapshot.rows.length.toLocaleString()} rows
                {snapshot.truncated ? " · limit reached" : ""}
              </span>
            </div>
          </section>
          <div className="mcp-footer">
            <span>Immutable snapshot · R2</span>
            <button
              className="text-link"
              style={{ border: 0, background: "none", cursor: "pointer" }}
              onClick={openPermanentView}
            >
              Open permanent view ↗
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>
            {error ? "Visualization unavailable" : "Waiting for your query…"}
          </h3>
          <p>
            {error || "The result will appear here when the tool finishes."}
          </p>
        </div>
      )}
      {snapshot && error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<SnapshotApp />);
