// src/App.jsx
import React, { useState, useEffect, useRef } from "react"; // <-- AÑADIMOS 'useRef'
import "./App.css";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Nuevo estado para almacenar el color seleccionado (ej: '#ff0000')
  const [pickedColor, setPickedColor] = useState(null); // <-- NUEVO ESTADO

  // Referencia para acceder al elemento Canvas en el DOM
  const canvasRef = useRef(null); // <-- NUEVA REFERENCIA

  // --- Lógica de Manejo de Archivo (useEffect) ---
  useEffect(() => {
    // ... (Tu código de useEffect no cambia, solo la limpieza inicial del color) ...

    // Limpieza adicional: Resetea el color cuando se carga una nueva imagen o se limpia
    setPickedColor(null);

    if (!imageFile) {
      setImageUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageUrl(objectUrl);

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

  // Función de ayuda para convertir RGB a Hexadecimal (la implementaremos después)
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  // --- FUNCIÓN CLAVE: Leer el color al hacer clic ---
  const handleImageClick = (e) => {
    if (!canvasRef.current || !imageUrl) return;

    // 1. Obtener la imagen y el canvas
    const canvas = canvasRef.current;
    const img = e.target;

    // 2. Calcular la posición del clic relativa a la imagen
    // Usamos getBoundingClientRect() para saber dónde está la imagen en la pantalla.
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. Escalado: Mapear las coordenadas del clic a las coordenadas reales de la imagen.
    // Necesario porque la imagen en pantalla puede ser más pequeña/grande que su tamaño original.
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const canvasX = Math.floor(x * scaleX);
    const canvasY = Math.floor(y * scaleY);

    // 4. Dibujar la imagen en el canvas si no ha sido dibujada
    // Se dibuja en el tamaño original (naturalWidth/Height)
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // 5. Leer los datos del píxel en las coordenadas escaladas
    // data[0]=R, data[1]=G, data[2]=B, data[3]=Alpha (Transparencia)
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

      {/* Mostrar la caja de color si hay un color seleccionado */}
      {pickedColor && (
        <div className="color-result" style={{ backgroundColor: pickedColor }}>
          <p>Color Seleccionado:</p>
          <p className="hex-value">**{pickedColor}**</p>
        </div>
      )}

      {/* ... (La lógica de renderizado de la zona de arrastre no cambia) ... */}

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
        // Si hay una URL, mostramos la imagen Y el Canvas Oculto
        <div className="image-display-area">
          <img
            src={imageUrl}
            alt="Imagen cargada para selección de color. Haz click para elegir el color."
            className="uploaded-image"
            onClick={handleImageClick} // <-- FUNCIÓN DE CLIC AÑADIDA
          />

          {/* CANVAS OCULTO: Usado para la lectura de píxeles, pero el usuario no lo ve */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <button
            onClick={() => setImageFile(null)}
            aria-label="Cargar una nueva imagen"
            className="reset-button"
          >
            Cargar otra imagen
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
