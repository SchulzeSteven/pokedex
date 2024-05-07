function generatePokemonCardHtml(id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon) {

    return `
    <div id="pokemon-card-${id}" class="card" onclick="toggleActiveClass(this)" style="background-color: ${cardBackgroundColor};">
        <div class="card__face card__front">${headerHTML}${bodyHTML}</div>
        <div class="card__face card__back"></div>
    </div>
    `;
}


function generatePokemonHeader(currentPokemon, pokemonName) {
    let formattedId = ("000" + currentPokemon.id).slice(-3); // Formatieren der ID auf 3 Stellen
    return `
    <div class="header-card">
        <h3 id="pokemon-name" class="card-title">${pokemonName}</h3>
        <span id="pokemon-id"><b>#${formattedId}</b></span>
    </div>
    `;
}


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


function generatePokemonTypesHtml(types) {
    return types.map(typeInfo => {
        // Erster Buchstabe groß, der Rest klein
        const typeName = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1).toLowerCase();
        return `<span class="pokemon-type" style="background-color: ${typeColors[typeInfo.type.name]}">${typeName}</span>`;
    }).join(' ');
}


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
        <img src="img/2.svg" class="pokeball-bg1 align-self-center" alt="">
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
                        <tr>
                            <td><b>Experience:</b></td>
                            <td><span id="aboutExperience${pokemon.id}">${pokemon.base_experience}</span></td>
                        </tr>
                        <tr>
                            <td><b>Height:</b></td>
                            <td><span id="aboutHeight${pokemon.id}">${heightInMeters}</span></td>
                        </tr>
                        <tr>
                            <td><b>Weight:</b></td>
                            <td><span id="aboutWeight${pokemon.id}">${weightInKilograms}</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div id="statsTab${pokemon.id}" class="tab-detail stats1" style="display: none;">
                <canvas id="myChart${pokemon.id}"></canvas>
            </div>
            <div id="evoTab${pokemon.id}" class="tab-detail evo1" style="display: none;">
                <!-- Evo Content Here -->
            </div>
            <div id="movesTab${pokemon.id}" class="tab-detail" style="display: none;">
                <!-- Moves Content Here -->
            </div>
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
        setActiveTab(activeTab, pokemon.id); // Beibehalten des aktuellen Tabs
        displayActiveTabContent(pokemon.id); // Diese Funktion sollte den Inhalt des aktiven Tabs anzeigen
    }
    return overlay;
}