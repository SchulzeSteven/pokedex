/**
 * Generates the outer HTML structure for a Pokémon card.
 * @param {number} id - The Pokémon ID.
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {string} cardBackgroundColor - The background color of the card.
 * @param {string} headerHTML - The HTML for the card header.
 * @param {string} bodyHTML - The HTML for the card body.
 * @param {Object} currentPokemon - The full Pokémon data object.
 * @returns {string} The complete HTML string for the card.
 */
function generatePokemonCardHtml(id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon) {
    return `
    <div id="pokemon-card-${id}" class="card" onclick="toggleActiveClass(this)" style="background-color: ${cardBackgroundColor};">
        <div class="card__face card__front">${headerHTML}${bodyHTML}</div>
        <div class="card__face card__back"></div>
    </div>
    `;
}


/**
 * Generates the header HTML for a Pokémon card, including name and ID.
 * @param {Object} currentPokemon - The Pokémon data.
 * @param {string} pokemonName - The formatted Pokémon name.
 * @returns {string} HTML string for the card header.
 */
function generatePokemonHeader(currentPokemon, pokemonName) {
    let formattedId = ("000" + currentPokemon.id).slice(-3);
    return `
    <div class="header-card">
        <h3 id="pokemon-name" class="card-title">${pokemonName}</h3>
        <span id="pokemon-id"><b>#${formattedId}</b></span>
    </div>
    `;
}


/**
 * Generates the body HTML of a Pokémon card, including image and type bubbles.
 * @param {Object} currentPokemon - The Pokémon data.
 * @param {string} species1Color - Background color for the primary type.
 * @param {string} species2Color - Background color for the secondary type or transparent.
 * @returns {string} HTML string for the card body.
 */
function generatePokemonBody(currentPokemon, species1Color, species2Color) {
    return `
    <img src="img/2.svg" class="pokeball-bg align-self-center" alt="">
    <img id="pokemon-image" class="card-img-top pokemon-image image-size" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="...">
    <div class="card-body">
        <div class="species">
            <div class="species-direction">
                <div class="species-bubble" style="background-color: ${species1Color}">${getSpecies(currentPokemon, 0)}</div>
                ${currentPokemon.types.length > 1 ? `<div class="species-bubble" style="background-color: ${species2Color}">${getSpecies(currentPokemon, 1)}</div>` : ''}
            </div>
        </div>
    </div>
    `;
}


/**
 * Generates HTML for displaying a Pokémon's types as styled bubbles.
 * @param {Array} types - Array of type objects from the Pokémon data.
 * @returns {string} HTML string of all types styled with their respective colors.
 */
function generatePokemonTypesHtml(types) {
    return types.map(typeInfo => {
        const typeName = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1).toLowerCase();
        return `<span class="pokemon-type" style="background-color: ${typeColors[typeInfo.type.name]}">${typeName}</span>`;
    }).join(' ');
}


/**
 * Creates and displays a detailed overlay for a Pokémon, including stats, evolution, and moves.
 * @param {Object} pokemon - The Pokémon data object.
 * @param {boolean} [resetTab=false] - Whether to reset the active tab to "about".
 * @returns {HTMLElement} The created overlay element.
 */
function createPokemonDetailOverlay(pokemon, resetTab = false) {
    const overlay = document.createElement('div');
    overlay.classList.add('active-overlay', 'card');
    overlay.style.backgroundColor = typeColors[pokemon.types[0].type.name];
    overlay.id = `pokemon-card-${pokemon.id}`;

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const formattedId = ("000" + pokemon.id).slice(-3);
    const pokemonTypesHtml = generatePokemonTypesHtml(pokemon.types);
    const heightInMeters = (pokemon.height / 10).toFixed(2) + ' m';
    const weightInKilograms = (pokemon.weight / 10).toFixed(2) + ' kg';

    overlay.innerHTML = `
        <img src="img/2.svg" class="pokeball-bg1 align-self-center rotate" alt="">
        <div class="h2-back">
            <h2>${pokemonName}</h2><span>#${formattedId}</span>
        </div>
        <div class="types-back">
            ${pokemonTypesHtml}
        </div>
        <img id="pokemon-image-back-${pokemon.id}" class="image-back" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemonName}">
        <div class="second-area">
            <div class="tab-content">
                <div id="aboutTabButton${pokemon.id}" class="about tab" data-id="${pokemon.id}" onclick="showAbout(${pokemon.id})">About</div>
                <div id="statsTabButton${pokemon.id}" class="stats tab" data-id="${pokemon.id}" onclick="showStats(${pokemon.id})">Stats</div>
                <div id="evoTabButton${pokemon.id}" class="evo tab" data-id="${pokemon.id}" onclick="showEvo(${pokemon.id})">Evolution</div>
                <div id="movesTabButton${pokemon.id}" class="moves tab" data-id="${pokemon.id}" onclick="showMoves(${pokemon.id})">Moves</div>
            </div>
            <div id="aboutTab${pokemon.id}" class="tab-detail about1">
                <div class="aboutPokemon"> 
                    <table>
                        <tr><td><b>Experience:</b></td><td><span id="aboutExperience${pokemon.id}">${pokemon.base_experience}</span></td></tr>
                        <tr><td><b>Height:</b></td><td><span id="aboutHeight${pokemon.id}">${heightInMeters}</span></td></tr>
                        <tr><td><b>Weight:</b></td><td><span id="aboutWeight${pokemon.id}">${weightInKilograms}</span></td></tr>
                    </table>
                </div>
            </div>
            <div id="statsTab${pokemon.id}" class="tab-detail stats1" style="display: none;">
                <canvas id="myChart${pokemon.id}"></canvas>
            </div>
            <div id="evoTab${pokemon.id}" class="tab-detail evo1" style="display: none;"></div>
            <div id="movesTab${pokemon.id}" class="tab-detail" style="display: none;"></div>
            <div class="navigation-arrows">
                <button onclick="navigateBack()" class="arrow-button" id="back-arrow">&#8678;</button>
                <div class="close-button" onclick="removeActiveOverlay(event, this)"></div>
                <button onclick="navigateForward()" class="arrow-button" id="forward-arrow">&#8680;</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    showBackgroundBlur();

    if (resetTab) {
        setActiveTab('about', pokemon.id);
        showAbout(pokemon.id);
    } else {
        setActiveTab(activeTab, pokemon.id);
        displayActiveTabContent(pokemon.id);
    }

    return overlay;
}


/**
 * Generates the HTML for a single evolution stage (image and label).
 * Highlights the currently active Pokémon in the chain.
 * @param {Object} detail - The evolution stage (name, id, artwork).
 * @param {boolean} isActive - Whether this evolution is the currently selected Pokémon.
 * @param {string} borderColor - The color used for the active border highlight.
 * @returns {string} HTML for a single evolution image block.
 */
function generateEvolutionHtml(detail, isActive, borderColor) {
    return `
        <div style="text-align: center;">
            <img src="${detail.artwork}" alt="${detail.name}" class="evo-image ${isActive ? 'active-evolution-image' : ''}" 
                 style="${isActive ? `border: 0px solid ${borderColor}; border-radius: 20px; box-shadow: 0 0 4px ${borderColor};` : ''}"
                 onclick="showPokemonDetail(${detail.id})">
            <div class="evo-text">${detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}</div>
        </div>
    `;
}


/**
 * Generates the arrow icon HTML between evolution stages.
 * @returns {string} SVG arrow HTML.
 */
function generateArrowHtml() {
    return '<div class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path><path d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"></path></svg></div>';
}