// color del fondo
export function getBackgroundColor(gradientBackgroundCheckbox) {
    
    const colorBackground1 = document.getElementById("color-background-1").value
    const colorBackground2 = document.getElementById("color-background-2").value

    if (gradientBackgroundCheckbox) {
        document.getElementById("color-background-2").disabled = false
        return {
            gradient: {
                type: "linear",   // o "radial"
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorBackground1 },
                    { offset: 1, color: colorBackground2 }
                ]
            }
        }
    } else {
        document.getElementById("color-background-2").disabled = true
        return {
            color: colorBackground1,
            gradient: undefined // desabilitar el gradiente para que funcione le color plano
        }
    }
}

// colore de los dots
export function getDotsColor (gradientModuleCheckbox) {
    
    const colorModule1 = document.getElementById("color-module-1").value
    const colorModule2 = document.getElementById("color-module-2").value

    if (gradientModuleCheckbox) {
        document.getElementById("color-module-2").disabled = false
        return {
            gradient: {
                type: "linear",   // o "radial"
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorModule1 },
                    { offset: 1, color: colorModule2 }
                ]
            }
        }
    } else {
        document.getElementById("color-module-2").disabled = true
        return {
            color: colorModule1,
            gradient: undefined // desabilitar el gradiente para que funcione le color plano
        }
    }
}

// color del marco de los módulos de las esquinas
export function getCornersSquareColor(gradientPatternExtCheckbox) {

    const colorPatternExt1 = document.getElementById("color-pattern-ext-1").value
    const colorPatternExt2 = document.getElementById("color-pattern-ext-2").value

    if (gradientPatternExtCheckbox) {
        document.getElementById("color-pattern-ext-2").disabled = false
        return {
            gradient: {
                type: "linear",   // o "radial"
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorPatternExt1 },
                    { offset: 1, color: colorPatternExt2 }
                ]
            }
        }
    } else {
        document.getElementById("color-pattern-ext-2").disabled = true
        return {
            color: colorPatternExt1,
            gradient: undefined // desabilitar el gradiente para que funcione le color plano
        }
    }
}

// color del marco de los módulos de las esquinas
export function getCornersDotColor(gradientPatternIntCheckbox) {

    const colorPatternInt1 = document.getElementById("color-pattern-int-1").value
    const colorPatternInt2 = document.getElementById("color-pattern-int-2").value

    if (gradientPatternIntCheckbox) {
        document.getElementById("color-pattern-int-2").disabled = false
        return {
            gradient: {
                type: "linear",   // o "radial"
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorPatternInt1 },
                    { offset: 1, color: colorPatternInt2 }
                ]
            }
        }
    } else {
        document.getElementById("color-pattern-int-2").disabled = true
        return {
            color: colorPatternInt1,
            gradient: undefined // desabilitar el gradiente para que funcione le color plano
        }
    }
}