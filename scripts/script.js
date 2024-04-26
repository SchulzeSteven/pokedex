let pokemonAmount = 30;
let id = 1;
let lastSearchTerm = null;
let filteredPokemonIds = [];
let filterIsActive = false;
let pokemonCache = {};
let searchTimeout;
let typeColors = {
    normal: 'rgb(168,168,153)',
    fire: 'rgb(229,59,25)',
    water: 'rgb(39,139,204)',
    electric: 'rgb(229,198,0)',
    grass: 'rgb(88,169,81)',
    ice: 'rgb(108, 239, 251)',
    fighting: 'rgb(167,76,61)',
    poison: 'rgb(134,74,184)',
    ground: 'rgb(149,104,51)',
    flying: 'rgb(152, 214, 251)',
    psychic: 'rgb(229,89,115)',
    bug: 'rgb(131,173,37)',
    rock: 'rgb(168,153,91)',
    ghost: 'rgb(152, 108, 251)',
    dragon: 'rgb(176, 152, 251)',
    steel: 'rgb(196, 206, 214)',
    fairy: 'rgb(212,128,207)',
};


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
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();

    console.log('Loaded Pokemon', currentPokemon);
    content.innerHTML += PokemonRender(currentPokemon);
    updatePokemonDetails(currentPokemon, id);
}


function setSpeciesColor(currentPokemon, index) {
    let type = currentPokemon.types[index].type.name;
    return typeColors[type];
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


function getSpecies(currentPokemon, index) {
    if (currentPokemon.types && currentPokemon.types.length > index) {
        let species = currentPokemon.types[index].type.name;
        return species.charAt(0).toUpperCase() + species.slice(1);
    }
    return '';
}


async function searchAndSuggestPokemon() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    if (searchTerm === lastSearchTerm) return;
    lastSearchTerm = searchTerm;
    if (searchTimeout) clearTimeout(searchTimeout);
    if (searchTerm.length >= 3) {
        document.getElementById('loadMoreButton').style.display = 'none';
        searchTimeout = setTimeout(() => initializeSearch(searchTerm), 500);
    } else {
        document.getElementById('pokemon-list').innerHTML = '';
        if (searchTerm.length === 0) {
            await loadInitialPokemons(document.getElementById('pokemon-list'));
            document.getElementById('loadMoreButton').style.display = 'block';
            filterIsActive = false;
        }
    }
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
        try {
            let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
            let response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            pokemonCache[id] = await response.json();
        } catch (e) {
            console.error('Error fetching data:', e);
        }
    }
    return pokemonCache[id];
}


function showBackgroundBlur() {
    const background = document.getElementById('background-blur');
    background.style.display = 'block';
}


function hideBackgroundBlur() {
    const background = document.getElementById('background-blur');
    background.style.display = 'none';
}


function toggleActiveClass(element) {
    const isActive = element.classList.contains('active-overlay');
    if (!isActive) {
        const clone = element.cloneNode(true);
        clone.classList.add('active-overlay');
        document.body.appendChild(clone);
        showBackgroundBlur();
    }
}


function closeCard(event) {
    event.stopPropagation(); // Stoppe die Weiterleitung des Events
    const card = document.querySelector('.active-overlay'); // Wähle das aktive Overlay-Element
    if (card) {
        card.remove(); // Entferne das Element direkt
        hideBackgroundBlur(); // Sicherstellen, dass der Hintergrund-Blur ebenfalls ausgeblendet wird
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Laden und Anzeigen der Typ-Optionen für Filter
    const typeOptionsContainer = document.getElementById('type-options');
    const typeCheckboxHtml = Object.keys(typeColors).map(type => `
        <label>
            <input type="checkbox" name="type" value="${type}" onchange="filterByType()"> ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
    `).join('');
    typeOptionsContainer.innerHTML = typeCheckboxHtml;
    // Initialisieren der Klick-Event-Listener für jede Pokémon-Karte
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.onclick = () => toggleActiveClass(card);
    });
    // Event-Listener für das Schließen der Karte durch den Schließbutton
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('close-button') || event.target.closest('.close-button')) {
            closeCard(event);
        }
    });
});


function toggleFilterMenu() {
    const filterMenu = document.getElementById('type-options');
    if (filterMenu.style.display === 'block') {
        filterMenu.style.display = 'none';
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


function updatePokemonDetails(pokemonData, id) {
    document.getElementById(`aboutExperience${id}`).textContent = pokemonData.base_experience;
    document.getElementById(`aboutHeight${id}`).textContent = (pokemonData.height / 10) + ' m';
    document.getElementById(`aboutWeight${id}`).textContent = (pokemonData.weight / 10) + ' kg';
    showAbout(id);
}


function showAbout(id) {
    hideAllTabs(id);
    const aboutTab = document.getElementById(`aboutTab${id}`);
    if (aboutTab) {
        aboutTab.style.display = 'flex';
    }
}

function showStats(id) {
    hideAllTabs(id);
    const statsTab = document.getElementById(`statsTab${id}`);
    if (statsTab) {
        statsTab.style.display = 'flex';
        // Hier könnten Sie zusätzliche Logik einfügen, um die Statistiken zu laden oder zu aktualisieren
    }
}

function showMoves(id) {
    hideAllTabs(id);
    const movesTab = document.getElementById(`movesTab${id}`);
    if (movesTab) {
        movesTab.style.display = 'flex';
        // Hier könnten Sie zusätzliche Logik einfügen, um die Bewegungen zu laden oder zu aktualisieren
    }
}

function hideAllTabs(id) {
    ['aboutTab', 'statsTab', 'movesTab'].forEach(tab => {
        const element = document.getElementById(`${tab}${id}`);
        if (element) {
            element.style.display = 'none';
        }
    });
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
    const activeCard = document.querySelector('.active-overlay'); // Dies sollte das aktive Karten-Element sein
    if (!activeCard) {
        console.error("No active card found");
        return null;
    }
    const idMatch = activeCard.id.match(/pokemon-card-(\d+)/);
    return idMatch ? parseInt(idMatch[1], 10) : null;
}


async function updatePokemonCard(pokemonId) {
    const pokemonData = await getPokemonData(pokemonId);
    if (!pokemonData) {
        console.error('Failed to load Pokemon data for ID:', pokemonId);
        return;
    }
    const activeCard = document.querySelector('.active-overlay');
    if (activeCard) activeCard.remove();  // Remove the current active card
    const container = document.createElement('div');
    container.innerHTML = PokemonRender(pokemonData);
    const newCard = container.firstElementChild;
    if (newCard) {
        newCard.classList.add('active-overlay');
        document.body.appendChild(newCard);
        showBackgroundBlur();
    } else {
        console.error('Error: The new card element was not created correctly.');
    }
}