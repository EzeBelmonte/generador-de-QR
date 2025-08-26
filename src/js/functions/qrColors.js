// color del fondo
export function getBackgroundColor(gradientBackgroundCheckbox) {
    
    const colorBackground1 = document.getElementById("color-background-1").value
    const colorBackground2 = document.getElementById("color-background-2").value
    const angleInput = document.getElementById("color-background-angle")

    if (gradientBackgroundCheckbox) {
        document.getElementById("color-background-2").disabled = false
        angleInput.disabled = false
        
        // generar 5 stops (se puede aumentar para más suavidad)
        const stops = [];
        const n = 5; // número de stops intermedios
        for (let i = 0; i < n; i++) {
            stops.push({
                offset: i / (n - 1),
                color: interpolateColor(colorBackground1, colorBackground2, i / (n - 1))
            });
        }
        
        return {
            gradient: {
                type: "linear",
                rotation: angleInput.value,
                colorStops: stops
            }
        }
    } else {
        document.getElementById("color-background-2").disabled = true
        angleInput.disabled = true
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
    const angleInput = document.getElementById("color-module-angle")

    if (gradientModuleCheckbox) {
        document.getElementById("color-module-2").disabled = false
        angleInput.disabled = false
        
        // generar 5 stops (se puede aumentar para más suavidad)
        const stops = [];
        const n = 5; // número de stops intermedios
        for (let i = 0; i < n; i++) {
            stops.push({
                offset: i / (n - 1),
                color: interpolateColor(colorModule1, colorModule2, i / (n - 1))
            });
        }
        
        return {
            gradient: {
                type: "linear",
                rotation: angleInput.value,
                colorStops: stops
            }
        }
    } else {
        document.getElementById("color-module-2").disabled = true
        angleInput.disabled = true
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
    const angleInput = document.getElementById("color-pattern-ext-angle")

    if (gradientPatternExtCheckbox) {
        document.getElementById("color-pattern-ext-2").disabled = false
        angleInput.disabled = false
        
        // generar 5 stops (se puede aumentar para más suavidad)
        const stops = [];
        const n = 5; // número de stops intermedios
        for (let i = 0; i < n; i++) {
            stops.push({
                offset: i / (n - 1),
                color: interpolateColor(colorPatternExt1, colorPatternExt2, i / (n - 1))
            });
        }
        
        return {
            gradient: {
                type: "linear",
                rotation: angleInput.value,
                colorStops: stops
            }
        }
    } else {
        document.getElementById("color-pattern-ext-2").disabled = true
        angleInput.disabled = true
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
    const angleInput = document.getElementById("color-pattern-int-angle")

    if (gradientPatternIntCheckbox) {
        document.getElementById("color-pattern-int-2").disabled = false
        angleInput.disabled = false
        
        // generar 5 stops (se puede aumentar para más suavidad)
        const stops = [];
        const n = 5; // número de stops intermedios
        for (let i = 0; i < n; i++) {
            stops.push({
                offset: i / (n - 1),
                color: interpolateColor(colorPatternInt1, colorPatternInt2, i / (n - 1))
            });
        }
        
        return {
            gradient: {
                type: "linear",
                rotation: angleInput.value,
                colorStops: stops
            }
        }
    } else {
        document.getElementById("color-pattern-int-2").disabled = true
        angleInput.disabled = true
        return {
            color: colorPatternInt1,
            gradient: undefined // desabilitar el gradiente para que funcione le color plano
        }
    }
}


// función para interpolar colores en RGB
function interpolateColor(color1, color2, factor) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r = Math.round(((c1 >> 16) * (1 - factor)) + ((c2 >> 16) * factor));
    const g = Math.round((((c1 >> 8) & 0xff) * (1 - factor)) + (((c2 >> 8) & 0xff) * factor));
    const b = Math.round(((c1 & 0xff) * (1 - factor)) + ((c2 & 0xff) * factor));

    return `rgb(${r},${g},${b})`;
}