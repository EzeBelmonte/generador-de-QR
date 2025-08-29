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
            newTitle.innerHTML = `<h2 class="title-h2 pointer">Configuración</h2>` 
            document.querySelector(".title-h2").style.cursor = "pointer"
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
        document.querySelector(".title-h2").style.cursor = "dafault"

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


// Movimiento con el mouse con el scroll cuando estoy con mouse y resolución <= 768
const menu = document.getElementById("config-container")
const mediaQuery = window.matchMedia("(max-width: 768px)")

function handleWheel(e) {
  if (mediaQuery.matches) { // solo si coincide con la media query
    e.preventDefault()
    menu.scrollLeft += e.deltaY
  }
}

// Agregar listener
menu.addEventListener("wheel", handleWheel, { passive: false })