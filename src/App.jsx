import React, { useState } from "react";
import "./App.css";

function App() {
  // 1. Estado para almacenar la imagen cargada
  const [imageFile, setImageFile] = useState(null);

  // 2. Estado para manejar el efecto visual de "arrastrando sobre la zona"
  const [isDragging, setIsDragging] = useState(false);

  // Funciones placeholder que implementaremos después:
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

    // Obtener el primer archivo soltado
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Solo tomamos el primero si se sueltan varios
      setImageFile(files[0]);
    }
  };

  // Función para manejar la selección tradicional por clic en el input file
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImageFile(files[0]);
    }
  };

  return (
    <div id="app-container" role="main">
      <h1>🎨 Color Dropper</h1>

      {/* Condicional: Si no hay imagen, mostrar el área de carga */}
      {!imageFile ? (
        <div
          className={`drop-area ${isDragging ? "dragging" : ""}`}
          // Eventos de accesibilidad y Drag and Drop
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          // Mejorando la accesibilidad:
          tabIndex="0" // Permite enfocar con el teclado (Tab)
          aria-label="Arrastra una imagen o haz click para subir"
        >
          {/* Usamos un label que es la zona grande de "Drop". 
            Cuando haces click, activa el input file oculto. 
          */}
          <label htmlFor="file-upload">
            <p>Arrastra aquí tu imagen 🖼️</p>
            <p>o haz click para seleccionar</p>
          </label>

          {/* El input file real, oculto pero accesible al hacer click en el label */}
          <input
            id="file-upload"
            type="file"
            accept="image/*" // Solo acepta archivos de imagen
            onChange={handleFileChange}
            // Estilos para ocultarlo, pero aún dejarlo accesible
            style={{ display: "none" }}
          />
        </div>
      ) : (
        // Si hay una imagen, mostramos su nombre (por ahora)
        <div>
          <p>Imagen cargada: **{imageFile.name}**</p>
        </div>
      )}
    </div>
  );
}

export default App;
