import { getBackgroundColor, getDotsColor, getCornersSquareColor, getCornersDotColor  } from "./qrColors.js"
import { getDotType, getCornersSquareType, getCornersDotType } from "./qrTypeModCorners.js"
import { manageExportOptions } from "./manageExportOptions.js"

//export let size = 200 // tamaño por defecto del QR

// variables globales internas del módulo
let logoSrc
let qrCode = null
let backgroundTextColor1 = "#ffffff"
let backgroundTextColor2 = "#ffffff"
let backgroundTextColorAngle
let textColor = "#000000"


export function generateQR(content) {
    // botón de descarga e impresion
    document.querySelectorAll("button[data-action]").forEach(btn => {
        btn.addEventListener("click", (event) => {
            manageExportOptions(
                event,
                getQrCode(),
                {
                    color1: getBackgroundTextColor1(),
                    color2: getBackgroundTextColor2(),
                    isGradient: getGradientBackgroundTextCheckbox().checked,
                    angle: Number(getBackgroundTextColorAngle()) || 0
                },
                getTextColor()
            )
        })
    })


    // Crear p para mostrar el texto en tiempo real
    const qrContent = document.querySelector(".qr-content")
    const qrTextInput = document.getElementById("qr-text")

    let qrParagraph = null

    qrTextInput.addEventListener("input", () => {
        const text = qrTextInput.value.trim()

        if (text === "") {
            // eliminar <p> si existe
            if (qrParagraph) {
                qrParagraph.remove()
                qrParagraph = null
                // actializar el estilo del contenedor del QR + texto
                updateQrContentStyle(false)
            }
        } else {
            // crear etiqueta <p> si es que no existe y hay texto
            if(!qrParagraph) {
                qrParagraph = document.createElement("p")
                qrContent.appendChild(qrParagraph)
            }

            // actualizar contenido del <p>
            qrParagraph.textContent = text;
            // actializar el estilo del contenedor del QR + texto
            updateQrContentStyle(true)
        }
    })

    createQR(content)
}

export function createQR(text, size = 200, colorModule1 = "#000000", colorBackground1 = "#ffffff") {
    // mostramos el contenedor general del QR y configuración
    document.getElementById("fullscreen-container").classList.add("active")

    const qrContainer = document.getElementById("qr-code")
    qrContainer.innerHTML = ""

    // logo seleccionado (si existe)
    const logoFile = document.getElementById("logo-file").files[0]

    if (logoFile) {
        document.getElementById("clear-logo").style.display = "block"
        logoSrc = URL.createObjectURL(logoFile)
    } else {
        document.getElementById("clear-logo").style.display = "none"
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
        },
        qrOptions: {
            errorCorrectionLevel: "H" // usar "L", "M", "Q" o "H"
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
    const colorBackgroundAngle = document.getElementById("color-background-angle").value
    let backgroundOptions = getBackgroundColor(gradientBackgroundCheckbox.checked, colorBackgroundAngle)

    // dots
    const colorModuleAngle = document.getElementById("color-module-angle")
    const dotsOptions = {
        ...getDotsColor(gradientModuleCheckbox.checked, colorModuleAngle),
        type: getDotType()
    }

    // esquinas ext
    const colorPatternExtAngle = document.getElementById("color-pattern-ext-angle")
    const cornersSquareOptions = {
        ...getCornersSquareColor(gradientPatternExtCheckbox.checked, colorPatternExtAngle),
        type: getCornersSquareType()
    }

    // esquinas int
    const colorPatternIntAngle = document.getElementById("color-pattern-int-angle")
    const cornersDotOptions = {
        ...getCornersDotColor(gradientPatternIntCheckbox.checked, colorPatternIntAngle),
        type: getCornersDotType()
    }

    // logo
    const logoFile = document.getElementById("logo-file").files[0]
    if (logoFile) { 
        document.getElementById("clear-logo").style.display = "block"
        logoSrc =  URL.createObjectURL(logoFile)
    } else {
        document.getElementById("clear-logo").style.display = "none"
    }

    // actualización del QR
    applyQRCodeUpdate({size, data, dotsOptions, cornersSquareOptions, cornersDotOptions, backgroundOptions, logoSrc})


    // actualización del fondo + texto
    backgroundTextColor1 = document.getElementById("color-background-text-1").value
    backgroundTextColor2 = document.getElementById("color-background-text-2").value
    backgroundTextColorAngle = document.getElementById("color-background-text-angle").value
    textColor = document.getElementById("color-text").value
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


// agrega fondo y texto si el usuario elige agregarle un texto
export function updateQrContentStyle(hasText = false) {
    // div que contiene el QR
    const qrContent = document.querySelector(".qr-content")
    if (!qrContent) return

    // div que modifica los colores del fondo y texto
    const configDisabled = document.querySelectorAll(".config-custom-disabled")
    // inputs de los colores de fondo y texto
    const colorBackgroundText1 = document.getElementById("color-background-text-1")
    const colorBackgroundText2 = document.getElementById("color-background-text-2")
    const backgroundTextColorAngle = document.getElementById("color-background-text-angle")
    const colorText = document.getElementById("color-text")
    // boton de resetear gradiente de fondo y texto
    const buttonBackgroundTextReset =  document.getElementById("color-background-text-reset")

    // si hay texto, se actualiza los estilos
    if (hasText) {
        buttonBackgroundTextReset.disabled = false // habilitar el boton de resetear 
        gradientBackgroundTextCheckbox.disabled = false // habilitar el check de gradiente
        backgroundTextColorAngle.disabled = false // hablitar el selector de ángulos
        if (gradientBackgroundTextCheckbox.checked) {
            colorBackgroundText2.disabled = false
            qrContent.style.background = `linear-gradient(${backgroundTextColorAngle.value}deg, ${colorBackgroundText1.value}, ${colorBackgroundText2.value})`
        } else {
            colorBackgroundText2.disabled = true
            backgroundTextColorAngle.disabled = true
            qrContent.style.background = colorBackgroundText1.value
        }
        qrContent.style.display = "flex"
        qrContent.style.flexDirection = "column"
        qrContent.style.width = (size + 26) + "px"
        qrContent.style.height = (size + 70) + "px"
        qrContent.style.padding = "13px 13px 0 13px"

        configDisabled.forEach(fieldset => fieldset.style.opacity = "1") // habilitar todos los fieldsets deshabilitados
        colorBackgroundText1.disabled = false // desactivamos el check para que no sea clickeable
        colorText.disabled = false

        // aplicar color de texto al <p>
        const p = qrContent.querySelector("p")
        if (p) { p.style.color = textColor }
    } else {
        // sino, se resetea
        backgroundTextColorAngle.disabled = true
        buttonBackgroundTextReset.disabled = true
        gradientBackgroundTextCheckbox.disabled = true
        configDisabled.forEach(fieldset => fieldset.style.opacity = ".5")
        colorBackgroundText1.disabled = true
        colorBackgroundText2.disabled = true
        colorText.disabled = true

        qrContent.style.background = "transparent"
        qrContent.style.width = size + "px"
        qrContent.style.height = size + "px"
        qrContent.style.padding = "0"
    }
}

export function setLogoSrc(value) {
    logoSrc = value
}

export function getQrCode() {
    return qrCode
}

export function getGradientBackgroundTextCheckbox() {
    return gradientBackgroundTextCheckbox
}

export function getBackgroundTextColor1() {
    return backgroundTextColor1
}

export function getBackgroundTextColor2() {
    return backgroundTextColor2
}

export function getBackgroundTextColorAngle() {
    return backgroundTextColorAngle
}

export function getTextColor() {
    return textColor
}

// animación de transición
function animateQR() {
    setTimeout(() => {
        document.getElementById("qr-code").style.opacity = 1
    }, 50); // 50ms
}


// ===============================================================================
// escucha en tiempo real
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
document.getElementById("color-background-text-angle").addEventListener("input", updateQR)
document.getElementById("color-text").addEventListener("input", updateQR)
document.getElementById("logo-file").addEventListener("change", updateQR)

// borrar logo
document.getElementById("clear-logo").addEventListener("click", () => {
    const logoInput = document.getElementById("logo-file")
    if (logoSrc) {
        logoInput.value = ""
        logoSrc = null
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

// ======= COLOR DE LOS PATTERN Y DOTS
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

// activar o desactivar el gradiente del fondo del texto
const gradientBackgroundTextCheckbox = document.getElementById("color-background-text-gradient")
gradientBackgroundTextCheckbox.addEventListener("change", updateQR)


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