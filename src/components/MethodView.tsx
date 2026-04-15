import { useState } from 'react';
import type { HostApi } from '@novasamatech/host-api';
import { getMethodBinding, stringify } from '@/src/lib/host-api-bridge';
import { services } from '@/src/lib/services';

const styles = {
  container: { padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto' } as const,
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' } as const,
  backBtn: { background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' } as const,
  title: { fontSize: '20px', fontWeight: 600, color: '#333' } as const,
  section: { background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' } as const,
  label: { fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: '8px' } as const,
  textarea: { width: '100%', minHeight: '80px', fontFamily: 'monospace', fontSize: '13px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' } as const,
  callBtn: { background: '#2196f3', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 } as const,
  response: { fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f5f5f5', padding: '12px', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' } as const,
  error: { color: '#d32f2f' } as const,
  logEntry: { borderBottom: '1px solid #eee', padding: '4px 0', fontSize: '13px', fontFamily: 'monospace' } as const,
};

export function MethodView({
  hostApi,
  service,
  method,
  onBack,
}: {
  hostApi: HostApi;
  service: string;
  method: string;
  onBack: () => void;
}) {
  const methodInfo = services.find((s) => s.name === service)?.methods.find((m) => m.name === method);
  const noParams = methodInfo?.noParams ?? false;
  const [request, setRequest] = useState(methodInfo?.defaultRequest ?? '{}');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [streamLog, setStreamLog] = useState<string[]>([]);
  const [streamActive, setStreamActive] = useState(false);
  const [activeSub, setActiveSub] = useState<{ unsubscribe: () => void } | null>(null);

  const binding = getMethodBinding(hostApi, service, method);


  const handleCall = async () => {
    if (!binding) return;
    setResponse('');
    setError('');
    setStreamLog([]);

    let parsed: unknown;
    if (noParams) {
      parsed = null;
    } else {
      try {
        parsed = JSON.parse(request);
      } catch {
        setError('Invalid JSON request');
        return;
      }
    }

    if (binding.isStream) {
      setStreamActive(true);
      const sub = binding.subscribe(
        parsed,
        (event) => {
          setStreamLog((prev) => [...prev, stringify(event)]);
        },
        () => {
          setStreamLog((prev) => [...prev, '--- stream ended ---']);
          setStreamActive(false);
          setActiveSub(null);
        },
      );
      setActiveSub(sub);
    } else {
      setLoading(true);
      try {
        const result = await binding.call(parsed);
        if (result.ok) {
          setResponse(stringify(result.data) ?? 'null');
        } else {
          setError(stringify(result.data));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStop = () => {
    activeSub?.unsubscribe();
    setStreamActive(false);
    setActiveSub(null);
    setStreamLog((prev) => [...prev, '--- stopped ---']);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} data-testid="back-button" onClick={onBack}>Back</button>
        <div style={styles.title}>{service} / {method}</div>
      </div>

      <div style={styles.section}>
        {!noParams && (
          <>
            <div style={styles.label}>Request</div>
            <textarea
              style={styles.textarea}
              data-testid="request-editor"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
            />
          </>
        )}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          {!binding ? (
            <button style={{ ...styles.callBtn, background: '#9e9e9e', cursor: 'not-allowed' }} disabled>
              Not supported yet
            </button>
          ) : binding.isStream ? (
            streamActive ? (
              <button style={{ ...styles.callBtn, background: '#d32f2f' }} data-testid="stop-button" onClick={handleStop}>Stop</button>
            ) : (
              <button style={styles.callBtn} data-testid="subscribe-button" onClick={handleCall}>Subscribe</button>
            )
          ) : (
            <button style={styles.callBtn} data-testid="call-button" onClick={handleCall} disabled={loading}>
              {loading ? 'Calling...' : 'Call'}
            </button>
          )}
        </div>
      </div>

      {(response || error || streamLog.length > 0) && (
        <div style={styles.section}>
          <div style={styles.label}>Response</div>
          {error && <div style={{ ...styles.response, ...styles.error }} data-testid="error-display">{error}</div>}
          {response && <div style={styles.response} data-testid="response-content">{response}</div>}
          {streamLog.length > 0 && (
            <div style={styles.response} data-testid="stream-log">
              {streamLog.map((entry, i) => (
                <div key={i} style={styles.logEntry} data-testid="stream-entry">{entry}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
