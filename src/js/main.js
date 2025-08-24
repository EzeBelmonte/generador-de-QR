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
    } 

    if (qrSelectValue === "wifiQR") {
        div.innerHTML = `
            <input type="text" id="ssid" class="qr-wifi" placeholder="SSID">
            <input type="text" id="wifiPass" class="qr-wifi" placeholder="Contraseña">

            <fieldset class="mb-3">
                <legend class="mt-3">Tipo de seguridad</legend>
                
                <label>
                    <input type="radio" name="security" value="WPA" checked> WPA/WPA2
                </label>
                
                <label>
                    <input type="radio" name="security" value="WEP"> WEP
                </label>
                
                <label>
                    <input type="radio" name="security" value="nopass"> Sin contraseña
                </label>
            </fieldset>
        `
    }

    if (qrSelectValue === "vcardQR") {
        div.innerHTML = `
            <div class="qr-vcard">
                <div class="qr-vcard-fullname">
                    <input type="text" id="vcard-name" placeholder="Nombre">
                    <input type="text" id="vcard-lastname" placeholder="Apellido">
                </div>
                <input type="text" id="vcard-phone" placeholder="Teléfono">
            </div>
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
    // creacion del div que va a contener el QR junto al botón para descargar
    const qrContainer = document.querySelector(".qr-container")
    qrContainer.innerHTML = `
        <div id="qrcode"></div>
        <button onclick="downloadQR()" class="button-download">Descargar QR</button>
    `

    let content
    const qrSelectValue = document.querySelector('input[name="qr-type"]:checked').value

    if (qrSelectValue === "standarQR") {
       content = document.getElementById("text-standar").value.trim()
        if (content === "") {
            alert("Escribe un texto o link primero.")
            return
        }
    }

    if (qrSelectValue === "wifiQR") {
        // obtener valores
        let ssid = document.getElementById("ssid").value.trim()
        let password = document.getElementById("wifiPass").value.trim()
        let security = document.querySelector('input[name="security"]:checked').value

        const passInput = document.getElementById("wifiPass")
        passInput.disabled = security === "nopass"
        if(security === "nopass") passInput.value = ""

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

    if (qrSelectValue === "vcardQR") {
        const name = document.getElementById("vcard-name").value.trim()
        const lastname = document.getElementById("vcard-lastname").value.trim()
        const phone = document.getElementById("vcard-phone").value.trim()

        content = 
            "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            "N:" + lastname + ";" + name + ";;;\n" +
            "FN:" + name + " " + lastname + "\n" +
            "TEL;TYPE=CELL:" + phone + "\n" +
            "END:VCARD"
    }
    
    createQR(content)

    document.querySelector(".qr-container").style.display = "flex"
    document.querySelector(".button-download").style.display = "block"
    document.querySelector(".config-container").style.display = "flex"
}


// instancia global
let qrCode

// Crear QR
function createQR(text, size = 200, colorDark = "#000000", colorLight = "#ffffff") {
    const qrContainer = document.getElementById("qrcode")
    qrContainer.innerHTML = ""

    // logo seleccionado (si existe)
    const logoFile = document.getElementById("logo-file").files[0]
    let logoSrc = null

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
            color: colorDark,
            type: "square"
        },
        backgroundOptions: {
            color: colorLight
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

// CONFIGURACIÓN
function configQR() {
    const sizeInput = document.getElementById("size")
    const sizeValue = sizeInput.value.trim()
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    const qrContainer = document.getElementById("qrcode")
    const text = qrContainer.dataset.qrText || "Texto de prueba"
    const dot = document.querySelector('input[name="module-type"]:checked').value
    const pattern = document.querySelector('input[name="pattern-type"]:checked').value
    const dotPattern = document.querySelector('input[name="dot-pattern-type"]:checked').value

    // cambio de tamaño
    let size = 200
    if (sizeValue) {
        size = Number(sizeValue)
        if (!isFinite(size) || size <= 130) {
            alert("Escribe un número válido y mayor que 130.")
            sizeInput.value = ""
            return
        }
    }

    // cambio de dot
    let dots, patterns, dotPatterns

    dots = (dot === "square") ? "square" : "dots"
    patterns = (pattern === "square") ? "square" : "extra-rounded"
    dotPatterns = (dotPattern === "square") ? "square" : "dots"

    const logoFile = document.getElementById("logo-file").files[0]
    let logoSrc = null
    if (logoFile) logoSrc = URL.createObjectURL(logoFile)

    qrCode.update({
        data: text,
        width: size,
        height: size,
        dotsOptions: { color: colorDark, type: dots },
        cornersSquareOptions: { color: colorDark, type: patterns }, // redondea los cuadrados grandes
        cornersDotOptions: { color: colorDark, type: dotPatterns }, // el puntito central del patrón de esquina
        backgroundOptions: { color: colorLight },
        image: logoSrc,
    })

    // animación de transición
    animateQR()
}

// DESCARGAR QR
function downloadQR() {
    if (!qrCode) {
        alert("Primero genera un QR.")
        return
    }
    qrCode.download({ name: "qr", extension: "png" })
}

// ACTUALIZACION EN TIEMPO REAL
const updateQR = () => {
    const text = document.getElementById("qrcode").dataset.qrText
    const size = Number(document.getElementById("size").value) || 200
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    const dot = document.querySelector('input[name="module-type"]:checked').value
    const pattern = document.querySelector('input[name="pattern-type"]:checked').value
    const dotPattern = document.querySelector('input[name="dot-pattern-type"]:checked').value

    // cambio de dot
    let dots, patterns, dotPatterns
    dots = (dot === "square") ? "square" : "dots"
    patterns = (pattern === "square") ? "square" : "extra-rounded"
    dotPatterns = (dotPattern === "square") ? "square" : "dots"

    const logoFile = document.getElementById("logo-file").files[0]
    let logoSrc = null
    if (logoFile) logoSrc = URL.createObjectURL(logoFile)

    qrCode.update({
        data: text,
        width: size,
        height: size,
        dotsOptions: { color: colorDark, type: dots },
        cornersSquareOptions: { color: colorDark, type: patterns },
        cornersDotOptions: { color: colorDark, type: dotPatterns },
        backgroundOptions: { color: colorLight },
        image: logoSrc
    })

    // animación de transición
    animateQR()
}

document.getElementById("size").addEventListener("input", updateQR)
document.getElementById("colorDark").addEventListener("input", updateQR)
document.getElementById("colorLight").addEventListener("input", updateQR)
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


// animación de transición
function animateQR() {
    setTimeout(() => {
        document.getElementById("qrcode").style.opacity = 1
    }, 50); // 50ms
}
