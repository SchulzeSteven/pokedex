document.addEventListener('DOMContentLoaded', () => {
    initializeTypeOptions();
    initializeMouseEvents();
    initializeCardClickListeners();
    initializeCloseButtonListener();
    initializeOutsideClickListener();
    initializeScrollToTopButton();
    preloadEvolutionImages();
});


function initializeTypeOptions() {
    const typeOptionsContainer = document.getElementById('type-options');
    const typeCheckboxHtml = Object.keys(typeColors).map(type =>
        `<label><input type="checkbox" name="type" value="${type}" onchange="filterByType()"> ${capitalize(type)}</label>`
    ).join('');
    typeOptionsContainer.innerHTML = typeCheckboxHtml;
}


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


function initializeCardClickListeners() {
    document.querySelectorAll('.card').forEach(card => {
        card.onclick = () => toggleActiveClass(card);
    });
}


function initializeCloseButtonListener() {
    document.body.addEventListener('click', event => {
        if (event.target.classList.contains('close-button') || event.target.closest('.close-button')) {
            removeActiveOverlay(event);
        }
    });
}


function initializeOutsideClickListener() {
    document.addEventListener('click', function (event) {
        const overlay = document.querySelector('.active-overlay');
        const blur = document.getElementById('background-blur');

        if (overlay && blur && event.target === blur) {
            removeActiveOverlay();
        }
    });
}


function initializeScrollToTopButton() {
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scrollToTopButton';
    scrollToTopButton.innerText = '↑';
    scrollToTopButton.style.display = 'none'; // Versteckt den Button standardmäßig
    scrollToTopButton.onclick = scrollToTop;
    document.body.appendChild(scrollToTopButton);

    window.addEventListener('scroll', toggleScrollButtonVisibility);
}