export function manageExportOptions(event, qrCode, backgroundOptions, textColor) {
    if (!qrCode) {
        alert("Primero genera un QR.") 
        return 
    }

    // botón que se apretó
    const action = event.target.dataset.action

    const text = document.getElementById("qr-text").value

    qrCode.getRawData("png").then(blob => {
        const img = new Image()
        img.onload = () => {
            const ctxMargin = Math.floor(img.width / 10)
            const margin = Math.max(20, Math.min(80, ctxMargin)) // mínimo 20px, máximo 80px

            // si hay texto, sumamos espacio extra
            const extraTextSpace = text ? (img.width / 10 + 50) : 0

            // crear canvas
            const canvas = document.createElement("canvas")
            canvas.width = img.width + margin
            canvas.height = img.height + margin + extraTextSpace
            const ctx = canvas.getContext("2d")

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

            // dibujar texto debajo si es que existe
            if (text) {
                ctx.font = `${img.width / 10}px Arial` // 10% del tamaño del QR
                ctx.fillStyle = textColor
                ctx.textAlign = "center"
                ctx.fillText(text, canvas.width / 2, img.height + margin / 2 + (img.width / 10) + 27)
            }

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
                        <body style="margin:0 display:flex align-items:center justify-content:center height:100vh ">
                            <img src="${dataUrl}" onload="window.print() window.close()" />
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
                    uploadQrToCloudinary(canvas, (url) => {
                        showShareMenu(url)
                    })
                }, "image/png")
            }
        }
        img.src = URL.createObjectURL(blob)
    })
}


// ======= Funciones para compartir =======
function uploadQrToCloudinary(canvas, callback) {
    canvas.toBlob(async (blob) => {
        const formData = new FormData() 
        formData.append("file", blob) 
        formData.append("upload_preset", "qr_preset")  // el preset creado
        formData.append("folder", "qr_codes")  // opcional, organiza en carpeta

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dimgbra0z/image/upload", {
                method: "POST",
                body: formData
            }) 

            const data = await res.json() 

            if (callback) callback(data.secure_url) 
        } catch (err) {
            console.error("❌ Error subiendo QR:", err) 
        }
    }, "image/png") 
}


function showShareMenu(url) {
    const isDarkMode = document.body.classList.contains('dark-mode') 

    // eliminar menú previo si existe
    const oldMenu = document.querySelector(".share-menu")
    if (oldMenu) oldMenu.remove() 

    const encodedUrl = encodeURIComponent(url) 

    // links de diferentes redes sociales/sitios
    const shareLinks = {
        whatsapp: `https://wa.me/?text=Escanea%20mi%20QR:%20${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Escanea%20mi%20QR`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=Escanea%20mi%20QR`,
        email: `mailto:?subject=Mi%20QR&body=Escanea%20mi%20QR:%20${encodedUrl}`
    } 

    // depende del modo de la app (claro/oscuro) es el icono que se usa
    const xIcon = isDarkMode ? "https://cdn.simpleicons.org/x/ffffff" : "https://cdn.simpleicons.org/x/000000"
    const facebookIcon = isDarkMode ? "https://cdn.simpleicons.org/facebook/ffffff" : "https://cdn.simpleicons.org/facebook/000000"
    const whatsappIcon = isDarkMode ? "https://cdn.simpleicons.org/whatsapp/ffffff" : "https://cdn.simpleicons.org/whatsapp/000000"
    const telegramIcon = isDarkMode ? "https://cdn.simpleicons.org/telegram/ffffff" : "https://cdn.simpleicons.org/telegram/000000"
    const gmailIcon = isDarkMode ? "https://cdn.simpleicons.org/gmail/ffffff" : "https://cdn.simpleicons.org/gmail/000000"
    const embedIcon = isDarkMode ? "https://cdn.simpleicons.org/playcanvas/ffffff" : "https://cdn.simpleicons.org/playcanvas/000000"  

    let html = `
        <div class="share-menu">
            <div class="share-header">
                <span class="color-text-share">Compartir QR</span>
                <button class="close-share">&times </button>
            </div>
            <div class="share-icons">
                <a href="${shareLinks.twitter}" target="_blank" title="Twitter/X">
                    <img src=${xIcon} />
                </a>
                <a href="${shareLinks.facebook}" target="_blank" title="Facebook">
                    <img src=${facebookIcon} />
                </a>
                <a href="${shareLinks.whatsapp}" target="_blank" title="WhatsApp">
                    <img src=${whatsappIcon} />
                </a>
                <a href="${shareLinks.telegram}" target="_blank" title="Telegram">
                    <img src=${telegramIcon} />
                </a>
                <a href="${shareLinks.email}" target="_blank" title="Email">
                    <img src=${gmailIcon} />
                </a>
                <a href="#" title="Iframe" class="embed-btn">
                    <img src=${embedIcon} />
                </a>
            </div>
        </div>
    `

    const container = document.createElement("div")
    container.innerHTML = html
    const menu = container.firstElementChild
    document.body.appendChild(menu)

    // cierre con animación
    menu.querySelector(".close-share").addEventListener("click", () => {
        // cerrar también la ventana embed si existe
        const embedModal = document.querySelector(".embed-modal")
        if (embedModal) {
                embedModal.classList.add("hide")
                embedModal.addEventListener("animationed", () => {
                    embedModal.remove()
                }, { once: true }) 
        }

        menu.classList.add("hide") // dispara fadeOut
        menu.addEventListener("animationend", () => {
            menu.remove() // elimina después de la animación
        }, { once: true })
    })


    // click en el botón embed
    const embedBtn = menu.querySelector(".embed-btn") 
    if (embedBtn) {
        embedBtn.addEventListener("click", () => {
            showEmbedCodes(url)
        })
    }
}


function showEmbedCodes(url) {
    const oldModal = document.querySelector(".embed-modal")
    if (oldModal) oldModal.remove() 

    // códigos de embeber
    const imgCode = `<img src="${url}" alt="QR Code" style="max-width:200px ">` 
    const iframeCode = `<iframe src="${url}" width="200" height="200" style="border:none "></iframe>` 

    const html = `
        <div class="embed-modal">
            <div class="embed-header">
                <span>Código para embeber</span>
                <button class="close-embed">&times </button>
            </div>
            <label>IMG:</label>
            <textarea readonly>${imgCode}</textarea>
            <label>IFRAME:</label>
            <textarea readonly>${iframeCode}</textarea>
        </div>
    ` 

    const container = document.createElement("div")
    container.innerHTML = html
    const modal = container.firstElementChild
    document.body.appendChild(modal)

    // cerrar modal
    modal.querySelector(".close-embed").addEventListener("click", () => {
        modal.classList.add("hide")  // activa el fadeOut
        modal.addEventListener("animationend", () => {
            modal.remove()   
        }, { once: true })
    })
}


