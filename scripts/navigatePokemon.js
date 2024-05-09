async function navigateForward() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;
    let currentIndex, newId;

    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex < filteredPokemonIds.length - 1 ? filteredPokemonIds[currentIndex + 1] : filteredPokemonIds[0];
    } else {
        newId = currentId < 151 ? currentId + 1 : 1; 
        if (!pokemonCache[newId]) { 
            await getPokemonData(newId); 
        }
    }
    updatePokemonCard(newId);
}


async function navigateBack() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;
    let currentIndex, newId;
    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex > 0 ? filteredPokemonIds[currentIndex - 1] : filteredPokemonIds[filteredPokemonIds.length - 1];
    } else {
        newId = currentId > 1 ? currentId - 1 : 151;
        if (!pokemonCache[newId]) {
            await getPokemonData(newId);
        }
    }
    updatePokemonCard(newId);
}


function getCurrentPokemonId() {
    const activeOverlay = document.querySelector('.active-overlay');
    if (!activeOverlay) {
        console.error("No active overlay found");
        return null;
    }
    const idMatch = activeOverlay.id.match(/pokemon-card-(\d+)/);
    if (idMatch && idMatch[1]) {
        return parseInt(idMatch[1], 10);
    } else {
        console.error("Failed to extract Pokemon ID from active overlay");
        return null;
    }
}


async function updatePokemonCard(pokemonId, resetTab = false) {
    const pokemonData = await getPokemonData(pokemonId);
    if (!pokemonData) {
        console.error('Failed to load Pokemon data for ID:', pokemonId);
        return;
    }
    removeActiveOverlay();
    const overlay = createPokemonDetailOverlay(pokemonData);
    document.body.appendChild(overlay);
    showBackgroundBlur();
    if (resetTab) {
        activeTab = 'about';
    }
    setActiveTab(activeTab, pokemonId);
    displayActiveTabContent(pokemonId);
}