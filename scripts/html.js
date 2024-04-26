function generatePokemonCardHtml(id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon) {
    const pokemonTypesHtml = generatePokemonTypesHtml(currentPokemon.types);
    const formattedId = id.toString().padStart(3, '0');
    const heightInMeters = (currentPokemon.height / 10) + ' m';
    const weightInKilograms = (currentPokemon.weight / 10) + ' kg';

    return `
    <div id="pokemon-card-${id}" class="card" onclick="toggleActiveClass(this)" style="background-color: ${cardBackgroundColor};">
        <div class="card__face card__front">${headerHTML}${bodyHTML}</div>
        <div class="card__face card__back">
            <img src="img/2.svg" class="pokeball-bg1 align-self-center" alt="">
            <div class="h2-back">
                <h2>${pokemonName}</h2><span>#${formattedId}</span>
            </div>
            <div class="types-back">
                ${pokemonTypesHtml}
            </div>
            <img id="pokemon-image-back-${id}" class="image-back" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${pokemonName}">
            <div class="second-area">
                <div class="tab-content">
                    <div class="about tab" onclick="showAbout(${id})">About</div>
                    <div class="stats tab" onclick="showStats(${id})">Stats</div>
                    <div class="moves tab" onclick="showMoves(${id})">Moves</div>
                </div>
                <div id="aboutTab${id}" class="tab-detail">
                    <!-- About content here -->
                    <div class="aboutPokemon"> 
                        <table>
                            <tr>
                                <td><b>Experience:</b></td>
                                <td><span id="aboutExperience${id}">${currentPokemon.base_experience}</span></td>
                            </tr>
                            <tr>
                                <td><b>Height:</b></td>
                                <td><span id="aboutHeight${id}">${heightInMeters}</span></td>
                            </tr>
                            <tr>
                                <td><b>Weight:</b></td>
                                <td><span id="aboutWeight${id}">${weightInKilograms}</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="statsTab${id}" class="tab-detail" style="display: none;">
                    <canvas id="myChart${id}"></canvas>
                </div>
                <div id="movesTab${id}" class="tab-detail" style="display: none;">
                    <!-- Moves Content Here -->
                </div>
                <div class="navigation-arrows">
                <button onclick="navigateBack()" class="arrow-button" id="back-arrow">&#8678</button>
                <div class="close-button" onclick="closeCard(event, this)"></div>
                <button onclick="navigateForward()" class="arrow-button" id="forward-arrow">&#8680</button>
                </div>
            </div>
        </div>
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