
// descarga / impresión
export function downloadPrint(event, qrCode, qrContentBackgroundColor, qrContentTextColor) {
    if (!qrCode) {
        alert("Primero genera un QR.");
        return;
    }

    // se guarda que botón se apretó
    const action = event.target.dataset.action

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
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // dibujar QR
                ctx.drawImage(img, margin/2, margin/2)

                // dibujar texto debajo
                ctx.font = "20px Arial"
                ctx.fillStyle = qrContentTextColor
                ctx.textAlign = "center"
                ctx.fillText(text, canvas.width / 2, img.height + 47)

                // descargar
                if (action === "download") {
                    const link = document.createElement("a")
                    link.download = "qr-con-text.png"
                    link.href = canvas.toDataURL("image/png")
                    link.click()
                } else {
                    // abrir nueva pestaña y mandar a imprimir
                    const dataUrl = canvas.toDataURL("image/png")
                    const printWindow = window.open("", "_blank")
                    printWindow.document.write(`
                        <html>
                            <head><title>Imprimir QR</title></head>
                            <body style="margin: 0;display:flex;align-items:center;justify-content:center;height:100vh;">
                                <img src="${dataUrl}" onload="window.print();window.close()" />
                            </body>
                        </html>
                    `)
                    printWindow.document.close()
                }
            }
            img.src = URL.createObjectURL(blob)
        })
    } else {
        // descarga QR origial
        if (action === "download") {
            qrCode.download({ name: "qr", extension: "png" })
        } else {
        // imprimir QR original
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
}