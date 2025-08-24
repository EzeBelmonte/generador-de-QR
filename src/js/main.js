// VARIABLES GLOBALES
let qrCode // instancia de QR
let logoSrc = null // logo
let size = 200 // tamaño por defecto del QR

let qrContentBackgroundColor = "#759ecc"
let qrContentTextColor = "#000000"

// Mostrar inputs al cambiar el tipo de QR
document.querySelectorAll('input[name="qr-type"]').forEach(radio => {
    radio.addEventListener("change", showInputs)
})

// Mostrar los inputs correctos al cargar (ej: QR estándar por defecto)
window.addEventListener("DOMContentLoaded", showInputs)


// muestra los inputs cuando se selecciona un tipo de QR
function showInputs() {
    const qrSelect = document.querySelector(".qr-type-content")
    const qrSelectValue = document.querySelector('input[name="qr-type"]:checked').value

    // limpiar inputs previos si ya existen
    const oldInputs = document.querySelector(".qr-extra")
    if (oldInputs) oldInputs.remove()

    // contenedor para inputs extra
    const div = document.createElement("div")
    div.classList.add("qr-extra")

    if (qrSelectValue === "standarQR") {
        div.innerHTML = `
            <input type="text" id="text-standar" class="qr-text" placeholder="Escribe un link o texto">
        `
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

    if (qrSelectValue === "socialQR") {
        div.innerHTML = `
            <div class="social-qr">
                <div class="social-opt-content">
                    <label for="social-select">Generar QR para:</label>
                    <select id="social-select">
                        <option value="" selected disabled>Elegir</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>
                </div>
                        
                <input type="text" id="social-input" class="qr-text" disabled>
            </div>
        `

        // detectar cambio en el selector
        const socialSelect = div.querySelector("#social-select")
        const socialInput = div.querySelector("#social-input")

        socialSelect.addEventListener("change", () => {
            socialInput.disabled = false
            socialInput.value = ""
            if (socialSelect.value === "whatsapp") {
                socialInput.placeholder = "Escribe tu número (con código de país sin el)"
            } else {
                socialInput.placeholder = "Escribe tu usuario"
            }
        })

        socialInput.addEventListener("input", () => {
            if (socialSelect.value === "whatsapp") {
                // Validar que empiece con + y tenga solo números después
                const regex = /^\+\d+$/
                if (!regex.test(socialInput.value)) {
                    socialInput.setCustomValidity("Ingresa un número válido con código de país, por ejemplo +54901123456789")
                } else {
                    socialInput.setCustomValidity("")
                }
            } else {
                socialInput.setCustomValidity("");// limpiar validación para otras redes
            }
        })

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

document.getElementById("button-gen").addEventListener("click", generateQR)
// GENERADOR DE QR
function generateQR() {
    // creacion del div que va a contener el QR junto al botón para descargar
    const qrContainer = document.querySelector(".qr-container")
    qrContainer.innerHTML = `
        <div class="qr-content">
            <div id="qrcode"></div>
        </div>

        <input type="text" id="qr-text" placeholder="Texto (Opcional)">

        <button id="button-download" class="button-download">Descargar QR</button>
        <button id="button-print" class="button-print">Imprimir QR</button>
    `
    // botón de descarga
    const downloadButton = document.getElementById("button-download")
    downloadButton.addEventListener("click", downloadQR)

    // botón de impresión
    const printButton = document.getElementById("button-print")
    printButton.addEventListener("click", printQR)
    // IMPRIMIR QR
    function printQR() {
        if (!qrCode) {
            alert("Primero genera un QR.");
            return;
        }

        const text = document.getElementById("qr-text").value
        if (text !== "") {
            // Crear imagen a partir del QR
            qrCode.getRawData("png").then(blob => {
                const img = new Image()
                img.onload = () => {
                    // Crear canvas
                    const canvas = document.createElement("canvas")
                    const margin = 26
                    canvas.width = img.width + margin
                    canvas.height = img.height + 70
                    const ctx = canvas.getContext("2d")

                    // fondo
                    ctx.fillStyle = qrContentBackgroundColor
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // QR
                    ctx.drawImage(img, margin/2, margin/2)

                    // texto
                    ctx.font = "20px Arial"
                    ctx.fillStyle = qrContentTextColor
                    ctx.textAlign = "center"
                    ctx.fillText(text, canvas.width / 2, img.height + 47)

                    // abrir nueva pestaña y mandar a imprimir
                    const dataUrl = canvas.toDataURL("image/png")
                    const printWindow = window.open("", "_blank")
                    printWindow.document.write(`
                        <html>
                            <head><title>Imprimir QR</title></head>
                            <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;">
                                <img src="${dataUrl}" onload="window.print();window.close()" />
                            </body>
                        </html>
                    `)
                    printWindow.document.close()
                }
                img.src = URL.createObjectURL(blob)
            })
        } else {
            // caso sin texto, más simple
            qrCode.getRawData("png").then(blob => {
                const url = URL.createObjectURL(blob)
                const printWindow = window.open("", "_blank")
                printWindow.document.write(`
                    <html>
                        <head><title>Imprimir QR</title></head>
                        <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;">
                            <img src="${url}" onload="window.print();window.close()" />
                        </body>
                    </html>
                `)
                printWindow.document.close()
            })
        }
    }



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

    if (qrSelectValue === "socialQR") {
        const socialSelect = document.getElementById("social-select");
        const selectedValue = socialSelect.value;

        const input = document.getElementById("social-input").value.trim()

        let option
        if (selectedValue === "whatsapp") {
            option = "https://wa.me/"
            logoSrc = "src/img/whatsapp.png"
        }
        if (selectedValue === "linkedin") {
            option = "https://www.linkedin.com/in/"
            logoSrc = "src/img/linkedin.png"
        }
        if (selectedValue === "instagram") {
            option = "https://www.instagram.com/"
            logoSrc = "src/img/instagram.png"
        }
        if (selectedValue === "facebook") {
            option = "https://www.facebook.com/"
            logoSrc = "src/img/facebook.png"
        }

        content = option+input
    }
    
    createQR(content)

    document.querySelector(".qr-container").style.display = "flex"
    document.querySelector(".button-download").style.display = "block"
    document.querySelector(".config-container").style.display = "flex"
}

// Crear QR
function createQR(text, size = 200, colorDark = "#000000", colorLight = "#ffffff") {
    // mostramos el contenedor general del QR y configuración
    document.getElementById("fullscreen-container").classList.add("active");

    const qrContainer = document.getElementById("qrcode")
    qrContainer.innerHTML = ""

    // logo seleccionado (si existe)
    const logoFile = document.getElementById("logo-file").files[0]

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

// Botón que cierra el contenedor general del QR y configuración
document.getElementById("fullscreen-close").addEventListener("click", () => {
    document.getElementById("fullscreen-container").classList.remove("active")

    // Resetear inputs/selects
    document.getElementById("size").value = ""

    document.getElementById("colorLight").value = "#ffffff"
    document.getElementById("colorDark").value = "#000000"

    document.getElementById("colorBackground").value = "#759ecc"
    document.getElementById("colorText").value = "#000000"

    document.querySelector('input[name="module-type"][value="square"]').checked = true
    document.querySelector('input[name="pattern-type"][value="square"]').checked = true
    document.querySelector('input[name="dot-pattern-type"][value="square"]').checked = true


    // Limpiar el contenedor del QR
    const qrContainer = document.querySelector(".qr-container")
    qrContainer.innerHTML = ""
})

// CONFIGURACIÓN
function configQR() {
    const sizeInput = document.getElementById("size")
    const sizeValue = sizeInput.value.trim()
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    const colorBackground = document.getElementById("colorBackground").value
    const colorText = document.getElementById("colorText").value
    const qrContent = document.getElementById("qrcode")
    const text = qrContent.dataset.qrText || "Texto de prueba"
    const dot = document.querySelector('input[name="module-type"]:checked').value
    const pattern = document.querySelector('input[name="pattern-type"]:checked').value
    const dotPattern = document.querySelector('input[name="dot-pattern-type"]:checked').value

    // cambio de tamaño
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
    logoSrc = null
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

    // actializar el estilo del contenedor del QR + texto
    qrContentBackgroundColor = colorBackground
    qrContentTextColor = colorText
    updateQrContentStyle(!!document.querySelector(".qr-content p"))

    // animación de transición
    animateQR()
}

// DESCARGAR QR
function downloadQR() {
    if (!qrCode) {
        alert("Primero genera un QR.");
        return;
    }

    const text = document.getElementById("qr-text").value
    if (text !== "") {
        // Crear imagen a partir del QR
        qrCode.getRawData("png").then(blob => {
            const img = new Image()
            img.onload = () => {
                // Crear canvas
                const canvas = document.createElement("canvas")
                const margin = 26
                canvas.width = img.width + margin
                canvas.height = img.height + 70 // espacio para el texto
                const ctx = canvas.getContext("2d")

                // cambiar color de fondo
                ctx.fillStyle = qrContentBackgroundColor // el color del canvas
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // dibujar QR
                ctx.drawImage(img, margin/2, margin/2)

                // dibujar texto debajo
                ctx.font = "20px Arial"
                ctx.fillStyle = qrContentTextColor
                ctx.textAlign = "center"
                ctx.fillText(text, canvas.width / 2, img.height + 47)

                // descargar
                const link = document.createElement("a")
                link.download = "qr-con-text.png"
                link.href = canvas.toDataURL("image/png")
                link.click()
            }
            img.src = URL.createObjectURL(blob)
        })
    } else {
        qrCode.download({ name: "qr", extension: "png" })
    }

}


// ACTUALIZACION EN TIEMPO REAL
const updateQR = () => {
    const text = document.getElementById("qrcode").dataset.qrText
    size = Number(document.getElementById("size").value) || 200
    const colorDark = document.getElementById("colorDark").value
    const colorLight = document.getElementById("colorLight").value
    const colorBackground = document.getElementById("colorBackground").value
    const colorText = document.getElementById("colorText").value
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

    // actualización del fondo + texto
    qrContentBackgroundColor = colorBackground
    qrContentTextColor = colorText
    updateQrContentStyle(!!document.querySelector(".qr-content p"))

    // animación de transición
    animateQR()
}

document.getElementById("size").addEventListener("input", updateQR)
document.getElementById("colorDark").addEventListener("input", updateQR)
document.getElementById("colorLight").addEventListener("input", updateQR)
document.getElementById("colorBackground").addEventListener("input", updateQR)
document.getElementById("colorText").addEventListener("input", updateQR)
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


// =================== FUNCIONES =====================
// animación de transición
function animateQR() {
    setTimeout(() => {
        document.getElementById("qrcode").style.opacity = 1
    }, 50); // 50ms
}

// actualizar el contenedor de QR + texto
function updateQrContentStyle(hasText = false) {
    const qrContent = document.querySelector(".qr-content")
    if (!qrContent) return

    if (hasText) {
        qrContent.style.backgroundColor = qrContentBackgroundColor
        qrContent.style.display = "flex"
        qrContent.style.flexDirection = "column"
        qrContent.style.width = (size + 26) + "px"
        qrContent.style.height = (size + 70) + "px"
        qrContent.style.padding = "13px 13px 0 13px"

        // aplicar color de texto al <p>
        const p = qrContent.querySelector("p")
        if (p) { p.style.color = qrContentTextColor }
    } else {
        qrContent.style.backgroundColor = "transparent"
        qrContent.style.width = size + "px"
        qrContent.style.height = size + "px"
        qrContent.style.padding = "0"
    }
}
