
let qr

// GENERADOR DE QR
function generateQR() {
    let text = document.getElementById("text").value
    if (text.trim() === "") {
        alert("Escribe un texto o link primero.")
        return
    }
    createQR(text)

    document.querySelector(".button-download").style.display = "block"
    document.querySelector(".config-container").style.display = "flex"
}


// Crear QR con margen funcional
function createQR(text, size = 200, colorDark = "#000000", colorLight = "#ffffff", margin = 20) {
    const qrContainer = document.getElementById("qrcode")
    qrContainer.innerHTML = ""

    // tamaño total del canvas incluyendo margen
    const totalSize = size + margin * 2

    // canvas final
    const canvas = document.createElement("canvas")
    canvas.width = totalSize
    canvas.height = totalSize
    const ctx = canvas.getContext("2d")

    // fondo blanco (quiet zone)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, totalSize, totalSize)

    // canvas temporal para generar el QR sin margin
    const tempDiv = document.createElement("div")
    const tempQR = new QRCode(tempDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel.H
    })

    // tomar el canvas generado por la librería
    const qrCanvas = tempDiv.querySelector("canvas")
    qrCanvas.onload = () => {
        ctx.drawImage(qrCanvas, margin, margin)
        qrContainer.appendChild(canvas)
    }

    // si ya se generó, agregar inmediatamente (para la mayoría de navegadores)
    if (qrCanvas) {
        ctx.drawImage(qrCanvas, margin, margin)
        qrContainer.appendChild(canvas)
    }

    // guardar referencia para descarga
    qr = canvas

    // guardar texto en dataset para futuras configuraciones
    qrContainer.dataset.qrText = text
}


// CONFIGURACIÓN
function configQR() {
    const sizeInput = document.getElementById("size") // input del tamaño
    const sizeValue = sizeInput.value.trim()
    
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    
    // obtener el texto del QR actual
    const qrContainer = document.getElementById("qrcode")
    const text = qrContainer.dataset.qrText || document.getElementById("text").value

    // definir tamaño
    let size
    if (sizeValue === "") {
        size = qr ? qr.width - 40 : 200 // 40 = 2 * margin por defecto
    } else {
        size = Number(sizeValue)
        if (!isFinite(size) || size <= 130) {
            alert("Escribe un número válido y mayor que 0.")
            sizeInput.value = ""
            return
        }
    }

    // generar QR con el mismo texto y nuevo tamaño / colores
    createQR(text, size, colorDark, colorLight, 20)
}


// DESCARGAR QR
function downloadQR() {
    if (!qr) {
        alert("Primero genera un QR.")
        return
    }

    const url = qr.toDataURL("image/png")

    const a = document.createElement("a")
    a.href = url
    a.download = "qr.png"
    a.click()
}
