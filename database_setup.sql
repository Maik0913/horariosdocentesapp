-- Script para crear la base de datos del proyecto Horarios Docentes
-- Reconstruido a partir de las columnas usadas en back/server.js

CREATE TABLE IF NOT EXISTS horarios_docentes (
  idHorario         INT AUTO_INCREMENT PRIMARY KEY,
  docente           VARCHAR(150) NOT NULL,
  facultad          VARCHAR(150) NOT NULL,
  carrera           VARCHAR(150) NOT NULL,
  materia           VARCHAR(150) NOT NULL,
  fechaClase        DATE NOT NULL,
  horaIniciaClase   TIME NOT NULL,
  horaTerminaClase  TIME NOT NULL
);

-- (Opcional) Datos de ejemplo para probar que todo funciona.
-- Puedes borrar este bloque si no lo necesitas.
INSERT INTO horarios_docentes (docente, facultad, carrera, materia, fechaClase, horaIniciaClase, horaTerminaClase)
VALUES
  ('Ana Pérez', 'Sistemas', 'Desarrollo de Software', 'Programación Web', '2026-07-01', '08:00:00', '10:00:00'),
  ('Carlos Gómez', 'Ingeniería', 'Ingeniería Civil', 'Topografía', '2026-07-02', '10:00:00', '12:00:00');
