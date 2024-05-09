function showBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'block';
    document.body.style.overflowY = 'hidden';
    document.body.style.paddingRight = '15px';
    toggleScrollButtonVisibility();
}


function hideBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'none';
    document.body.style.overflowY = 'auto';
    document.body.style.paddingRight = '0px';
    toggleScrollButtonVisibility();
}


function toggleScrollButtonVisibility() {
    const scrollToTopButton = document.getElementById('scrollToTopButton');
    if (window.pageYOffset > 180 && !document.querySelector('.active-overlay')) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
}


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // Warte kurz, um den Status des Buttons nach dem Scrollen zu überprüfen
    setTimeout(toggleScrollButtonVisibility, 150);
}