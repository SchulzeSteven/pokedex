document.addEventListener('DOMContentLoaded', () => {
    initializeTypeOptions();
    initializeMouseEvents();
    initializeCardClickListeners();
    initializeCloseButtonListener();
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


async function initializeSearch(searchTerm) {
    let content = document.getElementById('pokemon-list');
    content.innerHTML = ''; // Lösche vorhandenen Inhalt
    if (searchTerm.length === 0) {
        await loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
        filterIsActive = false; // Deaktiviere den Filtermodus
    } else {
        await searchAndRenderPokemons(searchTerm, content);
        filterIsActive = true; // Aktiviere den Filtermodus für die Navigation
    }
}


function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function showBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Verhindert das Scrollen des Hintergrunds
}


function hideBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'none';
    document.body.style.overflow = 'auto'; // Stellt das normale Scroll-Verhalten wieder her
}


function removeActiveOverlay() {
    const existingOverlay = document.querySelector('.active-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        hideBackgroundBlur(); // Stelle das normale Scroll-Verhalten wieder her, wenn das Overlay geschlossen wird
    }
}