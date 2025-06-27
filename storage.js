// Obtener todas las personas
function obtenerPersonas() {
    const personas = localStorage.getItem('personas');
    return personas ? JSON.parse(personas) : [];
}

// Obtener una persona por ID
function obtenerPersonaPorId(id) {
    const personas = obtenerPersonas();
    return personas.find(persona => persona.id === id);
}

// Agregar una nueva persona
function agregarPersona(persona) {
    const personas = obtenerPersonas();
    personas.push(persona);
    localStorage.setItem('personas', JSON.stringify(personas));
}

// Actualizar una persona existente
function actualizarPersona(personaActualizada) {
    let personas = obtenerPersonas();
    personas = personas.map(persona => 
        persona.id === personaActualizada.id ? personaActualizada : persona
    );
    localStorage.setItem('personas', JSON.stringify(personas));
}

// Eliminar una persona
function borrarPersona(id) {
    let personas = obtenerPersonas();
    personas = personas.filter(persona => persona.id !== id);
    localStorage.setItem('personas', JSON.stringify(personas));
}