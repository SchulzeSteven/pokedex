/**
 * Displays a blurred background overlay and disables page scroll.
 */
function showBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'block';
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = '10px';
    toggleScrollButtonVisibility();
}


/**
 * Hides the blurred background overlay and re-enables page scroll.
 */
function hideBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'none';
    document.body.style.overflowY = 'auto';
    document.body.style.paddingRight = '0px';
    toggleScrollButtonVisibility();
}


/**
 * Toggles the visibility of the "scroll to top" button.
 * The button is only shown if the user has scrolled down more than 180px
 * and no Pokémon detail overlay is currently open.
 */
function toggleScrollButtonVisibility() {
    const scrollToTopButton = document.getElementById('scrollToTopButton');
    if (window.pageYOffset > 180 && !document.querySelector('.active-overlay')) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
}


/**
 * Smoothly scrolls the page to the top and hides the scroll-to-top button shortly after.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setTimeout(toggleScrollButtonVisibility, 150);
}