// --- Hamburger Menu Logic ---
var hamburgerIcon = document.getElementById("hamburgerIcon");
var navItems = document.getElementById("navItems");
var hamburgerControl = false;

function showMenu(){
   if (!hamburgerControl){
      hamburgerIcon.firstElementChild.className = "fa-solid fa-times";
      navItems.classList.add('active');
      hamburgerControl = true;
   }else{
      hamburgerIcon.firstElementChild.className = "fa-solid fa-bars";
      navItems.classList.remove('active');
      hamburgerControl = false;
   }
}

// --- Slideshow Logic ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Shared State ---
    let isMobileView = window.innerWidth <= 768;
    const ANIMATION_CLEANUP_DELAY = 700; // Common delay

    // --- Outer Slideshow Variables & Logic ---
    const slideshowContainer = document.querySelector('.mobile-slideshow-container');
    const slides = slideshowContainer ? Array.from(slideshowContainer.querySelectorAll(':scope > div:not(.mobile-slideshow-nav)')) : [];
    const nextButton = document.querySelector('.next-slide');
    const prevButton = document.querySelector('.prev-slide');
    let currentSlideIndex = 0;
    let outerIntervalId = null;
    const OUTER_SLIDESHOW_INTERVAL = 6000;
    let isOuterPausedByUser = false;

    function showSlide(index) { /* ... (Function remains the same as previous version, triggers inner start/stop) ... */
        if (!slides || slides.length === 0) return;
        currentSlideIndex = (index + slides.length) % slides.length;

        if (isMobileView) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('slide-active', i === currentSlideIndex);
            });
             const activeOuterSlide = slides[currentSlideIndex];
             if (activeOuterSlide && activeOuterSlide.id === 'programs') {
                 setProgramContainerHeight();
                 if (!isOuterPausedByUser) startProgramSlideshow();
                 else showProgramSlide(currentProgramSlideIndex); // Show correct slide if outer paused
             } else {
                 stopProgramSlideshow();
             }
             // ** NEW: Stop Team/Testimonial slideshows if outer slide changes **
             // (They run independently when not inside outer slideshow)
             // stopTeamSlideshow(); // Stop these if needed, or let them run always on mobile?
             // stopTestimonialSlideshow(); // Let's let them run always on mobile for now.

        } else {
             stopOuterSlideshow();
             stopProgramSlideshow();
             stopTeamSlideshow(); // Stop on desktop
             stopTestimonialSlideshow(); // Stop on desktop
             // Reset container heights
             if (programSlideshowContainer) { programSlideshowContainer.style.height = ''; programSlideshowContainer.style.minHeight = ''; }
             if (teamSlideshowContainer) { teamSlideshowContainer.style.height = ''; teamSlideshowContainer.style.minHeight = ''; }
             if (testimonialSlideshowContainer) { testimonialSlideshowContainer.style.height = ''; testimonialSlideshowContainer.style.minHeight = ''; }
        }
    }
    function advanceSlide() { /* ... (Function remains the same) ... */
        if (!isMobileView || isOuterPausedByUser) {
            if (outerIntervalId !== null) stopOuterSlideshow();
            return;
        }
        showSlide(currentSlideIndex + 1);
    }
    function startOuterSlideshow() { /* ... (Function remains the same) ... */
        stopOuterSlideshow();
        if (isMobileView && slides.length > 1) {
            isOuterPausedByUser = false;
            showSlide(currentSlideIndex); // Show current first
            outerIntervalId = setInterval(advanceSlide, OUTER_SLIDESHOW_INTERVAL);
        }
    }
    function stopOuterSlideshow() { /* ... (Function remains the same) ... */
        if (outerIntervalId !== null) { clearInterval(outerIntervalId); outerIntervalId = null; }
    }


    // --- Inner (Program) Slideshow Variables & Logic ---
    const programSlideshowContainer = document.querySelector('.program-slideshow-container');
    const programSlides = programSlideshowContainer ? Array.from(programSlideshowContainer.querySelectorAll(':scope > .courseSec')) : [];
    let currentProgramSlideIndex = 0;
    let programIntervalId = null;
    const PROGRAM_SLIDESHOW_INTERVAL = 4000;
    let maxProgramSlideHeight = 0;
    let isAnimatingProgram = false; // Unique animation flag
    let isPausedByTapProgram = false; // Unique pause flag

    function setProgramContainerHeight() { /* ... (Function remains the same) ... */
        if (!isMobileView || !programSlideshowContainer || programSlides.length === 0) { if (programSlideshowContainer) { programSlideshowContainer.style.height = ''; programSlideshowContainer.style.minHeight = ''; } return; };
        maxProgramSlideHeight = 0;
        programSlides.forEach(slide => { slide.style.display = 'flex'; slide.style.position = 'static'; slide.style.visibility = 'hidden'; slide.style.transform = 'none'; slide.style.opacity = '1'; maxProgramSlideHeight = Math.max(maxProgramSlideHeight, slide.offsetHeight); slide.style.position = 'absolute'; slide.style.visibility = ''; slide.style.transform = ''; slide.style.opacity = ''; slide.style.display = ''; });
        const heightBuffer = 10; const targetHeight = maxProgramSlideHeight + heightBuffer; if (programSlideshowContainer && targetHeight > 0) { programSlideshowContainer.style.height = targetHeight + 'px'; }
    }
    function showProgramSlide(newIndex) { /* ... (Use unique animation flag) ... */
        if (!programSlides || programSlides.length < 2 || !isMobileView) return;
        if (isAnimatingProgram) return;
        isAnimatingProgram = true;
        const outgoingIndex = currentProgramSlideIndex; currentProgramSlideIndex = (newIndex + programSlides.length) % programSlides.length; const outgoingSlide = programSlides[outgoingIndex]; const incomingSlide = programSlides[currentProgramSlideIndex]; incomingSlide.classList.add('program-slide-active'); if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.add('program-slide-exiting'); }
        setTimeout(() => { if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.remove('program-slide-active'); outgoingSlide.classList.remove('program-slide-exiting'); } isAnimatingProgram = false; }, ANIMATION_CLEANUP_DELAY);
    }
    function advanceProgramSlide() { /* ... (Use unique pause flag) ... */
        if (isMobileView && !isPausedByTapProgram) { showProgramSlide(currentProgramSlideIndex + 1); } else if (!isMobileView) { stopProgramSlideshow(); }
    }
    function startProgramSlideshow() { /* ... (Use unique pause flag) ... */
        stopProgramSlideshow(); const activeOuterSlide = slides[currentSlideIndex]; if (isMobileView && programSlides.length > 1 && activeOuterSlide && activeOuterSlide.id === 'programs' && !isOuterPausedByUser) { programSlides.forEach((slide, i) => { slide.classList.toggle('program-slide-active', i === currentProgramSlideIndex); slide.classList.remove('program-slide-exiting'); }); programIntervalId = setInterval(advanceProgramSlide, PROGRAM_SLIDESHOW_INTERVAL); isPausedByTapProgram = false; }
    }
    function stopProgramSlideshow() { /* ... (Function remains the same) ... */
        if (programIntervalId !== null) { clearInterval(programIntervalId); programIntervalId = null; }
    }


    // --- Team Slideshow Variables & Logic (NEW) ---
    const teamSlideshowContainer = document.querySelector('.team-slideshow-container');
    const teamSlides = teamSlideshowContainer ? Array.from(teamSlideshowContainer.querySelectorAll(':scope > .teamMember')) : [];
    let currentTeamSlideIndex = 0;
    let teamIntervalId = null;
    const TEAM_SLIDESHOW_INTERVAL = 5000; // Adjust interval
    let maxTeamSlideHeight = 0;
    let isAnimatingTeam = false;
    let isPausedByTapTeam = false;

    function setTeamContainerHeight() { // Adapted height function
        if (!isMobileView || !teamSlideshowContainer || teamSlides.length === 0) { if (teamSlideshowContainer) { teamSlideshowContainer.style.height = ''; teamSlideshowContainer.style.minHeight = ''; } return; };
        maxTeamSlideHeight = 0;
        teamSlides.forEach(slide => { slide.style.display = 'flex'; slide.style.position = 'static'; slide.style.visibility = 'hidden'; slide.style.transform = 'none'; slide.style.opacity = '1'; maxTeamSlideHeight = Math.max(maxTeamSlideHeight, slide.offsetHeight); slide.style.position = 'absolute'; slide.style.visibility = ''; slide.style.transform = ''; slide.style.opacity = ''; slide.style.display = ''; });
        const heightBuffer = 10; const targetHeight = maxTeamSlideHeight + heightBuffer; if (teamSlideshowContainer && targetHeight > 0) { teamSlideshowContainer.style.height = targetHeight + 'px'; }
    }
    function showTeamSlide(newIndex) { // Adapted show function
        if (!teamSlides || teamSlides.length < 2 || !isMobileView) return;
        if (isAnimatingTeam) return; isAnimatingTeam = true; const outgoingIndex = currentTeamSlideIndex; currentTeamSlideIndex = (newIndex + teamSlides.length) % teamSlides.length; const outgoingSlide = teamSlides[outgoingIndex]; const incomingSlide = teamSlides[currentTeamSlideIndex]; incomingSlide.classList.add('team-slide-active'); if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.add('team-slide-exiting'); }
        setTimeout(() => { if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.remove('team-slide-active'); outgoingSlide.classList.remove('team-slide-exiting'); } isAnimatingTeam = false; }, ANIMATION_CLEANUP_DELAY);
    }
    function advanceTeamSlide() { // Adapted advance function
        if (isMobileView && !isPausedByTapTeam) { showTeamSlide(currentTeamSlideIndex + 1); } else if (!isMobileView) { stopTeamSlideshow(); }
    }
    function startTeamSlideshow() { // Adapted start function
        stopTeamSlideshow(); if (isMobileView && teamSlides.length > 1) { teamSlides.forEach((slide, i) => { slide.classList.toggle('team-slide-active', i === currentTeamSlideIndex); slide.classList.remove('team-slide-exiting'); }); setTeamContainerHeight(); teamIntervalId = setInterval(advanceTeamSlide, TEAM_SLIDESHOW_INTERVAL); isPausedByTapTeam = false; }
    }
    function stopTeamSlideshow() { // Adapted stop function
        if (teamIntervalId !== null) { clearInterval(teamIntervalId); teamIntervalId = null; }
    }


    // --- Testimonial Slideshow Variables & Logic (NEW) ---
    const testimonialSlideshowContainer = document.querySelector('.testimonial-slideshow-container');
    const testimonialSlides = testimonialSlideshowContainer ? Array.from(testimonialSlideshowContainer.querySelectorAll(':scope > .subSec')) : [];
    let currentTestimonialSlideIndex = 0;
    let testimonialIntervalId = null;
    const TESTIMONIAL_SLIDESHOW_INTERVAL = 5500; // Adjust interval
    let maxTestimonialSlideHeight = 0;
    let isAnimatingTestimonial = false;
    let isPausedByTapTestimonial = false;

    function setTestimonialContainerHeight() { // Adapted height function
        if (!isMobileView || !testimonialSlideshowContainer || testimonialSlides.length === 0) { if (testimonialSlideshowContainer) { testimonialSlideshowContainer.style.height = ''; testimonialSlideshowContainer.style.minHeight = ''; } return; };
        maxTestimonialSlideHeight = 0;
        testimonialSlides.forEach(slide => { slide.style.display = 'flex'; slide.style.position = 'static'; slide.style.visibility = 'hidden'; slide.style.transform = 'none'; slide.style.opacity = '1'; maxTestimonialSlideHeight = Math.max(maxTestimonialSlideHeight, slide.offsetHeight); slide.style.position = 'absolute'; slide.style.visibility = ''; slide.style.transform = ''; slide.style.opacity = ''; slide.style.display = ''; });
        const heightBuffer = 10; const targetHeight = maxTestimonialSlideHeight + heightBuffer; if (testimonialSlideshowContainer && targetHeight > 0) { testimonialSlideshowContainer.style.height = targetHeight + 'px'; }
    }
    function showTestimonialSlide(newIndex) { // Adapted show function
        if (!testimonialSlides || testimonialSlides.length < 2 || !isMobileView) return;
        if (isAnimatingTestimonial) return; isAnimatingTestimonial = true; const outgoingIndex = currentTestimonialSlideIndex; currentTestimonialSlideIndex = (newIndex + testimonialSlides.length) % testimonialSlides.length; const outgoingSlide = testimonialSlides[outgoingIndex]; const incomingSlide = testimonialSlides[currentTestimonialSlideIndex]; incomingSlide.classList.add('testimonial-slide-active'); if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.add('testimonial-slide-exiting'); }
        setTimeout(() => { if (outgoingSlide && outgoingSlide !== incomingSlide) { outgoingSlide.classList.remove('testimonial-slide-active'); outgoingSlide.classList.remove('testimonial-slide-exiting'); } isAnimatingTestimonial = false; }, ANIMATION_CLEANUP_DELAY);
    }
    function advanceTestimonialSlide() { // Adapted advance function
        if (isMobileView && !isPausedByTapTestimonial) { showTestimonialSlide(currentTestimonialSlideIndex + 1); } else if (!isMobileView) { stopTestimonialSlideshow(); }
    }
    function startTestimonialSlideshow() { // Adapted start function
        stopTestimonialSlideshow(); if (isMobileView && testimonialSlides.length > 1) { testimonialSlides.forEach((slide, i) => { slide.classList.toggle('testimonial-slide-active', i === currentTestimonialSlideIndex); slide.classList.remove('testimonial-slide-exiting'); }); setTestimonialContainerHeight(); testimonialIntervalId = setInterval(advanceTestimonialSlide, TESTIMONIAL_SLIDESHOW_INTERVAL); isPausedByTapTestimonial = false; }
    }
    function stopTestimonialSlideshow() { // Adapted stop function
        if (testimonialIntervalId !== null) { clearInterval(testimonialIntervalId); testimonialIntervalId = null; }
    }


    // --- Visibility Update Function (Handles ALL Slideshows + Heights) ---
    function updateSlideshowsVisibility() {
        const wasMobile = isMobileView;
        isMobileView = window.innerWidth <= 768;

        // Calculate heights first
        setProgramContainerHeight();
        setTeamContainerHeight();
        setTestimonialContainerHeight();

        if (wasMobile !== isMobileView || typeof wasMobile === 'undefined') {
            if (isMobileView) {
                isPausedByTap = false; isPausedByTapTeam = false; isPausedByTapTestimonial = false; // Reset all pause flags
                isOuterPausedByUser = false;
                showSlide(currentSlideIndex); // Set initial outer slide (handles inner program start/stop)
                startOuterSlideshow(); // Start outer timer
                startTeamSlideshow(); // Start team timer
                startTestimonialSlideshow(); // Start testimonial timer
            } else {
                // Desktop view actions
                slides.forEach(slide => slide.classList.remove('slide-active'));
                stopOuterSlideshow(); stopProgramSlideshow(); stopTeamSlideshow(); stopTestimonialSlideshow();
                // Clean up classes
                programSlides.forEach(slide => { slide.classList.remove('program-slide-active','program-slide-exiting'); });
                teamSlides.forEach(slide => { slide.classList.remove('team-slide-active','team-slide-exiting'); });
                testimonialSlides.forEach(slide => { slide.classList.remove('testimonial-slide-active','testimonial-slide-exiting'); });
                // Reset heights
                if (programSlideshowContainer) { programSlideshowContainer.style.height = ''; programSlideshowContainer.style.minHeight = ''; }
                if (teamSlideshowContainer) { teamSlideshowContainer.style.height = ''; teamSlideshowContainer.style.minHeight = ''; }
                if (testimonialSlideshowContainer) { testimonialSlideshowContainer.style.height = ''; testimonialSlideshowContainer.style.minHeight = ''; }
            }
        } else if (isMobileView) { // If staying mobile, ensure correct state
             // Outer Slideshow
             if (slides.length > 0 && !slideshowContainer?.querySelector('.slide-active')) showSlide(currentSlideIndex);
             if (slides.length > 1 && outerIntervalId === null && !isOuterPausedByUser && !slideshowContainer?.matches(':hover')) startOuterSlideshow();

             // Program Slideshow (only if relevant outer slide active)
             const activeOuterSlide = slides[currentSlideIndex];
             if (activeOuterSlide && activeOuterSlide.id === 'programs') {
                 if (programSlides.length > 1 && programIntervalId === null && !isPausedByTapProgram && !programSlideshowContainer?.matches(':hover')) startProgramSlideshow();
                 else showProgramSlide(currentProgramSlideIndex); // Ensure correct slide showing if paused
             } else stopProgramSlideshow();

             // Team Slideshow
             if (teamSlides.length > 1 && teamIntervalId === null && !isPausedByTapTeam && !teamSlideshowContainer?.matches(':hover')) startTeamSlideshow();
             else showTeamSlide(currentTeamSlideIndex); // Ensure correct slide showing if paused

             // Testimonial Slideshow
             if (testimonialSlides.length > 1 && testimonialIntervalId === null && !isPausedByTapTestimonial && !testimonialSlideshowContainer?.matches(':hover')) startTestimonialSlideshow();
             else showTestimonialSlide(currentTestimonialSlideIndex); // Ensure correct slide showing if paused
        }
    }

    // --- Event Listeners ---
    // Outer Slideshow Buttons & Interaction
    if (slideshowContainer) {
        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => { if (isMobileView) { isOuterPausedByUser = false; showSlide(currentSlideIndex + 1); startOuterSlideshow(); } });
            prevButton.addEventListener('click', () => { if (isMobileView) { isOuterPausedByUser = false; showSlide(currentSlideIndex - 1); startOuterSlideshow(); } });
        }
        slideshowContainer.addEventListener('mouseenter', (event) => { if (event.target.closest('.mobile-slideshow-nav') || event.target.closest('.program-slideshow-container')) return; if (isMobileView && outerIntervalId !== null) stopOuterSlideshow(); });
        slideshowContainer.addEventListener('mouseleave', () => { if (isMobileView && outerIntervalId === null && !isOuterPausedByUser) startOuterSlideshow(); });
        slideshowContainer.addEventListener('touchstart', (event) => { if (event.target.closest('.mobile-slideshow-nav') || event.target.closest('.program-slideshow-container')) return; if (isMobileView) { if (outerIntervalId !== null) { stopOuterSlideshow(); isOuterPausedByUser = true; } else { startOuterSlideshow(); } } }, { passive: true });
    }

    // Inner Program Slideshow Interaction (No Buttons)
    if (programSlideshowContainer) {
        programSlideshowContainer.addEventListener('mouseenter', () => { if (isMobileView && programIntervalId !== null) { stopProgramSlideshow(); } });
        programSlideshowContainer.addEventListener('mouseleave', () => { if (isMobileView && programIntervalId === null && !isPausedByTapProgram) { startProgramSlideshow(); } });
        programSlideshowContainer.addEventListener('touchstart', (event) => { if (isMobileView) { if (programIntervalId !== null) { stopProgramSlideshow(); isPausedByTapProgram = true; } else { startProgramSlideshow(); } } }, { passive: true });
    }

    // **NEW** Team Slideshow Interaction
     if (teamSlideshowContainer) {
        teamSlideshowContainer.addEventListener('mouseenter', () => { if (isMobileView && teamIntervalId !== null) stopTeamSlideshow(); });
        teamSlideshowContainer.addEventListener('mouseleave', () => { if (isMobileView && teamIntervalId === null && !isPausedByTapTeam) startTeamSlideshow(); });
        teamSlideshowContainer.addEventListener('touchstart', () => { if (isMobileView) { if (teamIntervalId !== null) { stopTeamSlideshow(); isPausedByTapTeam = true; } else { startTeamSlideshow(); } } }, { passive: true });
    }

    // **NEW** Testimonial Slideshow Interaction
    if (testimonialSlideshowContainer) {
        testimonialSlideshowContainer.addEventListener('mouseenter', () => { if (isMobileView && testimonialIntervalId !== null) stopTestimonialSlideshow(); });
        testimonialSlideshowContainer.addEventListener('mouseleave', () => { if (isMobileView && testimonialIntervalId === null && !isPausedByTapTestimonial) startTestimonialSlideshow(); });
        testimonialSlideshowContainer.addEventListener('touchstart', () => { if (isMobileView) { if (testimonialIntervalId !== null) { stopTestimonialSlideshow(); isPausedByTapTestimonial = true; } else { startTestimonialSlideshow(); } } }, { passive: true });
    }

    // Window Resize Listener
    window.addEventListener('resize', updateSlideshowsVisibility);

    // --- Initial Setup ---
    setProgramContainerHeight();
    setTeamContainerHeight();
    setTestimonialContainerHeight();
    updateSlideshowsVisibility(); // Set initial states and start timers if mobile

}); // End of DOMContentLoaded