/**
 * A mapping of Pokémon types to their corresponding RGB color values.
 * Used for styling type-specific UI elements.
 * @type {Object<string, string>}
 */
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
    fairy: 'rgb(212,128,207)'
};


/**
 * Returns the formatted type name (with first letter capitalized) of a Pokémon.
 * @param {Object} currentPokemon - The Pokémon object containing type data.
 * @param {number} index - The index of the type (0 for primary, 1 for secondary).
 * @returns {string} The capitalized type name or an empty string if not found.
 */
function getSpecies(currentPokemon, index) {
    if (currentPokemon.types && currentPokemon.types.length > index) {
        let species = currentPokemon.types[index].type.name;
        return species.charAt(0).toUpperCase() + species.slice(1);
    }
    return '';
}


/**
 * Returns the corresponding RGB color string for a Pokémon's type.
 * @param {Object} currentPokemon - The Pokémon object containing type data.
 * @param {number} index - The index of the type to get the color for.
 * @returns {string} The RGB color value of the type.
 */
function setSpeciesColor(currentPokemon, index) {
    let type = currentPokemon.types[index].type.name;
    return typeColors[type];
}


/**
 * Returns an object containing the primary and (if present) secondary type colors of a Pokémon.
 * @param {Object} currentPokemon - The Pokémon object containing type data.
 * @returns {Object} An object with `species1Color` and `species2Color` properties.
 */
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