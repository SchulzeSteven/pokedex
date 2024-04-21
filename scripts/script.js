let pokemonAmount = 30;
let id = 1;
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
    dark: 'rgb(108, 132, 151)',
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
    let pokemonName = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);
    let { species1Color, species2Color } = getSpeciesColors(currentPokemon);
    let cardBackgroundColor = typeColors[currentPokemon.types[0].type.name];
    let headerHTML = generatePokemonHeader(currentPokemon, pokemonName);
    let bodyHTML = generatePokemonBody(currentPokemon, species1Color, species2Color);

    // Hier wird generatePokemonCardHtml aufgerufen und das resultierende HTML zurückgegeben.
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
    let searchTerm = document.getElementById('search').value.toLowerCase();
    clearTimeout(searchTimeout);
    if (searchTerm.length >= 3) {
        document.getElementById('loadMoreButton').style.display = 'none';  // Verstecke den Load More Button während der Suche
        searchTimeout = setTimeout(async () => {
            await initializeSearch(searchTerm);
        }, 500); // Debounce der Eingabe für 500 ms
    } else if (searchTerm.length === 0) {
        document.getElementById('pokemon-list').innerHTML = '';  // Bereinige die Liste
        await loadInitialPokemons(document.getElementById('pokemon-list'));
        document.getElementById('loadMoreButton').style.display = 'block'; // Zeige Load More Button, wenn keine Suche aktiv ist
    }
}


async function initializeSearch(searchTerm) {
    let content = document.getElementById('pokemon-list');
    content.innerHTML = ''; // Clear current content
    if (searchTerm.length === 0) {
        document.getElementById('loadMoreButton').style.display = 'block';
        await loadInitialPokemons(content);
    } else {
        document.getElementById('loadMoreButton').style.display = 'none';
        await searchAndRenderPokemons(searchTerm, content);
    }
}


async function loadInitialPokemons(content) {
    content.innerHTML = '';  // Lösche vorhandenen Inhalt bevor neue Pokémon geladen werden
    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        content.innerHTML += PokemonRender(currentPokemon);
    }
    document.getElementById('loadMoreButton').style.display = 'block'; // Stelle sicher, dass der Button angezeigt wird, wenn die initialen Pokémon geladen werden
}


async function searchAndRenderPokemons(searchTerm, content) {
    let count = 0;
    for (let i = 1; i <= 151 && count < 10; i++) { // Begrenze auf die ersten 151 Pokémon
        let currentPokemon = await getPokemonData(i);
        if (currentPokemon.name.toLowerCase().includes(searchTerm)) {
            content.innerHTML += PokemonRender(currentPokemon);
            count++;
        }
    }
}


async function getPokemonData(id) {
    if (!pokemonCache[id]) {
        let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        let response = await fetch(url);
        pokemonCache[id] = await response.json();
    }
    return pokemonCache[id];
}


function activateCard(element) {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('active');
    });
    element.classList.add('active');
    showBackgroundBlur();
}


function showBackgroundBlur() {
    const background = document.getElementById('background-blur');
    background.style.display = 'block';
    background.addEventListener('click', () => {
        const activeCard = document.querySelector('.active-overlay');
        if (activeCard) {
            document.body.removeChild(activeCard);
        }
        hideBackgroundBlur();
    });
}


function deactivateActiveCard() {
    const activeCard = document.querySelector('.card.active');
    if (activeCard) {
        activeCard.classList.remove('active');
    }
    hideBackgroundBlur();
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

        clone.addEventListener('click', () => {
            document.body.removeChild(clone);
            hideBackgroundBlur();
        });

        showBackgroundBlur();
    } else {
        document.body.removeChild(document.querySelector('.active-overlay'));
        hideBackgroundBlur();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const typeOptionsContainer = document.getElementById('type-options');
    const typeCheckboxHtml = Object.keys(typeColors).map(type => `
        <label>
            <input type="checkbox" name="type" value="${type}" onchange="filterByType()"> ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
    `).join('');
    typeOptionsContainer.innerHTML = typeCheckboxHtml;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.onclick = () => toggleActiveClass(card);
    });
});


function toggleFilterMenu() {
    const filterMenu = document.getElementById('type-options');
    filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
}


function filterByType() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const content = document.getElementById('pokemon-list');
    content.innerHTML = ''; // Clear current content

    if (checkedTypes.length === 0) {
        loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block'; // Zeige Load More Button, wenn keine Filter aktiv sind
    } else {
        document.getElementById('loadMoreButton').style.display = 'none'; // Verstecke den Load More Button während des Filterns
        filterAndRenderPokemons(checkedTypes, content);
    }
}


async function filterAndRenderPokemons(checkedTypes, content) {
    for (let i = 1; i <= 151; i++) { // Begrenze auf die ersten 151 Pokémon
        let pokemon = await getPokemonData(i);
        if (pokemon.types.some(type => checkedTypes.includes(type.type.name))) {
            content.innerHTML += PokemonRender(pokemon);
        }
    }
}