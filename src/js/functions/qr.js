import { getBackgroundColor, getDotsColor, getCornersSquareColor, getCornersDotColor  } from "./qrColors.js"
import { getDotType, getCornersSquareType, getCornersDotType } from "./qrTypeModCorners.js"

//export let size = 200 // tamaño por defecto del QR

// 📌 Variables globales internas del módulo
let qrCode = null;
let qrContentBackgroundColor = "#759ecc";
let qrContentTextColor = "#000000";

export function createQR(text, size = 200, colorModule1 = "#000000", colorBackground1 = "#ffffff") {
    // mostramos el contenedor general del QR y configuración
    document.getElementById("fullscreen-container").classList.add("active");

    const qrContainer = document.getElementById("qr-code")
    qrContainer.innerHTML = ""

    // logo seleccionado (si existe)
    const logoFile = document.getElementById("logo-file").files[0]
    let logoSrc

    if (logoFile) {
        document.getElementById("clear-logo").style.visibility = "visible"
        logoSrc = URL.createObjectURL(logoFile)
    } else {
        document.getElementById("clear-logo").style.visibility = "hidden"
    }

    // crear instancia de QRCodeStyling
    qrCode = new QRCodeStyling({
        width: size,
        height: size,
        data: text,
        margin: 10, // margen alrededor
        dotsOptions: {
            color: colorModule1,
            type: "square"
        },
        backgroundOptions: {
            color: colorBackground1
        },
        image: logoSrc, // logo opcional
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 4,
            imageSize: 0.25 // 20% del QR
        }
    })

    qrCode.append(qrContainer)

    // guardar texto para futuras actualizaciones
    qrContainer.dataset.qrText = text

    // animación de transición
    animateQR()
}

// ACTUALIZACION EN TIEMPO REAL
export const updateQR = () => {
    const data = document.getElementById("qr-code").dataset.qrText
    const size = Number(document.getElementById("size").value) || 200

    // fondo QR
    let backgroundOptions = getBackgroundColor(gradientBackgroundCheckbox.checked)

    // dots
    const dotsOptions = {
        ...getDotsColor(gradientModuleCheckbox.checked),
        type: getDotType()
    }

    // esquinas ext
    const cornersSquareOptions = {
        ...getCornersSquareColor(gradientPatternExtCheckbox.checked),
        type: getCornersSquareType()
    }

    // esquinas int
    const cornersDotOptions = {
        ...getCornersDotColor(gradientPatternIntCheckbox.checked),
        type: getCornersDotType()
    }

    // logo
    const logoFile = document.getElementById("logo-file").files[0]
    const logoSrc = (logoFile) ? URL.createObjectURL(logoFile) : null

    // actualización del QR
    applyQRCodeUpdate({size, data, dotsOptions, cornersSquareOptions, cornersDotOptions, backgroundOptions, logoSrc})


    // actualización del fondo + texto
    qrContentBackgroundColor = document.getElementById("color-background").value
    qrContentTextColor = document.getElementById("color-text").value
    updateQrContentStyle(!!document.querySelector(".qr-content p"))

    // animación de transición
    animateQR()
}

const applyQRCodeUpdate = ({size, data, dotsOptions, cornersSquareOptions, cornersDotOptions, backgroundOptions, logoSrc}) => {
    qrCode.update({
        data,
        width: size,
        height: size,
        dotsOptions,
        cornersSquareOptions,
        cornersDotOptions,
        backgroundOptions,
        image: logoSrc
    });
}


// resetear configuración del QR
export function resetQR() {
    document.getElementById("fullscreen-container").classList.remove("active")
    
    // Resetear inputs/selects
    document.getElementById("size").value = ""

    document.getElementById("color-background-1").value = "#ffffff"
    document.getElementById("color-background-2").value = "#ffffff"

    document.getElementById("color-module-1").value = "#000000"
    document.getElementById("color-module-2").value = "#000000"

    document.getElementById("pattern-color-ext").value = "#000000"
    document.getElementById("pattern-color-int").value = "#000000"

    document.getElementById("color-background").value = "#759ecc"
    document.getElementById("color-text").value = "#000000"

    document.querySelector('input[name="module-type"][value="square"]').checked = true
    document.querySelector('input[name="pattern-type"][value="square"]').checked = true
    document.querySelector('input[name="dot-pattern-type"][value="square"]').checked = true


    // Limpiar el contenedor del QR
    const qrContainer = document.querySelector(".qr-container")
    qrContainer.innerHTML = ""
}

// agrega fondo y texto si el usuario elige agregarle un texto
export function updateQrContentStyle(hasText = false) {
    // div que contiene el QR
    const qrContent = document.querySelector(".qr-content")
    if (!qrContent) return

    // div que modifica los colores del fondo y texto
    const configDisable = document.querySelector(".config-custom-disabled")
    // inputs de los colores de fondo y texto
    const colorBackgroundInput = document.getElementById("color-background")
    const colorTextInput = document.getElementById("color-text");

    // si hay texto, se actualiza los estilos
    if (hasText) {
        qrContent.style.backgroundColor = qrContentBackgroundColor
        qrContent.style.display = "flex"
        qrContent.style.flexDirection = "column"
        qrContent.style.width = (size + 26) + "px"
        qrContent.style.height = (size + 70) + "px"
        qrContent.style.padding = "13px 13px 0 13px"

        configDisable.style.opacity = "1"
        colorBackgroundInput.disabled = false
        colorTextInput.disabled = false

        // aplicar color de texto al <p>
        const p = qrContent.querySelector("p")
        if (p) { p.style.color = qrContentTextColor }
    } else {
        // sino, se resetea
        configDisable.style.opacity = ".5"
        colorBackgroundInput.disabled = true
        colorTextInput.disabled = true

        qrContent.style.backgroundColor = "transparent"
        qrContent.style.width = size + "px"
        qrContent.style.height = size + "px"
        qrContent.style.padding = "0"
    }
}

export function getQrCode () {
    return qrCode
}

export function getQrContentBackgroundColor() {
    return qrContentBackgroundColor
}

export function getQrContentTextColor() {
    return qrContentTextColor
}

// animación de transición
function animateQR() {
    setTimeout(() => {
        document.getElementById("qr-code").style.opacity = 1
    }, 50); // 50ms
}


// ===============================================================================
// escucha en tiempo real
document.getElementById("fullscreen-close").addEventListener("click", resetQR)

document.getElementById("size").addEventListener("input", updateQR)
document.getElementById("color-background-1").addEventListener("input", updateQR)
document.getElementById("color-background-2").addEventListener("input", updateQR)
document.getElementById("color-module-1").addEventListener("input", updateQR)
document.getElementById("color-module-2").addEventListener("input", updateQR)
document.getElementById("color-pattern-ext-1").addEventListener("input", updateQR)
document.getElementById("color-pattern-ext-2").addEventListener("input", updateQR)
document.getElementById("color-pattern-int-1").addEventListener("input", updateQR)
document.getElementById("color-pattern-int-2").addEventListener("input", updateQR)
document.getElementById("color-background").addEventListener("input", updateQR)
document.getElementById("color-text").addEventListener("input", updateQR)
document.getElementById("logo-file").addEventListener("change", updateQR)

// borrar logo
document.getElementById("clear-logo").addEventListener("click", () => {
    const logoInput = document.getElementById("logo-file")
    logoInput.value = ""      
    updateQR()                
    document.getElementById("clear-logo").style.visibility = "hidden"
})

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

// activar o desactivar el gradiente del fondo
const gradientBackgroundCheckbox = document.getElementById("color-background-gradient")
gradientBackgroundCheckbox.addEventListener("change", updateQR)

// activar o desactivar el gradiente a los módulos
const gradientModuleCheckbox = document.getElementById("color-module-gradient")
gradientModuleCheckbox.addEventListener("change", updateQR)

// activar o desactivar el gradiente a los parrents
const gradientPatternExtCheckbox = document.getElementById("color-pattern-ext-gradient")
gradientPatternExtCheckbox.addEventListener("change", updateQR)

// activar o desactivar el gradiente a los dot de los parrents
const gradientPatternIntCheckbox = document.getElementById("color-pattern-int-gradient")
gradientPatternIntCheckbox.addEventListener("change", updateQR)

// resetear el gradiente del módulo
document.getElementById("color-module-reset").addEventListener("click", () => {
    document.getElementById("color-module-1").value = "#000000"
    document.getElementById("color-module-2").value = "#000000"
        
    updateQR()
})

// resetear el gradiente del fondo
document.getElementById("color-background-reset").addEventListener("click", () => {
    document.getElementById("color-background-1").value = "#ffffff"
    document.getElementById("color-background-2").value = "#ffffff"
        
    updateQR()
})