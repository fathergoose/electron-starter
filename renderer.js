const information = document.getElementById("info");
information.innerText = `This app is running Chrome v${versions.chrome()}, node v${versions.node()} and electron v${versions.electron()} `;
