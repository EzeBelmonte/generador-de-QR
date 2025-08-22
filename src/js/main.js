// Mostrar inputs al cambiar el tipo de QR
document.querySelectorAll('input[name="qr-type"]').forEach(radio => {
    radio.addEventListener("change", showInputs)
})

// Mostrar los inputs correctos al cargar (ej: QR estándar por defecto)
window.addEventListener("DOMContentLoaded", showInputs)


// muestra los inputs cuando se selecciona un tipo de QR
function showInputs() {
    const qrSelect = document.querySelector(".qr-select")
    const qrSelectValue = document.querySelector('input[name="qr-type"]:checked').value

    // limpiar inputs previos si ya existen
    const oldInputs = document.querySelector(".qr-extra")
    if (oldInputs) oldInputs.remove()

    // contenedor para inputs extra
    const div = document.createElement("div")
    div.classList.add("qr-extra")

    if (qrSelectValue === "standarQR") {
        const input = document.createElement("input")
        input.type = "text"
        input.id = "text-standar"
        input.classList.add("qr-text")
        input.placeholder = "Escribe un link o texto"
        div.appendChild(input)
    } else {
        div.innerHTML = `
            <input type="text" id="ssid" class="qr-wifi" placeholder="SSID">
            <input type="text" id="wifiPass" class="qr-wifi" placeholder="Contraseña">

            <fieldset class="mb-3">
                <legend class="mt-3">Tipo de seguridad</legend>
                
                <label>
                    <input type="radio" name="security" value="WPA" checked>
                    WPA/WPA2
                </label>
                
                <label>
                    <input type="radio" name="security" value="WEP">
                    WEP
                </label>
                
                <label>
                    <input type="radio" name="security" value="nopass">
                    Sin contraseña
                </label>
            </fieldset>
        `
    }

    qrSelect.appendChild(div)

    const radios = div.querySelectorAll('input[name="security"]')
    const passInput = div.querySelector("#wifiPass")
    if (radios.length > 0 && passInput) {
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.value === "nopass" && radio.checked) {
                    passInput.disabled = true
                    passInput.value = ""
                    passInput.placeholder = "No requiere contraseña"
                } else {
                    passInput.disabled = false
                    passInput.placeholder = "Contraseña"
                }
            })
        })
    }
}


// GENERADOR DE QR
function generateQR() {
    let content
    const qrSelectValue = document.querySelector('input[name="qr-type"]:checked').value

    if (qrSelectValue === "standarQR") {
       content = document.getElementById("text-standar").value.trim()
        if (content === "") {
            alert("Escribe un texto o link primero.")
            return
        }
    } else {
        // obtener valores
        let ssid = document.getElementById("ssid").value.trim()
        let password = document.getElementById("wifiPass").value.trim()
        let security = document.querySelector('input[name="security"]:checked').value

        if (ssid === "") {
            alert("Escribe el nombre de la red (SSID).")
            return
        }

        if (security === "nopass") {
            content = `WIFI:T:nopass;S:${ssid};H:false;;`
        } else {
            if (password === "") {
                alert("Escribe la contraseña de la red.")
                return
            }
            content = `WIFI:T:${security};S:${ssid};P:${password};H:false;;`
        }
    }
    
    createQR(content)

    document.querySelector(".qr-container").style.display = "flex"
    document.querySelector(".button-download").style.display = "block"
    document.querySelector(".config-container").style.display = "flex"
}


// Crear QR con margen
let qr
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


// ACTUALIZACION EN TIEMPO REAL

// tamaño
document.getElementById("size").addEventListener("input", () => {
    const text = document.getElementById("qrcode").dataset.qrText
    const size = Number(document.getElementById("size").value) || 200
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    createQR(text, size, colorDark, colorLight, 20)
})

// color oscuro
document.getElementById("colorDark").addEventListener("input", () => {
    const text = document.getElementById("qrcode").dataset.qrText
    const size = Number(document.getElementById("size").value) || 200
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    createQR(text, size, colorDark, colorLight, 20)
})

// color claro
document.getElementById("colorLight").addEventListener("input", () => {
    const text = document.getElementById("qrcode").dataset.qrText
    const size = Number(document.getElementById("size").value) || 200
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    createQR(text, size, colorDark, colorLight, 20)
})
