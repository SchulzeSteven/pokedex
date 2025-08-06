/**
 * Handles the user input for the search field.
 * Triggers a search if the input has 3 or more characters,
 * or resets the list if the input is empty.
 * @param {string} searchTerm - The search string entered by the user.
 * @param {HTMLElement} content - The DOM element to render search results into.
 * @returns {Promise<void>}
 */
async function handleSearchInput(searchTerm, content) {
    if (searchTerm.length >= 3) {
        await performSearch(searchTerm, content);
    } else if (searchTerm.length === 0) {
        await resetSearch(content);
    }
}


/**
 * Executes a search for Pokémon by name and renders matching results.
 * Disables the "Load More" button during filtered search.
 * @param {string} searchTerm - The lowercase name or partial name to search for.
 * @param {HTMLElement} content - The container to render the filtered Pokémon list into.
 * @returns {Promise<void>}
 */
async function performSearch(searchTerm, content) {
    content.innerHTML = '';
    document.getElementById('loadMoreButton').style.display = 'none';
    await searchAndRenderPokemons(searchTerm, content);
    filterIsActive = true;
}


/**
 * Resets the Pokémon list to the initial (first 30) unfiltered state.
 * Enables the "Load More" button again.
 * @param {HTMLElement} content - The container element where Pokémon will be rendered.
 * @returns {Promise<void>}
 */
async function resetSearch(content) {
    content.innerHTML = '';
    await resetAndReloadInitialPokemons(content);
    document.getElementById('loadMoreButton').style.display = 'block';
    filterIsActive = false;
}


/**
 * Listens for user input in the search field and triggers a debounced search.
 * Compares with `lastSearchTerm` to avoid redundant calls.
 * Shows and hides the loading dialog while searching.
 * @returns {void}
 */
async function searchAndSuggestPokemon() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const content = document.getElementById('pokemon-list');
    const loader = document.getElementById("dialog");

    if (searchTerm === lastSearchTerm) return;
    lastSearchTerm = searchTerm;
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        loader.classList.remove("d-none");
        await handleSearchInput(searchTerm, content);
        loader.classList.add("d-none");
    }, 500); // Debounce delay (ms)
}