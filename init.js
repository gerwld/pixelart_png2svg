var imgCan, imgCtx;
var imgData;
var imgLoader;

function makeSVG() {
    var svg = document.getElementById("svgImage");
    // Empty the SVG
    svg.innerHTML = "";

    svg.setAttribute("viewBox", "0 0 " + imgCan.width + " " + imgCan.height);

    var color = [];
    var colors = [];
    for (var i = 0; i < imgData.data.length; i++) {
        var channel = i % 4;
        var x = (i - channel) % imgCan.width;
        var y = ((i - channel) - x) / imgCan.width;

        if (channel == 3) {
            // Remember the previous color
            color.push(imgData.data[i]);
            colors.push(color);
            // Flush the previous color
            color = [];
        } else {
            color.push(imgData.data[i]);
        }

        console.log("C = " + channel);
        console.log("X = " + x);
        console.log("Y = " + y);
    }

    for (var i = 0; i < colors.length; i++) {
        var x = i % imgCan.width;
        var y = (i - x) / imgCan.width;
        if (colors[i][3] !== 0) {
            var rect = document.createElement("rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 1);
            rect.setAttribute("height", 1);
            rect.setAttribute("fill",
                "rgb(" + colors[i][0] + "," + colors[i][1] + "," + colors[i][2] + ")"
            );
            if (colors[i][3] !== 255) {
                rect.setAttribute("fill-opacity", colors[i][3] / 255);
            }
            svg.appendChild(rect);
        }
    }

    // Refresh SVG
    svg.innerHTML = svg.innerHTML;
    document.getElementById("content").innerText = "<svg viewBox=" + svg.getAttribute("viewbox") + "\">" + svg.innerHTML + "</svg>";
}

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
            // Get the image into imageData
            imgCan.width = img.width;
            imgCan.height = img.height;
            imgCtx.drawImage(img, 0, 0);
            imgData = imgCtx.getImageData(0, 0, imgCan.width, imgCan.height);
            makeSVG();
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function setup() {
    imgLoader = document.getElementById("imgLoader");
    document.getElementById("imgLoader").onchange = handleImage;

    imgCan = document.getElementById("testCanvas");
    imgCtx = imgCan.getContext("2d");
}

window.addEventListener("load", setup);
