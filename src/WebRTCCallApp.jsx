import { useEffect, useMemo, useState } from "react";
import { SIPProvider } from "react-sipjs";
import { CONNECT_STATUS, RegisterStatus, useSIPProvider } from "react-sipjs";
import { CallSessionItem } from "./CallSessionItem";

const STORAGE_KEY = "webrtc.callapp.settings.v1";

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
};

const parseIceServers = (value) => {
  if (!value) return [{ urls: "stun:stun.l.google.com:19302" }];
  const items = value
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (items.length === 0) return [{ urls: "stun:stun.l.google.com:19302" }];
  return items.map((u) => ({
    urls: u.startsWith("stun:") || u.startsWith("turn:") ? u : `stun:${u}`,
  }));
};

const StatusDot = ({ ok }) => (
  <div
    className={`flex-none rounded-full ${
      ok ? "bg-emerald-500/20" : "bg-yellow-500/20"
    } p-1`}
  >
    <div
      className={`h-1.5 w-1.5 rounded-full ${
        ok ? "bg-emerald-500" : "bg-yellow-500"
      }`}
    ></div>
  </div>
);

const Header = () => (
  <div className='flex items-center justify-between'>
    <div>
      <h1 className='text-xl font-semibold text-gray-900'>
        WebRTC Call Center
      </h1>
      <p className='text-sm text-gray-500'>
        Configurable SIP over WebSocket with audio calls
      </p>
    </div>
    <div className='rounded-lg border px-3 py-1 text-xs text-gray-500'>
      Powered by react-sipjs
    </div>
  </div>
);

const SettingsCard = ({ settings, onChange, onLaunch }) => {
  const [local, setLocal] = useState(settings);

  useEffect(() => setLocal(settings), [settings]);

  const update = (k, v) => setLocal((s) => ({ ...s, [k]: v }));

  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-base font-medium text-gray-900'>
          Connection Settings
        </h2>
        <div className='flex gap-2'>
          <button
            onClick={() => {
              saveSettings(local);
              onChange(local);
            }}
            className='text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded'
          >
            Save
          </button>
          <button
            onClick={onLaunch}
            className='text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded'
          >
            Launch
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label className='text-xs text-gray-600'>
            WebSocket Server (ws/wss)
          </label>
          <input
            className='mt-1 w-full rounded border px-2 py-1 text-sm'
            placeholder='wss://host:8089/ws'
            value={local.webSocketServer}
            onChange={(e) => update("webSocketServer", e.target.value)}
          />
        </div>
        <div>
          <label className='text-xs text-gray-600'>SIP Domain</label>
          <input
            className='mt-1 w-full rounded border px-2 py-1 text-sm'
            placeholder='10.134.1.166'
            value={local.domain}
            onChange={(e) => update("domain", e.target.value)}
          />
        </div>
        <div>
          <label className='text-xs text-gray-600'>
            ICE Servers (comma/newline separated)
          </label>
          <textarea
            className='mt-1 w-full rounded border px-2 py-1 text-sm'
            rows={2}
            placeholder='stun:stun.l.google.com:19302'
            value={local.iceServers}
            onChange={(e) => update("iceServers", e.target.value)}
          />
          <p className='mt-1 text-[11px] text-gray-500'>
            Examples: stun:stun.l.google.com:19302 or
            turn:user@turn.example.com:3478
          </p>
        </div>
      </div>
    </div>
  );
};

const ConnectPanel = ({ domain }) => {
  const {
    connectAndRegister,
    sessionManager,
    sessions,
    registerStatus,
    connectStatus,
  } = useSIPProvider();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [callTo, setCallTo] = useState("");

  const isConnected = connectStatus === CONNECT_STATUS.CONNECTED;
  const isRegistered = registerStatus === RegisterStatus.REGISTERED;

  return (
    <div className='rounded-xl border bg-white p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-base font-medium text-gray-900'>Agent Console</h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1.5 text-xs text-gray-600'>
            <StatusDot ok={isConnected} />
            <span>Connect: {connectStatus}</span>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-gray-600'>
            <StatusDot ok={isRegistered} />
            <span>Register: {registerStatus}</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          connectAndRegister({ username, password });
        }}
        className='grid grid-cols-1 gap-3 sm:grid-cols-3'
      >
        <div className='sm:col-span-1'>
          <label className='text-xs text-gray-600'>SIP Username</label>
          <input
            className='mt-1 w-full rounded border px-2 py-1 text-sm'
            placeholder='1060'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='sm:col-span-1'>
          <label className='text-xs text-gray-600'>Password</label>
          <input
            type='password'
            className='mt-1 w-full rounded border px-2 py-1 text-sm'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='sm:col-span-1 flex items-end gap-2'>
          {!isConnected ? (
            <button
              type='submit'
              className='w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded'
            >
              Connect & Register
            </button>
          ) : (
            <button
              type='button'
              onClick={() => sessionManager?.disconnect()}
              className='w-full text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded'
            >
              Disconnect
            </button>
          )}
        </div>
      </form>

      <div className='mt-4 rounded-lg bg-gray-50 p-3'>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!callTo || !domain) return;
            await sessionManager?.call(`sip:${callTo}@${domain}`, {
              sessionDescriptionHandlerOptions: {
                constraints: { audio: true, video: false },
              },
            });
          }}
          className='grid grid-cols-1 gap-3 sm:grid-cols-6'
        >
          <div className='sm:col-span-4'>
            <label className='text-xs text-gray-600'>Dial Number/User</label>
            <input
              className='mt-1 w-full rounded border px-2 py-2 text-sm'
              placeholder='1061'
              value={callTo}
              onChange={(e) => setCallTo(e.target.value)}
            />
          </div>
          <div className='sm:col-span-2 flex items-end'>
            <button
              type='submit'
              className='w-full text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded'
            >
              Call
            </button>
          </div>
        </form>
        <p className='mt-1 text-[11px] text-gray-500'>
          Call will be placed to sip:&lt;dial&gt;@{domain}
        </p>
      </div>

      <div className='mt-4'>
        <h3 className='mb-2 text-sm font-medium text-gray-700'>
          Active Sessions
        </h3>
        <ul role='list' className='divide-y divide-gray-100'>
          {Object.keys(sessions).length === 0 && (
            <li className='py-6 text-center text-sm text-gray-500'>
              No active calls
            </li>
          )}
          {Object.keys(sessions).map((sessionId) => (
            <CallSessionItem key={sessionId} sessionId={sessionId} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const WebRTCCallApp = () => {
  const defaults = useMemo(
    () =>
      loadSettings() || {
        webSocketServer: "wss://10.134.1.166:8089/ws",
        domain: "10.134.1.166",
        iceServers: "stun:stun.l.google.com:19302",
      },
    []
  );

  const [settings, setSettings] = useState(defaults);
  const [launched, setLaunched] = useState(false);

  const iceServers = useMemo(
    () => parseIceServers(settings.iceServers),
    [settings.iceServers]
  );

  return (
    <div className='p-5'>
      <div className='mx-auto flex max-w-6xl flex-col gap-4'>
        <Header />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='md:col-span-1'>
            <SettingsCard
              settings={settings}
              onChange={(s) => setSettings(s)}
              onLaunch={() => setLaunched(true)}
            />
            <div className='mt-4 rounded-xl border bg-white p-4 text-xs text-gray-600'>
              <div className='font-medium text-gray-800'>Tips</div>
              <ul className='mt-2 list-disc space-y-1 pl-4'>
                <li>Use wss for TLS (typical Asterisk port 8089).</li>
                <li>Domain is your SIP realm (often same as server IP).</li>
                <li>ICE server format: stun:host:port or turn:host:port.</li>
              </ul>
            </div>
          </div>

          <div className='md:col-span-2'>
            {!launched ? (
              <div className='flex h-full min-h-[420px] items-center justify-center rounded-xl border bg-white p-8 text-center text-gray-600'>
                <div>
                  <div className='text-lg font-medium text-gray-800'>
                    Ready to launch the call desk
                  </div>
                  <p className='mt-1 text-sm'>
                    Save your settings, then click Launch to initialize the SIP
                    stack.
                  </p>
                  <div className='mt-4'>
                    <button
                      onClick={() => setLaunched(true)}
                      className='text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded'
                    >
                      Launch Call Desk
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <SIPProvider
                options={{
                  webSocketServer: settings.webSocketServer,
                  domain: settings.domain,
                  // media: {
                  //   constraints: { audio: true, video: false },
                  //   iceServers,
                  // },
                }}
                mergedSessionManagerOptions={{
                  media: {
                    constraints: { audio: true, video: false },
                    iceServers,
                  },
                }}
              >
                <ConnectPanel domain={settings.domain} />
              </SIPProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRTCCallApp;
