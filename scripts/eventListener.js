document.addEventListener('DOMContentLoaded', () => {
    initializeTypeOptions();
    initializeMouseEvents();
    initializeCardClickListeners();
    initializeCloseButtonListener();
    initializeScrollToTopButton();
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


function initializeScrollToTopButton() {
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scrollToTopButton';
    scrollToTopButton.innerText = '↑';
    scrollToTopButton.style.display = 'none'; // Versteckt den Button standardmäßig
    scrollToTopButton.onclick = scrollToTop;
    document.body.appendChild(scrollToTopButton);

    window.addEventListener('scroll', toggleScrollButtonVisibility);
}


function toggleScrollButtonVisibility() {
    const scrollToTopButton = document.getElementById('scrollToTopButton');
    if (window.pageYOffset > 180 && !document.querySelector('.active-overlay')) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
}


function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}


function showBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'block';
    document.body.style.overflowY = 'hidden'; // Verhindert das Scrollen
    document.body.style.paddingRight = '15px'; // Kompensiert den Bereich, den der Scrollbalken einnimmt
    toggleScrollButtonVisibility(); // Versteckt den "Scroll to Top"-Button
}

function hideBackgroundBlur() {
    document.getElementById('background-blur').style.display = 'none';
    document.body.style.overflowY = 'auto'; // Erlaubt das Scrollen wieder
    document.body.style.paddingRight = '0px'; // Entfernt die Kompensation
    toggleScrollButtonVisibility(); // Zeigt den "Scroll to Top"-Button basierend auf der Scroll-Position
}


function removeActiveOverlay() {
    const existingOverlay = document.querySelector('.active-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        hideBackgroundBlur(); // Stelle das normale Scroll-Verhalten wieder her, wenn das Overlay geschlossen wird
    }
}