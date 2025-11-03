// src/App.jsx
import React, { useState, useEffect } from "react"; // <-- AÑADIMOS 'useEffect'
import "./App.css";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // Nuevo estado para la URL de la imagen que usaremos en la etiqueta <img>
  const [imageUrl, setImageUrl] = useState(null); // <-- NUEVO ESTADO

  // Función para crear la URL y limpiar después
  useEffect(() => {
    if (!imageFile) {
      // Si no hay archivo, limpiamos la URL
      setImageUrl(null);
      return;
    }

    // Crea una URL temporal del archivo cargado (Blob/File)
    const objectUrl = URL.createObjectURL(imageFile);
    setImageUrl(objectUrl);

    // Función de limpieza: Se ejecuta cuando el componente se desmonta o
    // cuando imageFile cambia para liberar memoria.
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]); // <-- Se ejecuta cada vez que 'imageFile' cambia

  // ... (handleDragOver, handleDragLeave, handleDrop, handleFileChange no cambian) ...

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

  return (
    <div id="app-container" role="main">
      <h1>🎨 Color Dropper</h1>

      {/* Condicional: Si NO hay imagen (imageUrl), mostrar el área de carga */}
      {!imageUrl ? ( // <-- USAMOS imageUrl para la condición
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
        // Si hay una URL, mostramos la imagen
        <div className="image-display-area">
          <img
            src={imageUrl}
            alt="Imagen cargada para selección de color"
            className="uploaded-image"
          />
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
