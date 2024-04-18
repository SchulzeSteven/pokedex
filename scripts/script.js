let pokemonAmount = 20;
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


function PokemonRender(currentPokemon) {
    // Großschreibung des ersten Buchstabens des Pokémon-Namens
    let pokemonName = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);

    let species1Color = typeColors[currentPokemon.types[0].type.name];
    let species2Color = currentPokemon.types.length > 1 ? typeColors[currentPokemon.types[1].type.name] : 'transparent';

    // Wähle die Hintergrundfarbe entsprechend dem ersten Typ des Pokémon
    let cardBackgroundColor = typeColors[currentPokemon.types[0].type.name];

    return `
    <div id="pokemon-card" class="card" style="width: 18rem; background-color: ${cardBackgroundColor};">
        <div class="header-card">
           <h3 id="pokemon-name" class="card-title">${pokemonName}</h3>
           <span id="pokemon-id"><b>#${currentPokemon.id}</b></span>
        </div>
        <img id="pokemon-image" class="card-img-top pokemon-image image-size" src="${currentPokemon.sprites.other['home'].front_default}" alt="...">
        <div class="card-body">
            <div class="species">
                <div class="flex-direction">
                    <div class="species-bubble species1" style="background-color: ${species1Color}">${getSpecies(currentPokemon, 0)}</div>
                    <div class="species-bubble species2" style="background-color: ${species2Color}">${getSpecies(currentPokemon, 1)}</div>
                </div>
            </div>
        </div>
    </div>
    `;
}



function getSpecies(currentPokemon, index) {
    if (currentPokemon.types && currentPokemon.types.length > index) {
        return currentPokemon.types[index].type.name;
    }
    return '';
}