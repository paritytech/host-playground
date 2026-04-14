'use client';

import { useEffect, useState } from 'react';
import type { ConnectionStatus } from '@novasamatech/host-api';
import { getHostApi, subscribeConnectionStatus } from '@/src/lib/transport';
import { ServiceTable } from '@/src/components/ServiceTable';
import { MethodView } from '@/src/components/MethodView';
import { services } from '@/src/lib/services';

export default function PlaygroundPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [selection, setSelection] = useState<{ service: string; method: string } | null>(null);

  useEffect(() => {
    return subscribeConnectionStatus(setStatus);
  }, []);

  if (status !== 'connected') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#666' }}>
        {status === null || status === 'connecting'
          ? 'Connecting to host...'
          : 'Disconnected from host. Please open this page inside the host app.'}
      </div>
    );
  }

  if (!selection) {
    return <ServiceTable services={services} onSelect={(s, m) => setSelection({ service: s, method: m })} />;
  }

  return (
    <MethodView
      hostApi={getHostApi()}
      service={selection.service}
      method={selection.method}
      onBack={() => setSelection(null)}
    />
  );
}
