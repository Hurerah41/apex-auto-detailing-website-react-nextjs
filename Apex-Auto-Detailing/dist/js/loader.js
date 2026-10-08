/* Apex — Humorous Progress Loader
   · Minimum 4 seconds always
   · Steps progress smoothly over the time
   · Waits for window.load + 4s minimum, whichever is LATER
*/
(function () {
    'use strict';

    var loaderEl = document.getElementById('wx-loader');
    var titleEl  = document.getElementById('wl-title');
    var subEl    = document.getElementById('wl-sub');
    var barFill  = document.getElementById('wl-bar-fill');
    var pctEl    = document.getElementById('wl-pct');
    var stepsEl  = document.getElementById('wl-steps');

    if (!loaderEl) return;

    var MIN_MS   = 4000;   /* 4 seconds minimum — always */
    var startTime = Date.now();
    var pageLoaded = false;
    var timerDone  = false;
    var done       = false;

    /* ── 6 humorous steps ── */
    var STEPS = [{"title": "A fresh start for your car", "sub": "Welcome to Apex Auto Detailing", "label": "Opening the studio"}, {"title": "Good care starts here", "sub": "We are getting everything ready", "label": "Preparing your visit"}, {"title": "Meet your next clean", "sub": "Details make the difference", "label": "Loading vehicle care"}, {"title": "More shine, less fuss", "sub": "Your vehicle deserves attention", "label": "Preparing the wash bay"}, {"title": "A finish to look forward to", "sub": "From cabin to paintwork", "label": "Checking the details"}, {"title": "Ready when you are", "sub": "Explore Apex Auto Detailing", "label": "Ready to explore"}];

    /* Build step DOM */
    STEPS.forEach(function (s) {
        var li  = document.createElement('li');
        li.className = 'wl-step pending';
        var dot = document.createElement('span'); dot.className = 'wl-step-dot';
        var txt = document.createElement('span'); txt.className = 'wl-step-text'; txt.textContent = s.label;
        li.appendChild(dot); li.appendChild(txt);
        stepsEl.appendChild(li);
    });

    var stepEls = Array.from(stepsEl.querySelectorAll('.wl-step'));
    var curStep = -1;

    /* Step thresholds (% of progress bar) */
    var THRESHOLDS = [0, 17, 34, 52, 68, 85];

    function setStep(idx) {
        if (idx === curStep || idx < 0 || idx >= STEPS.length) return;
        curStep = idx;
        stepEls.forEach(function (el, i) {
            el.classList.remove('pending','active','done');
            if      (i < idx)  el.classList.add('done');
            else if (i === idx) el.classList.add('active');
            else                el.classList.add('pending');
        });
        /* Fade title */
        if (titleEl) {
            titleEl.style.opacity = '0';
            subEl.style.opacity   = '0';
            setTimeout(function () {
                titleEl.textContent = STEPS[idx].title;
                subEl.textContent   = STEPS[idx].sub;
                titleEl.style.opacity = '1';
                subEl.style.opacity   = '1';
            }, 200);
        }
    }

    /* Set progress bar + activate correct step */
    function setProgress(pct) {
        pct = Math.min(100, Math.max(0, Math.round(pct)));
        if (barFill) barFill.style.width = pct + '%';
        if (pctEl)   pctEl.textContent   = pct + '%';
        for (var s = THRESHOLDS.length - 1; s >= 0; s--) {
            if (pct >= THRESHOLDS[s]) { setStep(s); break; }
        }
    }

    /* ── SMOOTH TIME-BASED PROGRESS over MIN_MS ── */
    var rafId;
    function tick() {
        if (done) return;
        var elapsed = Date.now() - startTime;
        /* Fill to max 92% over MIN_MS — holds there until window.load fires */
        var timePct = Math.min(92, (elapsed / MIN_MS) * 92);
        setProgress(timePct);
        if (elapsed < MIN_MS || !pageLoaded) {
            rafId = requestAnimationFrame(tick);
        }
    }
    tick();

    /* ── Fade out ── */
    function tryFadeOut() {
        if (done) return;
        var elapsed = Date.now() - startTime;
        /* Both conditions must be true */
        if (!pageLoaded || elapsed < MIN_MS) {
            /* Check again when the slower one completes */
            var wait = Math.max(0, MIN_MS - elapsed);
            setTimeout(tryFadeOut, pageLoaded ? wait : 100);
            return;
        }
        done = true;
        cancelAnimationFrame(rafId);
        setProgress(100);
        /* Mark all done */
        stepEls.forEach(function (el) { el.classList.remove('pending','active'); el.classList.add('done'); });

        setTimeout(function () {
            loaderEl.classList.add('fading');
            document.body.classList.remove('wx-loading');
            setTimeout(function () { loaderEl.style.display = 'none'; }, 900);
        }, 500);
    }

    /* ── window.load fires when ALL resources ready ── */
    function onPageLoad() {
        pageLoaded = true;
        tryFadeOut();
    }

    if (document.readyState === 'complete') {
        onPageLoad();
    } else {
        window.addEventListener('load', onPageLoad);
    }

    /* Hard failsafe at 14s */
    setTimeout(function () { pageLoaded = true; tryFadeOut(); }, 14000);

    /* Init */
    setStep(0);

}());

/* Preload all service preview images during loader window
   so they're in browser cache before user can hover */
(function () {
    var rows = document.querySelectorAll('.service-row[data-preview]');
    rows.forEach(function (row) {
        var src = row.getAttribute('data-preview');
        if (src) { var img = new Image(); img.src = src; }
    });
}());
