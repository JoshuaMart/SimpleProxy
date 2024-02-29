document.addEventListener('DOMContentLoaded', function() {
    const proxyCheckbox = document.getElementById('proxyToggle');
    const hostInput = document.getElementById('proxyHost');
    const portInput = document.getElementById('proxyPort');

    const colorSquares = document.querySelectorAll('.colorSquare');
    const colorCheckbox = document.getElementById('transparentCheckbox');

    // Load previously selected color
    chrome.storage.local.get('selectedColor', function(data) {
        // If no color is selected (transparent enabled)
        if (data.selectedColor === '') {
            colorCheckbox.checked = false;
            colorSquares.forEach(square => {
                square.style.opacity = '0.5';
                square.style.border = '2px solid #000';
            });
        } else {
            colorCheckbox.checked = true;
            colorSquares.forEach(square => square.style.opacity = '1');
            const activeSquare = Array.from(colorSquares).find(square => square.getAttribute('data-color') === data.selectedColor);
            if (activeSquare) {
                activeSquare.style.border = '2px solid white';
            }
        }
    });

    // Listener for "Transparent" checkbox
    colorCheckbox.addEventListener('change', function() {
        if (!colorCheckbox.checked) { // If the box is not checked, transparent is selected
            chrome.storage.local.set({selectedColor: ''}, function() {
                console.log('Aucune couleur sélectionnée.');
                colorSquares.forEach(square => {
                    square.style.opacity = '0.5';
                    square.style.border = '2px solid #000';
                });
            });
        } else { // Listener for colored squares
            chrome.storage.local.set({selectedColor: null}, function() {
                console.log('Prêt à sélectionner une couleur.');
                colorSquares.forEach(square => {
                    square.style.opacity = '1';
                    square.style.border = '2px solid #000';
                });
            });
        }
    });

    // Listener for colored squares
    colorSquares.forEach(item => {
        item.addEventListener('click', function() {
            if (colorCheckbox.checked) {
                chrome.storage.local.set({selectedColor: item.getAttribute('data-color')}, function() {
                    console.log(`Couleur sélectionnée: ${item.getAttribute('data-color')}`);
                    colorSquares.forEach(square => {
                        square.style.opacity = '1';
                        square.style.border = '2px solid #000';
                    });
                    item.style.border = '2px solid white'; // Highlights the selection
                });
            }
        });
    });

    // Load current state and proxy settings
    chrome.storage.local.get(['proxyEnabled', 'proxyHost', 'proxyPort'], function(data) {
        proxyCheckbox.checked = data.proxyEnabled || false;
        hostInput.value = data.proxyHost || '';
        portInput.value = data.proxyPort || '';
    });

    // Listener for checkbox
    proxyCheckbox.addEventListener('change', function() {
        const proxyEnabled = proxyCheckbox.checked;
        chrome.storage.local.set({
            proxyEnabled: proxyEnabled,
            proxyHost: hostInput.value,
            proxyPort: portInput.value
        });

        chrome.proxy.settings.set({
            value: proxyEnabled ? {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: "http",
                        host: hostInput.value,
                        port: parseInt(portInput.value)
                    },
                    bypassList: ["localhost"]
                }
            } : { mode: "direct" },
            scope: "regular"
        }, function() {});
    });

    // Listeners for input fields
    hostInput.addEventListener('change', function() {
        chrome.storage.local.set({proxyHost: hostInput.value});
    });

    portInput.addEventListener('change', function() {
        chrome.storage.local.set({proxyPort: portInput.value});
    });
});
