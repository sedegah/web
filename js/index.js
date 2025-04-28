var hamburgerIcon = document.getElementById("hamburgerIcon");
var navItems = document.getElementById("navItems");
var hamburgerControl = false;

function showMenu(){
   if (!hamburgerControl){
      hamburgerIcon.firstElementChild.className = "fa-solid fa-times";
      navItems.style.width = "100%";
      hamburgerControl = true;
   }else{
      hamburgerIcon.firstElementChild.className = "fa-solid fa-bars";
      navItems.style.width = "0%";
      hamburgerControl = false;
   }
}

// Carousel functionality for mobile (Programs, Team, Testimonials)
function initializeCarousel(containerSelector, indicatorSelector) {
    const carouselContainer = document.querySelector(containerSelector);
    const indicators = document.querySelectorAll(indicatorSelector);

    if (carouselContainer && indicators.length > 0) {
        // Update active indicator based on scroll position
        carouselContainer.addEventListener('scroll', () => {
            const cardWidth = carouselContainer.querySelector(':scope > *').offsetWidth;
            const scrollPosition = carouselContainer.scrollLeft;
            const activeIndex = Math.round(scrollPosition / cardWidth);

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        });

        // Handle indicator clicks
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.getAttribute('data-index'));
                const cardWidth = carouselContainer.querySelector(':scope > *').offsetWidth;
                carouselContainer.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            });
        });

        // Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        carouselContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeDistance = touchStartX - touchEndX;
            const cardWidth = carouselContainer.querySelector(':scope > *').offsetWidth;
            const currentScroll = carouselContainer.scrollLeft;
            let targetIndex;

            if (swipeDistance > 50) { // Swipe left
                targetIndex = Math.ceil((currentScroll + cardWidth) / cardWidth);
            } else if (swipeDistance < -50) { // Swipe right
                targetIndex = Math.floor((currentScroll - cardWidth) / cardWidth);
            } else {
                return; // Ignore small swipes
            }

            // Clamp index between 0 and number of cards - 1
            targetIndex = Math.max(0, Math.min(targetIndex, indicators.length - 1));
            carouselContainer.scrollTo({
                left: targetIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize carousels for each section
initializeCarousel('.divTwo .carousel-container', '.divTwo .carousel-indicators .indicator');
initializeCarousel('.divTeam .carousel-container', '.divTeam .carousel-indicators .indicator');
initializeCarousel('.divFive .carousel-container', '.divFive .carousel-indicators .indicator');