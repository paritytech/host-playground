import {
  createDefaultLogger,
  createTransport,
  createHostApi,
  type Transport,
  type HostApi,
  type ConnectionStatus,
} from '@novasamatech/host-api';

function delay(ttl: number) {
  return new Promise(resolve => setTimeout(resolve, ttl));
}

function getParentWindow() {
  if (window.top) return window.top;
  throw new Error('No parent window found');
}

function isIframe() {
  try {
    return window !== window.top;
  } catch {
    return false;
  }
}

function isWebview() {
  try {
    return (window as any)['__HOST_WEBVIEW_MARK__'] === true;
  } catch {
    return false;
  }
}

async function getWebviewPort(iteration = 200): Promise<MessagePort> {
  if (iteration === 0) throw new Error('No webview port found');
  if ((window as any)['__HOST_API_PORT__']) return (window as any)['__HOST_API_PORT__'];
  await delay(100);
  return getWebviewPort(iteration - 1);
}

function isValidIframeMessage(event: MessageEvent, sourceEnv: Window, currentEnv: Window) {
  return (
    event.source !== currentEnv &&
    event.source === sourceEnv &&
    event.data &&
    event.data.constructor.name === 'Uint8Array'
  );
}

function isValidWebviewMessage(event: MessageEvent) {
  return event.data && event.data.constructor.name === 'Uint8Array';
}

function createSandboxProvider() {
  const subscribers = new Set<(msg: Uint8Array) => void>();

  const handleIframeMessage = (event: MessageEvent) => {
    if (!isValidIframeMessage(event, getParentWindow(), window)) return;
    for (const subscriber of subscribers) subscriber(event.data);
  };

  const handleWebviewMessage = (event: MessageEvent) => {
    if (!isValidWebviewMessage(event)) return;
    for (const subscriber of subscribers) subscriber(event.data);
  };

  if (isIframe()) {
    window.addEventListener('message', handleIframeMessage);
  } else if (isWebview()) {
    getWebviewPort().then(port => (port.onmessage = handleWebviewMessage));
  }

  return {
    logger: createDefaultLogger(),
    isCorrectEnvironment() {
      return isIframe() || isWebview();
    },
    postMessage(message: Uint8Array) {
      if (isIframe()) {
        getParentWindow().postMessage(message, '*', [message.buffer]);
      } else if (isWebview()) {
        getWebviewPort().then(port => port.postMessage(message, [message.buffer]));
      }
    },
    subscribe(callback: (msg: Uint8Array) => void) {
      subscribers.add(callback);
      return () => { subscribers.delete(callback); };
    },
    dispose() {
      subscribers.clear();
      if (isIframe()) window.removeEventListener('message', handleIframeMessage);
      if (isWebview()) getWebviewPort().then(port => (port.onmessage = null));
    },
  };
}

let _transport: Transport | null = null;
let _hostApi: HostApi | null = null;

export function getTransport(): Transport {
  if (!_transport) {
    _transport = createTransport(createSandboxProvider());
  }
  return _transport;
}

export function getHostApi(): HostApi {
  if (!_hostApi) {
    _hostApi = createHostApi(getTransport());
  }
  return _hostApi;
}

export function subscribeConnectionStatus(callback: (status: ConnectionStatus) => void): () => void {
  const transport = getTransport();
  // Kick off the handshake so connection status transitions from disconnected -> connecting -> connected
  transport.isReady();
  return transport.onConnectionStatusChange(callback);
}
