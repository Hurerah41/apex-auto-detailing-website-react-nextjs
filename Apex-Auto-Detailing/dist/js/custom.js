/**
 * WashX — custom.js
 * jQuery 3.7 + vanilla JS
 * No other library dependencies
 */

(function ($) {
    'use strict';

    /* ══════════════════════════════════════════
       1. STICKY HEADER ON SCROLL
    ══════════════════════════════════════════ */
    var $header = $('#site-header');
    var lastScroll = 0;

    function handleHeaderScroll() {
        var scrollTop = $(window).scrollTop();
        $header.toggleClass('is-scrolled', scrollTop > 40);
        lastScroll = scrollTop;
    }

    $(window).on('scroll.header', handleHeaderScroll);
    handleHeaderScroll(); // run on init


    /* ══════════════════════════════════════════
       2. HAMBURGER / MOBILE NAV
    ══════════════════════════════════════════ */
    var $hamburger = $('#hamburger');
    var $mobileNav = $('#mobile-nav');

    $hamburger.on('click', function () {
        var isOpen = $hamburger.hasClass('open');
        $hamburger.toggleClass('open', !isOpen).attr('aria-expanded', !isOpen);
        $mobileNav.toggleClass('open', !isOpen);
    });

    // Close on link click
    $mobileNav.find('a').on('click', function () {
        $hamburger.removeClass('open').attr('aria-expanded', false);
        $mobileNav.removeClass('open');
    });

    // Close on outside click
    $(document).on('click.nav', function (e) {
        if ($mobileNav.hasClass('open') && !$(e.target).closest('#site-header').length) {
            $hamburger.removeClass('open').attr('aria-expanded', false);
            $mobileNav.removeClass('open');
        }
    });


    /* ══════════════════════════════════════════
       3. SMOOTH SCROLL FOR ANCHOR LINKS
    ══════════════════════════════════════════ */
    $(document).on('click', 'a[href^="#"]', function (e) {
        var href   = $(this).attr('href');
        if (!href || href === '#') return;
        var $target = $(href);
        if (!$target.length) return;
        e.preventDefault();
        var offset = $target.offset().top - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || 80, 10);
        $('html, body').animate({ scrollTop: offset }, 600, 'swing');
    });


    /* ══════════════════════════════════════════
       4. FLOATING WATER PARTICLES (hero)
    ══════════════════════════════════════════ */
    var $particleContainer = $('#hero-particles');

    if ($particleContainer.length) {
        var PARTICLE_COUNT = 22;

        function createParticle() {
            var size     = Math.random() * 8 + 4;          // 4–12 px
            var startX   = Math.random() * 100;            // % from left
            var startY   = 80 + Math.random() * 20;        // start near bottom
            var duration = Math.random() * 8 + 7;          // 7–15 s
            var delay    = Math.random() * 10;             // staggered

            var $p = $('<span class="particle"></span>').css({
                width:     size + 'px',
                height:    size + 'px',
                left:      startX + '%',
                bottom:    startY * -1 + 'px', // start offscreen bottom is handled by keyframe
                top:       startY + '%',
                opacity:   0,
                animationDuration:  duration + 's',
                animationDelay:     delay + 's',
                animationTimingFunction: 'ease-in',
                background: 'rgba(108,201,244,' + (Math.random() * 0.4 + 0.2) + ')',
            });

            $particleContainer.append($p);
        }

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            createParticle();
        }
    }


    /* ══════════════════════════════════════════
       5. ACTIVE NAV LINK ON SCROLL
       (ready for future sections)
    ══════════════════════════════════════════ */
    var navSections = ['about', 'services', 'process', 'packages', 'gallery', 'reviews', 'contact'];

    $(window).on('scroll.navspy', function () {
        if (!navSections.length) return;
        var scrollPos = $(window).scrollTop() + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80) + 40;
        var activeSet = false;

        navSections.forEach(function (id) {
            var $section = $('#' + id);
            if (!$section.length) return;
            var top    = $section.offset().top;
            var bottom = top + $section.outerHeight();
            if (scrollPos >= top && scrollPos < bottom && !activeSet) {
                activeSet = true;
                $('.header-nav .nav-link').removeClass('active');
                $('.header-nav .nav-link[href="#' + id + '"]').addClass('active');
            }
        });

        if (!activeSet && $(window).scrollTop() < 200) {
            $('.header-nav .nav-link').removeClass('active');
            $('.header-nav .nav-link[href="./"]').addClass('active');
        }
    });


    /* ══════════════════════════════════════════
       6. CAR TILT ON MOUSE MOVE
       Subtle parallax tilt for the hero car
    ══════════════════════════════════════════ */
    var $heroCar = $('#hero-car');

    if ($heroCar.length && window.matchMedia('(min-width: 993px)').matches) {
        var heroSection = document.getElementById('hero');

        heroSection && heroSection.addEventListener('mousemove', function (e) {
            var rect   = heroSection.getBoundingClientRect();
            var cx     = rect.left + rect.width  / 2;
            var cy     = rect.top  + rect.height / 2;
            var dx     = (e.clientX - cx) / (rect.width  / 2);
            var dy     = (e.clientY - cy) / (rect.height / 2);
            var tiltX  = dy * -4;   // max ±4deg
            var tiltY  = dx *  5;   // max ±5deg
            var moveX  = dx * 10;   // parallax px

            $heroCar.css({
                transform: 'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateX(' + moveX + 'px)',
                transition: 'transform 0.15s ease-out'
            });
        });

        heroSection && heroSection.addEventListener('mouseleave', function () {
            $heroCar.css({
                transform: '',
                transition: 'transform 0.6s ease'
            });
        });
    }

}(jQuery));


/* ══════════════════════════════════════════
   7. SCROLL REVEAL — IntersectionObserver
   Adds .in-view class when elements enter
   the viewport, triggering CSS transitions
══════════════════════════════════════════ */
(function () {
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all immediately
        document.querySelectorAll('.service-row').forEach(function (el) {
            el.classList.add('in-view');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // fire once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.service-row').forEach(function (el) {
        observer.observe(el);
    });
}());


/* ══════════════════════════════════════════
   8. SERVICE ROW — CURSOR IMAGE PREVIEW
   · Preloads ALL preview images on init
   · Cache object = instant swap, no flash
   · currentSrc guard = no stale image
   Only on desktop (pointer device)
══════════════════════════════════════════ */
(function () {
    var preview = document.getElementById('service-cursor-preview');
    var image = document.getElementById('service-cursor-img');
    if (!preview || !image) return;
    var pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 993px)');
    document.querySelectorAll('.service-row[data-preview]').forEach(function(row) {
        var preload = new Image(); preload.src = row.dataset.preview;
        row.addEventListener('pointermove', function(e) {
            if (!pointer.matches) return;
            if (image.getAttribute('src') !== row.dataset.preview) image.src = row.dataset.preview;
            var x = Math.min(e.clientX + 24, window.innerWidth - 240);
            var y = Math.max(12, Math.min(e.clientY - 80, window.innerHeight - 170));
            preview.style.left = Math.max(12,x) + 'px';
            preview.style.top = y + 'px';
            preview.classList.add('active');
        });
        row.addEventListener('pointerleave', function(){ preview.classList.remove('active'); });
    });
    window.addEventListener('scroll',function(){preview.classList.remove('active');},{passive:true});
}());

/* ══════════════════════════════════════════
   9. PROCESS SECTION — GSAP PINNED SCROLL
   Editorial split design · smooth scrub
   · Section pins at top of viewport
   · Each scroll step reveals next card
   · Progress bar updates live
   · Last card expands, then unpin
══════════════════════════════════════════ */
(function () {
    var section = document.querySelector('.process-section');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    var cards = Array.from(section.querySelectorAll('.process-card'));
    var counter = document.getElementById('process-current');
    var fill = document.getElementById('process-progress-fill');
    var media = gsap.matchMedia();
    // A tall desktop viewport supports the reference's pinned presentation.
    // All other screens keep every step in normal document flow.
    media.add('(min-width: 993px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)', function() {
        section.classList.add('process-animated');
        gsap.set(cards, {autoAlpha:0,y:36});
        gsap.set(cards[0], {autoAlpha:1,y:0});
        var timeline = gsap.timeline();
        cards.forEach(function(card,index) {
            if(index) {
                timeline.to(cards[index-1], {autoAlpha:0,y:-24,duration:.22},index);
                timeline.to(card, {autoAlpha:1,y:0,duration:.22},index+.22);
            }
            timeline.to({}, {duration:.56},index+.44);
        });
        cards[cards.length-1].classList.add('is-expanded');
        ScrollTrigger.create({
            trigger:section, start:'top top', end:function(){return '+='+(cards.length*window.innerHeight*.85);},
            pin:true, scrub:.3, animation:timeline, invalidateOnRefresh:true,
            onUpdate:function(self){
                var time=timeline.time();
                var step=Math.min(cards.length-1,Math.max(0,Math.floor(time-.22)));
                if(counter)counter.textContent=String(step+1).padStart(2,'0');
                if(fill)fill.style.width=((step+1)/cards.length*100)+'%';
            }
        });
        return function() {
            section.classList.remove('process-animated');
            cards.forEach(function(card){card.classList.remove('is-expanded');});
            if(counter)counter.textContent='01';
            if(fill)fill.style.width='25%';
        };
    });
    window.addEventListener('load',function(){ScrollTrigger.refresh();},{once:true});
}());

/* ══════════════════════════════════════════
   10. PACKAGES — Vehicle tab switcher
══════════════════════════════════════════ */
(function ($) {
    var $tabs   = $('.vehicle-tab');
    var $panels = $('.package-panel');

    $tabs.on('click', function () {
        var vehicle = $(this).data('vehicle');

        $tabs.removeClass('active').attr('aria-selected', false);
        $(this).addClass('active').attr('aria-selected', true);

        $panels.removeClass('active');
        $('#panel-' + vehicle).addClass('active');
    });
}(jQuery));



/* ══════════════════════════════════════════
   11. VIDEO GALLERY SLIDER — portrait reel
   · 9:16 cards · center plays · sides faded
   · Trendy counter + progress line nav
══════════════════════════════════════════ */
(function () {

    var cards     = document.querySelectorAll('.vslider-card');
    var btnPrev   = document.getElementById('vslider-prev');
    var btnNext   = document.getElementById('vslider-next');
    var curLabel  = document.getElementById('vslider-cur');
    var fillBar   = document.getElementById('vslider-progress-fill');

    if (!cards.length) return;

    var total     = cards.length;
    var current   = 0;
    var animating = false;

    /* ── Map circular offset to slot class ── */
    function slotFor(offset) {
        if (offset === 0)  return 'vs-center';
        if (offset === -1) return 'vs-left';
        if (offset === 1)  return 'vs-right';
        if (offset <= -2)  return 'vs-far-left';
        if (offset >= 2)   return 'vs-far-right';
        return 'vs-hidden';
    }

    /* ── Apply all positions ── */
    function applyPositions() {
        cards.forEach(function (card, i) {
            card.classList.remove('vs-center','vs-left','vs-right',
                                  'vs-far-left','vs-far-right','vs-hidden');
            var offset = i - current;
            // Wrap
            if (offset > Math.floor(total / 2))  offset -= total;
            if (offset < -Math.floor(total / 2)) offset += total;
            card.classList.add(slotFor(offset));
        });
    }

    /* ── Play center, pause others ── */
    function updatePlayback() {
        cards.forEach(function (card, i) {
            var video = card.querySelector('video');
            if (!video) return;
            if (i === current) {
                video.play().catch(function () {});
            } else {
                video.pause();
            }
        });
    }

    /* ── Update footer UI ── */
    function updateUI() {
        if (curLabel)  curLabel.textContent = String(current + 1).padStart(2, '0');
        if (fillBar)   fillBar.style.width  = ((current + 1) / total * 100) + '%';
    }

    /* ── Navigate ── */
    function goTo(index) {
        if (animating) return;
        animating = true;
        current   = ((index % total) + total) % total;
        applyPositions();
        updatePlayback();
        updateUI();
        setTimeout(function () { animating = false; }, 680);
    }

    function prev() { goTo(current - 1); }
    function next() { goTo(current + 1); }

    /* ── Controls ── */
    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    /* ── Click side cards to navigate ── */
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (card.classList.contains('vs-left'))  prev();
            if (card.classList.contains('vs-right')) next();
        });
    });

    /* ── Touch swipe ── */
    var tx = 0, ty = 0;
    var slider = document.getElementById('vslider');
    if (slider) {
        slider.addEventListener('touchstart', function (e) {
            tx = e.changedTouches[0].screenX;
            ty = e.changedTouches[0].screenY;
        }, { passive: true });
        slider.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].screenX - tx;
            var dy = e.changedTouches[0].screenY - ty;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
                dx < 0 ? next() : prev();
            }
        }, { passive: true });
    }

    /* ── Keyboard ── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    /* ── Auto-slide ── */
    var autoSlideTimer = null;
    var isPaused = false;
    var pauseTimer = null;

    function pauseTemporarily(ms) {
        isPaused = true;
        if (pauseTimer) clearTimeout(pauseTimer);
        pauseTimer = setTimeout(function () { isPaused = false; }, ms || 4000);
    }

    if (slider) {
        slider.addEventListener('mouseenter', function () { isPaused = true; });
        slider.addEventListener('mouseleave', function () { isPaused = false; });
    }

    autoSlideTimer = setInterval(function () {
        if (!document.hidden && !isPaused) {
            next();
        }
    }, 3500);

    /* ── Init ── */
    applyPositions();
    updateUI();
    // Try autoplay center
    var cv = cards[0] && cards[0].querySelector('video');
    if (cv) cv.play().catch(function () {});

}());




/* ══════════════════════════════════════════
   12. REVIEWS — GSAP Pinned · Stacking Cards
   · All cards position: absolute, same spot
   · Card 1 starts visible
   · Card 2 starts BELOW viewport, slides UP
     and covers card 1 (true stack overlap)
   · Card 3 starts BELOW viewport, slides UP
     and covers card 2
   · Left title pinned via CSS height:100vh
   · After all 3 settled, section unpins
══════════════════════════════════════════ */
(function () {

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var section  = document.querySelector('.reviews-section');
    var pinWrap  = document.getElementById('reviews-pinned');
    var viewport = document.getElementById('reviews-right-viewport');
    var card1    = document.getElementById('rc-1');
    var card2    = document.getElementById('rc-2');
    var card3    = document.getElementById('rc-3');

    if (!section || !card1 || !card2 || !card3 || !viewport) return;

    gsap.registerPlugin(ScrollTrigger);

    function initStack() {
        var vpH = viewport.clientHeight;

        /* ── Initial state: card 2 & 3 below viewport ── */
        gsap.set(card2, { y: vpH + 20 });
        gsap.set(card3, { y: vpH + 20 });

        /* ── Timeline: each card slides up to y:0 ── */
        var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

        /* Card 2 slides up over card 1 */
        tl.to(card2, { y: 0, duration: 0.5 });
        /* Dwell on card 2 */
        tl.to({}, { duration: 0.35 });

        /* Card 3 slides up over card 2 */
        tl.to(card3, { y: 0, duration: 0.5 });
        /* Dwell on card 3 */
        tl.to({}, { duration: 0.35 });

        /* ── ScrollTrigger: pin the grid wrapper ── */
        ScrollTrigger.create({
            trigger:         section,
            start:           'top top',
            /* Pin long enough for 2 card transitions + dwells */
            end:             '+=' + Math.round(window.innerHeight * 2.2),
            pin:             pinWrap,
            scrub:           0.7,
            anticipatePin:   0,
            animation:       tl,
            invalidateOnRefresh: true,
        });
    }

    /* Run after layout is painted */
    if (document.readyState === 'complete') {
        initStack();
    } else {
        window.addEventListener('load', initStack);
    }

    window.addEventListener('resize', function () {
        ScrollTrigger.refresh(true);
    });

}());



/* ══════════════════════════════════════════
   13. VIDEO REVIEW MODAL — 3-video carousel
   · Center card plays, sides show prev/next
   · Click side card or arrow to navigate
   · 9:16 portrait format
   · Videos: review.mp4, review-2.mp4, review-3.mp4
══════════════════════════════════════════ */
(function () {

    var modal    = document.getElementById('review-video-modal');
    var backdrop = document.getElementById('rvm-backdrop');
    var closeBtn = document.getElementById('rvm-close');
    var playBtn  = document.getElementById('reviews-play-btn');

    var centerCard   = document.getElementById('rvm-center');
    var leftCard     = document.getElementById('rvm-left');
    var rightCard    = document.getElementById('rvm-right');
    var centerVideo  = document.getElementById('rvm-video');
    var leftVideo    = leftCard  && leftCard.querySelector('video');
    var rightVideo   = rightCard && rightCard.querySelector('video');

    var prevBtn  = document.getElementById('rvm-prev');
    var nextBtn  = document.getElementById('rvm-next');
    var counter  = document.getElementById('rvm-counter');
    var dots     = document.querySelectorAll('.rvm-dot');

    if (!modal || !playBtn || !centerVideo) return;

    /* ── Video sources ── */
    var videos = [
        'media/videos/video-1.mp4',
        'media/videos/video-2.mp4',
        'media/videos/video-3.mp4'
    ];
    var total   = videos.length;
    var current = 0;

    /* ── Update all 3 slots ── */
    function updateSlots() {
        var prevIdx = (current - 1 + total) % total;
        var nextIdx = (current + 1) % total;

        /* Center */
        centerVideo.src = videos[current];
        centerVideo.load();
        centerVideo.play().catch(function () {});

        /* Left (prev) */
        if (leftVideo)  { leftVideo.src  = videos[prevIdx]; leftVideo.load(); }

        /* Right (next) */
        if (rightVideo) { rightVideo.src = videos[nextIdx]; rightVideo.load(); }

        /* Counter */
        if (counter) counter.textContent = (current + 1) + ' / ' + total;

        /* Dots */
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    function navigate(dir) {
        centerVideo.pause();
        current = ((current + dir) % total + total) % total;
        updateSlots();
    }

    /* ── Open ── */
    function openModal() {
        current = 0;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSlots();
    }

    /* ── Close ── */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        centerVideo.pause();
        centerVideo.currentTime = 0;
    }

    /* ── Events ── */
    playBtn.addEventListener('click', openModal);
    closeBtn  && closeBtn.addEventListener('click', closeModal);
    backdrop  && backdrop.addEventListener('click', closeModal);
    prevBtn   && prevBtn.addEventListener('click', function () { navigate(-1); });
    nextBtn   && nextBtn.addEventListener('click', function () { navigate(1); });

    /* Click side cards */
    leftCard  && leftCard.addEventListener('click',  function () { navigate(-1); });
    rightCard && rightCard.addEventListener('click', function () { navigate(1); });

    /* Dots */
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'), 10);
            if (idx !== current) {
                centerVideo.pause();
                current = idx;
                updateSlots();
            }
        });
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    /* Touch swipe on modal */
    var tx = 0;
    modal.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].screenX; }, { passive: true });
    modal.addEventListener('touchend',   function (e) {
        var dx = e.changedTouches[0].screenX - tx;
        if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });

}());


/* ══════════════════════════════════════════
   SERVICES DROPDOWN — desktop hover + keyboard
   + mobile accordion
   + scroll to specific service row on click
══════════════════════════════════════════ */
(function () {

    /* ── Desktop: close dropdown on outside click ── */
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.has-dropdown.open').forEach(function (li) {
            if (!li.contains(e.target)) li.classList.remove('open');
        });
    });

    /* Toggle open class on click of Services link (for keyboard/touch) */
    var dropLink = document.querySelector('.nav-link--has-drop');
    if (dropLink) {
        dropLink.addEventListener('click', function (e) {
            var li = this.closest('.has-dropdown');
            /* On desktop, hover handles it — click just toggles for keyboard */
            if (window.innerWidth > 992) {
                var isOpen = li.classList.contains('open');
                li.classList.toggle('open', !isOpen);
                this.setAttribute('aria-expanded', !isOpen);
            }
        });
    }

    /* ── Scroll to service row when dropdown item clicked ── */
    document.querySelectorAll('.nd-item[data-target], .mobile-drop-list a[data-target]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = this.getAttribute('data-target');
            var row = document.querySelector('.service-row[data-num="' + target + '"]');
            if (!row) return;

            /* Close dropdown + mobile nav */
            var li = document.querySelector('.has-dropdown');
            if (li) li.classList.remove('open');
            var mobileNav = document.getElementById('mobile-nav');
            var hamburger  = document.getElementById('hamburger');
            if (mobileNav)  mobileNav.classList.remove('open');
            if (hamburger)  { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }

            /* Scroll with header offset */
            var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
            var top = row.getBoundingClientRect().top + window.pageYOffset - headerH - 24;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ── Mobile accordion toggle ── */
    var mobileToggle = document.querySelector('.mobile-drop-toggle');
    var mobileList   = document.querySelector('.mobile-drop-list');
    if (mobileToggle && mobileList) {
        mobileToggle.addEventListener('click', function () {
            var isOpen = this.classList.toggle('open');
            mobileList.classList.toggle('open', isOpen);
            this.setAttribute('aria-expanded', isOpen);
        });
    }

}());
