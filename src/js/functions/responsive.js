function handleConfigTitle() {
    const fullscreen = document.getElementById("fullscreen-container") 
    const config = document.getElementById("config-container") 
    const originalTitle = document.getElementById("config-title") 
    
    // ocultar o mostrar según resolución
    if (window.innerWidth <= 768) {
        originalTitle.style.display = "none" 

        // revisar si ya existe el título dinámico
        let newTitle = document.getElementById("new-config-title") 
        if (!newTitle) {
            newTitle = document.createElement("div") 
            newTitle.id = "new-config-title" 
            newTitle.classList.add("new-config-title") 
            newTitle.innerHTML = `<h2 class="title-h2">Configuración</h2>` 
            fullscreen.insertBefore(newTitle, config) 
        }

        // SOLO si existe newTitle, asignamos el click
        if (newTitle) {
            newTitle.onclick = () => {
                config.classList.toggle("expanded") 
                newTitle.classList.toggle("expanded") 
            } 
        }

    } else {
        // restaurar título original
        originalTitle.style.display = "block" 

        // eliminar título dinámico si existe
        const newTitle = document.getElementById("new-config-title") 
        if (newTitle) {
            newTitle.remove() 
        }

        // quitar clase expanded si estaba activa
        config.classList.remove("expanded") 
    }
}

window.addEventListener("resize", handleConfigTitle) 
handleConfigTitle() 
