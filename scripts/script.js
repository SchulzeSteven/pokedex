/**
 * Number of Pokémon to initially load and per batch when loading more.
 * @type {number}
 */
let pokemonAmount = 30;

/**
 * Current ID used to determine which Pokémon to load next.
 * @type {number}
 */
let id = 1;

/**
 * Stores the last search term to avoid unnecessary repeat searches.
 * @type {string|null}
 */
let lastSearchTerm = null;

/**
 * Indicates whether a filter or search is currently active.
 * @type {boolean}
 */
let filterIsActive = false;

/**
 * A cache object storing already fetched Pokémon data by ID.
 * @type {Object<number, Object>}
 */
let pokemonCache = {};

/**
 * Timeout ID for delaying search input processing.
 * @type {number|undefined}
 */
let searchTimeout;


/**
 * Initializes the Pokédex by loading the first batch of Pokémon.
 * Displays a loading spinner during the process and sets the UI state.
 * Called once when the page is first loaded.
 */
async function init() {
    let content = document.getElementById('pokemon-list');
    let maxId = Math.min(id + 29, 151);
    let loader = document.getElementById("dialog");

    loader.classList.remove("d-none");

    await getPokemonData(pokemonAmount, id);
    for (; id <= maxId; id++) {
        await renderPokemon(id, content);
    }

    loader.classList.add("d-none");

    document.getElementById('loadMoreButton').style.display = (id > 151) ? 'none' : 'block';
    document.getElementById('footer').style.display = 'block';
}


/**
 * Loads the next batch of 30 Pokémon (or up to the last ID).
 * Prevents loading duplicates by checking the cache.
 */
async function loadMore() {
    let content = document.getElementById('pokemon-list');
    let maxId = Math.min(id + 29, 151);
    let loader = document.getElementById("dialog");

    loader.classList.remove("d-none");

    for (; id <= maxId; id++) {
        if (!pokemonCache[id]) {
            await renderPokemon(id, content);
        }
    }

    loader.classList.add("d-none");
    document.getElementById('loadMoreButton').style.display = (id > 151) ? 'none' : 'block';
    document.getElementById('footer').style.display = 'block';
}


/**
 * Opens the detail overlay for a clicked Pokémon card.
 * @param {HTMLElement} clickedElement - The card element that was clicked.
 */
function toggleActiveClass(clickedElement) {
    const pokemonId = parseInt(clickedElement.id.replace('pokemon-card-', ''), 10);
    const pokemonData = pokemonCache[pokemonId];

    if (!pokemonData) {
        console.error('No data available for Pokemon ID:', pokemonId);
        return;
    }

    removeActiveOverlay();
    const overlay = createPokemonDetailOverlay(pokemonData);
    document.body.appendChild(overlay);
    showBackgroundBlur();

    activeTab = 'about';
    setActiveTab(activeTab, pokemonId);
    showAbout(pokemonId);
}


/**
 * Toggles the visibility of the type filter menu.
 */
function toggleFilterMenu() {
    const filterMenu = document.getElementById('type-options');
    filterMenu.style.display = (filterMenu.style.display === 'block') ? 'none' : 'block';
}


/**
 * Removes the currently active Pokémon detail overlay from the DOM
 * and hides the background blur.
 */
function removeActiveOverlay() {
    const existingOverlay = document.querySelector('.active-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        hideBackgroundBlur();
    }
}


/**
 * Renders a list of Pokémon moves inside the "Moves" tab of the overlay.
 * @param {Object} pokemon - The Pokémon object containing the move data.
 * @param {number} id - The Pokémon's ID used to target the tab container.
 */
function renderMoves(pokemon, id) {
    const movesContainer = document.getElementById(`movesTab${id}`);
    if (!movesContainer) {
        console.error('Moves tab container not found');
        return;
    }

    movesContainer.innerHTML = '';

    const movesList = document.createElement('div');
    movesList.id = 'movesContainer';

    pokemon.moves.forEach(moveEntry => {
        const moveItem = document.createElement('div');
        moveItem.classList.add('moveItem');
        moveItem.textContent = moveEntry.move.name
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        movesList.appendChild(moveItem);
    });

    movesContainer.appendChild(movesList);
}