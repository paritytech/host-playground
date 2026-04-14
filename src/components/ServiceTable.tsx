import type { ServiceInfo } from '@/src/lib/services';

const typeBadge: Record<string, { label: string; color: string }> = {
  unary: { label: 'Unary', color: '#2196f3' },
  subscription: { label: 'Stream', color: '#4caf50' },
};

const styles = {
  container: { padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto' } as const,
  title: { fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: '#333' } as const,
  service: { marginBottom: '16px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' } as const,
  serviceHeader: { padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600, fontSize: '15px', color: '#333' } as const,
  method: { display: 'flex', alignItems: 'center', padding: '8px 16px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' } as const,
  methodName: { flex: 1, fontSize: '14px', color: '#555' } as const,
  badge: (color: string) => ({
    fontSize: '11px', padding: '2px 8px', borderRadius: '10px', color: '#fff', background: color, fontWeight: 500,
  }) as const,
};

export function ServiceTable({
  services,
  onSelect,
}: {
  services: ServiceInfo[];
  onSelect: (service: string, method: string) => void;
}) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Host API Playground</div>
      {services.map((svc) => (
        <div key={svc.name} style={styles.service} data-testid={`service-${svc.name}`}>
          <div style={styles.serviceHeader}>{svc.name}</div>
          {svc.methods.map((m) => (
            <div
              key={m.name}
              style={styles.method}
              data-testid={`method-${svc.name}-${m.name}`}
              onClick={() => onSelect(svc.name, m.name)}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f8f8f8')}
              onMouseOut={(e) => (e.currentTarget.style.background = '')}
            >
              <span style={styles.methodName}>{m.name}</span>
              <span style={styles.badge(typeBadge[m.type].color)}>{typeBadge[m.type].label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
