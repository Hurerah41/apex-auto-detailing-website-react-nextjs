'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contactConfig } from '../lib/contact-config';

const gallerySlots = ['vs-center', 'vs-left', 'vs-right', 'vs-far-left', 'vs-far-right', 'vs-hidden'];
const galleryItems = [
  { id: 0, title: '2-Step Paint Correction', src: '/media/gallery/ba-paint-correction.jpg' },
  { id: 1, title: 'Luxury Interior Deep Clean', src: '/media/gallery/ba-interior-detail.jpg' },
  { id: 2, title: 'Headlight UV Restoration', src: '/media/gallery/ba-headlight-restoration.jpg' },
  { id: 3, title: 'Alloy Decontamination', src: '/media/gallery/ba-wheel-detailing.jpg' },
  { id: 4, title: 'Mud & Grime Decontamination', src: '/media/gallery/ba-foam-wash.jpg' },
  { id: 5, title: 'PPF Shield & Hydrophobic Gloss', src: '/media/gallery/ba-ceramic-ppf.jpg' }
];
const galleryVideos = galleryItems;
const reviewVideos = ['/media/videos/video-1.mp4', '/media/videos/video-2.mp4', '/media/videos/video-3.mp4'];
const fallbackMapLink = 'https://www.google.com/maps/search/?api=1&query=Apex%20Auto%20Detailing%20Karachi';

function contactUrl(anchor) {
  const label = `${anchor.getAttribute('aria-label') || ''} ${anchor.textContent || ''} ${anchor.className || ''}`.toLowerCase();
  if (label.includes('direction')) return contactConfig.mapsUrl || fallbackMapLink;
  if (label.includes('instagram')) return contactConfig.instagramUrl;
  if (label.includes('facebook')) return contactConfig.facebookUrl;
  if (anchor.classList.contains('fsd-link') && contactConfig.phone) return `tel:${contactConfig.phone}`;
  if (contactConfig.whatsapp) return `https://wa.me/${contactConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Apex Auto Detailing, I would like a quote.')}`;
  return '';
}

export default function SiteInteractions({ children }) {
  const rootRef = useRef(null);
  const touchStartRef = useRef(null);
  const [vehicle, setVehicle] = useState('hatchback');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const isGalleryPausedRef = useRef(false);
  const galleryPauseTimerRef = useRef(null);

  const pauseGalleryTemporarily = (ms = 4000) => {
    isGalleryPausedRef.current = true;
    if (galleryPauseTimerRef.current) clearTimeout(galleryPauseTimerRef.current);
    galleryPauseTimerRef.current = setTimeout(() => {
      isGalleryPausedRef.current = false;
    }, ms);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    gsap.registerPlugin(ScrollTrigger);

    const header = root.querySelector('#site-header');
    const hero = root.querySelector('#hero');
    const startHeroAnimation = () => hero?.classList.add('hero-animated');
    const loader = root.querySelector('#wx-loader');
    window.addEventListener('apex-loader-hidden', startHeroAnimation, { once: true });
    if (!loader || getComputedStyle(loader).display === 'none') startHeroAnimation();
    let scrollFrame = 0;
    const updateScrollState = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        header?.classList.toggle('is-scrolled', window.scrollY > 40);
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
        let active = '';
        ['about', 'services', 'process', 'packages', 'gallery', 'reviews', 'contact'].forEach((id) => {
          const section = root.querySelector(`#${id}`);
          const layoutNode = section?.parentElement?.classList.contains('pin-spacer') ? section.parentElement : section;
          const top = layoutNode ? layoutNode.getBoundingClientRect().top + window.scrollY : 0;
          if (section && window.scrollY + offset + 40 >= top && window.scrollY + offset + 40 < top + layoutNode.offsetHeight && !active) active = id;
        });
        root.querySelectorAll('.header-nav .nav-link').forEach((link) => link.classList.toggle('active', active ? link.getAttribute('href') === `#${active}` : window.scrollY < 200 && link.getAttribute('href') === './'));
      });
    };
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    root.querySelectorAll('[data-apex-contact]').forEach((anchor) => {
      const url = contactUrl(anchor);
      const label = `${anchor.getAttribute('aria-label') || ''} ${anchor.textContent || ''}`.toLowerCase();
      if (!url && (label.includes('instagram') || label.includes('facebook'))) {
        anchor.hidden = true;
        return;
      }
      if (url) {
        anchor.href = url;
        anchor.target = '_blank';
        anchor.rel = 'noopener';
        if (anchor.classList.contains('fsd-link') && contactConfig.phone) anchor.textContent = contactConfig.phone;
      } else {
        anchor.href = '#contact';
        anchor.removeAttribute('target');
      }
    });

    const process = root.querySelector('.process-section');
    const reviews = root.querySelector('.reviews-section');
    const mediaContexts = [];
    const gsapContext = gsap.context(() => {
      const processMedia = gsap.matchMedia();
      mediaContexts.push(processMedia);
      processMedia.add('(min-width: 993px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)', () => {
        if (!process) return undefined;
        const cards = Array.from(process.querySelectorAll('.process-card'));
        const counter = process.querySelector('#process-current');
        const fill = process.querySelector('#process-progress-fill');
        const finalCta = process.querySelector('.process-final-cta');
        if (cards.length < 2) return undefined;

        process.classList.add('process-animated');
        gsap.set(cards, { autoAlpha: 0, y: 56 });
        gsap.set(cards[0], { autoAlpha: 1, y: 0 });
        if (finalCta) gsap.set(finalCta, { autoAlpha: 0, y: 12 });
        if (counter) counter.textContent = '01';
        if (fill) gsap.set(fill, { width: `${100 / cards.length}%` });

        const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        for (let index = 0; index < cards.length - 1; index += 1) {
          const position = index;
          timeline.to(cards[index], { autoAlpha: 0, y: -48, duration: 0.48 }, position);
          timeline.fromTo(
            cards[index + 1],
            { autoAlpha: 0, y: 56 },
            { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false },
            position + 0.22,
          );
          timeline.to({}, { duration: 0.28 }, position + 0.72);
        }
        if (finalCta) {
          timeline.fromTo(
            finalCta,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.28, immediateRender: false },
            cards.length - 1,
          );
        }
        timeline.to({}, { duration: 0.32 });

        timeline.eventCallback('onUpdate', () => {
          const transitionProgress = Math.min(cards.length - 1, timeline.time());
          const step = Math.min(cards.length - 1, Math.floor(transitionProgress + 0.5));
          if (counter) counter.textContent = String(step + 1).padStart(2, '0');
          if (fill) {
            const progress = (1 + transitionProgress) / cards.length;
            gsap.set(fill, { width: `${Math.min(100, progress * 100)}%` });
          }
        });

        const trigger = ScrollTrigger.create({
          trigger: process,
          start: 'top top',
          end: () => `+=${Math.round((cards.length - 1) * Math.max(700, window.innerHeight * 0.9))}`,
          pin: true,
          scrub: 0.65,
          animation: timeline,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        });
        return () => {
          trigger.kill();
          timeline.kill();
          process.classList.remove('process-animated');
          gsap.set(cards, { clearProps: 'all' });
          if (finalCta) gsap.set(finalCta, { clearProps: 'all' });
          if (fill) gsap.set(fill, { clearProps: 'width' });
          if (counter) counter.textContent = '01';
        };
      });

      const reviewMedia = gsap.matchMedia();
      mediaContexts.push(reviewMedia);
      reviewMedia.add('(min-width: 993px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)', () => {
        if (!reviews) return undefined;
        const viewport = reviews.querySelector('#reviews-right-viewport');
        const cards = Array.from(reviews.querySelectorAll('.review-card'));
        if (!viewport || cards.length < 2) return undefined;

        reviews.classList.add('reviews-animated');
        const stackOffset = (card) => Math.max(viewport.clientHeight, card.offsetHeight) + 48;
        gsap.set(cards, {
          yPercent: -50,
          y: 0,
          zIndex: (index) => index + 1,
        });
        gsap.set(cards.slice(1), { y: (index, card) => stackOffset(card) });

        const timeline = gsap.timeline({ defaults: { ease: 'none' } });
        cards.slice(1).forEach((card, index) => {
          timeline.fromTo(
            card,
            { y: () => stackOffset(card) },
            { y: 0, duration: 0.82, immediateRender: false },
            index,
          );
          timeline.to({}, { duration: 0.18 });
        });

        const trigger = ScrollTrigger.create({
          trigger: reviews,
          start: 'top top',
          end: () => `+=${Math.round((cards.length - 1) * Math.max(700, window.innerHeight * 0.95))}`,
          pin: true,
          scrub: 0.65,
          animation: timeline,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        });
        return () => {
          trigger.kill();
          timeline.kill();
          reviews.classList.remove('reviews-animated');
          gsap.set(cards, { clearProps: 'transform,zIndex' });
        };
      });

      // ── Scroll Reveal Animations ──────────────────────────────────
      // Runs on all screen sizes, respects prefers-reduced-motion
      const revealMedia = gsap.matchMedia();
      mediaContexts.push(revealMedia);
      revealMedia.add('(prefers-reduced-motion: no-preference)', () => {

        // Helper: animate elements in stagger, triggered by a parent
        function revealGroup(elements, triggerEl, opts) {
          var elArr = Array.from(elements || []);
          if (!elArr.length) return;
          var options = opts || {};
          gsap.fromTo(
            elArr,
            { autoAlpha: 0, y: options.y != null ? options.y : 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: options.duration || 0.7,
              ease: options.ease || 'power3.out',
              stagger: options.stagger != null ? options.stagger : 0.13,
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: triggerEl || elArr[0],
                start: options.start || 'top 88%',
                once: true,
              },
            },
          );
        }

        // ── Section tags + titles ─────────────────────────────────
        root.querySelectorAll('.wx-tag, .wx-title, .gallery-title, .reviews-big-title').forEach(function(el) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        });

        // ── Subtitle / body text ──────────────────────────────────
        root.querySelectorAll('.gallery-main-sub, .process-main-sub, .about-lead, .about-body, .about-desc, .section-sub, .packages-footnote').forEach(function(el) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform,opacity',
              scrollTrigger: { trigger: el, start: 'top 91%', once: true },
            },
          );
        });

        // ── About section ─────────────────────────────────────────
        var about = root.querySelector('#about');
        if (about) {
          revealGroup(about.querySelectorAll('.about-img, .about-img-wrap, .about-media'), about, { stagger: 0.15, y: 55 });
          revealGroup(about.querySelectorAll('.about-stat'), about.querySelector('.about-stats') || about, { stagger: 0.1, y: 30 });
          revealGroup(about.querySelectorAll('.about-cta, .btn'), about, { stagger: 0.1, y: 20 });
        }

        // ── Services rows ──────────────────────────────────────────
        var services = root.querySelector('#services');
        if (services) {
          revealGroup(services.querySelectorAll('.service-row'), services, { stagger: 0.1, y: 36 });
        }

        // ── Package cards ──────────────────────────────────────────
        var packages = root.querySelector('#packages');
        if (packages) {
          revealGroup(packages.querySelectorAll('.pkg-card'), packages, { stagger: 0.12, y: 44 });
        }

        // ── Gallery section header ─────────────────────────────────
        var gallery = root.querySelector('#gallery');
        if (gallery) {
          revealGroup(gallery.querySelectorAll('.gallery-header > *'), gallery, { stagger: 0.12, y: 28 });
        }

        // ── Contact section ────────────────────────────────────────
        var contact = root.querySelector('#contact');
        if (contact) {
          revealGroup(
            contact.querySelectorAll('.contact-title, .contact-sub, .contact-info-item, .contact-form-group, .contact-form-actions'),
            contact,
            { stagger: 0.09, y: 30 }
          );
        }

        // ── Footer ────────────────────────────────────────────────
        var footer = root.querySelector('footer');
        if (footer) {
          revealGroup(
            footer.querySelectorAll('.footer-logo, .footer-col, .footer-nav, .footer-socials, .footer-bottom'),
            footer,
            { stagger: 0.09, y: 22, start: 'top 96%' }
          );
        }

      });
      // ── End Scroll Reveal ─────────────────────────────────────────
    }, root);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad, { once: true });

    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('apex-loader-hidden', startHeroAnimation);
      mediaContexts.forEach((mediaContext) => mediaContext.revert());
      gsapContext.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (root.contains(trigger.trigger)) trigger.kill();
      });
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll('.vehicle-tab').forEach((tab) => {
      const selected = tab.dataset.vehicle === vehicle;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    root.querySelectorAll('.package-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${vehicle}`));
  }, [vehicle]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll('.vslider-card'));
    const current = cards[galleryIndex];
    cards.forEach((card, index) => {
      gallerySlots.forEach((slot) => card.classList.remove(slot));
      let offset = index - galleryIndex;
      if (offset > Math.floor(cards.length / 2)) offset -= cards.length;
      if (offset < -Math.floor(cards.length / 2)) offset += cards.length;
      const slot = offset === 0 ? gallerySlots[0] : offset === -1 ? gallerySlots[1] : offset === 1 ? gallerySlots[2] : offset <= -2 ? gallerySlots[3] : gallerySlots[4];
      card.classList.add(slot);
      const video = card.querySelector('video');
      if (video && index === galleryIndex) video.play().catch(() => {});
      else video?.pause();
    });
    const label = root.querySelector('#vslider-cur');
    const fill = root.querySelector('#vslider-progress-fill');
    if (label) label.textContent = String(galleryIndex + 1).padStart(2, '0');
    if (fill) fill.style.width = `${((galleryIndex + 1) / cards.length) * 100}%`;
    return () => current?.querySelector('video')?.pause();
  }, [galleryIndex]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const vslider = root.querySelector('#vslider');
    const onMouseEnter = () => { isGalleryPausedRef.current = true; };
    const onMouseLeave = () => { isGalleryPausedRef.current = false; };
    vslider?.addEventListener('mouseenter', onMouseEnter);
    vslider?.addEventListener('mouseleave', onMouseLeave);

    const interval = setInterval(() => {
      if (document.hidden || isGalleryPausedRef.current) return;
      setGalleryIndex((prev) => (prev + 1) % galleryItems.length);
    }, 3500);

    return () => {
      clearInterval(interval);
      if (galleryPauseTimerRef.current) clearTimeout(galleryPauseTimerRef.current);
      vslider?.removeEventListener('mouseenter', onMouseEnter);
      vslider?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  function closeMobileNav() {
    const root = rootRef.current;
    root?.querySelector('#hamburger')?.classList.remove('open');
    root?.querySelector('#hamburger')?.setAttribute('aria-expanded', 'false');
    root?.querySelector('#mobile-nav')?.classList.remove('open');
  }

  function handleClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const root = rootRef.current;
    const hamburger = target.closest('#hamburger');
    const mobileNav = root.querySelector('#mobile-nav');
    if (hamburger) {
      const open = !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      mobileNav?.classList.toggle('open', open);
      return;
    }

    const serviceTarget = target.closest('[data-target]');
    if (serviceTarget) {
      event.preventDefault();
      const row = root.querySelector(`.service-row[data-num="${serviceTarget.dataset.target}"]`);
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
      if (row) window.scrollTo({ top: row.getBoundingClientRect().top + window.scrollY - headerHeight - 24, behavior: 'smooth' });
      root.querySelector('.has-dropdown')?.classList.remove('open');
      closeMobileNav();
      return;
    }

    if (target.closest('.nav-link--has-drop')) {
      if (window.innerWidth > 992) {
        const item = target.closest('.has-dropdown');
        const open = !item.classList.contains('open');
        item.classList.toggle('open', open);
        target.closest('.nav-link--has-drop').setAttribute('aria-expanded', String(open));
      }
      return;
    }

    if (target.closest('.mobile-drop-toggle')) {
      const button = target.closest('.mobile-drop-toggle');
      const open = !button.classList.contains('open');
      button.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      root.querySelector('.mobile-drop-list')?.classList.toggle('open', open);
      return;
    }

    if (target.closest('#site-header') === null) root.querySelector('.has-dropdown.open')?.classList.remove('open');
    const navLink = target.closest('#mobile-nav a');
    if (navLink) closeMobileNav();

    const tab = target.closest('.vehicle-tab');
    if (tab) {
      setVehicle(tab.dataset.vehicle);
      return;
    }

    if (target.closest('#vslider-prev')) {
      pauseGalleryTemporarily(4000);
      setGalleryIndex((index) => (index + galleryItems.length - 1) % galleryItems.length);
      return;
    }
    if (target.closest('#vslider-next')) {
      pauseGalleryTemporarily(4000);
      setGalleryIndex((index) => (index + 1) % galleryItems.length);
      return;
    }
    const galleryCard = target.closest('.vslider-card');
    if (galleryCard?.classList.contains('vs-left')) {
      pauseGalleryTemporarily(4000);
      setGalleryIndex((index) => (index + galleryItems.length - 1) % galleryItems.length);
    }
    if (galleryCard?.classList.contains('vs-right')) {
      pauseGalleryTemporarily(4000);
      setGalleryIndex((index) => (index + 1) % galleryItems.length);
    }

    if (target.closest('#apex-gallery-button')) {
      root.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const contact = target.closest('[data-apex-contact]');
    if (contact && !contactUrl(contact)) {
      event.preventDefault();
      const rowTitle = contact.closest('.service-row')?.querySelector('.service-row-title')?.textContent?.trim();
      const packageName = contact.closest('.pkg-card')?.querySelector('.pkg-name')?.textContent?.trim();
      const requestedService = rowTitle || (packageName ? 'Car Wash' : '');
      const select = root.querySelector('#contact select[name="service"]');
      if (select && requestedService) {
        const requestText = requestedService.toLowerCase();
        const match = Array.from(select.options).find((option) => {
          const optionText = option.textContent.toLowerCase();
          return optionText.includes(requestText) || requestText.includes(optionText.replace(' (ppf)', ''));
        });
        if (match) select.value = match.value;
      }
      const message = root.querySelector('#contact textarea[name="message"]');
      if (message && packageName && !message.value) message.value = `I would like to book the ${packageName} package.`;
      const vehicleInput = root.querySelector('#contact input[name="vehicle"]');
      const activeVehicle = root.querySelector('.vehicle-tab.active span')?.textContent?.trim();
      if (vehicleInput && packageName && activeVehicle && !vehicleInput.value) vehicleInput.value = activeVehicle;
      const destination = root.querySelector('#contact');
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
      if (destination) window.scrollTo({ top: destination.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
      closeMobileNav();
      window.setTimeout(() => root.querySelector('#contact input[name="name"]')?.focus({ preventScroll: true }), 550);
      return;
    }

    if (target.closest('#rvm-close, #rvm-backdrop')) closeReviewModal(root);
    if (target.closest('#rvm-prev, #rvm-left')) changeReview(root, -1);
    if (target.closest('#rvm-next, #rvm-right')) changeReview(root, 1);
    const dot = target.closest('.rvm-dot');
    if (dot) changeReview(root, Number(dot.dataset.idx), true);
    if (target.closest('#reviews-play-btn')) openReviewModal(root);

    if (target.closest('a[href^="#"]')) {
      const anchor = target.closest('a[href^="#"]');
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const destination = root.querySelector(href);
        if (destination) {
          event.preventDefault();
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
          window.scrollTo({ top: destination.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
        }
      }
    }
  }

  function handlePointerMove(event) {
    const root = rootRef.current;
    const target = event.target instanceof Element ? event.target : null;
    const row = target?.closest('.service-row[data-preview]');
    const preview = root?.querySelector('#service-cursor-preview');
    const image = root?.querySelector('#service-cursor-img');
    if (row && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 993px)').matches) {
      const src = row.dataset.preview.replace(/^media\//, '/media/');
      if (image && image.getAttribute('src') !== src) image.src = src;
      if (preview) {
        preview.style.left = `${Math.max(12, Math.min(event.clientX + 24, window.innerWidth - 240))}px`;
        preview.style.top = `${Math.max(12, Math.min(event.clientY - 80, window.innerHeight - 170))}px`;
        preview.classList.add('active');
      }
    } else preview?.classList.remove('active');

    const hero = target?.closest('#hero');
    const car = root?.querySelector('#hero-car');
    if (hero && car && window.matchMedia('(min-width: 993px)').matches) {
      const rect = hero.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      car.style.transform = `perspective(900px) rotateX(${dy * -4}deg) rotateY(${dx * 5}deg) translateX(${dx * 10}px)`;
      car.style.transition = 'transform 0.15s ease-out';
    }
  }

  function handlePointerLeave(event) {
    const root = rootRef.current;
    const target = event.target;
    if (target?.id === 'hero') {
      const car = root?.querySelector('#hero-car');
      if (car) {
        car.style.transform = '';
        car.style.transition = 'transform 0.6s ease';
      }
    }
    if (target?.closest?.('.service-row')) root?.querySelector('#service-cursor-preview')?.classList.remove('active');
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    const target = event.target instanceof Element ? event.target : null;
    touchStartRef.current = {
      x: touch.screenX,
      y: touch.screenY,
      gallery: Boolean(target?.closest('#vslider')),
      review: Boolean(target?.closest('#review-video-modal')),
    };
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.screenX - start.x;
    const dy = touch.screenY - start.y;
    if (start.gallery && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
      pauseGalleryTemporarily(4000);
      setGalleryIndex((index) => (index + (dx < 0 ? 1 : galleryItems.length - 1)) % galleryItems.length);
    }
    const modal = rootRef.current?.querySelector('#review-video-modal.active');
    if (start.review && modal && Math.abs(dx) > 40) changeReview(rootRef.current, dx < 0 ? 1 : -1);
    touchStartRef.current = null;
  }

  useEffect(() => {
    const root = rootRef.current;
    const onKeyDown = (event) => {
      const modal = root?.querySelector('#review-video-modal.active');
      if (modal && event.key === 'Escape') closeReviewModal(root);
      else if (modal && event.key === 'ArrowLeft') changeReview(root, -1);
      else if (modal && event.key === 'ArrowRight') changeReview(root, 1);
      else if (event.key === 'ArrowLeft') {
        pauseGalleryTemporarily(4000);
        setGalleryIndex((index) => (index + galleryItems.length - 1) % galleryItems.length);
      }
      else if (event.key === 'ArrowRight') {
        pauseGalleryTemporarily(4000);
        setGalleryIndex((index) => (index + 1) % galleryItems.length);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return <div ref={rootRef} onClick={handleClick} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    {children}
  </div>;
}

function closeReviewModal(root) {
  const modal = root.querySelector('#review-video-modal');
  modal?.classList.remove('active');
  document.body.style.overflow = '';
  const video = modal?.querySelector('#rvm-video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function openReviewModal(root) {
  const modal = root.querySelector('#review-video-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateReviewSlots(root, 0);
}

function changeReview(root, direction, absolute = false) {
  const modal = root.querySelector('#review-video-modal.active');
  if (!modal) return;
  const current = Number(modal.dataset.current || 0);
  const next = absolute ? direction : (current + direction + reviewVideos.length) % reviewVideos.length;
  updateReviewSlots(root, next);
}

function updateReviewSlots(root, index) {
  const modal = root.querySelector('#review-video-modal');
  const setVideo = (selector, videoIndex, autoplay) => {
    const video = modal.querySelector(selector);
    if (!video) return;
    if (video.src !== new URL(reviewVideos[videoIndex], window.location.href).href) {
      video.src = reviewVideos[videoIndex];
      video.load();
    }
    if (autoplay) video.play().catch(() => {});
  };
  const previous = (index + reviewVideos.length - 1) % reviewVideos.length;
  const next = (index + 1) % reviewVideos.length;
  modal.dataset.current = String(index);
  setVideo('#rvm-video', index, true);
  setVideo('#rvm-left video', previous, false);
  setVideo('#rvm-right video', next, false);
  const counter = modal.querySelector('#rvm-counter');
  if (counter) counter.textContent = `${index + 1} / ${reviewVideos.length}`;
  modal.querySelectorAll('.rvm-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
}
