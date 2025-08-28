import { updateQR, setLogoSrc, setGradientBackgroundCheckbox, setGradientModuleCheckbox, setGradientPatternExtCheckbox, setGradientPatternIntCheckbox } from "./qr.js"


document.getElementById("size").addEventListener("input", updateQR)
document.getElementById("color-background-1").addEventListener("input", updateQR)
document.getElementById("color-background-2").addEventListener("input", updateQR)
document.getElementById("color-background-angle").addEventListener("input", updateQR)
document.getElementById("color-module-1").addEventListener("input", updateQR)
document.getElementById("color-module-2").addEventListener("input", updateQR)
document.getElementById("color-module-angle").addEventListener("input", updateQR)
document.getElementById("color-pattern-ext-1").addEventListener("input", updateQR)
document.getElementById("color-pattern-ext-2").addEventListener("input", updateQR)
document.getElementById("color-pattern-ext-angle").addEventListener("input", updateQR)
document.getElementById("color-pattern-int-1").addEventListener("input", updateQR)
document.getElementById("color-pattern-int-2").addEventListener("input", updateQR)
document.getElementById("color-pattern-int-angle").addEventListener("input", updateQR)
document.getElementById("color-background-text-1").addEventListener("input", updateQR)
document.getElementById("color-background-text-2").addEventListener("input", updateQR)
document.getElementById("color-background-text-gradient").addEventListener("change", updateQR)
document.getElementById("color-background-text-angle").addEventListener("input", updateQR)
document.getElementById("color-text").addEventListener("input", updateQR)
document.getElementById("logo-file").addEventListener("change", updateQR)

// ======= BORRAR LOGO
document.getElementById("clear-logo").addEventListener("click", () => {
    const logoInput = document.getElementById("logo-file")
    if (!logoInput.value) {
        logoInput.value = ""
        setLogoSrc(null)
    }
    updateQR()                
    document.getElementById("clear-logo").style.display = "none"
})

// ======= ESTILO DE LOS PATTERN Y DOTS
// actualización de los dots
document.querySelectorAll('input[name="module-type"]').forEach(radio => {
    radio.addEventListener("change", updateQR)
})

// actualización de los patterns
document.querySelectorAll('input[name="pattern-type"]').forEach(radio => {
    radio.addEventListener("change", updateQR)
})

// actualización de los dots internos de los patterns
document.querySelectorAll('input[name="dot-pattern-type"]').forEach(radio => {
    radio.addEventListener("change", updateQR)
})

// ======= BOTONES DE RESETEO
// resetear el gradiente del fondo
document.getElementById("color-background-reset").addEventListener("click", () => {
    document.getElementById("color-background-1").value = "#ffffff"
    document.getElementById("color-background-2").value = "#ffffff"
        
    updateQR()
})

// resetear el gradiente del módulo
document.getElementById("color-module-reset").addEventListener("click", () => {
    document.getElementById("color-module-1").value = "#000000"
    document.getElementById("color-module-2").value = "#000000"
        
    updateQR()
})

// resetear el gradiente de los patterns
document.getElementById("color-pattern-ext-reset").addEventListener("click", () => {
    document.getElementById("color-pattern-ext-1").value = "#000000"
    document.getElementById("color-pattern-ext-2").value = "#000000"
        
    updateQR()
})

// resetear el gradiente de los dots de los patterns
document.getElementById("color-pattern-int-reset").addEventListener("click", () => {
    document.getElementById("color-pattern-int-1").value = "#000000"
    document.getElementById("color-pattern-int-2").value = "#000000"
        
    updateQR()
})

// resetear el gradiente del fondo del texto
document.getElementById("color-background-text-reset").addEventListener("click", () => {
    document.getElementById("color-background-text-1").value = "#ffffff"
    document.getElementById("color-background-text-2").value = "#ffffff"
        
    updateQR()
})

// ======= COLOR DE LOS PATTERN Y DOTS
// activar o desactivar el gradiente del fondo
const gradientBackgroundCheckbox = document.getElementById("color-background-gradient")
gradientBackgroundCheckbox.addEventListener("click", () => {
    setGradientBackgroundCheckbox(gradientBackgroundCheckbox.checked)
    updateQR()
})

// activar o desactivar el gradiente a los módulos
const gradientModuleCheckbox = document.getElementById("color-module-gradient")
gradientModuleCheckbox.addEventListener("click", () => {
    setGradientModuleCheckbox(gradientModuleCheckbox.checked)
    updateQR()
})

// activar o desactivar el gradiente a los parrents
const gradientPatternExtCheckbox = document.getElementById("color-pattern-ext-gradient")
gradientPatternExtCheckbox.addEventListener("click", () => {
    setGradientPatternExtCheckbox(gradientPatternExtCheckbox.checked)
    updateQR()
})

// activar o desactivar el gradiente a los dot de los parrents
const gradientPatternIntCheckbox = document.getElementById("color-pattern-int-gradient")
gradientPatternIntCheckbox.addEventListener("click", () => {
    setGradientPatternIntCheckbox(gradientPatternIntCheckbox.checked)
    updateQR()
})
