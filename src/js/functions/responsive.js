// agrega la funcionalidad de abrir y cerrar el menu cuando esta en resoluciones bajas
const configContainer = document.getElementById("config-container");
//const configContent = document.getElementById("config-content");

if (window.innerWidth <= 480) {
    const fullscreen = document.getElementById("fullscreen-container");
    const config = document.getElementById("config-container"); // para referencia a la hora de insertar el div
    
    const originalTitle = document.getElementById("config-title");
    // se oculta el div original
    originalTitle.style.display = "none"

    // se crea nuevo bóton
    const newTitleContainer = document.createElement("div")
    newTitleContainer.id = "new-config-title"
    newTitleContainer.classList.add("new-config-title")
    newTitleContainer.innerHTML = `
        <h2 class="title-h2">Configuración</h2>
    `

    // Insertar antes de config-container
    fullscreen.insertBefore(newTitleContainer, config);

    // solo en móvil
    newTitleContainer.addEventListener("click", () => {
        configContainer.classList.toggle("expanded")
        newTitleContainer.classList.toggle("expanded")
        //configContent.classList.add("expanded");
    });
}