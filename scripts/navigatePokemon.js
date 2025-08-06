/**
 * Navigates to the next Pokémon card.
 * If filtering is active, uses the `filteredPokemonIds` list.
 * Otherwise, loops through all Pokémon from 1 to 151.
 * Skips fetching if data is already in the cache.
 * @returns {Promise<void>}
 */
async function navigateForward() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;

    let currentIndex, newId;

    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex < filteredPokemonIds.length - 1
            ? filteredPokemonIds[currentIndex + 1]
            : filteredPokemonIds[0]; // wrap around
    } else {
        newId = currentId < 151 ? currentId + 1 : 1;
        if (!pokemonCache[newId]) {
            await getPokemonData(newId);
        }
    }

    updatePokemonCard(newId);
}


/**
 * Navigates to the previous Pokémon card.
 * If filtering is active, uses the `filteredPokemonIds` list.
 * Otherwise, loops backward from 151 to 1.
 * Skips fetching if data is already in the cache.
 * @returns {Promise<void>}
 */
async function navigateBack() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;

    let currentIndex, newId;

    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex > 0
            ? filteredPokemonIds[currentIndex - 1]
            : filteredPokemonIds[filteredPokemonIds.length - 1]; // wrap around
    } else {
        newId = currentId > 1 ? currentId - 1 : 151;
        if (!pokemonCache[newId]) {
            await getPokemonData(newId);
        }
    }

    updatePokemonCard(newId);
}


/**
 * Retrieves the current active Pokémon ID from the overlay element.
 * Expects the overlay ID to follow the format: `pokemon-card-<id>`.
 * @returns {number|null} The current Pokémon ID or null if not found.
 */
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


/**
 * Updates the detail overlay with a new Pokémon card.
 * Removes the existing overlay and replaces it with the new one.
 * Optionally resets the active tab to "about".
 * @param {number} pokemonId - The ID of the Pokémon to display.
 * @param {boolean} [resetTab=false] - Whether to reset the active tab to "about".
 * @returns {Promise<void>}
 */
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