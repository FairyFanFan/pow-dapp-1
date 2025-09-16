// Analytics tracking utilities
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  console.log('Analytics Event:', eventName, properties);
};

export const trackWalletConnection = (walletType: string) => {
  trackEvent('wallet_connected', {
    wallet_type: walletType,
    timestamp: new Date().toISOString()
  });
};

export const trackTransaction = (transactionType: string, amount?: string, token?: string) => {
  trackEvent('transaction_initiated', {
    transaction_type: transactionType,
    amount: amount,
    token: token,
    timestamp: new Date().toISOString()
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString()
  });
};

export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  });
};

// Google Analytics setup
export const initGoogleAnalytics = () => {
  if (typeof window !== 'undefined' && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX');
  }
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
