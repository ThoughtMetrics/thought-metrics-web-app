export const scrollToHashId = (hashId: string) => {
  const target = document.getElementById(hashId);
  const rootElement = document.getElementById('root');
  
  if (!target || !rootElement) {
    console.warn(`Element with id "${hashId}" or root container not found`);
    return;
  }

  // Get element position relative to the root container
  const elementRect = target.getBoundingClientRect();
  const rootRect = rootElement.getBoundingClientRect();
  const currentScrollTop = rootElement.scrollTop;

  // Calculate target position
  const targetPosition = currentScrollTop + (elementRect.top - rootRect.top);

  // Smooth scroll in your custom container
  rootElement.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });

  // Update URL manually
  window.history.pushState(null, '', `#${hashId}`);
};