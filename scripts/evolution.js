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


function filterEvolutionData(chain, collectedData = []) {
    if (!chain) return collectedData;

    const speciesId = chain.species.url.split("/").filter(Boolean).pop();
    if (parseInt(speciesId) <= 151) {
        collectedData.push({
            name: chain.species.name,
            id: speciesId,
            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
        });
    }
    chain.evolves_to.forEach(evolution => {
        filterEvolutionData(evolution, collectedData);
    });
    return collectedData;
}


async function showEvo(pokemonId) {
    const evoTab = document.getElementById(`evoTab${pokemonId}`);
    if (activeTab === 'evo' && evoTab.style.display === 'flex') {
        return;
    }
    activeTab = 'evo';
    setActiveTab(activeTab, pokemonId);
    updateActiveTab(pokemonId);
    const evolutionData = await fetchEvolutionChain(pokemonId);
    if (evolutionData) {
        const evoContent = buildEvolutionChainContent(evolutionData);
        evoTab.innerHTML = evoContent;
    } else {
        evoTab.innerHTML = '<div>No evolution data available.</div>';
    }
}


function buildEvolutionChainContent(evolutionDetails) {
    if (!evolutionDetails || evolutionDetails.length === 0) {
        return '<div>No evolution data available.</div>';
    }
    let htmlContent = '<div class="evolution-chain">';
    evolutionDetails.forEach((detail, index) => {
        if (detail.artwork) {
            htmlContent += `
                <div style="text-align: center;">
                    <img src="${detail.artwork}" alt="${detail.name}">
                    <div class="evo-text">${detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}</div>
                </div>
            `;
            if (index < evolutionDetails.length - 1) {
                htmlContent += `
                <div class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path><path d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"></path></svg></div>
            `}
        }
    });
    htmlContent += '</div>';
    return htmlContent;
}
