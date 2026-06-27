// ⚠️ IMPORTANTE: cuando despliegues el backend en Render, reemplaza esta URL
// por la real que Render te dé, agregando "/api/horarios" al final. Ejemplo:
// const API = "https://horariosdocentesapp-backend.onrender.com/api/horarios";
const API = 'http://127.0.0.1:8080/api/horarios';

const carreras = {
  'Ciencias Económicas': ['Contabilidad', 'Administración', 'Finanzas'],
  'Sistemas':            ['Tecnología en Redes', 'Desarrollo de Software'],
  'Ingeniería':          ['Ingeniería Industrial', 'Ingeniería Civil']
};

const materias = {
  'Contabilidad':           ['Matemáticas Financieras', 'Contabilidad General'],
  'Administración':         ['Gestión Empresarial', 'Mercadeo'],
  'Finanzas':               ['Estadística', 'Economía'],
  'Tecnología en Redes':    ['Bases de Datos', 'Redes I'],
  'Desarrollo de Software': ['Programación Web', 'Algoritmos'],
  'Ingeniería Industrial':  ['Física I', 'Cálculo'],
  'Ingeniería Civil':       ['Topografía', 'Resistencia de Materiales']
};

// NAVEGACIÓN
function mostrarVista(nombre) {
  document.querySelectorAll('[id^="vista-"]').forEach(v => v.style.display = 'none');
  document.getElementById('vista-' + nombre).style.display = 'block';
}

// LISTAS DEPENDIENTES
function cargarCarreras() {
  const facultad = document.getElementById('c-facultad').value;
  const sel = document.getElementById('c-carrera');
  sel.innerHTML = '<option value="">-- selecciona --</option>';
  (carreras[facultad] || []).forEach(c => sel.innerHTML += '<option>' + c + '</option>');
  document.getElementById('c-materia').innerHTML = '<option value="">-- selecciona carrera --</option>';
}

function cargarMaterias() {
  const carrera = document.getElementById('c-carrera').value;
  const sel = document.getElementById('c-materia');
  sel.innerHTML = '<option value="">-- selecciona --</option>';
  (materias[carrera] || []).forEach(m => sel.innerHTML += '<option>' + m + '</option>');
}

// LIMPIAR
function limpiar(prefijo) {
  ['id', 'docente', 'facultad', 'carrera', 'materia', 'fecha', 'hinicio', 'hfin'].forEach(c => {
    const el = document.getElementById(prefijo + '-' + c);
    if (el) el.value = '';
  });
  document.getElementById(prefijo + '-msg').textContent = '';
}

// CANCELAR
function cancelar(vista) {
  const prefijo = vista === 'crear' ? 'c' : vista === 'editar' ? 'e' : 'b';
  limpiar(prefijo);
  mostrarVista('menu');
}

// CREAR
async function guardar() {
  const docente  = document.getElementById('c-docente').value.trim();
  const facultad = document.getElementById('c-facultad').value;
  const carrera  = document.getElementById('c-carrera').value;
  const materia  = document.getElementById('c-materia').value;
  const fecha    = document.getElementById('c-fecha').value;
  const hinicio  = document.getElementById('c-hinicio').value;
  const hfin     = document.getElementById('c-hfin').value;

  if (!docente || !facultad || !carrera || !materia || !fecha || !hinicio || !hfin) {
    document.getElementById('c-msg').textContent = 'Debes completar los datos del formulario.';
    return;
  }

  const resp = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      docente, facultad, carrera, materia,
      fechaClase:       fecha,
      horaIniciaClase:  hinicio,
      horaTerminaClase: hfin
    })
  });

  const datos = await resp.json();

  if (resp.ok) {
    document.getElementById('c-msg').textContent = 'Registro creado.';
    setTimeout(() => mostrarVista('menu'), 2000);
  } else {
    document.getElementById('c-msg').textContent = datos.mensaje || 'Error al crear.';
  }
}

// BUSCAR POR ID (editar y borrar)
async function buscar(prefijo) {
  const id = document.getElementById(prefijo + '-id').value.trim();

  if (!id) {
    document.getElementById(prefijo + '-msg').textContent = 'Debe digitar el ID a buscar.';
    return;
  }

  const resp = await fetch(API + '/byidHorario?idHorario=' + id);
  const datos = await resp.json();

  if (!resp.ok) {
    document.getElementById(prefijo + '-msg').textContent = 'El horario no existe.';
    return;
  }

  document.getElementById(prefijo + '-docente').value  = datos.docente;
  document.getElementById(prefijo + '-facultad').value = datos.facultad;
  document.getElementById(prefijo + '-carrera').value  = datos.carrera;
  document.getElementById(prefijo + '-materia').value  = datos.materia;
  document.getElementById(prefijo + '-fecha').value    = datos.fechaClase.toString().substring(0, 10);
  document.getElementById(prefijo + '-hinicio').value  = datos.horaIniciaClase;
  document.getElementById(prefijo + '-hfin').value     = datos.horaTerminaClase;
  document.getElementById(prefijo + '-msg').textContent = 'Horario cargado.';
}

// EDITAR
async function editar() {
  const docente = document.getElementById('e-docente').value.trim();

  if (!docente) {
    document.getElementById('e-msg').textContent = 'Debe buscar un horario existente para editar.';
    return;
  }

  if (!confirm('¿Está seguro de Editar el registro?')) {
    limpiar('e');
    return;
  }

  const id = document.getElementById('e-id').value;

  const resp = await fetch(API + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      docente:          document.getElementById('e-docente').value.trim(),
      facultad:         document.getElementById('e-facultad').value.trim(),
      carrera:          document.getElementById('e-carrera').value.trim(),
      materia:          document.getElementById('e-materia').value.trim(),
      fechaClase:       document.getElementById('e-fecha').value,
      horaIniciaClase:  document.getElementById('e-hinicio').value,
      horaTerminaClase: document.getElementById('e-hfin').value
    })
  });

  const datos = await resp.json();

  if (resp.ok) {
    document.getElementById('e-msg').textContent = 'Horario editado.';
    limpiar('e');
  } else {
    document.getElementById('e-msg').textContent = datos.mensaje || 'Error al editar.';
  }
}

// BORRAR
async function borrar() {
  const id = document.getElementById('b-id').value.trim();

  if (!id) {
    document.getElementById('b-msg').textContent = 'El Horario no puede estar vacío.';
    return;
  }

  const docente = document.getElementById('b-docente').value.trim();

  if (!docente) {
    document.getElementById('b-msg').textContent = 'Debe buscar una identificación existente antes de eliminar.';
    return;
  }

  if (!confirm('¿Está seguro de Borrar el registro?')) {
    limpiar('b');
    return;
  }

  const resp = await fetch(API + '/by-idHorario', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idHorario: id })
  });

  const datos = await resp.json();

  if (resp.ok) {
    document.getElementById('b-msg').textContent = 'Horario borrado.';
    limpiar('b');
  } else {
    document.getElementById('b-msg').textContent = datos.mensaje || 'Error al borrar.';
  }
}

// LISTADO
async function cargarLista() {
  const orden    = document.getElementById('l-orden').value;
  const busqueda = document.getElementById('l-busqueda').value.trim();

  const resp  = await fetch(API + '/list?orderBy=' + orden + '&q=' + encodeURIComponent(busqueda));
  const datos = await resp.json();

  document.getElementById('l-resumen').textContent = 'Registros: ' + datos.length;

  const cuerpo = document.getElementById('l-cuerpo');
  cuerpo.innerHTML = '';

  datos.forEach(h => {
    cuerpo.innerHTML +=
      '<tr>' +
        '<td>' + h.idHorario                              + '</td>' +
        '<td>' + h.docente                                + '</td>' +
        '<td>' + h.facultad                               + '</td>' +
        '<td>' + h.carrera                                + '</td>' +
        '<td>' + h.materia                                + '</td>' +
        '<td>' + h.fechaClase.toString().substring(0, 10) + '</td>' +
        '<td>' + h.horaIniciaClase                        + '</td>' +
        '<td>' + h.horaTerminaClase                       + '</td>' +
      '</tr>';
  });
}