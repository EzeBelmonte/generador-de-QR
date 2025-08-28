import { setLogoSrc, setGradientBackgroundCheckbox, setGradientModuleCheckbox, setGradientPatternExtCheckbox, setGradientPatternIntCheckbox } from "./qr.js"
import { updateQrContentStyle } from "./updateStyle.js"

export function resetQR() {
    document.getElementById("fullscreen-container").classList.remove("active")

    setGradientBackgroundCheckbox(false)
    setGradientModuleCheckbox(false)
    setGradientPatternExtCheckbox(false)
    setGradientPatternIntCheckbox(false)

    // Resetear inputs/selects
    document.getElementById("size").value = ""

    document.getElementById("color-background-1").value = "#ffffff"
    document.getElementById("color-background-2").value = "#ffffff"
    document.getElementById("color-background-2").disabled = true
    document.getElementById("color-background-gradient").checked = false
    document.getElementById("color-background-angle").disabled = true

    document.getElementById("color-module-1").value = "#000000"
    document.getElementById("color-module-2").value = "#000000"
    document.getElementById("color-module-2").disabled = true
    document.getElementById("color-module-gradient").checked = false
    document.getElementById("color-module-angle").disabled = true

    document.getElementById("color-pattern-ext-1").value = "#000000"
    document.getElementById("color-pattern-ext-2").value = "#000000"
    document.getElementById("color-pattern-ext-2").disabled = true
    document.getElementById("color-pattern-ext-gradient").checked = false
    document.getElementById("color-pattern-ext-angle").disabled = true

    document.getElementById("color-pattern-int-1").value = "#000000"
    document.getElementById("color-pattern-int-2").value = "#000000"
    document.getElementById("color-pattern-int-2").disabled = true
    document.getElementById("color-pattern-int-gradient").checked = false
    document.getElementById("color-pattern-int-angle").disabled = true

    document.getElementById("color-background-text-1").value = "#ffffff"
    document.getElementById("color-background-text-2").value = "#ffffff"
    document.getElementById("color-text").value = "#000000"
    document.getElementById("color-background-text-1").disabled = true
    document.getElementById("color-background-text-2").disabled = true
    document.getElementById("color-text").disabled = true
    document.getElementById("color-background-text-gradient").checked = false
    document.getElementById("color-background-text-gradient").disabled = true
    document.getElementById("color-background-text-angle").disabled = true
    document.getElementById("color-background-text-reset").disabled = true

    const currentSize = Number(document.getElementById("size").value) || 200
    updateQrContentStyle(false, currentSize)

    document.querySelector('input[name="module-type"][value="square"]').checked = true
    document.querySelector('input[name="pattern-type"][value="square"]').checked = true
    document.querySelector('input[name="dot-pattern-type"][value="square"]').checked = true

    setLogoSrc(null)
    const logoInput = document.getElementById("logo-file")
    logoInput.value = ""
    document.getElementById("clear-logo").style.display = "none"

    // Limpiar el contenedor del QR
    const qrContainer = document.querySelector(".qr-container")
    qrContainer.innerHTML = ""

    // cerrar el menu de compartir
    const menu = document.querySelector(".share-menu")
    if (menu) {
        menu.classList.add("hide") // dispara fadeOut
        menu.addEventListener("animationend", () => {
            menu.remove() // elimina después de la animación
        }, { once: true })
    }

    // cerrar, si existe, el div embed-modal
    const embedModal = document.querySelector(".embed-modal")
    if (embedModal) {
            embedModal.classList.add("hide")
            embedModal.addEventListener("animationed", () => {
                embedModal.remove()
            }, { once: true }) 
    }
}