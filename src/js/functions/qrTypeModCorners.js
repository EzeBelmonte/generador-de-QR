
// tipo de dots
export function getDotType() {
    const dot = document.querySelector('input[name="module-type"]:checked').value
    return (dot === "square") ? "square" : "dots"
}

// tipo de esquina
export function getCornersSquareType() {
    const pattern = document.querySelector('input[name="pattern-type"]:checked').value
    return (pattern === "square") ? "square" : "extra-rounded"
}

// tipo de dont interno de la esquina
export function getCornersDotType() {
    const dotPattern = document.querySelector('input[name="dot-pattern-type"]:checked').value
    return (dotPattern === "square") ? "square" : "dots" 
}