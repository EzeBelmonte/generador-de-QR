let qr

// GENERADOR DE QR
function generateQR() {
    let container = document.getElementById("qrcode");
    container.innerHTML = ""; // limpiar antes de generar uno nuevo
    let text = document.getElementById("text").value;
    
    const downloadBtn = document.querySelector(".button-download")
    downloadBtn.style.display = "block"

    const configContainer = document.querySelector(".config-container ")
    configContainer.style.display = "flex"

    if (text.trim() === "") {
        alert("Escribe un texto o link primero.");
        return;
    }

    qr = new QRCode(container, {
        text: text,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.H
    });


}

// CONFIGURACIÓN
function configQR() {
    const sizeInput = document.getElementById("size"); // input del tamaño
    const sizeValue = sizeInput.value.trim();
    
    const colorDark = document.getElementById("colorDark").value;
    const colorLight = document.getElementById("colorLight").value;
   
    // definir el tamaño del QR
    let size
    if (sizeValue === "") {
        // si ya existe el QR, usar ancho actual del canvas o imagen
        const imgOrCanvas = document.querySelector("#qrcode canvas") || document.querySelector("#qrcode img");
        size = imgOrCanvas ? imgOrCanvas.width : 200;
    } else {
        size = Number(sizeValue)
        if (!isFinite(size) || size <= 130) {
            alert("Escribe un número válido y mayor que 0.")
            sizeInput.value = ""
            return
        }
    }

    // limpiar el qr anterior para generarlo con las nuevas medidas
    let container = document.getElementById("qrcode")
    container.innerHTML = ""

    // generar nuevo QR con el tamaño indicado
    qr = new QRCode(container, {
        text: text,
        width: parseInt(size),
        height: parseInt(size),
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: QRCode.CorrectLevel.H
    })
}

// DESCARGAR QR
function downloadQR() {
    if (!qr) {
        alert("Primero genera un QR.")
        return
    }

    // buscar el canvas o img generado por la libreria
    let img = document.querySelector("#qrcode img") || document.querySelector("#qrcode canvas")

    if (!img) {
        alert("No se encontró el QR.")
        return
    }

    // si es canvas, se convierte a imagen
    let url
    if (img.tagName.toLowerCase() === "canvas") {
        url = img.toDataURL("image/png")
    } else {
        url = img.src
    }

    // crear un enlace invisible para descargar
    let a = document.createElement("a")
    a.href = url
    a.download = "qr.png"
    a.click()
}
