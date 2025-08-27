// ======= descarga / impresión =======
export function downloadPrint(event, qrCode, backgroundOptions, textColor) {
    if (!qrCode) {
        alert("Primero genera un QR.");
        return;
    }

    // botón que se apretó
    const action = event.target.dataset.action

    const text = document.getElementById("qr-text").value

    qrCode.getRawData("png").then(blob => {
        const img = new Image()
        img.onload = () => {
            // Crear canvas
            const canvas = document.createElement("canvas")

            let margin = Math.floor(img.width * 0.1)
            // mínimo 20px, máximo 80px
            margin = Math.max(20, Math.min(80, margin))
            
            canvas.width = img.width + margin
            canvas.height = img.height + margin
            const ctx = canvas.getContext("2d")

            // dibujar texto debajo si hay
            if (text) {
                
                canvas.height = img.height + 70 // espacio para el texto
                
                ctx.font = "20px Arial"
                ctx.fillStyle = textColor
                ctx.textAlign = "center"
                ctx.fillText(text, canvas.width / 2, img.height + 47)
            }

            // configurar color de fondo
            if (backgroundOptions.isGradient) {
            
                // convertir a radian
                const angleRad = backgroundOptions.angle * Math.PI / 180
                // calcular dirección del gradiente en el canvas
                const x0 = canvas.width / 2 - Math.cos(angleRad) * canvas.width / 2
                const y0 = canvas.height / 2 - Math.sin(angleRad) * canvas.height / 2
                const x1 = canvas.width / 2 + Math.cos(angleRad) * canvas.width / 2
                const y1 = canvas.height / 2 + Math.sin(angleRad) * canvas.height / 2

                const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
                gradient.addColorStop(0, backgroundOptions.color1)
                gradient.addColorStop(1, backgroundOptions.color2)
                ctx.fillStyle = gradient
            } else {
                ctx.fillStyle = backgroundOptions.color1
            }

            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // dibujar QR
            ctx.drawImage(img, margin / 2, margin / 2)

            // ejecutar acción
            if (action === "download") {
                const link = document.createElement("a")
                link.download = text ? "qr-con-text.png" : "qr.png"
                link.href = canvas.toDataURL("image/png")
                link.click()
            } else if (action === "print") {
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
            } else if (action === "copy") {
                canvas.toBlob(blob => {
                    const item = new ClipboardItem({ "image/png": blob })
                    navigator.clipboard.write([item])
                        .then(() => alert("QR copiado al portapapeles!"))
                        .catch(err => console.error("Error al copiar el QR:", err))
                }, "image/png")
            } else if (action ==="share") {
                canvas.toBlob(blob => {
                    // 👉 Plan B: subir a Cloudinary y mostrar menú estilo YouTube
                    uploadQrToCloudinary(canvas, (url) => {
                        showShareMenu(url)
                    })
                }, "image/png")
            }
        }
        img.src = URL.createObjectURL(blob)
    })
}


// ======= funciones para compartir =======
function uploadQrToCloudinary(canvas, callback) {
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", "qr_preset"); // el preset que creaste
        formData.append("folder", "qr_codes"); // opcional, organiza en carpeta

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dimgbra0z/image/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            console.log("✅ QR subido a Cloudinary:", data.secure_url);

            if (callback) callback(data.secure_url);
        } catch (err) {
            console.error("❌ Error subiendo QR:", err);
        }
    }, "image/png");
}


function showShareMenu(url) {
    // eliminar menú previo si existe
    const oldMenu = document.querySelector(".share-menu");
    if (oldMenu) oldMenu.remove();

    const encodedUrl = encodeURIComponent(url);

    const shareLinks = {
        whatsapp: `https://wa.me/?text=Escanea%20mi%20QR:%20${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Escanea%20mi%20QR`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=Escanea%20mi%20QR`,
        email: `mailto:?subject=Mi%20QR&body=Escanea%20mi%20QR:%20${encodedUrl}`
    };

    let html = `
        <div class="share-menu">
            <div class="share-header">
                <span>Compartir QR</span>
                <button class="close-share">&times;</button>
            </div>
            <div class="share-icons">
                <a href="${shareLinks.whatsapp}" target="_blank" title="WhatsApp">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" />
                </a>
                <a href="${shareLinks.facebook}" target="_blank" title="Facebook">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" />
                </a>
                <a href="${shareLinks.twitter}" target="_blank" title="Twitter/X">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" />
                </a>
                <a href="${shareLinks.telegram}" target="_blank" title="Telegram">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg" />
                </a>
                <a href="${shareLinks.email}" target="_blank" title="Email">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" />
                </a>
            </div>
        </div>
    `;

    const container = document.createElement("div")
    container.innerHTML = html
    const menu = container.firstElementChild
    document.body.appendChild(menu)

    // cierre con animación
    menu.querySelector(".close-share").addEventListener("click", () => {
        menu.classList.add("hide") // dispara fadeOut
        menu.addEventListener("animationend", () => {
            menu.remove() // elimina después de la animación
        }, { once: true })
    });
}

