// Web Vitals analytics helper script
function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id
  });
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      body,
      method: 'POST',
      keepalive: true
    });
  }
}

// Load the web-vitals library as a script tag instead of using import()
const script = document.createElement('script');
script.src = 'https://unpkg.com/web-vitals@3.5.2/dist/web-vitals.iife.js';
script.onload = function() {
  // The library exposes itself as a global webVitals object
  window.webVitals.onCLS(sendToAnalytics);
  window.webVitals.onFID(sendToAnalytics);
  window.webVitals.onLCP(sendToAnalytics);
};

document.head.appendChild(script); 