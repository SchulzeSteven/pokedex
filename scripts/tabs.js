let activeTab = 'about';

/**
 * Sets the active tab and updates its visual state.
 * @param {string} tabName - The name of the tab to activate (e.g., 'about', 'stats', 'moves', 'evo').
 * @param {number} id - The ID of the currently selected Pokémon.
 */
function setActiveTab(tabName, id) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    const activeTabElement = document.getElementById(`${tabName}TabButton${id}`);
    if (activeTabElement) {
        activeTabElement.classList.add('active-tab');
    }
}

/**
 * Displays the "About" tab for a given Pokémon.
 * @param {number} id - The ID of the Pokémon whose "About" tab should be shown.
 */
function showAbout(id) {
    hideAllTabs(id);
    if (activeTab === 'about' && document.getElementById(`aboutTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'about';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}

/**
 * Displays the "Stats" tab for a given Pokémon.
 * @param {number} id - The ID of the Pokémon whose "Stats" tab should be shown.
 */
function showStats(id) {
    if (activeTab === 'stats' && document.getElementById(`statsTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'stats';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}

/**
 * Displays the "Moves" tab for a given Pokémon.
 * @param {number} id - The ID of the Pokémon whose "Moves" tab should be shown.
 */
function showMoves(id) {
    if (activeTab === 'moves' && document.getElementById(`movesTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'moves';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}

/**
 * Hides all tabs for a given Pokémon card.
 * @param {number} id - The ID of the Pokémon whose tab contents should be hidden.
 */
function hideAllTabs(id) {
    ['aboutTab', 'statsTab', 'movesTab', 'evoTab'].forEach(tab => {
        const element = document.getElementById(`${tab}${id}`);
        if (element) {
            element.style.display = 'none';
        }
    });
}

/**
 * Updates and displays the current active tab content.
 * Also handles rendering the stats chart or moves list if applicable.
 * @param {number} id - The ID of the Pokémon to update tab content for.
 */
function updateActiveTab(id) {
    hideAllTabs(id);
    const tabDetail = document.getElementById(`${activeTab}Tab${id}`);
    if (tabDetail) {
        tabDetail.style.display = 'flex';
        if (activeTab === 'stats') {
            const pokemon = pokemonCache[id];
            if (pokemon && pokemon.stats) {
                const base_stat = pokemon.stats.map(stat => stat.base_stat);
                const name_stat = pokemon.stats.map(stat => stat.stat.name);
                renderChart(base_stat, name_stat, id);
            }
        } else if (activeTab === 'moves') {
            const pokemon = pokemonCache[id];
            if (pokemon) {
                renderMoves(pokemon, id);
            }
        }
    }
}

/**
 * Displays the currently selected tab content (About, Stats, Moves, or Evolution).
 * @param {number} pokemonId - The ID of the Pokémon for which to display tab content.
 */
function displayActiveTabContent(pokemonId) {
    if (activeTab === 'stats') {
        showStats(pokemonId);
    } else if (activeTab === 'moves') {
        showMoves(pokemonId);
    } else if (activeTab === 'evo') {
        showEvo(pokemonId);
    } else {
        showAbout(pokemonId);
    }
}