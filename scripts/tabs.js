let activeTab = 'about';

function setActiveTab(tabName, id) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    const activeTabElement = document.getElementById(`${tabName}TabButton${id}`);
    if (activeTabElement) {
        activeTabElement.classList.add('active-tab');
    }
}


function showAbout(id) {
    hideAllTabs(id);
    if (activeTab === 'about' && document.getElementById(`aboutTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'about';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


function showStats(id) {
    if (activeTab === 'stats' && document.getElementById(`statsTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'stats';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


function showMoves(id) {
    if (activeTab === 'moves' && document.getElementById(`movesTab${id}`).style.display === 'flex') {
        return;
    }
    activeTab = 'moves';
    updateActiveTab(id);
    setActiveTab(activeTab, id);
}


function hideAllTabs(id) {
    ['aboutTab', 'statsTab', 'movesTab', 'evoTab'].forEach(tab => {
        const element = document.getElementById(`${tab}${id}`);
        if (element) {
            element.style.display = 'none';
        }
    });
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
                renderChart(base_stat, name_stat, id);
            }
        } else if (activeTab === 'moves') {
            const pokemon = pokemonCache[id];
            if (pokemon) {
                renderMoves(pokemon, id);
            }
        }
    }
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