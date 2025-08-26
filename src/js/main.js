import { downloadPrint } from "./functions/utilities.js"
import { createQR, updateQrContentStyle, getQrCode, getGradientBackgroundTextCheckbox, getBackgroundTextColor1, getBackgroundTextColor2, getBackgroundTextColorAngle, getTextColor } from "./functions/qr.js"
import { setLogoSrc } from "./functions/qr.js"

let logoSrc = null

// Mostrar inputs al cambiar el tipo de QR
document.querySelectorAll('input[name="qr-type"]').forEach(radio => {
    radio.addEventListener("change", showInputs)
})

// Mostrar los inputs correctos al cargar (ej: QR estándar por defecto)
window.addEventListener("DOMContentLoaded", showInputs)


// muestra los inputs cuando se selecciona un tipo de QR
function showInputs() {
    // radio seleccionado
    const qrSelectValue = document.querySelector('input[name="qr-type"]:checked').value

    // contenedor del input
    const input = document.getElementById("qr-type-input")

    // limpiar el input si hay uno
    if (input) {
        input.innerHTML = ""
    }
    
    if (qrSelectValue === "standarQR") {
        input.innerHTML = `
            <input type="text" id="text-standar" class="w-100" placeholder="Escribe un link o texto">
        `
    } 

    if (qrSelectValue === "wifiQR") {
        input.innerHTML = `
            <div class="d-flex gap-2">
            <input type="text" id="ssid" class="w-50" placeholder="SSID">
            <input type="text" id="wifi-pass" class="w-50" placeholder="Contraseña">
            </div>
            <fieldset class="mb-3">
                <legend class="mt-3 text">Tipo de seguridad</legend>
                
                <label class="text">
                    <input type="radio" name="security" value="WPA" checked> WPA/WPA2
                </label>
                
                <label class="text">
                    <input type="radio" name="security" value="WEP"> WEP
                </label>
                
                <label class="text">
                    <input type="radio" name="security" value="nopass"> Sin contraseña
                </label>
            </fieldset>
        `
    }

    if (qrSelectValue === "vcardQR") {
        input.innerHTML = `
            <div class="d-flex flex-column">
                <div class="w-100 d-flex gap-2 mb-2">
                    <input type="text" id="vcard-name" class="w-50" placeholder="Nombre">
                    <input type="text" id="vcard-lastname" class="w-50" placeholder="Apellido">
                </div>
                <input type="text" id="vcard-phone" class="w-100" placeholder="Teléfono">
            </div>
            `
    }

    if (qrSelectValue === "socialQR") {
        input.innerHTML = `
            <div>
                <div class="mt-2 mb-2">
                    <label class="text" for="social-select">Generar QR para:</label>
                    <select id="social-select">
                        <option value="" selected disabled>Elegir</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>
                </div>
                        
                <input type="text" id="social-input" class="w-100" disabled>
            </div>
        `

        // detectar cambio en el selector
        const socialSelect = input.querySelector("#social-select")
        const socialInput = input.querySelector("#social-input")

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

    const radios = input.querySelectorAll('input[name="security"]')
    const passInput = input.querySelector("#wifi-pass")
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
            <div id="qr-code"></div>
        </div>

        <input type="text" id="qr-text" class="w-25 mt-4 mb-3" placeholder="Texto (Opcional)">

        <div class="d-flex gap-4">
            <button id="button-download" class="button-utility" data-action="download">Descargar QR</button>
            <button id="button-print" class="button-utility" data-action="print">Imprimir QR</button>
            <button id="button-copy" class="button-utility" data-action="copy">Copiar QR</button>
        </div>
    `
    // botón de descarga e impresion
document.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", (event) => {
        downloadPrint(
            event,
            getQrCode(),
            {
                color1: getBackgroundTextColor1(),
                color2: getBackgroundTextColor2(),
                isGradient: getGradientBackgroundTextCheckbox().checked,
                angle: getBackgroundTextColorAngle().value
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
        let password = document.getElementById("wifi-pass").value.trim()
        let security = document.querySelector('input[name="security"]:checked').value

        const passInput = document.getElementById("wifi-pass")
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

        setLogoSrc(logoSrc)
        content = option+input
    }
    
    createQR(content)
}


// agrega la funcionalidad de abrir y cerrar el menu cuando esta en resoluciones bajas
const configContainer = document.querySelector(".config-container");
const configContent = document.getElementById("config-content");

if (window.innerWidth <= 480) {
    const configTitle = document.getElementById("config-title");
    // solo en móvil
    configTitle.addEventListener("click", () => {
        configContainer.classList.toggle("expanded");
        configContent.classList.add("expanded");
    });
}
