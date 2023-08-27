var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, { expressions: false, settingsMenu: false, zoomButtons: false });
calculator.setExpression({ id: 'graph1' });
restrictedFunctions = true;



function solve() {

    var e1 = document.getElementById("equation_1").value
    var e2 = document.getElementById("equation_2").value
    e1 += " "
    e2 += " "
    e1 = e1.replace(/−/g, "-")
    e2 = e2.replace(/−/g, "-")

    calculator.setExpression({ id: 'graph1', latex: e1 });
    calculator.setExpression({ id: 'graph2', latex: e2 });


    var x = 0
    var y = 0

    var seperated = getX(e1, e2)

    x = seperated[1][1]["b"]

    y = getY(e1, e2, seperated)

    if (document.getElementById('rounding').checked) {
        x = Math.round(x * 10) / 10;
        y = Math.round(y * 10) / 10;
    }
    else {
        x = Math.round(x * 1000) / 1000;
        y = Math.round(y * 1000) / 1000;
    }

    document.getElementById("result").innerHTML = `(${x}, ${y})`
    if (x !== 0 && y !== 0) confetti();
}

function getX(e1, e2) {
    //e1
    var half1
    var half2
    //e2
    var half3
    var half4

    //get the variables in a table
    var tabled = decode(e1)
    half1 = tabled[0]
    half2 = tabled[1]

    //isolate
    var seperated = seperateY(half1, half2)
    half1 = seperated[0]
    half2 = seperated[1]

    //implant
    tabled = decode(e2)
    half3 = tabled[0]
    half4 = tabled[1]

    console.log(half1)
    console.log(half2)

    if (half3["y"] != 0) {
        var m = half3["y"]
        half3["b"] = half3["b"] + half2["b"] * m
        half3["x"] = half3["x"] + half2["x"] * m
        half3["y"] = 0
    }
    else if (half4["y"] != 0) {
        var m = half4["y"]
        half4["b"] = half4["b"] + half2["b"] * m
        half4["x"] = half4["x"] + half2["x"] * m
        half4["y"] = 0
    }

    var seperatedX = seperateX(half3, half4)
    return [seperated, seperatedX]
}

function decode(e1) {
    //initializing variables
    var isNegative = false
    var negative = { true: -1, false: 1 }

    var coefficient = undefined

    var half = 1
    var half1 = { "x": 0, "y": 0, "b": 0 }
    var half2 = { "x": 0, "y": 0, "b": 0 }

    var variable = { "x": true, "y": true }
    for (var i = 0; i < e1.length; i++) {
        var cur = e1[i]
        console.log(half1)
        console.log(half2)
        console.log(cur)
        //console.log(coefficient)

        if (cur == "-") {
            isNegative = true
        }
        else if (cur == "+") {
            isNegative = false
        }
        else if (cur == "=") {
            half = 2
            isNegative = false
            coefficient = undefined
        }
        else if (parseInt(cur) || parseInt(cur) == 0) {
            if (coefficient != undefined && parseInt(e1[i + 1])) {
                coefficient = parseInt(coefficient.toString() + cur) * negative[isNegative]
            }
            if (coefficient != undefined) {
                coefficient = parseInt(coefficient.toString() + cur) * negative[isNegative]
                isNegative = false
            }
            else {
                coefficient = parseInt(cur) * negative[isNegative]
                isNegative = false
            }
        }
        else if (variable[cur]) {
            if (coefficient == undefined) {
                switch (half) {
                    case 1:
                        half1[cur] = 1 * negative[isNegative]
                        break;
                    case 2:
                        half2[cur] = 1 * negative[isNegative]
                        break;
                }
            }
            else if (cur != undefined) {
                switch (half) {
                    case 1:
                        half1[cur] = coefficient
                        break;
                    case 2:
                        half2[cur] = coefficient
                        break;
                }
            }
            coefficient = undefined
        }
        else if (coefficient != undefined && !variable[cur]) {
            switch (half) {
                case 1:
                    half1["b"] = coefficient
                    break;
                case 2:
                    half2["b"] = coefficient
                    break;
            }
            coefficient = undefined
        }
    }
    console.log(half1)
    console.log(half2)
    return [half1, half2]
}

function seperateY(half1, half2) {
    var yCoefficient = 1

    if (half2["y"] != 0) {
        half1["y"] -= half2["y"]
        half2["y"] = 0
    }
    if (half1["y"] != 0) {
        yCoefficient = half1["y"]

        half2["b"] -= half1["b"]
        half1["b"] = 0
        half2["x"] -= half1["x"]
        half1["x"] = 0

        half1["y"] = 1
        half2["x"] = half2["x"] / yCoefficient
        half2["b"] = half2["b"] / yCoefficient
    }
    return [half1, half2]
}

function seperateX(half1, half2) {
    var xCoefficient = 1

    if (half2["x"] != 0) {
        half1["x"] -= half2["x"]
        half2["x"] = 0
    }
    if (half1["x"] != 0) {
        xCoefficient = half1["x"]

        half2["b"] -= half1["b"]
        half1["b"] = 0

        half2["b"] = half2["b"] / xCoefficient
        half1["x"] = 1
    }
    return [half1, half2]
}

function getY(e1, e2, seperated) {
    half1 = seperated[0][0]
    half2 = seperated[0][1]
    half3 = seperated[1][0]
    half4 = seperated[1][1]

    var m = half2["x"]
    half2["b"] = half2["b"] + half4["b"] * m
    half2["x"] = 0

    return half2["b"]
}

