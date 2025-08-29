import { getTextColor } from "./qr.js"

export function updateQrContentStyle(hasText = false, size = 300) {
    // div que contiene el QR
    const qrContent = document.querySelector(".qr-content")

    if (!qrContent || size > 800) return

    const textColor = getTextColor()
    const configDisabled = document.querySelectorAll(".config-custom-disabled")

    // inputs de los colores de fondo y texto
    const colorBackgroundText1 = document.getElementById("color-background-text-1")
    const colorBackgroundText2 = document.getElementById("color-background-text-2")
    const gradientBackgroundTextCheckbox = document.getElementById("color-background-text-gradient")
    const backgroundTextColorAngle = document.getElementById("color-background-text-angle")
    const colorText = document.getElementById("color-text")
    const buttonBackgroundTextReset =  document.getElementById("color-background-text-reset")

    size = Math.max(300, Math.min(340, size))

    const ctxMargin = Math.floor(size / 10)
    const margin = Math.max(20, Math.min(80, ctxMargin))

    // Calcular márgenes dinámicos
    const extraTextSpace = hasText ? (size / 10 + 50) : 0

    // si hay texto, se actualiza los estilos
    if (hasText) {
        // quitar grisado del fieldset
        configDisabled.forEach(fieldset => fieldset.style.opacity = "1")

        buttonBackgroundTextReset.disabled = false
        gradientBackgroundTextCheckbox.disabled = false
        backgroundTextColorAngle.disabled = false

        // Gradiente
        if (gradientBackgroundTextCheckbox.checked) {
            colorBackgroundText2.disabled = false
            // Ajuste de ángulo para que coincida con canvas
            const cssAngle = (parseFloat(backgroundTextColorAngle.value) + 90 + 360) % 360
            qrContent.style.background = `linear-gradient(${cssAngle}deg, ${colorBackgroundText1.value}, ${colorBackgroundText2.value})`
        } else {
            colorBackgroundText2.disabled = true
            backgroundTextColorAngle.disabled = true
            qrContent.style.background = colorBackgroundText1.value
        }

        // Tamaño dinámico igual al canvas
        qrContent.style.display = "flex"
        qrContent.style.flexDirection = "column"
        qrContent.style.width =  `${(size + margin)}px`
        qrContent.style.height = `${(size + margin + extraTextSpace)}px`
        qrContent.style.padding = `${margin/2}px 0 0 0`
        qrContent.style.alignItems = "center" // centrar QR horizontalmente

        colorBackgroundText1.disabled = false
        colorText.disabled = false

        // Aplicar color de texto y posición
        const p = qrContent.querySelector("p")
        if (p) {
            p.style.fontSize = `${size / 10}px`
            p.style.color = textColor
            p.style.margin = "0 0 20px 0"
            p.style.paddingTop = `${(margin /2)}px` // colocar debajo del QR
            p.style.textAlign = "center"
        }
    } else {
        configDisabled.forEach(fieldset => fieldset.style.opacity = ".5")

        backgroundTextColorAngle.disabled = true
        buttonBackgroundTextReset.disabled = true
        gradientBackgroundTextCheckbox.disabled = true

        colorBackgroundText1.disabled = true
        colorBackgroundText2.disabled = true
        colorText.disabled = true

        qrContent.style.background = "transparent"
        qrContent.style.width = size + "px"
        qrContent.style.height = size + "px"
        qrContent.style.padding = "0"
    }

}