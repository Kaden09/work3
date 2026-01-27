import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const CONSENT_COOKIE = "cookie_consent";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60;

function getCookieConsent(): boolean {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === CONSENT_COOKIE && value === "accepted") {
      return true;
    }
  }
  return false;
}

function setCookieConsent(accepted: boolean): void {
  const value = accepted ? "accepted" : "declined";
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Strict`;
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasConsent = getCookieConsent();
    if (!hasConsent) {
      setVisible(true);
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  const handleAccept = useCallback(() => {
    setCookieConsent(true);
    setMounted(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  const handleDecline = useCallback(() => {
    setCookieConsent(false);
    setMounted(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-4xl mx-auto bg-chat-secondary-bg border border-primary-border rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-font-primary font-semibold text-base mb-2">
                  Мы используем cookies
                </h3>
                <p className="text-font-secondary text-sm leading-relaxed">
                  Для обеспечения работы сервиса и авторизации мы используем
                  файлы cookie. Продолжая использовать сайт, вы соглашаетесь с{" "}
                  <a
                    href="/privacy-policy"
                    className="text-font-contrast hover:text-hover-font-contrast underline transition-colors"
                  >
                    политикой конфиденциальности
                  </a>
                  .
                </p>
              </div>
              <button
                onClick={handleDecline}
                className="text-font-secondary hover:text-font-primary transition-colors p-1 md:hidden"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="hidden md:block px-5 py-2.5 text-font-primary text-sm font-medium border border-primary-border rounded-full hover:bg-chat-tertiary-bg-hover transition-colors"
            >
              Отклонить
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-6 py-2.5 bg-linear-to-b from-button-gradient-start to-button-gradient-end text-font-tertiary text-sm font-semibold rounded-full shadow-[0_2px_4px_var(--color-hover-shadow)] hover:shadow-[0_3px_8px_var(--color-hover-shadow)] transition-shadow"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
