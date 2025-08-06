/**
 * Initializes a search for Pokémon based on the input term.
 * If the search term is empty, it loads the default list of Pokémon.
 * @param {string} searchTerm - The text input to search for matching Pokémon names.
 */
async function initializeSearch(searchTerm) {
    let content = document.getElementById('pokemon-list');
    content.innerHTML = '';
    if (searchTerm.length === 0) {
        await loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
        filterIsActive = false;
    } else {
        await searchAndRenderPokemons(searchTerm, content);
        filterIsActive = true;
    }
}


/**
 * Searches all Pokémon by name and renders those that match the search term.
 * Populates the `filteredPokemonIds` array with matching Pokémon IDs.
 * @param {string} searchTerm - The term to search Pokémon names for (case-insensitive).
 * @param {HTMLElement} content - The DOM element where matching Pokémon should be rendered.
 */
async function searchAndRenderPokemons(searchTerm, content) {
    filteredPokemonIds = [];
    let count = 0;
    for (let i = 1; i <= 151; i++) {
        let pokemonData = await getPokemonData(i);
        if (pokemonData && pokemonData.name.toLowerCase().includes(searchTerm)) {
            content.innerHTML += PokemonRender(pokemonData);
            filteredPokemonIds.push(i);
            count++;
        }
    }
    filterIsActive = true;
}


/**
 * Filters the Pokémon list based on selected type checkboxes.
 * Hides the "Load More" button if filters are active.
 * Displays a loader while fetching and rendering results.
 */
async function filterByType() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const content = document.getElementById('pokemon-list');
    const footer = document.getElementById('footer');
    const loader = document.getElementById("dialog");

    footer.style.display = 'none';
    content.innerHTML = '';
    loader.classList.remove("d-none");

    if (checkedTypes.length === 0) {
        filterIsActive = false;
        await resetAndReloadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
    } else {
        filterIsActive = true;
        document.getElementById('loadMoreButton').style.display = 'none';
        await filterAndRenderPokemons(checkedTypes, content);
    }

    loader.classList.add("d-none");
    footer.style.display = 'block';
}


/**
 * Resets the Pokémon list to the default (first 30 Pokémon).
 * Clears the cache to ensure fresh data.
 * @param {HTMLElement} content - The DOM element where Pokémon should be rendered.
 */
async function resetAndReloadInitialPokemons(content) {
    pokemonCache = {};
    let loader = document.getElementById("dialog");

    loader.classList.remove("d-none");
    content.innerHTML = '';

    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        if (currentPokemon) {
            content.innerHTML += PokemonRender(currentPokemon);
        }
    }

    loader.classList.add("d-none");
    document.getElementById('loadMoreButton').style.display = 'block';
    filterIsActive = false;
}


/**
 * Filters and renders all Pokémon that match one or more of the selected types.
 * Populates the `filteredPokemonIds` array with matching Pokémon IDs.
 * @param {string[]} checkedTypes - Array of selected Pokémon type strings (e.g., ['fire', 'water']).
 * @param {HTMLElement} content - The DOM element where matching Pokémon should be rendered.
 */
async function filterAndRenderPokemons(checkedTypes, content) {
    filteredPokemonIds = [];
    for (let i = 1; i <= 151; i++) {
        let pokemon = await getPokemonData(i);
        if (pokemon.types.some(type => checkedTypes.includes(type.type.name))) {
            content.innerHTML += PokemonRender(pokemon);
            filteredPokemonIds.push(i);
        }
    }
}