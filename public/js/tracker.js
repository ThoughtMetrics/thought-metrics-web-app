/**
 * Thought Metrics - User Behavior Tracking System
 */

(function () {
  'use strict';

  const CONFIG = {
    apiEndpoint: '/api/v1/analytics/track',
    sessionTimeout: 30 * 60 * 1000,
    scrollThresholds: [25, 50, 75, 100],
    debounceDelay: 250,
    batchSize: 10,
    flushInterval: 5000,
    trackingLinkParam: 'tm_link_id',
    signupPage: '/sign-up',
    surveyCampaignPage: '/survey-campaign',
  };

  let eventQueue = [];
  let flushTimer = null;

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('tm_session_id');
    let sessionStart = sessionStorage.getItem('tm_session_start');
    const now = Date.now();

    if (
      !sessionId ||
      !sessionStart ||
      now - parseInt(sessionStart) > CONFIG.sessionTimeout
    ) {
      sessionId = generateUUID();
      sessionStorage.setItem('tm_session_id', sessionId);
      sessionStorage.setItem('tm_session_start', now.toString());
    }

    return sessionId;
  };

  const getVisitorId = () => {
    let visitorId = localStorage.getItem('tm_visitor_id');
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem('tm_visitor_id', visitorId);
    }
    return visitorId;
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const getTrackingLinkId = () => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get(CONFIG.trackingLinkParam);

    if (linkId) {
      localStorage.setItem('tm_source_link_id', linkId);
      localStorage.setItem('tm_source_link_time', Date.now().toString());
    }

    const storedLinkId = localStorage.getItem('tm_source_link_id');
    const storedTime = localStorage.getItem('tm_source_link_time');

    if (storedLinkId && storedTime) {
      const daysSinceClick =
        (Date.now() - parseInt(storedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceClick < 30) {
        return storedLinkId;
      }
    }

    return null;
  };

  const getPostSignupRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect_after');
    if (redirect) {
      localStorage.setItem('tm_redirect_after_signup', redirect);
    }
    return (
      localStorage.getItem('tm_redirect_after_signup') ||
      CONFIG.surveyCampaignPage
    );
  };

  const handleTrackingLinkArrival = () => {
    const params = new URLSearchParams(window.location.search);
    const linkId = params.get(CONFIG.trackingLinkParam);

    if (!linkId) return false;

    const redirectAfter = params.get('redirect_after');
    if (redirectAfter) {
      localStorage.setItem('tm_redirect_after_signup', redirectAfter);
    }

    const isRegistered = localStorage.getItem('tm_user_registered') === 'true';
    const currentPath = window.location.pathname;

    if (
      !isRegistered &&
      currentPath !== CONFIG.signupPage &&
      currentPath !== '/login'
    ) {
      const signupUrl = new URL(CONFIG.signupPage, window.location.origin);
      signupUrl.searchParams.set(CONFIG.trackingLinkParam, linkId);

      [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'redirect_after',
      ].forEach((param) => {
        const value = params.get(param);
        if (value) signupUrl.searchParams.set(param, value);
      });

      window.location.href = signupUrl.toString();
      return true;
    }

    return false;
  };

  const onUserRegistered = (userId, userEmail) => {
    localStorage.setItem('tm_user_registered', 'true');
    localStorage.setItem('tm_user_id', userId);

    track('user_registered', {
      userId: userId,
      email: userEmail,
      sourceLinkId: getTrackingLinkId(),
      visitorId: getVisitorId(),
    });

    flushEvents();

    const redirectTo = getPostSignupRedirect();

    localStorage.removeItem('tm_redirect_after_signup');

    setTimeout(() => {
      window.location.href = redirectTo;
    }, 500);
  };

  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source:
        params.get('utm_source') ||
        localStorage.getItem('tm_utm_source') ||
        null,
      utm_medium:
        params.get('utm_medium') ||
        localStorage.getItem('tm_utm_medium') ||
        null,
      utm_campaign:
        params.get('utm_campaign') ||
        localStorage.getItem('tm_utm_campaign') ||
        null,
      utm_term:
        params.get('utm_term') || localStorage.getItem('tm_utm_term') || null,
      utm_content:
        params.get('utm_content') ||
        localStorage.getItem('tm_utm_content') ||
        null,
      tm_link_id: getTrackingLinkId(),
      ref: params.get('ref') || null,
    };
  };

  const storeUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ].forEach((param) => {
      const value = params.get(param);
      if (value) localStorage.setItem(`tm_${param}`, value);
    });
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    return {
      userAgent: ua,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      deviceType: getDeviceType(ua),
    };
  };

  const getDeviceType = (ua) => {
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
      return 'mobile';
    return 'desktop';
  };

  const getPageInfo = () => {
    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      host: window.location.host,
    };
  };

  const track = (eventType, eventData = {}) => {
    const event = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      userId: localStorage.getItem('tm_user_id') || null,
      eventType: eventType,
      page: getPageInfo(),
      device: getDeviceInfo(),
      utm: getUTMParams(),
      data: eventData,
    };

    eventQueue.push(event);

    if (eventQueue.length >= CONFIG.batchSize) {
      flushEvents();
    } else if (!flushTimer) {
      flushTimer = setTimeout(flushEvents, CONFIG.flushInterval);
    }
  };

  const flushEvents = async () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    if (eventQueue.length === 0) return;

    const eventsToSend = [...eventQueue];
    eventQueue = [];

    try {
      localStorage.setItem('tm_pending_events', JSON.stringify(eventsToSend));

      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true,
      });

      if (response.ok) {
        localStorage.removeItem('tm_pending_events');
      } else {
        eventQueue = [...eventsToSend, ...eventQueue];
      }
    } catch (error) {
      eventQueue = [...eventsToSend, ...eventQueue];
    }
  };

  const trackPageView = () => {
    track('page_view', {
      loadTime: performance.timing
        ? performance.timing.loadEventEnd - performance.timing.navigationStart
        : null,
    });
  };

  let maxScrollDepth = 0;
  const scrolledThresholds = new Set();

  const trackScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const winHeight = window.innerHeight;
    const scrollPercent = Math.round(
      (scrollTop / (docHeight - winHeight)) * 100
    );

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
    }

    CONFIG.scrollThresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !scrolledThresholds.has(threshold)) {
        scrolledThresholds.add(threshold);
        track('scroll_depth', { depth: threshold });
      }
    });
  };

  const trackClick = (event) => {
    const target = event.target.closest('a, button, [data-track]');
    if (!target) return;

    track('click', {
      element: target.tagName.toLowerCase(),
      text: target.innerText?.substring(0, 100),
      href: target.href || null,
      id: target.id || null,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const trackFormSubmit = (event) => {
    const form = event.target;
    track('form_submit', {
      formId: form.id || null,
      formName: form.name || null,
      formAction: form.action || null,
    });
  };

  let pageStartTime = Date.now();
  const trackTimeOnPage = () => {
    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
    track('time_on_page', {
      seconds: timeSpent,
      maxScrollDepth: maxScrollDepth,
    });
  };

  // PUBLIC API
  window.ThoughtMetrics = {
    track: (eventName, data = {}) => track(`custom_${eventName}`, data),

    identify: (userId, traits = {}) => {
      localStorage.setItem('tm_user_id', userId);
      localStorage.setItem('tm_user_registered', 'true');
      track('identify', { userId, traits });
    },

    onRegistered: onUserRegistered,

    getVisitorId: getVisitorId,
    getSessionId: getSessionId,
    getTrackingLinkId: getTrackingLinkId,

    isFromTrackingLink: () => !!getTrackingLinkId(),

    getUTMParams: getUTMParams,

    getPostSignupRedirect: getPostSignupRedirect,

    flush: flushEvents,
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const init = () => {
    storeUTMParams();

    if (handleTrackingLinkArrival()) {
      return;
    }

    if (document.readyState === 'complete') {
      trackPageView();
    } else {
      window.addEventListener('load', trackPageView);
    }

    window.addEventListener(
      'scroll',
      debounce(trackScroll, CONFIG.debounceDelay),
      { passive: true }
    );
    document.addEventListener('click', trackClick);
    document.addEventListener('submit', trackFormSubmit, true);

    window.addEventListener('beforeunload', () => {
      trackTimeOnPage();
      flushEvents();
    });

    const pendingEvents = JSON.parse(
      localStorage.getItem('tm_pending_events') || '[]'
    );
    if (pendingEvents.length > 0) {
      eventQueue = [...pendingEvents, ...eventQueue];
      flushEvents();
    }

    console.log('ThoughtMetrics Tracker initialized');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
