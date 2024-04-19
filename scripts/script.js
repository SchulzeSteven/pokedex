let pokemonAmount = 30;
let id = 1;
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
    for (let i = 0; i < pokemonAmount; i++) {
        await renderPokemon(id, content);
        id += 1;
    }
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
    return `
    <div id="pokemon-card" class="card" style="width: 18rem; background-color: ${cardBackgroundColor};">
        ${headerHTML}
        ${bodyHTML}
    </div>
    `;
}


function getSpecies(currentPokemon, index) {
    if (currentPokemon.types && currentPokemon.types.length > index) {
        return currentPokemon.types[index].type.name;
    }
    return '';
}