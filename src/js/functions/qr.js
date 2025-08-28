import { getBackgroundColor, getDotsColor, getCornersSquareColor, getCornersDotColor  } from "./qrColors.js"
import { getDotType, getCornersSquareType, getCornersDotType } from "./qrTypeModCorners.js"
import { manageExportOptions } from "./manageExportOptions.js"
import { updateQrContentStyle } from "./updateStyle.js"


// variables globales internas del módulo
let gradientBackgroundCheckbox = false
let gradientModuleCheckbox = false
let gradientPatternExtCheckbox = false
let gradientPatternIntCheckbox = false


let logoSrc
let size
let qrCode = null
let backgroundTextColor1 = "#ffffff"
let backgroundTextColor2 = "#ffffff"
let gradientBackgroundTextCheckbox
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
        const currentSize = Number(document.getElementById("size").value) || 200

        if (text === "") {
            if (qrParagraph) {
                qrParagraph.remove()
                qrParagraph = null
                // pasar tamaño real al resetear
                updateQrContentStyle(false, currentSize)
            }
        } else {
            if(!qrParagraph) {
                qrParagraph = document.createElement("p")
                qrContent.appendChild(qrParagraph)
            }

            qrParagraph.textContent = text;
            // usar el tamaño actual (no la variable global indefinida)
            updateQrContentStyle(true, currentSize)
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
    let backgroundOptions = getBackgroundColor(gradientBackgroundCheckbox, colorBackgroundAngle)

    // dots
    const colorModuleAngle = document.getElementById("color-module-angle")
    const dotsOptions = {
        ...getDotsColor(gradientModuleCheckbox, colorModuleAngle),
        type: getDotType()
    }

    // esquinas ext
    const colorPatternExtAngle = document.getElementById("color-pattern-ext-angle")
    const cornersSquareOptions = {
        ...getCornersSquareColor(gradientPatternExtCheckbox, colorPatternExtAngle),
        type: getCornersSquareType()
    }

    // esquinas int
    const colorPatternIntAngle = document.getElementById("color-pattern-int-angle")
    const cornersDotOptions = {
        ...getCornersDotColor(gradientPatternIntCheckbox, colorPatternIntAngle),
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
    gradientBackgroundTextCheckbox = document.getElementById("color-background-text-gradient")
    backgroundTextColorAngle = document.getElementById("color-background-text-angle").value
    textColor = document.getElementById("color-text").value
    updateQrContentStyle(!!document.querySelector(".qr-content p"), size)

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


// ======= SETTERS Y GETTERS =======
// setters
export function setLogoSrc(value) {
    logoSrc = value
}

export function setGradientBackgroundCheckbox(value) {
    gradientBackgroundCheckbox = value
}

export function setGradientModuleCheckbox(value) {
    gradientModuleCheckbox = value
}

export function setGradientPatternExtCheckbox(value) {
    gradientPatternExtCheckbox = value
}

export function setGradientPatternIntCheckbox(value) {
    gradientPatternIntCheckbox = value
}


// getters
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
