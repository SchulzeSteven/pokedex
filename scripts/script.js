let pokemonAmount = 30;
let id = 1;
let lastSearchTerm = null;
let filterIsActive = false;
let pokemonCache = {};
let searchTimeout;


async function init() {
    let content = document.getElementById('pokemon-list');
    let maxId = Math.min(id + 29, 151);
    for (; id <= maxId; id++) {
        await renderPokemon(id, content);
    }
    if (id > 151) {
        document.getElementById('loadMoreButton').style.display = 'none';
    } else {
        document.getElementById('loadMoreButton').style.display = 'block';
    }
}


function loadMore() {
    init();
}


async function searchAndSuggestPokemon() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    if (searchTerm === lastSearchTerm) return;
    lastSearchTerm = searchTerm;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        if (searchTerm.length >= 3) {
            document.getElementById('loadMoreButton').style.display = 'none';
            document.getElementById('pokemon-list').innerHTML = '';
            await searchAndRenderPokemons(searchTerm, document.getElementById('pokemon-list'));
        } else if (searchTerm.length === 0) {
            await loadInitialPokemons(document.getElementById('pokemon-list'));
            document.getElementById('loadMoreButton').style.display = 'block';
            filterIsActive = false;
        }
    }, 500);
}


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


function toggleFilterMenu() {
    const filterMenu = document.getElementById('type-options');
    if (filterMenu.style.display === 'block') {filterMenu.style.display = 'none';
    } else {
        filterMenu.style.display = 'block';
    }
}


function removeActiveOverlay() {
    const existingOverlay = document.querySelector('.active-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
        hideBackgroundBlur();
    }
}


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
        moveItem.textContent = moveEntry.move.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        movesList.appendChild(moveItem);
    });
    movesContainer.appendChild(movesList);
}