// descarga / impresión
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
            const margin = 26
            canvas.width = img.width + margin
            canvas.height = img.height + 70 // espacio para el texto
            const ctx = canvas.getContext("2d")

            // configurar color de fondo
            if (text && backgroundOptions.isGradient) {
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

            // dibujar texto debajo si hay
            if (text) {
                ctx.font = "20px Arial"
                ctx.fillStyle = textColor
                ctx.textAlign = "center"
                ctx.fillText(text, canvas.width / 2, img.height + 47)
            }

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
            }
        }
        img.src = URL.createObjectURL(blob)
    })
}
