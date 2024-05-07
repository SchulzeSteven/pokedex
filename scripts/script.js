let pokemonAmount = 30;
let id = 1;
let activeTab = 'about';
let lastSearchTerm = null;
let filteredPokemonIds = [];
let filterIsActive = false;
let pokemonCache = {};
let searchTimeout;
let typeColors = { normal: 'rgb(168,168,153)', fire: 'rgb(229,59,25)', water: 'rgb(39,139,204)', electric: 'rgb(229,198,0)', grass: 'rgb(88,169,81)', ice: 'rgb(108, 239, 251)', fighting: 'rgb(167,76,61)', poison: 'rgb(134,74,184)', ground: 'rgb(149,104,51)', flying: 'rgb(152, 214, 251)', psychic: 'rgb(229,89,115)', bug: 'rgb(131,173,37)', rock: 'rgb(168,153,91)', ghost: 'rgb(152, 108, 251)', dragon: 'rgb(176, 152, 251)', steel: 'rgb(196, 206, 214)', fairy: 'rgb(212,128,207)', };


async function init() {
    let content = document.getElementById('pokemon-list');
    let maxId = Math.min(id + 29, 151); // Stelle sicher, dass nicht mehr als 151 Pokémon geladen werden
    for (; id <= maxId; id++) {
        await renderPokemon(id, content);
    }
    // Verstecke den Load More Button, wenn die maximale Anzahl erreicht ist
    if (id > 151) {
        document.getElementById('loadMoreButton').style.display = 'none';
    } else {
        document.getElementById('loadMoreButton').style.display = 'block';
    }
}


function loadMore() {
    init();
}


async function renderPokemon(id, content) {
    let pokemonData = await getPokemonData(id);
    if (pokemonData) {
        content.innerHTML += PokemonRender(pokemonData);
    } else {
        console.error(`Failed to load data for Pokemon ID ${id}`);
    }
}


function setSpeciesColor(currentPokemon, index) {
    let type = currentPokemon.types[index].type.name;
    return typeColors[type];
}


function getSpecies(currentPokemon, index) {
    if (currentPokemon.types && currentPokemon.types.length > index) {
        let species = currentPokemon.types[index].type.name;
        return species.charAt(0).toUpperCase() + species.slice(1);
    }
    return '';
}



function getSpeciesColors(currentPokemon) {
    let speciesColors = {};
    speciesColors.species1Color = setSpeciesColor(currentPokemon, 0);
    if (currentPokemon.types.length > 1) {
        speciesColors.species2Color = setSpeciesColor(currentPokemon, 1);
    } else {
        speciesColors.species2Color = 'transparent';
    }
    return speciesColors;
}


function PokemonRender(currentPokemon) {
    if (!currentPokemon || !currentPokemon.name) {
        console.error('Invalid Pokemon data', currentPokemon);
        return ''; // Führt frühzeitig einen Ausstieg durch, wenn Daten ungültig sind
    }
    let pokemonName = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);
    let { species1Color, species2Color } = getSpeciesColors(currentPokemon);
    let cardBackgroundColor = typeColors[currentPokemon.types[0].type.name];
    let headerHTML = generatePokemonHeader(currentPokemon, pokemonName);
    let bodyHTML = generatePokemonBody(currentPokemon, species1Color, species2Color);

    return generatePokemonCardHtml(currentPokemon.id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon);
}


async function searchAndSuggestPokemon() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    if (searchTerm === lastSearchTerm) return;
    lastSearchTerm = searchTerm;
    if (searchTimeout) clearTimeout(searchTimeout);
    if (searchTerm.length >= 3) {
        document.getElementById('loadMoreButton').style.display = 'none';
        searchTimeout = setTimeout(() => initializeSearch(searchTerm), 151);
    } else {
        document.getElementById('pokemon-list').innerHTML = '';
        if (searchTerm.length === 0) {
            await loadInitialPokemons(document.getElementById('pokemon-list'));
            document.getElementById('loadMoreButton').style.display = 'block';
            filterIsActive = false;
        }
    }
}


async function loadInitialPokemons(content) {
    content.innerHTML = '';  // Lösche vorhandenen Inhalt bevor neue Pokémon geladen werden
    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        content.innerHTML += PokemonRender(currentPokemon);
    }
    document.getElementById('loadMoreButton').style.display = 'block'; // Stelle sicher, dass der Button angezeigt wird
    filterIsActive = false; // Keine Filter sind aktiv
}


async function searchAndRenderPokemons(searchTerm, content) {
    filteredPokemonIds = [];
    let count = 0;
    for (let i = 1; i <= 151; i++) {
        let currentPokemon = await getPokemonData(i);
        if (currentPokemon.name.toLowerCase().includes(searchTerm)) {
            content.innerHTML += PokemonRender(currentPokemon);
            filteredPokemonIds.push(i); // Speichere die ID des Pokémon
            count++;
        }
    }
    filterIsActive = true; // Aktiviere den Filtermodus für die Navigation
}


async function getPokemonData(id) {
    if (!pokemonCache[id]) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            pokemonCache[id] = data;
        } catch (e) {
            console.error('Error fetching data:', e);
            return null;
        }
    }
    return pokemonCache[id];
}


function toggleActiveClass(clickedElement) {
    const pokemonId = parseInt(clickedElement.id.replace('pokemon-card-', ''), 10);
    const pokemonData = pokemonCache[pokemonId];

    // Überprüfe, ob Daten verfügbar sind, bevor das Overlay entfernt oder erstellt wird
    if (!pokemonData) {
        console.error('No data available for Pokemon ID:', pokemonId);
        return;
    }
    removeActiveOverlay();

    // Erstelle und zeige das neue Overlay
    const overlay = createPokemonDetailOverlay(pokemonData);
    document.body.appendChild(overlay);
    showBackgroundBlur();

    // Setze den aktiven Tab auf 'about' und zeige entsprechenden Inhalt
    activeTab = 'about';
    setActiveTab(activeTab, pokemonId);
    showAbout(pokemonId);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // Warte kurz, um den Status des Buttons nach dem Scrollen zu überprüfen
    setTimeout(toggleScrollButtonVisibility, 150);
}

function toggleFilterMenu() {
    const filterMenu = document.getElementById('type-options');
    if (filterMenu.style.display === 'block') {filterMenu.style.display = 'none';
    } else {
        filterMenu.style.display = 'block';
    }
}


async function filterByType() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const content = document.getElementById('pokemon-list');
    content.innerHTML = ''; // Clear current content

    if (checkedTypes.length === 0) {
        filterIsActive = false; // Keine Filter aktiv
        loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
    } else {
        filterIsActive = true; // Filter sind aktiv
        document.getElementById('loadMoreButton').style.display = 'none';
        filterAndRenderPokemons(checkedTypes, content);
    }
}


async function filterAndRenderPokemons(checkedTypes, content) {
    filteredPokemonIds = []; // Reset bei jeder neuen Filterung
    for (let i = 1; i <= 151; i++) { // Begrenze auf die ersten 151 Pokémon
        let pokemon = await getPokemonData(i);
        if (pokemon.types.some(type => checkedTypes.includes(type.type.name))) {
            content.innerHTML += PokemonRender(pokemon);
            filteredPokemonIds.push(i); // Speichere die ID des Pokémon
        }
    }
}


function showAbout(id) {
    hideAllTabs(id);
    if (activeTab === 'about' && document.getElementById(`aboutTab${id}`).style.display === 'flex') {
        // Verhindert das Neuladen der Moves, wenn der Tab bereits aktiv ist
        return;
    }
    activeTab = 'about';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


function showStats(id) {
    if (activeTab === 'stats' && document.getElementById(`statsTab${id}`).style.display === 'flex') {
        // Verhindert das Neuladen der Moves, wenn der Tab bereits aktiv ist
        return;
    }
    activeTab = 'stats';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


function showMoves(id) {
    if (activeTab === 'moves' && document.getElementById(`movesTab${id}`).style.display === 'flex') {
        // Verhindert das Neuladen der Moves, wenn der Tab bereits aktiv ist
        return;
    }
    activeTab = 'moves';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


async function showEvo(pokemonId) {
    const evoTab = document.getElementById(`evoTab${pokemonId}`);

    // Verhindert das Neuladen, wenn der Evo-Tab bereits angezeigt wird
    if (activeTab === 'evo' && evoTab.style.display === 'flex') {
        return;
    }

    // Setzt den aktiven Tab auf 'evo' und aktualisiert die Anzeige
    activeTab = 'evo';
    setActiveTab(activeTab, pokemonId);
    updateActiveTab(pokemonId);

    // Lädt die Evolutionsdaten
    const evolutionData = await fetchEvolutionChain(pokemonId);
    if (evolutionData) {
        const evoContent = buildEvolutionChainContent(evolutionData);
        evoTab.innerHTML = evoContent;
    } else {
        evoTab.innerHTML = '<div>No evolution data available.</div>';
    }
}


async function fetchEvolutionChain(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        if (!speciesResponse.ok) throw new Error('Failed to fetch species data');

        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error('Failed to fetch evolution data');

        const evolutionData = await evolutionResponse.json();
        return await fetchFullEvolutionDetails(evolutionData);
    } catch (error) {
        console.error('Error fetching evolution data:', error);
        return null;
    }
}


async function fetchEvolutionChain(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        if (!speciesResponse.ok) throw new Error('Failed to fetch species data');

        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error('Failed to fetch evolution data');

        const evolutionData = await evolutionResponse.json();
        return filterEvolutionData(evolutionData.chain);
    } catch (error) {
        console.error('Error fetching evolution data:', error);
        return null;
    }
}


function buildEvolutionChainContent(evolutionDetails) {
    if (!evolutionDetails || evolutionDetails.length === 0) {
        return '<div>No evolution data available.</div>';
    }

    let htmlContent = '<div class="evolution-chain">';
    evolutionDetails.forEach((detail) => {
        if (detail.artwork) {
            htmlContent += `
                <div style="text-align: center;">
                    <img src="${detail.artwork}" alt="${detail.name}">
                    <div class="evo-text">${detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}</div>
                </div>
            `;
        }
    });
    
    htmlContent += '</div>';
    return htmlContent;
}


function filterEvolutionData(chain, collectedData = []) {
    if (!chain) return collectedData;

    const speciesId = chain.species.url.split("/").filter(Boolean).pop();
    if (parseInt(speciesId) <= 151) { // Sicherstellen, dass nur Pokémon bis zur 151. Generation betrachtet werden
        collectedData.push({
            name: chain.species.name,
            id: speciesId,
            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
        });
    }

    // Rekursiv durch alle möglichen Evolutionen gehen
    chain.evolves_to.forEach(evolution => {
        filterEvolutionData(evolution, collectedData);
    });

    return collectedData;
}


function hideAllTabs(id) {
    ['aboutTab', 'statsTab', 'movesTab', 'evoTab'].forEach(tab => {
        const element = document.getElementById(`${tab}${id}`);
        if (element) {
            element.style.display = 'none';
        }
    });
}


function setActiveTab(tabName, id) {
    // Entferne die aktive Tab-Klasse von allen Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Füge die aktive Tab-Klasse zum ausgewählten Tab hinzu
    const activeTabElement = document.getElementById(`${tabName}TabButton${id}`);
    if (activeTabElement) {
        activeTabElement.classList.add('active-tab');
    }
}


async function navigateBack() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;
    let currentIndex, newId;

    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex > 0 ? filteredPokemonIds[currentIndex - 1] : filteredPokemonIds[filteredPokemonIds.length - 1];
    } else {
        newId = currentId > 1 ? currentId - 1 : 151; // Wrap-around am Anfang der Liste
        if (!pokemonCache[newId]) { // Prüfe, ob das Pokémon geladen ist
            await getPokemonData(newId); // Lade das Pokémon, wenn es noch nicht geladen wurde
        }
    }
    updatePokemonCard(newId);
}


async function navigateForward() {
    const currentId = getCurrentPokemonId();
    if (!currentId) return;
    let currentIndex, newId;

    if (filterIsActive) {
        currentIndex = filteredPokemonIds.indexOf(currentId);
        newId = currentIndex < filteredPokemonIds.length - 1 ? filteredPokemonIds[currentIndex + 1] : filteredPokemonIds[0];
    } else {
        newId = currentId < 151 ? currentId + 1 : 1; // Wrap-around am Ende der Liste
        if (!pokemonCache[newId]) { // Prüfe, ob das Pokémon geladen ist
            await getPokemonData(newId); // Lade das Pokémon, wenn es noch nicht geladen wurde
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
    // Stellen Sie sicher, dass das ID-Format richtig erkannt wird. Angenommen, die ID sieht so aus: "pokemon-card-42"
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


function displayActiveTabContent(pokemonId) {
    if (activeTab === 'stats') {
        showStats(pokemonId);
    } else if (activeTab === 'moves') {
        showMoves(pokemonId);
    } else if (activeTab === 'evo') {
        showEvo(pokemonId);
    }else {
        showAbout(pokemonId);
    }
}


function renderMoves(pokemon, id) {
    const movesContainer = document.getElementById(`movesTab${id}`);
    if (!movesContainer) {
        console.error('Moves tab container not found');
        return;
    }

    // Leere den vorhandenen Inhalt
    movesContainer.innerHTML = '';

    // Erstelle das Flex-Container-Element für die Moves
    const movesList = document.createElement('div');
    movesList.id = 'movesContainer';

    pokemon.moves.forEach(moveEntry => {
        const moveItem = document.createElement('div');
        moveItem.classList.add('moveItem');
        moveItem.textContent = moveEntry.move.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // formatiere den Namen
        movesList.appendChild(moveItem);
    });

    movesContainer.appendChild(movesList);
}


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
                renderChart(base_stat, name_stat, id); // Stelle sicher, dass diese Funktion aufgerufen wird
            }
        } else if (activeTab === 'moves') {
            const pokemon = pokemonCache[id];
            if (pokemon) {
                renderMoves(pokemon, id); // Lade Moves, wenn das Pokémon gewechselt wird
            }
        }
    }
}