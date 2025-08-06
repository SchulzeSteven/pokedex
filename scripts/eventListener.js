/**
 * Initializes all event listeners and preloads data after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTypeOptions();
    initializeMouseEvents();
    initializeCardClickListeners();
    initializeCloseButtonListener();
    initializeOutsideClickListener();
    initializeScrollToTopButton();
    preloadEvolutionImages();
});


/**
 * Populates the type filter options dynamically using the available type colors.
 */
function initializeTypeOptions() {
    const typeOptionsContainer = document.getElementById('type-options');
    const typeCheckboxHtml = Object.keys(typeColors).map(type =>
        `<label><input type="checkbox" name="type" value="${type}" onchange="filterByType()"> ${capitalize(type)}</label>`
    ).join('');
    typeOptionsContainer.innerHTML = typeCheckboxHtml;
}


/**
 * Adds mouseenter and mouseleave events to handle delayed hiding of the type options filter menu.
 */
function initializeMouseEvents() {
    const typeOptionsContainer = document.getElementById('type-options');
    let timeoutId;
    typeOptionsContainer.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => { typeOptionsContainer.style.display = 'none'; }, 200);
    });
    typeOptionsContainer.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
    });
}


/**
 * Assigns click event handlers to all Pokémon cards to open their detailed overlay.
 */
function initializeCardClickListeners() {
    document.querySelectorAll('.card').forEach(card => {
        card.onclick = () => toggleActiveClass(card);
    });
}


/**
 * Adds a global click listener to handle closing the Pokémon overlay when the close button is clicked.
 */
function initializeCloseButtonListener() {
    document.body.addEventListener('click', event => {
        if (event.target.classList.contains('close-button') || event.target.closest('.close-button')) {
            removeActiveOverlay(event);
        }
    });
}


/**
 * Adds a click listener to the document to allow closing the overlay by clicking the background blur.
 */
function initializeOutsideClickListener() {
    document.addEventListener('click', function (event) {
        const overlay = document.querySelector('.active-overlay');
        const blur = document.getElementById('background-blur');

        if (overlay && blur && event.target === blur) {
            removeActiveOverlay();
        }
    });
}


/**
 * Creates and initializes a scroll-to-top button and adds scroll event listener to toggle its visibility.
 */
function initializeScrollToTopButton() {
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scrollToTopButton';
    scrollToTopButton.innerText = '↑';
    scrollToTopButton.style.display = 'none'; // Hide button by default
    scrollToTopButton.onclick = scrollToTop;
    document.body.appendChild(scrollToTopButton);

    window.addEventListener('scroll', toggleScrollButtonVisibility);
}