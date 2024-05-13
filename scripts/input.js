async function handleSearchInput(searchTerm, content) {
    if (searchTerm.length >= 3) {
        await performSearch(searchTerm, content);
    } else if (searchTerm.length === 0) {
        await resetSearch(content);
    }
}


async function performSearch(searchTerm, content) {
    content.innerHTML = '';
    document.getElementById('loadMoreButton').style.display = 'none';
    await searchAndRenderPokemons(searchTerm, content);
    filterIsActive = true;
}


async function resetSearch(content) {
    content.innerHTML = '';
    await resetAndReloadInitialPokemons(content);
    document.getElementById('loadMoreButton').style.display = 'block';
    filterIsActive = false;
}


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
    }, 500);
}