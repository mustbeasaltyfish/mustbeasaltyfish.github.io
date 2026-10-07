import { useEffect, useRef, useState } from 'react';

export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
interface TurnstileApi {
  ready: (callback: () => void) => void;
  render: (element: HTMLElement, options: {
    sitekey: string; action: string; size: 'compact'; theme: 'light';
    callback: (token: string) => void;
    'expired-callback': () => void; 'error-callback': () => void;
  }) => string;
  remove: (id: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi } }
let scriptReady: Promise<void> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptReady) scriptReady = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); scriptReady = undefined; reject(new Error('verification unavailable')); };
    document.head.append(script);
  });
  return scriptReady;
}
export function Turnstile({ onToken, attempt }: { onToken: (token: string) => void; attempt: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let id: string | undefined;
    onToken('');
    setFailed(false);
    load().then(() => {
      window.turnstile?.ready(() => {
        if (!active || !container.current) return;
        id = window.turnstile!.render(container.current, {
          sitekey: turnstileSiteKey, action: 'starry-chat', size: 'compact', theme: 'light',
          callback: token => { if (active) { setFailed(false); onToken(token); } },
          'expired-callback': () => { if (active) onToken(''); },
          'error-callback': () => { if (active) { setFailed(true); onToken(''); } },
        });
      });
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; if (id) window.turnstile?.remove(id); };
  }, [onToken, attempt, retry]);
  return <div className="bot-verification">
    <div ref={container} />
    {failed && <p role="alert">验证暂时无法加载。 <button type="button" className="mac-button" onClick={() => setRetry(v => v + 1)}>重新验证</button></p>}
  </div>;
}
