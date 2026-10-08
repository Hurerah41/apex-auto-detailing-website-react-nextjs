'use client';

import { useEffect, useRef } from 'react';

const steps = [
  ['A fresh start for your car', 'Welcome to Apex Auto Detailing', 'Opening the studio'],
  ['Good care starts here', 'We are getting everything ready', 'Preparing your visit'],
  ['Meet your next clean', 'Details make the difference', 'Loading vehicle care'],
  ['More shine, less fuss', 'Your vehicle deserves attention', 'Preparing the wash bay'],
  ['A finish to look forward to', 'From cabin to paintwork', 'Checking the details'],
  ['Ready when you are', 'Explore Apex Auto Detailing', 'Ready to explore'],
];

export default function Loader({ markup }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const start = Date.now();
    let frame;
    let fadeTimeout;
    let hideTimeout;
    let failsafe;
    let loaded = document.readyState === 'complete';
    let done = false;
    let currentStep = -1;
    const root = rootRef.current;
    const loader = root?.querySelector('#wx-loader');
    const title = root?.querySelector('#wl-title');
    const subtitle = root?.querySelector('#wl-sub');
    const fill = root?.querySelector('#wl-bar-fill');
    const percent = root?.querySelector('#wl-pct');
    const stepsList = root?.querySelector('#wl-steps');

    stepsList?.replaceChildren();
    steps.forEach((step) => {
      const item = document.createElement('li');
      item.className = 'wl-step pending';
      item.innerHTML = '<span class="wl-step-dot"></span><span class="wl-step-text"></span>';
      item.querySelector('.wl-step-text').textContent = step[2];
      stepsList?.appendChild(item);
    });
    const stepElements = Array.from(stepsList?.querySelectorAll('.wl-step') || []);

    const setStep = (index) => {
      if (index === currentStep || index < 0 || index >= steps.length) return;
      currentStep = index;
      stepElements.forEach((element, stepIndex) => {
        element.classList.remove('pending', 'active', 'done');
        element.classList.add(stepIndex < index ? 'done' : stepIndex === index ? 'active' : 'pending');
      });
      if (title && subtitle) {
        title.style.opacity = '0';
        subtitle.style.opacity = '0';
        window.setTimeout(() => {
          title.textContent = steps[index][0];
          subtitle.textContent = steps[index][1];
          title.style.opacity = '1';
          subtitle.style.opacity = '1';
        }, 200);
      }
    };
    const setProgress = (value) => {
      const next = Math.min(100, Math.max(0, Math.round(value)));
      if (fill) fill.style.width = `${next}%`;
      if (percent) percent.textContent = `${next}%`;
      const thresholds = [0, 17, 34, 52, 68, 85];
      for (let index = thresholds.length - 1; index >= 0; index -= 1) {
        if (next >= thresholds[index]) {
          setStep(index);
          break;
        }
      }
    };
    const finish = () => {
      if (done || !loaded || Date.now() - start < 4000) return;
      done = true;
      cancelAnimationFrame(frame);
      setProgress(100);
      stepElements.forEach((element) => {
        element.classList.remove('pending', 'active');
        element.classList.add('done');
      });
      fadeTimeout = window.setTimeout(() => {
        loader?.classList.add('fading');
        document.body.classList.remove('wx-loading');
        hideTimeout = window.setTimeout(() => {
          if (loader) {
            loader.style.display = 'none';
            window.dispatchEvent(new Event('apex-loader-hidden'));
          }
        }, 900);
      }, 500);
    };
    const handleLoad = () => {
      loaded = true;
      finish();
    };
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(92, (elapsed / 4000) * 92));
      if (loaded && elapsed >= 4000) finish();
      else frame = requestAnimationFrame(tick);
    };
    setStep(0);
    window.addEventListener('load', handleLoad, { once: true });
    failsafe = window.setTimeout(() => { loaded = true; finish(); }, 14000);
    tick();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(failsafe);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: markup }} />;
}