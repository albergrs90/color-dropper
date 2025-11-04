// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Nuevo estado para almacenar el color seleccionado
  const [pickedColor, setPickedColor] = useState(null);

  // Referencia para acceder al elemento Canvas en el DOM
  const canvasRef = useRef(null);

  // --- Lógica de Manejo de Archivo (useEffect) ---
  useEffect(() => {
    // Limpieza adicional: Resetea el color cuando se carga una nueva imagen o se limpia
    setPickedColor(null);

    if (!imageFile) {
      setImageUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageUrl(objectUrl);

    // Función de limpieza
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // --- Funciones de Drag and Drop (No cambian) ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImageFile(files[0]);
    }
  };

  // Función de ayuda para convertir RGB a Hexadecimal
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  // Función de accesibilidad: Determina si el texto debe ser blanco o negro
  const calculateTextColor = (hexColor) => {
    if (!hexColor || hexColor.length !== 7) return "#333";

    // 1. Convertir los valores Hex a R, G, B decimales.
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // 2. Calcular la luminosidad percibida (YIQ)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // 3. Devolver blanco o negro (umbral 150)
    return yiq >= 150 ? "#333" : "white";
  };

  // --- FUNCIÓN CLAVE: Leer el color al hacer clic ---
  const handleImageClick = (e) => {
    if (!canvasRef.current || !imageUrl) return;

    // 1. Obtener la imagen y el canvas
    const canvas = canvasRef.current;
    const img = e.target;

    // 2. Calcular la posición del clic relativa a la imagen
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. Escalado: Mapear las coordenadas del clic a las coordenadas reales de la imagen.
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const canvasX = Math.floor(x * scaleX);
    const canvasY = Math.floor(y * scaleY);

    // 4. Dibujar la imagen en el canvas (Tamaño original)
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 5. Leer los datos del píxel
    const pixelData = ctx.getImageData(canvasX, canvasY, 1, 1).data;

    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];

    // 6. Convertir y actualizar el estado
    const hexColor = rgbToHex(r, g, b);
    setPickedColor(hexColor);
  };

  // --- Renderizado (JSX) ---
  return (
    <div id="app-container" role="main">
      <h1>🎨 Color Dropper</h1>

      {!imageUrl ? (
        <div
          className={`drop-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex="0"
          aria-label="Arrastra una imagen o haz click para subir"
        >
          <label htmlFor="file-upload">
            <p>Arrastra aquí tu imagen 🖼️</p>
            <p>o haz click para seleccionar</p>
          </label>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        // Contenedor principal para la imagen y el resultado, asegurando la alineación.
        <div className="image-display-wrapper">
          {/* Muestra la caja de color si hay un color seleccionado */}
          {pickedColor && (
            <div
              className="color-result"
              style={{
                backgroundColor: pickedColor,
                color: calculateTextColor(pickedColor),
              }}
            >
              <p>Color Seleccionado:</p>
              <p className="hex-value">{pickedColor}</p>
            </div>
          )}

          <div className="image-display-area">
            <img
              src={imageUrl}
              alt="Imagen cargada para selección de color. Haz click para elegir el color."
              className="uploaded-image"
              onClick={handleImageClick}
            />

            {/* CANVAS OCULTO */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <button
              onClick={() => setImageFile(null)}
              aria-label="Cargar una nueva imagen"
              className="reset-button"
            >
              Cargar otra imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
