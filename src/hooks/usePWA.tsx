import React, { useEffect, useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showMobileModal, setShowMobileModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[#C86D3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Install Memo Ledger on iOS, Android, or Desktop for offline study"
      >
        <Download className="w-3.5 h-3.5 text-[#C86D3B]" />
        <span>Install App</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowMobileModal(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#C86D3B]/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Get iOS & Android offline app instructions"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#C86D3B]" />
        <span>{isIOS ? 'Install on iOS' : 'iOS & Android App'}</span>
      </button>

      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Study Offline on iOS & Android
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Memo Ledger is built as a lightweight offline-ready Progressive Web App so you can review flashcards on slow connections or airplane mode.
                </p>
              </div>
              <button
                onClick={() => setShowMobileModal(false)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[var(--text-secondary)]">
              <div className="rounded-lg bg-[var(--bg-surface)] p-3.5">
                <p className="font-semibold text-[var(--text-primary)]">iPhone & iPad (Safari)</p>
                <p className="mt-1 leading-relaxed">
                  1. Tap the <strong>Share</strong> icon in your Safari toolbar.<br />
                  2. Scroll down and select <strong>Add to Home Screen</strong>.<br />
                  3. Launch Memo Ledger directly from your home screen with full offline caching.
                </p>
              </div>
              <div className="rounded-lg bg-[var(--bg-surface)] p-3.5">
                <p className="font-semibold text-[var(--text-primary)]">Android (Chrome / Edge)</p>
                <p className="mt-1 leading-relaxed">
                  1. Tap the browser menu (three dots in the top-right corner).<br />
                  2. Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.<br />
                  3. All saved tutorials and flashcards remain available without internet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMobileModal(false)}
              className="mt-5 w-full rounded-lg bg-[#C86D3B] py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] transition-colors cursor-pointer"
            >
              Got It, Back to Studying
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#B87D14] px-3.5 py-2 text-xs font-medium text-white shadow-lg">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Offline Mode · Studying from your locally saved tutorials & flashcards</span>
    </div>
  );
};
