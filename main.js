
(function() {
  
    // 1. CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
    const url = 'https://gdcilptihuoojbwrlbbh.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY2lscHRpaHVvb2pid3JsYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Mzc2NjMsImV4cCI6MjA4NzExMzY2M30.zzdm7zVlFV3T-ANcIWE4FR_JSPC-naSuiMnpgZ5ea9A';
    //const sb = window.supabase.createClient(url, key);
window.sb = window.supabase.createClient(url, key);


    // 2. CARGA DE SEDES (PANTALLA INICIAL CON ANIMACIONES)


    async function cargarSedes() {
        const lista = document.getElementById('lista-sedes');
        if (!lista) return;
        
        const { data: sedes, error } = await sb.from('sedes').select('*');
        if (error) return console.error("Error crítico al conectar con sedes:", error.message);
        
        lista.innerHTML = ''; 
        sedes.forEach(sede => {
            const btn = document.createElement('button');
            btn.className = "fade-in bg-teal-600 text-white p-5 rounded-2xl shadow-md hover:bg-teal-700 active:scale-95 transition-all text-lg font-bold flex justify-between items-center mb-4 w-full";
            btn.innerHTML = `<span>${sede.nombre}</span><span>→</span>`;
            //btn.onclick = () => mostrarMenuPrincipal(sede);
btn.onclick = () => {
    window.sedeActual = sede.id;
    console.log("SEDE SELECCIONADA:", sede.id);
    mostrarMenuPrincipal(sede);
};
            lista.appendChild(btn);
        });

        // --- ADICIÓN SOLICITADA: BOTÓN DE ACCESO ADMIN ---
        const btnAdmin = document.createElement('button');
        btnAdmin.className = "mt-12 w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all italic";
        btnAdmin.innerText = "🔒 Acceso Administrativo";
        btnAdmin.onclick = () => window.panelAdmin();
        lista.appendChild(btnAdmin);
    }
//1. PANEL ADMINISTRATIVO 
window.panelAdmin = async function() {
   // Definimos el usuario internamente como ADMIN
    const usuarioMaestro = "ADMIN";
    
    // Solo pedimos la clave una vez
    const pass = prompt("Introduzca la Clave de Acceso:");
    if (!pass) return;

    // Validamos la clave contra la base de datos usando el usuario quemado
    const validacion = await window.verificarCredencialesSede(usuarioMaestro, pass);

    if (!validacion) {
        return alert("❌ Clave incorrecta. Acceso Denegado.");
    }
    

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="fade-in p-4 max-w-[98%] mx-auto">
            
            <div class="text-center mb-10">
                <span onclick="window.location.reload()" class="text-slate-400 hover:text-[#1e293b] font-black italic text-[10px] uppercase cursor-pointer transition-all tracking-widest">
                    ← MENÚ
                </span>
                
                <h2 class="text-2xl font-black text-slate-800 uppercase italic leading-none">GESTIÓN CENTRAL</h2>
                <p class="text-[9px] text-teal-600 font-black uppercase tracking-[0.3em] mt-1 italic">Administración</p>
            </div>

<div class="mb -1">
                
            </div>

            <div class="flex justify-center gap-2 mb-4 px-2">
                <button onclick="window.abrirModalServicios()" class="bg-blue-600 text-white px-1.5 h-9 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span class="text-sm">💼</span>
                    <span class="text-[9px] font-black uppercase">Servicios</span>
                </button>

                <button onclick="window.seccionGestionarPromos()" class="bg-purple-600 text-white px-1.5 h-8 rounded-xl shadow-md hover:bg-purple-700 transition-all flex items-center gap-2">
                    <span class="text-sm">🎁</span>
                    <span class="text-[9px] font-black uppercase">Promos</span>
                </button>

               <button onclick="window.exportarExcelPro()" class="bg-emerald-600 text-white px-1.5 h-9 rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <span class="text-sm">📊</span>
                    <span class="text-[9px] font-black uppercase">Excel</span>
                </button>

                <button onclick="window.abrirModalSeguridad()" 
                    class="bg-amber-500 text-white px-3 h-9 rounded-xl shadow-md hover:bg-amber-600 transition-all flex items-center gap-2 font-black uppercase">
                    <span class="text-sm">🔐</span>
                    <span class="text-[9px]">Seguridad</span>
                </button>
                          
            </div>
            <div class="flex justify-center w-full my-2">
                <button onclick="window.mostrarGestionEvaluaciones()" 
                    class="bg-sky-500 text-white px-3 h-9 rounded-xl shadow-sm hover:bg-sky-600 active:bg-sky-700 transition-all flex items-center gap-2 border-none">
                    <span class="text-sm">📋</span>
                    <span class="text-[9px] font-black uppercase">Evaluaciones</span>
                </button>
            </div>
            <div class="text-center mb-6">
                <h2 class="text-2xl font-black text-slate-800 uppercase italic leading-none">REPORTE DE CITAS</h2>
                <p class="text-[9px] text-teal-600 font-black uppercase tracking-[0.3em] mt-1 italic"></p>
            </div>
           
            <div id="filtros-admin" class="flex flex-wrap justify-center gap-2 mb-8">
                            
            <button id="btn-todas-admin" onclick="window.filtrarAdmin('TODAS', this)" 
                    style="background-color: #1e293b; color: white; border: 2px solid #1e293b;"
                    class="py-2 px-6 rounded-xl text-[9px] font-black uppercase shadow-md transition-all">
                    TODAS
                </button>   
            
            </div>

            <div class="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col" style="max-height: 500px;">
                
                <div class="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                   <!-- HEADER DINÁMICO -->
                
                <!-- PANEL AGENDAMIENTOS -->
<div id="panel-agendamientos">
    <div id="contenedor-admin" style="overflow-y: auto; max-height: 400px;">
        <p class="animate-pulse text-slate-300 font-bold italic text-xs py-20 text-center uppercase tracking-widest">
            Cargando
        </p>
    </div>
</div>

<!-- PANEL EVALUACIONES -->
<div id="panel-evaluaciones" style="display:none;">
    <div id="contenedor-evaluaciones" style="overflow-y: auto; max-height: 400px;"></div>
</div>
            </div>
        </div>`;

    // Cargar sedes...
    const { data: sedes } = await window.sb.from('sedes').select('*');
    const filtros = document.getElementById('filtros-admin');
    sedes?.forEach(s => {
        const b = document.createElement('button');
        b.className = "bg-white text-slate-800 py-2 px-6 rounded-xl text-[9px] font-black uppercase transition-all shadow-sm border-2 border-slate-50";
        b.innerText = s.nombre;
        b.onclick = (e) => window.filtrarAdmin(s.nombre, e.currentTarget);
        filtros.appendChild(b);
    });

    window.renderizarCitasAdmin('TODAS');
};

window.abrirModalSeguridad = function() {
    const modal = document.createElement('div');
    modal.id = 'modal-seguridad';
    modal.className = "fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4";
    modal.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div class="text-center mb-8">
                <h3 class="text-2xl font-black text-slate-800 uppercase italic">Gestión de Accesos</h3>
                <p class="text-[9px] text-teal-600 font-black uppercase tracking-widest mt-1">Cambio de Contraseña Maestra</p>
            </div>

            <div class="space-y-6">
                <input id="seguridad-usuario" type="hidden" value="ADMIN">

                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-5 mb-2 block italic">Clave Actual</label>
                    <input id="seguridad-actual" type="password" 
                        class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 transition-all text-center" 
                        placeholder="••••">
                </div>

                <div>
                    <label class="text-[10px] font-black text-teal-600 uppercase ml-5 mb-2 block italic">Nueva Clave</label>
                    <input id="seguridad-nueva" type="password" 
                        class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 transition-all text-center" 
                        placeholder="••••">
                </div>
            </div>

            <div class="mt-10 space-y-4">
                <button onclick="window.procesarCambioClave()" 
                    class="w-full bg-slate-800 text-white p-5 rounded-[2rem] font-black text-xs uppercase italic hover:bg-black transition-all shadow-lg">
                    ACTUALIZAR CREDENCIALES
                </button>
                <button onclick="document.getElementById('modal-seguridad').remove()" 
                    class="w-full text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-slate-600 transition-all">
                    CANCELAR
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.procesarCambioClave = async function() {
    // Toma automáticamente el "ADMIN" oculto
    const usuario = document.getElementById('seguridad-usuario').value; 
    const claveActual = document.getElementById('seguridad-actual').value.trim();
    const claveNueva = document.getElementById('seguridad-nueva').value.trim();

    if (!claveActual || !claveNueva) {
        return alert("⚠️ Ingresa la clave actual y la nueva.");
    }

    // Valida contra Supabase usando el usuario ADMIN y la clave actual que pusiste
    const esValido = await window.verificarCredencialesSede(usuario, claveActual);

    if (!esValido) {
        // Esto evita el error de la imagen si la clave actual es correcta
        return alert("❌ La clave actual es incorrecta.");
    }

    try {
        const { error } = await window.sb
            .from('seguridad_accesos')
            .update({ clave: claveNueva })
            .eq('usuario', usuario);

        if (error) throw error;

        alert("✅ Contraseña actualizada con éxito.");
        document.getElementById('modal-seguridad').remove();
    } catch (err) {
        console.error(err);
        alert("Error al conectar con la base de datos.");
    }
};

window.ejecutarCambioClave = async function() {
    // 1. Capturamos los datos del modal
    const usuario = document.getElementById('sec-usuario').value.trim();
    const claveOld = document.getElementById('sec-clave-old').value.trim();
    const claveNew = document.getElementById('sec-clave-new').value.trim();

    if (!usuario || !claveOld || !claveNew) {
        alert("⚠️ Por favor, completa todos los campos.");
        return;
    }

    // 2. Usamos tu función anterior para validar si las credenciales son reales
    const validacion = await window.verificarCredencialesSede(usuario, claveOld);

    if (!validacion) {
        alert("❌ El usuario o la clave actual son incorrectos.");
        return;
    }

    // 3. Si es válido, procedemos a actualizar en Supabase
    try {
        const { error } = await window.sb
            .from('seguridad_accesos')
            .update({ 
                clave: claveNew,
                ultimo_cambio: new Date().toISOString()
            })
            .eq('id', validacion.id); // Usamos el ID que nos devolvió tu función de prueba

        if (error) throw error;

        alert("✅ CONTRASEÑA ACTUALIZADA CON ÉXITO");
        document.getElementById('modal-seguridad').remove();

    } catch (err) {
        console.error("Error al actualizar:", err.message);
        alert("FALLO TÉCNICO: " + err.message);
    }
};


window.verificarCredencialesSede = async function(usuario, claveActual) {
    try {
        const { data, error } = await sb
            .from('seguridad_accesos')
            .select('id, sede_id')
            .eq('usuario', usuario)
            .eq('clave', claveActual)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            console.log("✅ Credenciales correctas para la sede:", data.sede_id);
            return data; // Retorna la info si coincide
        } else {
            console.warn("❌ Usuario o clave incorrectos");
            return null;
        }
    } catch (err) {
        console.error("Error en validación de seguridad:", err.message);
        return null;
    }
};


window.evaluacionesActuales = [];

//                                          EVALUACIONES ADMINISTRADOR

window.mostrarGestionEvaluaciones = async function() {
   const contenedor = document.getElementById('contenedor-evaluaciones');
    // 🔥 CAMBIO DE PANELES
document.getElementById('panel-agendamientos').style.display = 'none';
document.getElementById('panel-evaluaciones').style.display = 'block';
    if (!contenedor) return;

  // 1. Limpiar el contenido previo para eliminar el "doble cuadro"
    contenedor.innerHTML = ''; 
    
    // 2. Forzar que el contenedor use el 100% del ancho disponible
    contenedor.style.width = '100%';
    contenedor.style.maxWidth = 'none';

    // 3. Quitar el límite de ancho al contenedor padre (el que tiene max-w-5xl)
    const padreRaiz = contenedor.closest('.max-w-5xl, .max-w-sm, .max-w-4xl');
    if (padreRaiz) {
        padreRaiz.style.maxWidth = '98%';
    }
    // La última columna de 1.5fr garantiza espacio total para los botones.
    //grid grid-cols-[1fr_2fr_1.2fr_2fr]
    const htmlBase = `
    <div class="w-full animate-in fade-in duration-100">
        <div class="grid grid-cols-[0.2fr_0.5fr_0.5fr_0.5fr] gap- px-2 py-2 bg-slate-50 rounded-t-2xl border border-slate-200 shadow-sm  relative z-[100] bg-slate-50">
            <div class="flex items-center gap-2 cursor-pointer group" onclick="window.abrirFiltroEvaluaciones('fecha')">
                <span class="text-[10px] font-black text-slate-500 uppercase italic">FECHA</span>
                <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div class="flex items-center gap-2 cursor-pointer group border-l border-slate-200 pl-2" onclick="window.abrirFiltroEvaluaciones('paciente')">
                <span class="text-[10px] font-black text-slate-500 uppercase italic">PACIENTE</span>
                <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div class="flex items-center justify-center gap-2 cursor-pointer group border-l border-slate-200 pl-2" onclick="window.abrirFiltroEvaluaciones('servicio')">
                <span class="text-[10px] font-black text-slate-500 uppercase italic">SERVICIO</span>
                <svg class="w-3 h-3 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <div class="text-right border-l border-slate-200 pr-6">
                <span class="text-[10px] font-black text-slate-500 uppercase italic text-slate-400">GESTIÓN</span>
            </div>
        </div>
        <div id="cuerpo-evaluaciones" class="bg-white border-x border-b border-slate-200 rounded-b-2xl shadow-sm min-h-[500px]">
            <div class="py-20 text-center text-slate-400 text-[10px] font-black uppercase italic">Cargando registros...</div>
        </div>
    </div>`;

    contenedor.innerHTML = htmlBase;

    try {
        const { data, error } = await sb.from('evaluaciones').select('*').eq('estado', 'PENDIENTE').order('fecha_evaluacion', { ascending: true });
        if (error) throw error;
        window.evaluacionesActuales = data || [];
        window.renderizarFilasEvaluacion(window.evaluacionesActuales);
    } catch (err) {
        console.error("Error en reinicio de vista:", err);
    }
};

// Función para eliminar evaluación analizada desde la estructura real de la BBDD
window.accionEliminarEvaluacion = async function(id) {
    if (!id) return;
    if (!confirm("¿Está seguro de eliminar esta solicitud de evaluación?")) return;

    try {
        // Usamos la instancia 'sb' que ya está definida globalmente en tu sistema
        const { error } = await sb
            .from('evaluaciones')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert("Solicitud eliminada.");
        
        // Ejecuta la función de refresco que ya usas en tu sistema
        if (typeof window.mostrarGestionEvaluaciones === 'function') {
            window.mostrarGestionEvaluaciones();
        } else {
            location.reload();
        }

    } catch (e) {
        console.error("Error al eliminar:", e);
        alert("Error al eliminar: " + e.message);
    }
};

// SERVICIOS
window.accionRegistrarEvaluacionACliente = async function(p) {
   
   console.log("🚀 INICIO REGISTRO EVALUACION", p);
   if (!p.servicio_id) {
    alert("❌ ERROR: Esta evaluación no tiene servicio_id.\n\nNo se puede continuar.");
    console.error("EVALUACION SIN SERVICIO_ID:", p);
    return;
}

    if (!confirm(`¿DESEA REGISTRAR A ${p.nombre.toUpperCase()} EN EL SISTEMA?`)) return;

    try {
    
        
        const { data: servicio } = await sb
    .from('servicios')
    .select('id, citas_incluidas')
    .eq('id', p.servicio_id)
    .single();

        // VALIDACIÓN CRÍTICA: Si no existe el servicio, detenemos para no guardar basura
        if (!servicio) {
            alert(`❌ ERROR DE VINCULACIÓN: El servicio "${p.promo_titulo}" no existe en la tabla 'servicios'. \n\nVerifique que el nombre sea IDÉNTICO en ambas tablas para poder recuperar el ID.`);
            return; 
        }

        // 2. REGISTRO/ACTUALIZACIÓN EN CLIENTES
        const { error: errorInsert } = await sb
            .from('clientes')
            .upsert([{
                identificacion: p.identificacion,
                nombre: p.nombre,
                telefono: p.telefono,
                sede_id: p.sede_id,
                sesiones_totales: servicio ? servicio.citas_incluidas : 1,
                tratamiento_actual: p.promo_titulo
            }], { onConflict: 'identificacion' });

        if (errorInsert) throw errorInsert;

        // 🔥 OBTENER CLIENTE ID REAL
        const { data: clienteData, error: errorCliente } = await sb
            .from('clientes')
            .select('id')
            .eq('identificacion', p.identificacion)
            .single();

        if (errorCliente) throw errorCliente;

        const clienteId = clienteData.id;

        console.log("👤 Cliente ID:", clienteId);

        // 🔥 VALIDAR O CREAR TRATAMIENTO (NUEVO BLOQUE)
       const { data: tratamientosActivos, error: errorBusqueda } = await sb
    .from('cliente_tratamientos')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('estado', 'activo');

if (errorBusqueda) throw errorBusqueda;

// 🔥 BUSCAR EL TRATAMIENTO CORRECTO
const tratamientoExistente = tratamientosActivos.find(t =>
    t.tratamiento_id === servicio.id
);

        if (errorBusqueda) throw errorBusqueda;

        let clienteTratamientoId;

        if (tratamientoExistente) {
            // ♻️ REUTILIZAR
            clienteTratamientoId = tratamientoExistente.id;
            console.log("♻️ Reutilizando tratamiento:", clienteTratamientoId);

        } else {
            // 🔥 CREAR NUEVO
            console.log("ID SERVICIO QUE SE GUARDARÁ:", servicio.id);
            const { data: nuevoTratamiento, error: errorTratamiento } = await sb
                .from('cliente_tratamientos')
                .insert([{
                    cliente_id: clienteId,
                    sede_id: p.sede_id,
                    tratamiento_id: servicio.id,
                    nombre_tratamiento: p.promo_titulo,
                    sesiones_totales: servicio.citas_incluidas,
                    citas_restantes: servicio.citas_incluidas,
                    estado: 'activo'
                }])
                .select()
                .single();

           // if (errorTratamiento) throw errorTratamiento;
           if (errorTratamiento) {

    // 🔥 ERROR DE DUPLICADO CONTROLADO
    if (errorTratamiento.code === '23505') {
        alert("⚠️ ESTE CLIENTE YA TIENE ESTE SERVICIO ACTIVO.\n\nNo se puede registrar nuevamente.");
        return;
    }

    throw errorTratamiento;
}

            clienteTratamientoId = nuevoTratamiento.id;
            console.log("🔥 Tratamiento ID:", clienteTratamientoId);
        }

        // 3. CREACIÓN EN AGENDAMIENTOS (SESIÓN INICIA EN 0)
        const fechaIso = p.fecha_evaluacion && p.hora_evaluacion 
            ? `${p.fecha_evaluacion}T${p.hora_evaluacion}` 
            : new Date().toISOString();

        // 🚫 VALIDAR DUPLICADO DE CITA (NUEVO BLOQUE)
        const { data: citaExistente, error: errorCita } = await sb
            .from('agendamientos')
            .select('id')
            .eq('cliente_cedula', p.identificacion)
            .eq('servicio_id', servicio.id)
            .eq('fecha_hora', fechaIso)
            .maybeSingle();

        if (errorCita) throw errorCita;

        if (citaExistente) {
            alert("⚠️ Este cliente ya tiene una cita agendada para este servicio en esa fecha y hora.");
            return;
        }

        const { data: nuevoAgendamiento, error: errorAgendamiento } = await sb
            .from('agendamientos')
            .insert([{
                cliente_cedula: p.identificacion,
                sede_id: p.sede_id,
                servicio_id: servicio.id,
                fecha_hora: fechaIso,
                estado: 'agendada',
                nro_sesion_actual: 0,
                cliente_tratamiento_id: clienteTratamientoId 
            }])
            .select()
            .single();

        if (errorAgendamiento) throw errorAgendamiento;

        // 4. ACTUALIZAR EVALUACIÓN
        await sb.from('evaluaciones')
            .update({ 
                estado: 'REGISTRADO', 
                cliente_tratamiento_id: clienteTratamientoId 
            })
            .eq('id', p.id);

        // 5. NOTA FINAL
        const notaAdmin = prompt("REGISTRO EXITOSO. Ingrese observación interna:", "");
        if (notaAdmin !== null) {
            await sb.from('agendamientos')
                .update({ notas: notaAdmin })
                .eq('id', nuevoAgendamiento.id);
        }

        alert("✅ PROCESO COMPLETADO: Cliente en base y Sesión inicial en 0.");
        if (typeof window.mostrarGestionEvaluaciones === 'function') window.mostrarGestionEvaluaciones();

    } catch (error) {
        console.error("Error:", error);
        alert("⚠️ ERROR: " + error.message);
    }
};



window.renderizarFilasEvaluacion = function(lista) {
    const cuerpo = document.getElementById('cuerpo-evaluaciones');
    if (!cuerpo) return;
    
    // Aseguramos que el contenedor admin tenga el ancho máximo para que el grid respire
    const contenedorAdmin = document.getElementById('contenedor-admin');
    if (contenedorAdmin) {
        contenedorAdmin.classList.remove('max-w-4xl', 'max-w-5xl');
        contenedorAdmin.classList.add('max-w-7xl', 'w-full');
    }
    
    let htmlRows = '';
    lista.forEach(p => {
        const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        const fechaObj = new Date(p.fecha_evaluacion + 'T00:00:00');
        const diaNombre = dias[fechaObj.getDay()];

        console.log("EVALUACION RENDER:", p);

        // Proporción corregida: 1.2fr para gestión garantiza que los botones se vean completos
        htmlRows += `
        <div class="grid grid-cols-[1.2fr_1.8fr_1.5fr_1.2fr] gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-all items-center">
            <div class="flex flex-col overflow-hidden">
                <span class="text-[8px] font-black text-indigo-500 uppercase italic">${diaNombre}</span>
                <span class="text-[11px] font-black text-slate-800">${p.fecha_evaluacion}</span>
                <span class="text-[9px] font-bold text-teal-600 mt-1">${p.hora_evaluacion}</span>
            </div>
          
            <div class="flex flex-col">
               <span class="text-[9px] font-black text-slate-900 uppercase">${p.nombre}</span>
               <span class="text-[8px] font-bold text-slate-400 tracking-tighter">${p.identificacion} </span>
              
             </div>

            <div class="flex flex-col">
               <span class="text-[10px] font-black text-slate-800">${p.promo_titulo}</span>
               
             </div>
            
             <div class="flex justify-end gap-3 border-l border-slate-100 pl-1">
              <button onclick="window.accionRegistrarEvaluacionACliente({id: '${p.id}', identificacion: '${p.identificacion}', nombre: '${p.nombre}', telefono: '${p.telefono}', sede_id: '${p.sede_id}', promo_titulo: '${p.promo_titulo}', fecha_evaluacion: '${p.fecha_evaluacion}', hora_evaluacion: '${p.hora_evaluacion}', servicio_id: '${p.servicio_id || ''}'})"
    class="w-5 h-5 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-50 flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
    </svg>
</button>
                <button onclick="window.accionEliminarEvaluacion('${p.id}')"
                    class="w-5 h-5 flex items-center justify-center bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>`;
    });
    cuerpo.innerHTML = htmlRows || `<div class="p-20 text-center text-slate-400 font-black uppercase italic">Sin registros</div>`;
};


window.abrirFiltroEvaluaciones = function(columna) {
    // 1. Validar que existan datos
    if (!window.evaluacionesActuales || window.evaluacionesActuales.length === 0) return;

    // 2. Extraer valores únicos (Limpios)
    const valoresUnicos = [...new Set(window.evaluacionesActuales.map(p => {
        let v = (columna === 'fecha') ? p.fecha_evaluacion : 
                (columna === 'paciente' ? p.nombre : p.promo_titulo);
        return v ? String(v).trim() : "SIN DATOS";
    }))].sort();

    // 3. Crear el Modal (Con Z-Index reforzado)
    const modalHTML = `
    <div id="modal-filtro-excel" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[10000]">
       <div class="bg-white rounded-xl shadow-lg w-[300px] max-h-[400px] overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200">
            <div class="px-3 py-2 border-b flex justify-between items-center bg-slate-50">
                <h3 class="text-[10px] font-black text-slate-700 uppercase italic">FILTRAR POR ${columna.toUpperCase()}</h3>
                <button type="button" id="btn-cerrar-filtro-x" class="text-slate-400 hover:text-red-500 p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"/></svg>
                </button>
            </div>
            
            <div class="p-6 max-h-[350px] overflow-y-auto">
                <label class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer border-b border-slate-100 mb-2">
                    <input type="checkbox" id="check-todo-filtro" checked class="w-5 h-5 rounded text-teal-600">
                    <span class="text-[10px] font-black text-slate-800 uppercase italic">(SELECCIONAR TODO)</span>
                </label>
                <div class="space-y-1">
                    ${valoresUnicos.map(valor => `
                        <label class="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input type="checkbox" name="opcion-filtro-item" value="${valor}" checked class="w-4 h-4 rounded text-teal-600">
                            <span class="text-[10px] font-bold text-slate-600 uppercase">${valor}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="p-2 border-t flex justify-end">
                <button id="btn-ejecutar-filtro-final" type="button" 
                       class="bg-teal-600 text-white text-[10px] px-3 py-1 rounded-lg font-bold hover:bg-teal-700">
                    APLICAR FILTRO 
                </button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // --- LÓGICA DE EVENTOS (Directa y sin intermediarios) ---

    // Cerrar con la X
    document.getElementById('btn-cerrar-filtro-x').onclick = () => document.getElementById('modal-filtro-excel').remove();

    // Seleccionar Todo
    document.getElementById('check-todo-filtro').onchange = (e) => {
        document.querySelectorAll('input[name="opcion-filtro-item"]').forEach(cb => cb.checked = e.target.checked);
    };

    // BOTÓN APLICAR (La solución definitiva)
    document.getElementById('btn-ejecutar-filtro-final').onclick = function() {
        const seleccionados = Array.from(document.querySelectorAll('input[name="opcion-filtro-item"]:checked')).map(cb => cb.value);
        
        let datosFiltrados = [];
        if (seleccionados.length === 0) {
            datosFiltrados = window.evaluacionesActuales;
        } else {
            datosFiltrados = window.evaluacionesActuales.filter(p => {
                let valorActual = (columna === 'fecha') ? p.fecha_evaluacion : 
                                 (columna === 'paciente' ? p.nombre : p.promo_titulo);
                return seleccionados.includes(String(valorActual || "SIN DATOS").trim());
            });
        }

        // Refrescar la tabla
        window.renderizarFilasEvaluacion(datosFiltrados);
        
        // Cerrar modal
        document.getElementById('modal-filtro-excel').remove();
    };
};




// 5. Motor de Filtrado (Único y robusto)
window.aplicarFiltroExcel = function(columna) {
    const modal = document.getElementById('modal-filtro-excel');
    
    try {
        const seleccionados = Array.from(document.querySelectorAll('input[name="opcion-filtro"]:checked')).map(cb => cb.value);
        
        if (seleccionados.length === 0) {
            // Si no hay nada seleccionado, mostramos todo el respaldo original
            window.renderizarFilasEvaluacion(window.evaluacionesActuales);
        } else {
            const filtrados = window.evaluacionesActuales.filter(p => {
                let valor = "";
                if (columna === 'fecha') {
                    valor = p.fecha_evaluacion;
                } else if (columna === 'paciente') {
                    valor = p.nombre;
                } else if (columna === 'servicio') {
                    // VALIDACIÓN DOBLE: Buscamos en promo_titulo o en el nombre del servicio directamente
                    valor = p.promo_titulo || p.servicio_nombre || p.nombre_promocion || "";
                }
                
                return seleccionados.includes(String(valor));
            });

            window.renderizarFilasEvaluacion(filtrados);
        }
    } catch (e) {
        console.error("Error crítico al filtrar columna " + columna + ":", e);
    } finally {
        // REGLA DE ORO: El modal se cierra siempre para no bloquear la pantalla
        if (modal) modal.remove();
    }
};




window.accionRegistrarEvaluacion = async function(evalId, dni, nombre, tel, sede, tratamiento) {
    if (!confirm(`¿DESEA REGISTRAR A ${nombre.toUpperCase()} Y AGENDAR CITA?`)) return;

    try {
        // 1. Insertar en clientes
        const { error: errorCli } = await sb.from('clientes').insert([{
            identificacion: dni,
            nombre: nombre,
            telefono: tel,
            sede_id: sede,
            tratamiento_actual: tratamiento,
            estado: 'ACTIVO'
        }]);
        if (errorCli) throw errorCli;

        // 2. Actualizar estado a REGISTRADO 
        await sb.from('evaluaciones').update({ estado: 'REGISTRADO' }).eq('id', evalId);

        alert("✅ CLIENTE REGISTRADO EXITOSAMENTE");
        
        // 3. Abrir calendario de agendamiento inmediatamente
        if (typeof window.abrirCalendarioAgendamiento === 'function') {
            window.abrirCalendarioAgendamiento(dni, nombre, tratamiento, sede);
        } else {
            console.error("Función de calendario no encontrada.");
        }

        window.mostrarGestionEvaluaciones();

    } catch (e) {
        alert("ERROR: " + e.message);
    }
};


window.agendarEvaluacionDesdeCliente = async function() {
    // 1. ANALISIS DE INTERFAZ: Obtenemos los valores de los inputs
    // Asegúrate de que tus IDs en el HTML sean exactamente estos:
    const nombre = document.getElementById('cliente-nombre')?.value;
    const dni = document.getElementById('cliente-dni')?.value;
    const tel = document.getElementById('cliente-tel')?.value;
    const sedeId = document.getElementById('cliente-sede')?.value; 
    const promo = document.getElementById('promo-titulo')?.innerText;

    // Validación básica antes de procesar
    if (!nombre || !dni || !tel || !sedeId) {
        alert("Por favor, completa todos los campos para agendar tu evaluación.");
        return;
    }

    try {
        const db = window.sb || sb;

        // 2. INSERCIÓN PASO A PASO
        const { data, error } = await db.from('evaluaciones').insert([{
            nombre: nombre,
            identificacion: dni,
            telefono: tel,
            sede_id: sedeId,
            promo_titulo: promo || 'Evaluación General',
            fecha_evaluacion: new Date().toISOString().split('T')[0], // Fecha hoy para pruebas
            hora_evaluacion: new Date().toLocaleTimeString('it-IT'), // Hora actual
            estado: 'PENDIENTE'
        }]).select();

        if (error) throw error;

        // 3. ÉXITO ESTÉTICO
        alert("¡Registro exitoso! Tu evaluación ha sido programada.");
        
        // Limpiar formulario si es necesario
        document.getElementById('form-agendamiento')?.reset();

    } catch (e) {
        console.error("Error en registro cliente:", e);
        alert("Error al agendar: " + e.message);
    }
};

window.confirmarTratamiento = async function(evalId, dni, nombre, tel, sede, promo) {
    if (!confirm(`¿Confirmar el alta de ${nombre}?`)) return;

    try {
        // ANALISIS: En lugar de usar la variable global que puede estar desactualizada,
        // usamos la instancia directa para asegurar que reconozca las nuevas columnas.
        const db = window.sb || sb;

        // PASO A PASO: Primero intentamos la inserción con los nombres exactos de tus tablas
        const { data, error: errInsert } = await db
            .from('clientes')
            .insert([
                {
                    nombre: nombre,
                    identificacion: dni,
                    telefono: tel,
                    sede_id: sede,
                    tratamiento_actual: promo,
                    // Dejamos que la BBDD asigne los valores por defecto (1) 
                    // para evitar el error de 'sesiones_total' si el cache falla.
                    created_at: new Date()
                }
            ])
            .select(); // El select() ayuda a forzar la validación del registro

        if (errInsert) {
            console.error("Error detectado en la inserción:", errInsert);
            throw errInsert;
        }

        // Si la inserción tuvo éxito, procedemos al segundo paso: actualizar la evaluación
        const { error: errUpdate } = await db
            .from('evaluaciones')
            .update({ estado: 'CONVERTIDO' })
            .eq('id', evalId);

        if (errUpdate) throw errUpdate;

        alert("¡Cliente registrado exitosamente!");
        
        // Refrescamos la vista para que desaparezca la tarjeta procesada
        if (typeof window.mostrarGestionEvaluaciones === 'function') {
            window.mostrarGestionEvaluaciones();
        }

    } catch (e) {
        // Análisis del error para no adivinar:
        console.error("Fallo técnico detallado:", e);
        alert("Error en el proceso: " + (e.message || "Consulte la consola para más detalles"));
    }
};





// 1. FUNCIÓN PARA ELIMINAR/DESCARTAR
window.eliminarEvaluacion = async function(id) {
    if (!confirm("¿Está seguro de eliminar esta solicitud de evaluación?")) return;

    try {
        const { error } = await sb.from('evaluaciones').delete().eq('id', id);
        if (error) throw error;
        
        alert("Solicitud eliminada.");
        window.mostrarGestionEvaluaciones(); // Recargamos las tarjetas
    } catch (e) {
        alert("Error al eliminar: " + e.message);
    }
};

window.confirmarTratamiento = async function(evalId, dni, nombre, tel, sede, promo) {
    if (!confirm(`¿Confirmar el alta de ${nombre}?`)) return;

    try {
        const db = window.sb || sb;

        // 1. CREACIÓN DEL OBJETO DE DATOS (Mapeo Estricto)
        // Forzamos el nombre 'sesiones_totales' plural para romper el bucle de error.
        const datosCliente = {
            nombre: nombre,
            identificacion: dni,
            telefono: tel,
            sede_id: sede,
            tratamiento_actual: promo,
            citas_restantes: 1,
            sesiones_totales: 1 // Nombre exacto de image_646414
        };

        console.log("Enviando datos a clientes:", datosCliente);

        // 2. INSERCIÓN
        const { error: errInsert } = await db
            .from('clientes')
            .insert([datosCliente]);

        if (errInsert) {
            // Si el error persiste aquí, el nombre 'sesiones_total' viene del Schema Cache
            // o de un trigger en la base de datos.
            throw errInsert;
        }

        // 3. ACTUALIZACIÓN DE EVALUACIÓN
        const { error: errUpdate } = await db
            .from('evaluaciones')
            .update({ estado: 'CONVERTIDO' })
            .eq('id', evalId);

        if (errUpdate) throw errUpdate;

        alert("¡Cliente registrado exitosamente!");
        window.mostrarGestionEvaluaciones();

    } catch (e) {
        console.error("Error detectado:", e);
        // Si el mensaje sigue diciendo 'sesiones_total', es que Supabase 
        // necesita un refresco manual del esquema.
        alert("Error de esquema: " + e.message);
    }
};

// Función de filtrado para que los botones funcionen
window.filtrarAdmin = function(sede, btn) {
    window.sedeFiltroActual = sede;
    const botones = document.querySelectorAll('#filtros-admin button');
    botones.forEach(b => {
        b.style.backgroundColor = "white";
        b.style.color = "#1e293b";
        b.style.border = "2px solid #f1f5f9";
    });
    btn.style.backgroundColor = "#1e293b";
    btn.style.color = "white";
    btn.style.border = "2px solid #1e293b";
    window.renderizarCitasAdmin(sede);
};

window.guardarNuevoCliente = async function(identificacion, promoId, sesiones) {
    const nombreInput = document.getElementById('reg-nombre');
    const telefonoInput = document.getElementById('reg-telefono');
    
    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();

    // 1. Validación de Nombre
    if (!nombre) {
        alert("Por favor, ingresa tu nombre completo.");
        nombreInput.focus();
        return;
    }

    // 2. VALIDACIÓN ESTRICTA DE CELULAR (09 + 10 dígitos)
    const regexCelular = /^09\d{8}$/;
    
    if (!regexCelular.test(telefono)) {
        alert("El número de teléfono no es válido.\n\nDebe:\n- Empezar con 09\n- Tener exactamente 10 dígitos");
        telefonoInput.focus();
        return;
    }

    // Localizar el botón para feedback visual
    const btn = document.querySelector('#modal-registro-rapido button');
    if (!btn) return;

    try {
        // Bloquear botón para evitar doble clic y registros duplicados
        btn.disabled = true;
        btn.innerText = "REGISTRANDO...";

        // Insertamos en la tabla 'clientes' [Basado en tu estructura de identificacion, nombre, telefono]
        const { data: nuevoCliente, error } = await sb
            .from('clientes')
            .insert([{ 
                identificacion: identificacion, 
                nombre: nombre, 
                telefono: telefono
            }])
            .select()
            .single();

        if (error) {
            // Manejo específico si la identificación ya existe
            if (error.code === '23505') {
                throw new Error("Esta identificación ya está registrada.");
            }
            throw error;
        }

        // 3. ÉXITO: Limpieza y transición
        console.log("Cliente registrado con éxito:", nuevoCliente.nombre);
        
        const modal = document.getElementById('modal-registro-rapido');
        if (modal) modal.remove();

        // PASO CLAVE: Iniciamos el agendamiento automáticamente con los datos del nuevo cliente
        window.procederAgendamientoPromo(nuevoCliente, promoId, sesiones);

    } catch (err) {
        console.error("Error al registrar:", err);
        alert(err.message || "No se pudo registrar al cliente. Verifique su conexión.");
        
        // Reactivar botón en caso de error para que el usuario corrija
        btn.disabled = false;
        btn.innerText = "REGISTRAR Y AGENDAR";
    }
};

// PROMOCIONES 

window.mostrarFormularioIdentificacion = function(promoId, promoTitulo, sesiones) {
  const contenedorPrincipal = document.getElementById('lista-promos-cliente');
    
    if (!contenedorPrincipal) return;

    // 1. Cabecera dinámica: Nombre de la promo + número de citas
    const titulo = document.querySelector('#menu-volatil-promos h3');
    const subtitulo = document.querySelector('#menu-volatil-promos p');
    
    if (titulo) titulo.innerText = "IDENTIFICACIÓN";
    if (subtitulo) {
        subtitulo.innerHTML = `${promoTitulo} <span class="ml-2 bg-white/20 px-2 py-0.5 rounded-lg text-[8px]">${sesiones} CITAS</span>`;
    }

    // 2. Aplicamos scroll al contenedor principal por si el contenido crece
    contenedorPrincipal.className = "p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-gray-50/50 custom-scroll";

    contenedorPrincipal.innerHTML = `
        <div class="space-y-4 animate-in fade-in zoom-in duration-300">
            
            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 italic">Cédula (10 dígitos)</label>
                <input type="text" id="input-cedula" placeholder="0000000000" maxlength="10"
                    oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length === 10) window.verificarClienteAutomatico(this.value, '${promoId}', '${promoTitulo}', ${sesiones}, window.sedeActualId)"
                    class="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-5 text-center text-2xl font-black text-slate-700 outline-none focus:border-orange-500 transition-all shadow-sm">
            </div>

            <div id="grupo-nombre" class="opacity-40 pointer-events-none transition-all">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 italic">Nombre Completo</label>
                <input type="text" id="input-nombre" placeholder="..."
                    oninput="this.value = this.value.replace(/[^a-zA-Z\\s]/g, ''); window.validarBotonConfirmar()"
                    class="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] p-4 text-sm font-bold text-slate-600 outline-none">
            </div>

            <div id="grupo-celular" class="opacity-40 pointer-events-none transition-all">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2 italic">Celular</label>
                <input type="text" id="input-celular" placeholder="09..." maxlength="10"
                    oninput="this.value = this.value.replace(/[^0-9]/g, ''); window.validarBotonConfirmar()"
                    class="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] p-4 text-sm font-bold text-slate-600 outline-none">
            </div>

            <button id="btn-confirmar-datos" disabled
   onclick="window.confirmarDatosIdentificacion('${promoId}', '${promoTitulo}', ${sesiones}, window.sedeActual)"
    class="w-full bg-slate-300 text-white font-black py-5 rounded-[2rem] uppercase italic shadow-lg mt-4 transition-all cursor-not-allowed">
    Confirmar Datos
</button>
        </div>
    `;
};


// Función auxiliar para habilitar el botón según tus reglas
window.validarBotonConfirmar = function() {
    const nombre = document.getElementById('input-nombre').value;
    const celular = document.getElementById('input-celular').value;
    const btn = document.getElementById('btn-confirmar-datos');
    
    // Reglas: Nombre no vacío y Celular empieza con 09 y tiene 10 dígitos
    const celularValido = celular.startsWith('09') && celular.length === 10;
    
    if (nombre.length > 3 && celularValido) {
        btn.disabled = false;
        btn.className = "w-full bg-orange-500 text-white font-black py-5 rounded-[2rem] uppercase italic shadow-lg mt-4 transition-all hover:bg-orange-600 active:scale-95";
    } else {
        btn.disabled = true;
        btn.className = "w-full bg-slate-300 text-white font-black py-5 rounded-[2rem] uppercase italic shadow-lg mt-4 transition-all cursor-not-allowed";
    }
};

// PROMOS
// AGREGAR ESTA FUNCIÓN QUE FALTA EN TU MAIN
window.validarBotonPromos = function() {
    const nombre = document.getElementById('input-nombre').value.trim();
    const celular = document.getElementById('input-celular').value.trim();
    const btn = document.getElementById('btn-confirmar-datos');

    if (!btn) return;

    // Criterio EVAL: Nombre mínimo 3 letras y celular 10 dígitos
    const esValido = nombre.length >= 3 && celular.length === 10;

    if (esValido) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none', 'bg-slate-300');
        btn.classList.add('bg-orange-500');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'pointer-events-none', 'bg-slate-300');
        btn.classList.remove('bg-orange-500');
    }
};

//   PROMOCIONES
window.verificarClienteAutomatico = async function() {
    const inputCedula = document.getElementById('input-cedula');
    const campoNombre = document.getElementById('input-nombre');
    const campoCelular = document.getElementById('input-celular');
    const grupoNombre = document.getElementById('grupo-nombre');
    const grupoCelular = document.getElementById('grupo-celular');

    if (!inputCedula.value) return;

    try {
        const { data: cliente, error } = await sb
            .from('clientes')
            .select('*')
            .eq('identificacion', inputCedula.value.trim())
            .maybeSingle();

        if (error) throw error;

        if (cliente) {
            // COMPARACIÓN ROBUSTA DE SEDE (Se mantiene igual)
            const idCliente = String(cliente.sede_id).trim().toLowerCase();
            const idActual = String(window.sedeSeleccionadaId).trim().toLowerCase();

            if (idCliente !== idActual) {
                alert(" ❌ El cliente pertenece a otra sede.");
                inputCedula.classList.add('border-red-500');
                return;
            }

            // SI ES LA MISMA SEDE:
            inputCedula.classList.remove('border-red-500');
            inputCedula.classList.add('border-green-500');
            
            campoNombre.value = cliente.nombre;
            campoCelular.value = cliente.telefono || "";
            
            campoNombre.readOnly = true;
            campoCelular.readOnly = true;
            campoNombre.classList.add('bg-slate-100');
            campoCelular.classList.add('bg-slate-100');

            grupoNombre.classList.remove('opacity-40', 'pointer-events-none');
            grupoCelular.classList.remove('opacity-40', 'pointer-events-none');

            // --- MEJORA: ACTIVACIÓN INSTANTÁNEA ---
            // Primero llamamos a tu función original
            window.validarBotonPromos();
            
            // Y forzamos el cambio visual del botón de inmediato para evitar el retraso
            const btn = document.getElementById('btn-confirmar-datos');
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('bg-slate-300', 'cursor-not-allowed');
                btn.classList.add('bg-orange-500', 'hover:bg-orange-600', 'cursor-pointer');
            }
            // --------------------------------------

        } else {
            // CLIENTE NUEVO
            inputCedula.classList.remove('border-red-500');
            campoNombre.value = "";
            campoCelular.value = "";
            campoNombre.readOnly = false;
            campoCelular.readOnly = false;
            
            grupoNombre.classList.remove('opacity-40', 'pointer-events-none');
            grupoCelular.classList.remove('opacity-40', 'pointer-events-none');

            campoNombre.oninput = window.validarBotonPromos;
            campoCelular.oninput = window.validarBotonPromos;
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

// SERVICIOS
window.confirmarDatosIdentificacion = async function(promoId, promoTitulo, sesiones, sedeId) {
    
    console.log("🔥 FUNCION EJECUTADA");
    window.promoActual = promoId;

    const btn = document.getElementById('btn-confirmar-datos');
    const idInput = document.getElementById('input-cedula')?.value?.trim();
    const nombreInput = "";
    const celularInput = document.getElementById('input-celular')?.value?.trim() || "";
    const contenedorPrincipal = document.getElementById('lista-promos-cliente');

    console.log("CONTENEDOR:", contenedorPrincipal);

    // ✅ USAMOS SOLO LA GLOBAL (FIX PRINCIPAL)
    const sedeFinal = window.sedeActualId?.trim();

    // 🔥 DEBUG
    console.log("SEDE FINAL:", sedeFinal);
    console.log("CEDULA:", idInput);

    if (!btn || !idInput) return;

    if (!sedeFinal) {
        console.error("❌ SEDE NO DEFINIDA");
        return;
    }

    try {

        // 🔍 BUSCAR CLIENTE
        let { data: cliente, error: errorCheck } = await sb
            .from('clientes')
            .select('*')
            .eq('identificacion', idInput)
            .maybeSingle();

        if (errorCheck) throw errorCheck;

        const totalPromo = parseInt(sesiones) || 1;
        let restantes = totalPromo;

        // 🔥 VALIDAR TRATAMIENTO ACTIVO (DEPURADO)
        if (cliente) {

            console.log("PROMO TITULO RAW:", JSON.stringify(promoTitulo));
            const { data: tratamientoActivo, error: errorTratamiento } = await sb
                .from('cliente_tratamientos')
                .select('id, citas_restantes')
                .eq('cliente_id', cliente.id)
             .ilike('nombre_tratamiento', `%${promoTitulo?.trim()}%`)
                .eq('estado', 'activo')
                .maybeSingle();

            if (errorTratamiento) throw errorTratamiento;

            // ✅ SOLO BLOQUEA SI AÚN TIENE CITAS
            if (tratamientoActivo && tratamientoActivo.citas_restantes > 0) {
                alert(`⚠️ ESTE SERVICIO YA ESTÁ ACTIVO.\n\nLe quedan ${tratamientoActivo.citas_restantes} citas pendientes.`);

                // 🚫 BLOQUEAR BOTÓN
                btn.innerHTML = "SERVICIO YA ACTIVO";
                btn.disabled = true;

                return;
            }
        }

        // 🔥 CREAR CLIENTE SI NO EXISTE
        if (!cliente) {

            const { data: nuevo, error: errorInsert } = await sb
                .from('clientes')
                .insert([{ 
                    nombre: nombreInput, 
                    identificacion: idInput,
                    telefono: celularInput,
                    tratamiento_actual: promoTitulo,
                    citas_restantes: totalPromo,
                    sesiones_totales: totalPromo,
                    sede_id: sedeFinal
                }])
                .select()
                .single();

            if (errorInsert) throw errorInsert;

            cliente = nuevo;

        } else {
            restantes = cliente.citas_restantes || totalPromo;
        }

        const nroCitaActual = Math.max(1, (totalPromo - restantes) + 1);

        // ✅ UI OK
        btn.innerHTML = "DATOS VALIDADOS ✓";
        btn.className = "w-full bg-[#fff7ed] text-[#f97316] font-black py-4 rounded-full uppercase italic shadow-sm mt-4 border border-[#ffedd5] cursor-default";

        // 🔒 BLOQUEAR INPUTS
        document.querySelectorAll('#input-cedula-proc, #input-celular')
            .forEach(i => i && (i.readOnly = true));

        const hoy = new Date().toISOString().split('T')[0];

        let areaCalendario = document.getElementById('area-selector-fecha') || document.createElement('div');

        areaCalendario.id = "area-selector-fecha";
        areaCalendario.className = "mt-10 animate-in fade-in";

        if (!document.getElementById('area-selector-fecha') && contenedorPrincipal) {
            contenedorPrincipal.appendChild(areaCalendario);
        }

        areaCalendario.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-6 py-3 text-center shadow-sm">
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Estado</p>
                    <p class="text-sm font-black text-blue-700 uppercase">
                        Cita <span class="text-lg text-[#f97316]">${nroCitaActual}</span> de <span class="text-lg text-[#f97316]">${totalPromo}</span>
                    </p>
                </div>

                <h4 class="font-black text-[#f97316] uppercase italic text-sm mb-4 tracking-tighter">
                    Seleccione Fecha y Hora
                </h4>
                
                <div class="relative w-full max-w-sm">
                    <input type="date" id="fecha-promo-input" min="${hoy}" 
                        onchange="window.desplegarHorasEstiloProcedimiento(this.value)"
                        class="w-full p-4 bg-white border border-blue-100 rounded-[1.5rem] text-slate-600 font-bold focus:outline-none shadow-sm cursor-pointer">
                </div>
            </div>

            <div id="grid-horas-procedimiento" class="hidden mt-10 grid grid-cols-3 gap-3 px-2"></div>
        `;

    } catch (e) {
        console.error("Error:", e.message);
        if (btn) {
            btn.innerHTML = "REINTENTAR VALIDACIÓN";
            btn.disabled = false;
        }
    }
};


window.desplegarHorasEstiloProcedimiento = async function(fechaSeleccionada) {
    if (!fechaSeleccionada) return;
    
    const grid = document.getElementById('grid-horas-procedimiento');
    grid.innerHTML = '<div class="col-span-3 text-center py-5 text-slate-400 animate-pulse font-bold text-xs uppercase">Consultando disponibilidad...</div>';
    grid.classList.remove('hidden');

    // 1. OBTENER CITAS YA AGENDADAS PARA ESE DÍA
    // Buscamos en la columna fecha_hora (formato timestamp)
    const { data: citasExistentes, error } = await sb.from('citas')
        .select('fecha_hora')
        .gte('fecha_hora', `${fechaSeleccionada} 00:00:00`)
        .lte('fecha_hora', `${fechaSeleccionada} 23:59:59`);

    if (error) { console.error(error); return; }

    // 2. DEFINIR HORARIO SEGÚN EL DÍA
    const [anio, mes, dia] = fechaSeleccionada.split('-').map(Number);
    const diaSemana = new Date(anio, mes - 1, dia).getDay();
    
    if (diaSemana === 0) { // Domingo
        grid.innerHTML = ''; 
        grid.classList.add('hidden');
        return;
    }

    const horasBase = (diaSemana === 6) 
        ? ["09:00", "10:00", "11:00", "12:00", "13:00"] 
        : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    // 3. RENDERIZADO CON CÁLCULO DE CUPOS REALES
    grid.innerHTML = '';
    const cuposMaximos = 3; // Aquí defines cuántas personas puedes atender por hora

    horasBase.forEach(h => {
        const fullTimestamp = `${fechaSeleccionada} ${h}:00`;
        // Contamos cuántas citas coinciden exactamente con esta hora
        const ocupados = citasExistentes.filter(c => c.fecha_hora.includes(`${h}:00`)).length;
        const disponibles = cuposMaximos - ocupados;

        // Solo mostramos la hora si hay cupos > 0
        if (disponibles > 0) {
            grid.innerHTML += `
                <button onclick="window.finalizarAgendamiento('${fechaSeleccionada}', '${h}')"
                    class="bg-white border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:border-blue-400 transition-all active:scale-95 group">
                    <span class="text-lg font-black text-[#1e40af] group-hover:text-blue-600">${h}</span>
                    <span class="text-[9px] font-bold ${disponibles === 1 ? 'text-red-500' : 'text-green-500'} uppercase tracking-widest mt-1">
                        ${disponibles} ${disponibles === 1 ? 'Cupo' : 'Cupos'}
                    </span>
                </button>
            `;
        }
    });

    if (grid.innerHTML === '') {
        grid.innerHTML = '<div class="col-span-3 text-center py-5 text-slate-400 font-bold text-[10px] uppercase italic">No hay turnos disponibles para este día</div>';
    }
};


window.desplegarHorasEstiloProcedimiento = async function(fechaSeleccionada) {
    if (!fechaSeleccionada) return;
    
    const grid = document.getElementById('grid-horas-procedimiento');
    grid.innerHTML = '<div class="col-span-3 text-center py-5 text-slate-400 animate-pulse font-bold text-xs uppercase">Consultando disponibilidad...</div>';
    grid.classList.remove('hidden');

    try {
        // Consultamos disponibilidad
        const { data: citasExistentes, error } = await sb.from('agendamientos')
            .select('fecha_hora')
            .gte('fecha_hora', `${fechaSeleccionada} 00:00:00`)
            .lte('fecha_hora', `${fechaSeleccionada} 23:59:59`)
            .neq('estado', 'cancelada');

        if (error) throw error;

        const [anio, mes, dia] = fechaSeleccionada.split('-').map(Number);
        const diaSemana = new Date(anio, mes - 1, dia).getDay();
        if (diaSemana === 0) { grid.innerHTML = ''; grid.classList.add('hidden'); return; }

        const horasBase = (diaSemana === 6) 
            ? ["09:00", "10:00", "11:00", "12:00", "13:00"] 
            : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

        grid.innerHTML = '';
        const cuposMaximos = 3; 

        horasBase.forEach(h => {
            const ocupados = citasExistentes.filter(c => c.fecha_hora.includes(`${h}:00`)).length;
            const disponibles = cuposMaximos - ocupados;

            if (disponibles > 0) {
                const btn = document.createElement('button');
                btn.className = "bg-white border border-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:border-blue-400 transition-all active:scale-95 group";
                
                // ASIGNACIÓN LIMPIA DE LA FUNCIÓN
                btn.onclick = () => window.finalizarAgendamiento(fechaSeleccionada, h);
                
                btn.innerHTML = `
                    <span class="text-lg font-black text-[#1e40af] group-hover:text-blue-600">${h}</span>
                    <span class="text-[9px] font-bold ${disponibles === 1 ? 'text-red-500' : 'text-green-500'} uppercase tracking-widest mt-1">
                        ${disponibles} ${disponibles === 1 ? 'Cupo' : 'Cupos'}
                    </span>
                `;
                grid.appendChild(btn);
            }
        });

    } catch (err) {
        grid.innerHTML = '<div class="col-span-3 text-center py-5 text-red-500 font-bold text-[10px]">Error de conexión</div>';
    }
};



window.renderizarCalendarioPromo = function(contenedorId, promoId, sesiones) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    // Generamos los próximos 7 días disponibles
    const diasHTML = [];
    const hoy = new Date();
    
    for (let i = 1; i <= 7; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
        const numeroDia = fecha.getDate();
        const fechaISO = fecha.toISOString().split('T')[0];

        diasHTML.push(`
            <button onclick="window.seleccionarDiaPromo('${fechaISO}', this)" 
                class="dia-btn flex flex-col items-center p-4 rounded-3xl border-2 border-slate-50 hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <span class="text-[9px] font-black text-slate-400 group-hover:text-orange-500 uppercase">${nombreDia}</span>
                <span class="text-xl font-black text-slate-700 group-hover:text-orange-600">${numeroDia}</span>
            </button>
        `);
    }

    contenedor.innerHTML = `
        <div class="space-y-6 animate-in fade-in duration-500">
            <p class="text-[10px] font-bold text-slate-400 uppercase text-center italic">Seleccione un día disponible</p>
            <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                ${diasHTML.join('')}
            </div>
            <div id="horarios-promo" class="hidden space-y-4 pt-4 border-t border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase text-center italic">Horarios Disponibles</p>
                <div class="grid grid-cols-3 gap-2" id="lista-horas-promo">
                    </div>
            </div>
        </div>
    `;
};

window.seleccionarDiaPromo = async function(fecha, elemento, promoId, promoTitulo, nroSesionActual) {
    // 1. Resaltar visualmente el día seleccionado
    document.querySelectorAll('.dia-btn').forEach(btn => btn.classList.remove('border-orange-500', 'bg-orange-100'));
    elemento.classList.add('border-orange-500', 'bg-orange-100');

    const seccionHoras = document.getElementById('horarios-promo');
    const listaHoras = document.getElementById('lista-horas-promo');
    seccionHoras.classList.remove('hidden');
    listaHoras.innerHTML = '<div class="col-span-3 text-center py-5 text-slate-400 animate-pulse font-bold text-[9px] uppercase tracking-widest">Verificando Cupos...</div>';

    try {
        // 2. Consulta de ocupación real en la tabla agendamientos
        const { data: ocupados, error } = await sb.from('agendamientos')
            .select('fecha_hora')
            .gte('fecha_hora', `${fecha} 00:00:00`)
            .lte('fecha_hora', `${fecha} 23:59:59`)
            .neq('estado', 'cancelada');

        if (error) throw error;

        // 3. Definir bloques de horas según el día (L-V / Sábados)
        const [anio, mes, dia] = fecha.split('-').map(Number);
        const diaSemana = new Date(anio, mes - 1, dia).getDay();
        const horasBase = (diaSemana === 6) 
            ? ["09:00", "10:00", "11:00", "12:00", "13:00"] 
            : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

        // 4. Renderizado de botones con validación de 3 cupos
        listaHoras.innerHTML = '';
        horasBase.forEach(h => {
            const count = ocupados.filter(c => c.fecha_hora.includes(`${h}:00`)).length;
            const disponibles = 3 - count;

            if (disponibles > 0) {
                listaHoras.innerHTML += `
                    <button onclick="window.finalizarAgendamiento('${fecha}', '${h}', '${promoId}', '${promoTitulo}', ${nroSesionActual})"
                        class="bg-slate-50 hover:bg-orange-500 hover:text-white text-slate-700 font-black py-3 rounded-2xl text-[10px] transition-all active:scale-95 shadow-sm flex flex-col items-center border border-transparent hover:border-orange-600">
                        <span>${h}</span>
                        <span class="text-[7px] opacity-70 uppercase tracking-tighter">${disponibles} Cupos Disp.</span>
                    </button>
                `;
            }
        });

        if (listaHoras.innerHTML === '') {
            listaHoras.innerHTML = '<div class="col-span-3 text-center py-5 text-red-400 font-bold text-[9px] uppercase italic">Sin cupos para este día</div>';
        }

    } catch (err) {
        console.error("Error en selección de día:", err);
        listaHoras.innerHTML = '<div class="col-span-3 text-red-500 text-[9px] font-bold uppercase text-center">Error al conectar con la base de datos</div>';
    }
};


window.cerrarFlujoAgendamiento = function() {
    // 1. Identificamos todos los posibles modales del flujo
    const modales = [
        'modal-registro-rapido',
        'modal-calendario-promo',
        'modal-selector-horas'
    ];

    // 2. Los eliminamos del DOM uno por uno
    modales.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    // 3. Limpiamos las variables globales para que el siguiente cliente empiece de cero
    window.clienteActual = null;
    window.fechaSeleccionada = null;
    window.promoSeleccionadaId = null;
    window.sesionesRestantesPromo = null;

    console.log("Flujo de agendamiento reseteado y cerrado.");
};

window.mostrarRegistroRapido = function(identificacion, promoId, sesiones) {
    // 1. Guardamos los datos de la promo en la memoria para no perderlos
    window.promoSeleccionadaId = promoId;
    window.sesionesRestantesPromo = sesiones;

    const htmlRegistro = `
    <div id="modal-registro-rapido" class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
            <h3 class="font-black text-2xl uppercase italic text-orange-600 mb-2">¡Eres Nuevo!</h3>
            <p class="text-slate-500 text-xs font-bold mb-6 uppercase tracking-wider">Completa tus datos para agendar tu promo</p>
            
            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Identificación</label>
                    <input type="text" id="reg-id" value="${identificacion}" readonly class="w-full bg-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-400 outline-none">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre Completo</label>
                    <input type="text" id="reg-nombre" placeholder="Ej. Juan Pérez" class="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase ml-2">WhatsApp / Celular</label>
                    <input type="tel" id="reg-tel" placeholder="0987654321" class="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-orange-500 outline-none transition-all">
                </div>
            </div>

            <button onclick="window.ejecutarRegistro()" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl mt-8 shadow-lg shadow-orange-200 transition-all uppercase italic tracking-widest">
                LISTO, AGENDAR AHORA
            </button>
            
            <button onclick="document.getElementById('modal-registro-rapido').remove()" class="w-full mt-2 text-slate-400 font-bold text-[10px] uppercase">Cancelar</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', htmlRegistro);
};

window.ejecutarRegistro = async function() {
    const id = document.getElementById('reg-id').value;
    const nombre = document.getElementById('reg-nombre').value;
    const tel = document.getElementById('reg-tel').value;

    if (!nombre || !tel) {
        alert("Por favor completa tu nombre y teléfono");
        return;
    }

    try {
        const nuevoCliente = { identificacion: id, nombre: nombre, telefono: tel };

        // Guardamos en Supabase
        const { data, error } = await sb
            .from('clientes')
            .insert([nuevoCliente])
            .select();

        if (error) throw error;

        // Si se guardó bien, cerramos este modal y abrimos el calendario
        document.getElementById('modal-registro-rapido').remove();
        
        // Llamamos a la función que ya creamos antes
        window.procederAgendamientoPromo(data[0], window.promoSeleccionadaId, window.sesionesRestantesPromo);

    } catch (err) {
        console.error("Error al registrar:", err);
        alert("Hubo un error al guardar tus datos.");
    }
};



// --- PASO 1: FUNCIÓN PARA DIBUJAR EL MODAL DE SERVICIOS (ESTILO FLOTANTE) ---
window.abrirModalServicios = function() {
    const modalHtml = `
    <div id="modal-servicios" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div class="bg-[#0369a1] p-6 text-white flex justify-between items-center">
                <div>
                    <h3 class="font-black text-lg uppercase tracking-tighter leading-none">Gestionar Servicios</h3>
                    <p class="text-[10px] opacity-90 uppercase font-bold italic mt-1">Cascada Spa - Configuración</p>
                </div>
                <button onclick="document.getElementById('modal-servicios').remove()" class="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6">
                <div id="lista-servicios-config" class="space-y-2 max-h-60 overflow-y-auto pr-2 mb-4">
                    <div class="flex flex-col items-center justify-center py-8 opacity-40">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0369a1] mb-2"></div>
                        <p class="text-[9px] font-black uppercase tracking-widest">Consultando Base de Datos...</p>
                    </div>
                </div>
                
                <div class="pt-6 border-t border-slate-100">
                    <div class="inline-block bg-slate-800 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                        Nuevo Servicio
                    </div>
                    
                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-8">
                            <p class="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Nombre del Servicio</p>
                            <input type="text" id="nuevo-servicio-nombre" placeholder="EJ. MASAJE RELAJANTE" 
                                class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase focus:ring-2 focus:ring-[#0369a1] focus:border-transparent outline-none transition-all">
                        </div>
                        
                        <div class="col-span-4">
                            <p class="text-[9px] font-black text-slate-400 uppercase mb-1 text-center">N° de Citas</p>
                            <input type="number" id="nuevo-servicio-citas" placeholder="00" 
                                oninput="if(this.value.length > 2) this.value = this.value.slice(0, 2)"
                                class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-[10px] font-black text-center focus:ring-2 focus:ring-[#0369a1] focus:border-transparent outline-none transition-all">
                        </div>
                    </div>
                    
                    <button onclick="window.guardarNuevoServicio()" 
                        class="w-full mt-5 bg-[#0369a1] text-white font-black py-4 rounded-xl text-[11px] uppercase shadow-lg shadow-blue-100 active:scale-[0.98] transition-all tracking-widest">
                        AGREGAR SERVICIO
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    // Llamamos a la carga de datos inmediatamente al abrir
    if (window.cargarServiciosExistentes) window.cargarServiciosExistentes();
};

window.cargarServiciosExistentes = async function() {
    const listaCont = document.getElementById('lista-servicios-config');
    if (!listaCont) return;

    // Consultamos tus servicios de la base de datos
    const { data: servicios, error } = await sb
        .from('servicios')
        .select('*')
        .order('nombre', { ascending: true });

    if (error) {
        listaCont.innerHTML = `<p class="text-[9px] text-red-500 text-center font-black uppercase">Error al conectar con la base de datos</p>`;
        return;
    }

    if (!servicios || servicios.length === 0) {
        listaCont.innerHTML = `<p class="text-[9px] text-slate-400 italic text-center py-4 uppercase font-bold">No hay servicios registrados aún</p>`;
        return;
    }

    // Dibujamos la lista con el nuevo estilo
    listaCont.innerHTML = servicios.map(s => `
        <div class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2 hover:bg-slate-100 transition-all group">
            <div class="flex flex-col">
                <span class="text-[10px] font-black text-slate-700 uppercase leading-none">${s.nombre}</span>
                <span class="text-[9px] text-[#0369a1] font-bold mt-1 italic uppercase">${s.citas_incluidas} Citas por sesión</span>
            </div>
            <button onclick="window.eliminarServicio('${s.id}', '${s.nombre}')" 
                class="text-slate-300 hover:text-red-500 transition-colors p-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `).join('');
};

// Función auxiliar para eliminar (por si el administrador se equivoca)
window.eliminarServicio = async function(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el servicio "${nombre}"?`)) return;

    const { error } = await sb.from('servicios').delete().eq('id', id);

    if (error) {
        alert("Error al eliminar: " + error.message);
    } else {
        window.cargarServiciosExistentes();
    }
};

// Función para validar mientras el usuario escribe o sale del campo
window.verificarServicioDuplicado = async function(input) {
    const nombre = input.value.trim().toUpperCase();
    if (!nombre) return;

    const { data, error } = await sb
        .from('servicios')
        .select('nombre')
        .eq('nombre', nombre)
        .maybeSingle();

    if (data) {
        alert("⚠️ El servicio '" + nombre + "' ya existe. Por favor, ingresa uno diferente.");
        input.value = ""; // Limpia el campo automáticamente
        input.focus();    // Devuelve el foco para que corrija
    }
};

// --- PASO 3: GUARDAR SERVICIO EN SUPABASE ---
window.guardarNuevoServicio = async function() {
    const nombreInput = document.getElementById('nuevo-servicio-nombre');
    const citasInput = document.getElementById('nuevo-servicio-citas');
    
    if (!nombreInput || !citasInput) return;

    // 1. LIMPIEZA TOTAL: Convertimos a mayúsculas y eliminamos espacios dobles
    const nombreLimpio = nombreInput.value.trim().toUpperCase().replace(/\s+/g, ' ');
    const citas = parseInt(citasInput.value);

    // 2. VALIDACIÓN DE CAMPOS VACÍOS
    if (!nombreLimpio || isNaN(citas)) {
        alert("⚠️ Por favor, completa el nombre y el número de citas.");
        return;
    }

    try {
        // 3. CONSULTA DE SEGURIDAD (Busca en TODA la tabla servicios)
        // Usamos .eq para búsqueda exacta una vez que el nombre está normalizado
        const { data: existente, error: errorCheck } = await sb
            .from('servicios')
            .select('nombre')
            .eq('nombre', nombreLimpio); // Comparación directa en la DB

        if (errorCheck) throw errorCheck;

        // 4. CONTROL DE DUPLICADOS (Si el array tiene algo, ya existe)
        if (existente && existente.length > 0) {
            alert(`❌ EL SERVICIO "${nombreLimpio}" YA ESTÁ REGISTRADO.\n\nNo puedes usar el mismo nombre.`);
            nombreInput.value = ""; // Limpia para obligar al cambio
            nombreInput.focus();
            return; // AQUÍ SE DETIENE TODO
        }

        // 5. INSERCIÓN (Solo si pasó el control de arriba)
        const { error: errorInsert } = await sb.from('servicios').insert([
            { 
                nombre: nombreLimpio, 
                citas_incluidas: citas
            }
        ]);

        if (errorInsert) throw errorInsert;

        // 6. ÉXITO
        alert("✅ Servicio guardado correctamente.");
        nombreInput.value = "";
        citasInput.value = "";
        
        // Refrescar lista si la función existe
        if (typeof window.cargarServiciosExistentes === 'function') {
            window.cargarServiciosExistentes();
        }

    } catch (err) {
        console.error("Error en el sistema de servicios:", err);
        alert("Hubo un error de conexión: " + err.message);
    }
};


// --- PASO 4: CARGAR Y ELIMINAR SERVICIOS (CONTROL TOTAL) ---
window.cargarServiciosAdmin = async function() {
    const container = document.getElementById('lista-servicios-container');
    if (!container) return;

    container.innerHTML = '<p class="text-center text-slate-400 text-[10px] font-black animate-pulse uppercase">ACTUALIZANDO...</p>';

    try {
        const { data: servicios, error } = await supabase
            .from('servicios')
            .select('id, nombre, citas_disponibles') // Especificamos columnas para evitar errores
            .order('nombre', { ascending: true });

        if (error) {
            console.error("Error Supabase:", error);
            container.innerHTML = `<p class="text-center text-red-500 text-[10px] font-black uppercase">ERROR: ${error.message}</p>`;
            return;
        }

        if (!servicios || servicios.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-400 text-[10px] font-black uppercase py-4">NO HAY SERVICIOS</p>';
            return;
        }

        container.innerHTML = ''; 
        servicios.forEach(srv => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2';
            div.innerHTML = `
                <div class="flex flex-col">
                    <span class="text-[11px] font-black text-slate-700 uppercase">${srv.nombre}</span>
                    <span class="text-[9px] font-bold text-[#0369a1] uppercase">CUPO: ${srv.citas_disponibles || 'Ilimitado'}</span>
                </div>
                <button onclick="window.eliminarServicio(${srv.id})" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = '<p class="text-center text-red-500 text-[10px] font-black uppercase">ERROR DE CONEXIÓN</p>';
    }
};


// SERVICIOS


// Finalizar agendamiento Evaluaciones
window.finalizarAgendamientoTotal = async function() {
    const b = document.getElementById('btn-registrar-final');
    
    // Recolectamos los datos con los nombres exactos de tu tabla
    const datos = {
        identificacion: document.getElementById('eval-dni').value.trim(),
        nombre: document.getElementById('eval-nombre').value.trim(),
        telefono: document.getElementById('eval-tel').value.trim(),
        fecha_evaluacion: document.getElementById('fecha-cita').value,
        hora_evaluacion: window.horaSeleccionada,
        sede_id: window.sedeSeleccionada, 
        promo_titulo: window.servicioSeleccionado,
        servicio_id: window.servicioIdSeleccionado,
        estado: 'PENDIENTE'
    };

    b.innerText = "REGISTRANDO...";
    b.disabled = true;
    console.log("SERVICIO_ID FINAL:", window.servicioIdSeleccionado);

    try {
        const { error } = await sb.from('evaluaciones').insert([datos]);

        if (error) throw error;

        // ÉXITO: Feedback visual rápido
        b.innerText = "¡CITA AGENDADA!";
        b.className = "w-full bg-emerald-600 text-white p-5 rounded-[2.5rem] font-black text-sm italic shadow-xl";

        setTimeout(() => {
            // Cerramos el modal y limpiamos
            const modal = document.getElementById('modal-servicios-cliente');
            if (modal) modal.remove();
            alert("✅ Registro exitoso en Evaluaciones");
        }, 1000);

    } catch (err) {
        console.error("Error al guardar:", err);
        alert("Error técnico: " + (err.message || "No se pudo guardar"));
        b.disabled = false;
        b.innerText = "REINTENTAR";
        b.className = "w-full bg-red-500 text-white p-5 rounded-[2.5rem] font-black text-sm italic";
    }
};


// SERVICIOS
// --- FUNCIÓN PARA ELIMINAR (CON CONFIRMACIÓN) ---
window.eliminarServicio = async function(id, nombre) {
    // 1. Confirmación de seguridad
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar el servicio "${nombre}"?\nEsta acción no se puede deshacer.`);
    
    if (!confirmar) return;

    try {
        // 2. Ejecutar la eliminación en Supabase
        const { error } = await sb
            .from('servicios')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // 3. Éxito: Avisamos y refrescamos la lista inmediatamente
        alert(`Servicio "${nombre}" eliminado correctamente.`);
        
        if (typeof window.cargarServiciosExistentes === 'function') {
            window.cargarServiciosExistentes();
        }

    } catch (err) {
        console.error("Error al eliminar servicio:", err);
        alert("No se pudo eliminar el servicio: " + err.message);
    }
};

// CITAS

window.confirmarCancelacion = async function(citaId) {
    const confirmacion = confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción eliminará el agendamiento permanentemente.");
    
    if (confirmacion) {
        try {
            // EL CAMBIO CLAVE: Usar la tabla 'agendamientos'
            const { error } = await sb
                .from('agendamientos')
                .delete()
                .eq('id', citaId);

            if (error) throw error;

            alert("✅ Agendamiento cancelado exitosamente.");
            
            // Refrescar la vista usando los datos de la sede y el cliente
            if (window.abrirModuloUsuario) {
                // Usamos las variables que ya tenemos en memoria
                window.abrirModuloUsuario(window.sedeSeleccionadaId, window.sedeSeleccionada?.nombre || "");
            }

        } catch (err) {
            console.error("Error al cancelar agendamiento:", err);
            alert("❌ No se pudo cancelar el agendamiento. Inténtalo de nuevo.");
        }
    }
};


// PANEL ADMIN 
window.renderizarCitasAdmin = async function(filtroSede = 'TODAS') {

     console.log('FILTRO RECIBIDO:', filtroSede);
     // 🔥 RESTAURAR PANELES CORRECTAMENTE
const panelAg = document.getElementById('panel-agendamientos');
const panelEv = document.getElementById('panel-evaluaciones');

if (panelAg) panelAg.style.display = 'block';
if (panelEv) panelEv.style.display = 'none';
    const cont = document.getElementById('contenedor-admin');
    // 🔥 VOLVER A PANEL AGENDAMIENTOS
document.getElementById('panel-agendamientos').style.display = 'block';
document.getElementById('panel-evaluaciones').style.display = 'none';
    // 🔥 RESTAURAR ESTILOS ORIGINALES
cont.style.width = '';
cont.style.maxWidth = '';

const padreRaiz = cont.closest('.max-w-5xl, .max-w-sm, .max-w-4xl');
if (padreRaiz) {
    padreRaiz.style.maxWidth = '';
}
    if (!cont) return console.error("No se encontró el elemento contenedor-admin");

    const panelPadre = cont.parentElement; 
    const esTodas = filtroSede === 'TODAS';

    const { data: citas, error } = await sb.from('agendamientos')
.select(`
    *,
    sedes(nombre)
`)
    .order('fecha_hora', { ascending: true });

    console.log('CITAS:', citas);
console.log('ERROR:', error);
console.log('PRIMERA CITA COMPLETA:', citas[0]);
citas.forEach(c => console.log('ID:', c.sede_id));

    const { data: clientes } = await sb
    .from('clientes')
    .select('nombre, identificacion, telefono, citas_restantes');

// 🔥 TRAER SALDOS REALES POR TRATAMIENTO
const { data: saldos } = await sb
    .from('vista_perfil_cliente')
    .select('cliente_cedula, nombre_servicio, citas_restantes');

// 🔥 CREAR MAPA DE SALDOS
const mapaSaldos = {};
saldos?.forEach(s => {
    const key = s.cliente_cedula + '_' + (s.nombre_servicio || '').toUpperCase().trim();
    mapaSaldos[key] = s.citas_restantes;
});

const mapaClientes = {};
clientes?.forEach(c => {
    mapaClientes[c.identificacion] = c;
});

const { data: servicios } = await sb
    .from('servicios')
    .select('id, nombre');

const mapaServicios = {};
servicios?.forEach(s => {
    mapaServicios[s.id] = s.nombre;
});
        
    if (error || !citas) {
    console.error('ERROR REAL:', error);
    cont.innerHTML = `<div class="p-10 text-center text-red-500 font-bold">ERROR AL CARGAR DATOS</div>`;
    return;
}


const ID_QUITO = '8f6cfaa9-a71d-446d-9901-4676bf8c1b98';
const ID_VALLE = 'f647104c-e8f5-4134-a9c6-ff3cfbc7ba4e';

// 🔥 NORMALIZAR FILTRO
const filtro = filtroSede.toUpperCase().trim();

const filtradas = citas.filter(c => {
    if (filtro === 'TODAS') return true;

    if (filtro === 'QUITO') {
        return c.sede_id === ID_QUITO;
    }

    if (filtro === 'VALLE' || filtro === 'VALLE DE LOS CHILLOS') {
        return c.sede_id === ID_VALLE;
    }

    return false;
});

const cabeceraExistente = panelPadre.querySelector('.grid');
if (cabeceraExistente) cabeceraExistente.remove();

const nuevoHeader = document.createElement('div');
nuevoHeader.id = 'header-admin';

// Definimos anchos proporcionales: Sede(0.7), Fecha(1), Paciente(1.5), Tratamiento(1.5), Acción(0.8)
nuevoHeader.className = esTodas 
    ? "grid grid-cols-[0.7fr_1fr_1.5fr_1.5fr_0.8fr] gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100 items-center" 
    : "grid grid-cols-[1fr_1.5fr_1.5fr_0.8fr] gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100 items-center";

nuevoHeader.innerHTML = esTodas ? `
    <div class="flex items-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('sede')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Sede</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center justify-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('fecha')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Fecha</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('paciente')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Paciente</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('tratamiento')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Tratamiento</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center justify-end gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('estado')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Acción</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>
` : `
    <div class="flex items-center justify-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('fecha')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Fecha</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('paciente')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Paciente</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('tratamiento')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Tratamiento</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>

    <div class="flex items-center justify-end gap-1 cursor-pointer group" onclick="window.alternarFiltroAdmin('estado')">
        <span class="text-[10px] font-black text-slate-500 uppercase italic">Acción</span>
        <span class="text-[8px] text-slate-400 group-hover:text-teal-600 transition-colors">▼</span>
    </div>
`;

    panelPadre.insertBefore(nuevoHeader, cont);

    cont.innerHTML = ''; 
    const ahora = new Date();
    
    filtradas.forEach(c => {

        console.log('SERVICIO_ID:', c.servicio_id);
console.log('PROMO_ID:', c.promocion_id);

        const cliente = mapaClientes[c.cliente_cedula] || {};
        const f = new Date(c.fecha_hora);
       let estadoFinal = c.estado;
    
        const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const nombreDia = diasSemana[f.getUTCDay()];

        if (estadoFinal === 'cancelada') {
             estadoFinal = 'CANCELADO';
            } else if (f <= ahora) {
                estadoFinal = 'FINALIZADO';
            } else {
                estadoFinal = 'PENDIENTE';
        }

        // LÓGICA DE ACCIÓN PARA EL ADMINISTRADOR (PODER TOTAL)
        let accionHtml = "";
        if (estadoFinal === "FINALIZADO") {
                accionHtml = `<span style="color: #059669;" class="font-black text-[10px] uppercase italic tracking-tighter">FINALIZADO</span>`;
        } else if (estadoFinal === "CANCELADO") {
                accionHtml = `<span style="color: #ef4444;" class="font-black text-[10px] uppercase italic tracking-tighter">CANCELADO</span>`;
        } else if (estadoFinal === "PENDIENTE") {
                accionHtml = `
       <div class="flex gap-2 justify-end items-center flex-nowrap">

        <!-- ❌ CANCELAR -->
    <button 
        onclick="window.cambiarEstadoCita('${c.id}', '${c.fecha_hora}')"
        title="Cancelar"
        class="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-all active:scale-90">
        
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 6l12 12M6 18L18 6" />
        </svg>
    </button>

    <!-- 🔁 REAGENDAR -->
    <button 
        onclick="window.reagendarCitaAdmin('${c.id}', '${c.sede_id}')"
        title="Reagendar"
        class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-all active:scale-90">
        
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0114-7M19 5a9 9 0 00-14 7" />
        </svg>
    </button>

</div>
    `;
}

        let sedeCorto = c.sede_id === '8f6cfaa9-a71d-446d-9901-4676bf8c1b98'
    ? 'QUITO'
    : 'VALLE';

const nombreDelServicio =
    mapaServicios[c.servicio_id] ||
    'SIN TRAT';
    // 🔥 CALCULAR SALDO REAL CORRECTO
const keySaldo = c.cliente_cedula + '_' + (nombreDelServicio || '').toUpperCase().trim();
const saldoReal = mapaSaldos?.[keySaldo] ?? 0;

        const div = document.createElement('div');
       div.className = esTodas 
    ? "grid grid-cols-[45px_45px_95px_45px_90px] gap-1 px-4 py-3 items-center hover:bg-slate-50 border-b border-slate-100 transition-all"
    : "grid grid-cols-[75px_85px_45px_90px] gap-1 px-4 py-3 items-center hover:bg-slate-50 border-b border-slate-100 transition-all";

        div.innerHTML = `
            ${esTodas ? `<div class="text-[8px] font-black text-teal-600 uppercase italic tracking-widest ex-sede">${sedeCorto}</div>` : `<span class="hidden ex-sede">${filtroSede}</span>`}
            
            <div class="flex flex-col items-center justify-center text-center">
                <span class="text-[8px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 uppercase mb-1 tracking-tighter">${nombreDia}</span>
                <span class="text-[10px] font-bold text-slate-700 leading-none ex-fecha">${f.toLocaleDateString()}</span>
                <span class="text-slate-400 italic text-[10px] mt-0.5 ex-hora">${f.getUTCHours().toString().padStart(2, '0')}:00</span>
            </div>

            <!-- PACIENTE -->
<div class="flex flex-col justify-center text-center">
    <span class="font-black text-[10px] uppercase text-slate-800 tracking-tight leading-none ex-paciente">
        ${cliente.nombre || 'N/A'}
    </span>
    <span class="text-[9px] text-slate-400 font-medium ex-id">
        ${cliente.identificacion || ''}
    </span>
</div>

<!-- TRATAMIENTO -->
<div class="flex flex-col justify-center text-center">
    <span class="text-[10px] font-black text-slate-700 uppercase leading-tight">
        ${nombreDelServicio}
    </span>
    <span class="text-[9px] text-teal-600 font-bold italic">
        [Saldo: ${saldoReal}]
    </span>
</div>
                    ${estadoFinal === 'ACTIVO' ? `
                        <button onclick="window.cargarSesionesAdmin('${c.cliente_id}', '${c.clientes?.nombre}')" class="bg-slate-100 p-1 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    ` : ''}
                                  
                <span class="hidden ex-promo-nombre">${nombreDelServicio} </span>
                
                <div class="flex justify-end items-center w-full">${accionHtml}</div>
            <span class="hidden ex-tel">${cliente.telefono || '---'}</span>
            <span class="hidden ex-est">${estadoFinal}</span>
        `;
        cont.appendChild(div);
    });
};

window.reagendarCitaAdmin = function(citaId, sedeId) {
    const nuevaFecha = prompt("Ingrese nueva fecha y hora (YYYY-MM-DD HH:00)");

    if (!nuevaFecha) return;

    window.confirmarReagendamiento(citaId, nuevaFecha, sedeId);
};

window.confirmarReagendamiento = async function(citaId, nuevaFecha, sedeId) {
    try {
        const { error } = await sb.from('agendamientos')
            .update({ fecha_hora: nuevaFecha })
            .eq('id', citaId);

        if (error) throw error;

        alert("✅ Cita reagendada correctamente.");
        window.renderizarCitasAdmin('TODAS');

    } catch (err) {
        console.error(err);
        alert("Error al reagendar: " + err.message);
    }
};



window.alternarFiltroAdmin = function(tipo) {
    console.log('FILTRO ADMIN CLICK:', tipo);
   
 // 🔥 ASEGURAR QUE EL MODAL EXISTA
let modal = document.getElementById('modal-filtro-excel');

if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-filtro-excel';
    modal.className = 'fixed inset-0 bg-black/30 flex items-start justify-center pt-20 z-50';

   modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg w-[300px] max-h-[400px] flex flex-col overflow-hidden">
        
        <!-- HEADER -->
        <div class="flex justify-between items-center px-3 py-2 border-b">
            <span class="text-[11px] font-black uppercase text-slate-600">Filtrar por ${tipo.toUpperCase()} </span>
            <button onclick="document.getElementById('modal-filtro-excel').style.display='none'" 
                    class="text-slate-400 hover:text-red-500 font-bold text-[14px]">✕</button>
        </div>

        <!-- LISTA -->
        <div id="lista-opciones-filtro" class="overflow-y-auto flex-1 p-2"></div>

        <!-- FOOTER -->
        <div class="p-2 border-t flex justify-end">
            <button onclick="window.aplicarFiltroAdmin()" 
                    class="bg-teal-600 text-white text-[10px] px-3 py-1 rounded-lg font-bold hover:bg-teal-700">
                Aplicar Filtro
            </button>
        </div>

    </div>
`;

    document.body.appendChild(modal);
}
   const lista = modal.querySelector('#lista-opciones-filtro');
    const contenedor = document.getElementById('contenedor-admin');

    

    if (!contenedor || !modal) return;

    lista.innerHTML = '';
    let opcionesUnicas = new Set();

    // 1. Lógica según la columna seleccionada
    if (tipo === 'paciente') {
        const etiquetas = contenedor.querySelectorAll('.ex-paciente');
        etiquetas.forEach(el => opcionesUnicas.add(el.innerText.trim()));
    } 
    else if (tipo === 'estado') {
        const etiquetas = contenedor.querySelectorAll('.ex-est');
        etiquetas.forEach(el => opcionesUnicas.add(el.innerText.trim()));
    }
   else if (tipo === 'fecha') {
    // Extraemos las fechas usando la clase que definiste: ex-fecha
    const etiquetas = contenedor.querySelectorAll('.ex-fecha');
    etiquetas.forEach(el => {
        const fecha = el.innerText.trim();
        if (fecha) opcionesUnicas.add(fecha);
    });
}
else if (tipo === 'sede') {
    const etiquetas = contenedor.querySelectorAll('.ex-sede');
    etiquetas.forEach(el => {
        const sede = el.innerText.trim();
        if (sede) opcionesUnicas.add(sede);
    });
}
else if (tipo === 'tratamiento') {
    const etiquetas = contenedor.querySelectorAll('.ex-promo-nombre');
    etiquetas.forEach(el => {
        const tratamiento = el.innerText.trim();
        if (tratamiento) opcionesUnicas.add(tratamiento);
    });
}

    // Ordenamos las opciones (en fechas, el orden alfabético simple suele servir para DD/MM)
    const opcionesOrdenadas = Array.from(opcionesUnicas).sort();

    // 2. Construir el Modal
    let html = `
        <div class="sticky top-0 bg-white border-b p-2 mb-1">
            <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" id="chk-todos-excel" checked class="w-4 h-4 accent-teal-600" 
                       onchange="document.querySelectorAll('.chk-filtro-generico').forEach(c => c.checked = this.checked)">
                <span class="text-[10px] font-black uppercase italic text-slate-600">(SELECCIONAR TODO)</span>
            </label>
        </div>
    `;

    opcionesOrdenadas.forEach(opt => {
        html += `
            <label class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" class="chk-filtro-generico w-4 h-4 accent-teal-600" value="${opt}" data-tipo="${tipo}" checked>
                <span class="text-[11px] font-bold text-slate-700 uppercase">${opt}</span>
            </label>
        `;
    });

    lista.innerHTML = html;
    modal.style.display = 'flex';
  
};

window.aplicarFiltroAdmin = function() {

    const modal = document.getElementById('modal-filtro-excel');
    const checks = document.querySelectorAll('.chk-filtro-generico:checked');

    if (!checks.length) return;

    // 🔥 OBTENER TIPO DE FILTRO
    const tipo = checks[0].dataset.tipo;

    // 🔥 VALORES SELECCIONADOS
    const valores = Array.from(checks).map(c => c.value.trim());

    const filas = document.querySelectorAll('#contenedor-admin > div');

    filas.forEach(fila => {

        let valorFila = '';

        if (tipo === 'paciente') {
            valorFila = fila.querySelector('.ex-paciente')?.innerText.trim();
        }
        else if (tipo === 'estado') {
            valorFila = fila.querySelector('.ex-est')?.innerText.trim();
        }
        else if (tipo === 'fecha') {
            valorFila = fila.querySelector('.ex-fecha')?.innerText.trim();
        }
        else if (tipo === 'sede') {
            valorFila = fila.querySelector('.ex-sede')?.innerText.trim();
        }
        else if (tipo === 'tratamiento') {
            valorFila = fila.querySelector('.ex-promo-nombre')?.innerText.trim();
        }

        if (valores.includes(valorFila)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }

    });

    // 🔥 cerrar modal
    if (modal) modal.style.display = 'none';
};

window.aplicarFiltroExcel = function() {
    const checks = document.querySelectorAll('.chk-filtro-generico:checked');
    const seleccionados = Array.from(checks).map(cb => cb.value);
    
    const primerCheck = document.querySelector('.chk-filtro-generico');
    if (!primerCheck) {
        document.getElementById('modal-filtro-excel').style.display = 'none';
        return;
    }
    const tipoFiltro = primerCheck.getAttribute('data-tipo');

    const contenedor = document.getElementById('contenedor-admin');
    if (!contenedor) return;

    const filas = contenedor.querySelectorAll('.grid');

    filas.forEach(fila => {
        // Mapeo de selectores según el tipo de filtro
        let selector = '.ex-paciente'; // por defecto
        if (tipoFiltro === 'estado') selector = '.ex-est';
        if (tipoFiltro === 'fecha') selector = '.ex-fecha';
        if (tipoFiltro === 'sede') selector = '.ex-sede';
        if (tipoFiltro === 'tratamiento') selector = '.ex-promo-nombre';

        const elValor = fila.querySelector(selector);
        
        if (elValor) {
            const valorFila = elValor.innerText.trim();
            
            if (seleccionados.includes(valorFila)) {
                fila.style.setProperty('display', 'grid', 'important');
            } else {
                fila.style.setProperty('display', 'none', 'important');
            }
        }
    });

    document.getElementById('modal-filtro-excel').style.display = 'none';
};



// SOLUCIÓN PARA EL ADMINISTRADOR
window.cambiarEstadoCita = async function(id, fechaHora) {
    // Llamamos a la función maestra. 
    // Pasamos null en clienteId y saldo porque el admin no los necesita para refrescar su tabla.
    await window.cancelarCita(id, fechaHora, null, null);
};

// --- FUNCIÓN PARA QUE EL ADMIN CARGUE SESIONES DESPUÉS DE LA EVALUACIÓN ---
window.cargarSesionesAdmin = function(clienteId, nombre) {
    const modal = document.getElementById('modal-sesiones');
    const input = document.getElementById('input-num-sesiones');
    const btn = document.getElementById('btn-confirmar-sesiones');
    const titulo = document.getElementById('modal-titulo');

    titulo.innerText = `SESIONES PARA: ${nombre}`;
    input.value = "12"; // Valor por defecto
    modal.style.display = 'flex';
    input.focus();

    // Al hacer clic en confirmar
    btn.onclick = async () => {
        const num = parseInt(input.value);
        if (isNaN(num) || num < 1 || input.value.length > 2) {
            alert("Ingrese un número válido de 1 o 2 dígitos");
            return;
        }

        modal.style.display = 'none';

        try {
            const { count } = await sb.from('citas').select('*', { count: 'exact', head: true }).eq('cliente_id', clienteId);
            const saldoNuevo = num - (count || 0);

            await sb.from('clientes').update({ 
                sesiones_totales: num,
                citas_restantes: saldoNuevo 
            }).eq('id', clienteId);

            alert("✅ Plan actualizado");
            window.renderizarCitasAdmin();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };
};

window.exportarExcelPro = function() {
    const contenedor = document.getElementById('contenedor-admin');
    if (!contenedor) return alert("Error: No se encontró el contenedor de citas.");

    const filasHTML = Array.from(contenedor.querySelectorAll('div.grid'));
    const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    
    let excelTemplate = `<html><head><meta charset="UTF-8">
        <style>
            .header { background: #0d9488; color: white; font-family: sans-serif; font-size: 14pt; font-weight: bold; text-align: center; }
            .col-h { background: #f1f5f9; border: 1px solid #000; font-family: sans-serif; font-size: 10pt; font-weight: bold; text-align: center; }
            .celda { border: 1px solid #000; font-family: sans-serif; font-size: 9pt; padding: 4px; }
        </style>
    </head><body>
    <table>
        <tr><td colspan="9" class="header">CASCADA SPA - REPORTE DE CITAS</td></tr>
        <tr><td colspan="9"></td></tr>
        <tr>
            <th class="col-h">SEDE</th>
            <th class="col-h">FECHA</th>
            <th class="col-h">DÍA</th>
            <th class="col-h">HORA</th>
            <th class="col-h">PACIENTE</th>
            <th class="col-h">ID/CEDULA</th>
            <th class="col-h">TELEFONO</th>
            <th class="col-h" style="width: 160pt;">SERVICIO / PROMO</th>
            <th class="col-h">ESTADO</th>
        </tr>`;

    filasHTML.forEach(f => {
        const fechaTxt = f.querySelector('.ex-fecha')?.innerText || "";
        const [d, m, a] = fechaTxt.split('/');
        const dObj = new Date(a, m - 1, d);
        const nombreDia = diasSemana[dObj.getDay()] || "---";

        // Capturamos el nombre real que inyectamos en el Paso 1
        const servicioReal = f.querySelector('.ex-promo-nombre')?.innerText || "SERVICIO GENERAL";

        excelTemplate += `<tr>
            <td class="celda">${(f.querySelector('.ex-sede')?.innerText || "").toUpperCase()}</td>
            <td class="celda" style="text-align:center;">${fechaTxt}</td>
            <td class="celda" style="text-align:center;">${nombreDia}</td>
            <td class="celda" style="text-align:center;">${f.querySelector('.ex-hora')?.innerText || ""}</td>
            <td class="celda">${(f.querySelector('.ex-paciente')?.innerText || "").toUpperCase()}</td>
            <td class="celda" style="text-align:center;">${f.querySelector('.ex-id')?.innerText || ""}</td>
            <td class="celda" style="text-align:center;">${f.querySelector('.ex-tel')?.innerText || ""}</td>
            <td class="celda" style="text-align:left;">${servicioReal.toUpperCase()}</td>
            <td class="celda" style="text-align:center; font-weight:bold;">${(f.querySelector('.ex-est')?.innerText || "").toUpperCase()}</td>
        </tr>`;
    });

    excelTemplate += `</table></body></html>`;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_Cascada_Spa_${new Date().getTime()}.xls`;
    link.click();
};
window.seccionGestionarPromos = function() {
    // 1. Eliminar modal previo si existe para evitar duplicados en el DOM
    const modalPrevio = document.getElementById('modal-promos');
    if (modalPrevio) modalPrevio.remove();

    // 2. Crear la estructura modal evolucionada (Purple style)
    const modalHtml = `
    <div id="modal-promos" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-90 duration-300">
            
            <div class="bg-purple-700 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 class="font-black text-xl uppercase tracking-wider leading-none">Gestionar Promociones</h3>
                    <p class="text-[10px] opacity-80 uppercase font-bold mt-1">Administración de Ofertas</p>
                </div>
                <button onclick="document.getElementById('modal-promos').remove()" class="hover:bg-white/20 p-2 rounded-full transition-colors">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="p-6 space-y-5">
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Título de la Promo</label>
                        <input type="text" id="promo-titulo" placeholder="EJ. 2X1 EN LIMPIEZA" 
                            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase focus:border-purple-700 focus:bg-white outline-none transition-all">
                    </div>
                    
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Descripción</label>
                        <textarea id="promo-desc" placeholder="DETALLES..." 
                            class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase focus:border-purple-700 focus:bg-white outline-none transition-all h-20 resize-none"></textarea>
                    </div>

                    <div class="flex items-center justify-between gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <label class="text-[10px] font-black text-slate-600 uppercase">Número de sesiones requeridas</label>
                        
                        <input type="text" id="promo-citas" placeholder="00" value="1"
                            maxlength="2"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '');" 
                            class="w-16 h-12 bg-white border-2 border-slate-200 focus:border-purple-700 rounded-xl px-2 text-[16px] font-black text-purple-700 text-center outline-none transition-all shadow-inner">
                    </div>

                    <button onclick="window.guardarPromocion()" 
                        class="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-4 rounded-2xl text-[11px] uppercase shadow-lg shadow-purple-100 active:scale-95 transition-all">
                        PUBLICAR PROMOCIÓN
                    </button>
                </div>

                <div class="border-t border-slate-100 pt-4">
                    <p class="text-[10px] font-black text-slate-400 uppercase mb-3 text-center">Promociones Activas</p>
                    <div id="lista-promos-admin" class="space-y-2 max-h-40 overflow-y-auto pr-1">
                        <p class="text-center text-[9px] font-black uppercase animate-pulse py-4">Sincronizando con base de datos...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 3. Ejecutar la carga de datos existente
    if (typeof window.renderizarPromosAdmin === 'function') {
        window.renderizarPromosAdmin();
    }
};



// FUNCIÓN PARA RENDERIZAR LA LISTA EN EL ADMIN
window.renderizarPromosAdmin = async function() {
    const lista = document.getElementById('lista-promos-admin');
    const { data: promos } = await sb.from('promociones').select('*').order('created_at', { ascending: false });

    if (!promos || promos.length === 0) {
        lista.innerHTML = '<p class="text-center text-slate-300 italic text-xs py-4">No hay promociones activas.</p>';
        return;
    }

    lista.innerHTML = promos.map(p => `
        <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
                <p class="font-bold text-slate-800 text-sm uppercase italic">${p.titulo}</p>
                <p class="text-[10px] text-slate-500">${p.descripcion || ''}</p>
            </div>
            <button onclick="window.eliminarPromocion('${p.id}')" 
                class="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase italic border border-red-100">
                Eliminar
            </button>
        </div>
    `).join('');
};

// 1. FUNCIÓN PARA GUARDAR LA PROMO
window.guardarPromocion = async function() {
    // 1. Captura de elementos para validación visual
    const inputTitulo = document.getElementById('promo-titulo');
    const inputDesc = document.getElementById('promo-desc');
    const inputCitas = document.getElementById('promo-citas');

    const titulo = inputTitulo.value.trim();
    const descripcion = inputDesc.value.trim();
    const citas = inputCitas.value.trim();

    // 2. Validación Quirúrgica: El número de citas ES REQUERIDO y debe ser > 0
    if (!titulo || !descripcion || !citas || parseInt(citas) <= 0) {
        // Feedback visual: resaltamos en rojo los campos vacíos
        if (!titulo) inputTitulo.classList.add('border-red-500');
        if (!descripcion) inputDesc.classList.add('border-red-500');
        if (!citas || parseInt(citas) <= 0) inputCitas.classList.add('border-red-500');

        alert("⚠️ EL NÚMERO DE SESIONES ES REQUERIDO Y DEBE SER MAYOR A CERO");
        
        // Limpiar el color rojo después de 2 segundos para mantener la elegancia
        setTimeout(() => {
            inputTitulo.classList.remove('border-red-500');
            inputDesc.classList.remove('border-red-500');
            inputCitas.classList.remove('border-red-500');
        }, 2000);
        
        return; // Detenemos la ejecución aquí
    }

    try {
        // 3. Inserción en Supabase con la nueva columna 'cantidad_citas'
        const { error } = await sb
            .from('promociones')
            .insert([{
                titulo: titulo,
                descripcion: descripcion,
                cantidad_citas: parseInt(citas) // Convertimos a número entero
            }]);

        if (error) throw error;

        alert("✅ PROMOCIÓN PUBLICADA CON ÉXITO");

        // 4. Limpieza y actualización
        inputTitulo.value = "";
        inputDesc.value = "";
        inputCitas.value = "1";
        
        if (typeof window.renderizarPromosAdmin === 'function') {
            window.renderizarPromosAdmin();
        }

    } catch (err) {
        console.error("Error al guardar promo:", err);
        alert("❌ Error de conexión: " + err.message);
    }
};

// 2. FUNCIÓN PARA ELIMINAR LA PROMO
window.eliminarPromocion = async function(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta promoción?")) return;

    try {
        const { error } = await sb.from('promociones').delete().eq('id', id);

        if (error) throw error;

        alert("✅ Promoción eliminada.");
        
        // Refrescamos la lista para ver el cambio
        await window.renderizarPromosAdmin();
        
    } catch (err) {
        console.error("Error al eliminar promo:", err);
        alert("No se pudo eliminar.");
    }
};



 // 3. MENÚ PRINCIPAL (VERSIÓN COMPACTA Y PROFESIONAL)
// 1.- repeticion uno de la funcion 
    function mostrarMenuPrincipal(sede) {
        window.sedeSeleccionadaId = sede.id;
        const main = document.getElementById('main-content');
        main.innerHTML = `
          <div class="fade-in p-2 text-center max-w-[98%] mx-auto">
                <button onclick="window.location.reload()" class="text-teal-600 font-black mb-2 flex items-center italic text-[9px] hover:opacity-70 transition-all">
                    ← INICIO
                </button>
                
                <h2 class="text-lg font-black text-slate-800 mb-0 italic uppercase leading-none">${sede.nombre}</h2>
                <p class="text-slate-400 mb-4 text-[8px] tracking-[0.2em] uppercase italic font-bold">Seleccione Atención</p>
                
                <div class="grid grid-cols-1 gap-2">
                    
                         <button onclick="window.mostrarSeccionServicios('${sede.id}', '${sede.nombre}')" 
                              class="bg-white border-2 border-emerald-400 p-3 rounded-2xl shadow-sm active:scale-95 transition-all text-left flex items-center gap-3">
    
                         <div class="bg-emerald-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm shadow-sm">1</div>
    
                               <div class="flex-1">
                                    <div class="text-emerald-600 font-black text-[13px] italic uppercase leading-none">SERVICIOS</div>
                                    <p class="text-slate-500 text-[9px] italic font-medium leading-tight mt-0.5">Evaluación y registro inicial</p>
                               </div>
                        </button>

                        <button onclick="window.abrirModuloUsuario('${sede.id}', '${sede.nombre}')" class="bg-white border-2 border-slate-200 p-3 rounded-2xl shadow-sm active:scale-95 transition-all text-left flex items-center gap-3">
                                <div class="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm shadow-sm">2</div>
                                   <div class="flex-1">
                                      <div class="text-slate-800 font-black text-[13px] italic uppercase leading-none">USUARIO</div>
                                          <p class="text-slate-500 text-[9px] italic font-medium leading-tight mt-0.5">Controles y citas agendadas</p>
                                      </div>
                       </button>

                        <button onclick="window.verPromocionesCliente('${sede.id}', '${sede.nombre}')" 
                                    class="bg-white border-2 border-orange-400 p-3 rounded-2xl shadow-sm active:scale-95 transition-all text-left flex items-center gap-3">
                                <div class="bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm shadow-sm">3</div>
                                    <div class="flex-1">
                                        <div class="text-orange-600 font-black text-[13px] italic uppercase leading-none">PROMOCIONES </div>
                                            <p class="text-slate-500 text-[9px] italic font-medium leading-tight mt-0.5">Ofertas y horarios especiales</p>
                                        </div>
                        </button>

                </div>
            </div>
        `;
    }


window.verPromocionesCliente = async function(idSede, nombreSede) {
    // Guardamos la sede en variables globales para no perder el contexto
    window.sedeActualId = idSede;
    window.sedeActualId = String(idSede).trim();
    window.sedeActualNombre = nombreSede;

    // 1. Limpieza de cualquier menú previo
    const menuPrevio = document.getElementById('menu-volatil-promos');
    if (menuPrevio) menuPrevio.remove();

    // 2. Estructura del contenedor volátil (Nuevos Colores Coherentes con la Imagen)
    const htmlBase = `
    <div id="menu-volatil-promos" class="fixed inset-0 bg-orange-950/20 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
        <div class="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] border-2 border-orange-400 shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 duration-500">
            
            <div class="bg-gradient-to-r from-orange-400 to-orange-600 p-8 text-white relative">
                <button onclick="document.getElementById('menu-volatil-promos').remove()" class="absolute top-6 right-6 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="font-black text-2xl uppercase tracking-tighter italic">Promociones </h3>
                <p class="text-orange-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">${nombreSede}</p>
            </div>

            <div id="lista-promos-cliente" class="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-gray-50/50">
                <div class="flex flex-col items-center py-10">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p class="text-[10px] font-black text-orange-900 mt-4 uppercase">Buscando las mejores ofertas...</p>
                </div>
            </div>

            <div class="p-6 bg-white border-t border-gray-100 text-center">
                <p class="text-[9px] font-bold text-gray-400 uppercase italic">Sujeto a disponibilidad de agenda y horarios</p>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', htmlBase);

    // 3. Carga de datos desde Supabase
    try {
        const { data: promos, error } = await sb
            .from('promociones')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const contenedor = document.getElementById('lista-promos-cliente');
        contenedor.innerHTML = `<p class="text-center py-10 font-bold text-gray-400 uppercase text-xs">Cargando promociones...</p>`;
        
        if (!promos || promos.length === 0) {
            contenedor.innerHTML = `<p class="text-center py-10 font-bold text-gray-400 uppercase text-xs">No hay promociones activas.</p>`;
            return;
        }

        contenedor.innerHTML = promos.map(p => `
            <div class="bg-white p-5 rounded-[2rem] border-2 border-transparent hover:border-orange-400 shadow-sm hover:shadow-xl transition-all group cursor-pointer" 
                 onclick="window.mostrarFormularioIdentificacion('${p.id}', '${p.titulo}', ${p.cantidad_citas})">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-black text-slate-900 uppercase text-sm group-hover:text-orange-600 transition-colors">${p.titulo}</h4>
                    <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        ${p.cantidad_citas} Sesiones
                    </span>
                </div>
                <p class="text-slate-500 text-[11px] font-medium leading-relaxed">${p.descripcion}</p>
                <div class="mt-4 flex items-center text-orange-600 font-black text-[10px] uppercase tracking-wider">
                    Elegir promoción 
                    <svg class="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Error al cargar promos:", err);
        document.getElementById('lista-promos-cliente').innerHTML = `<p class="text-red-500 text-center text-xs font-bold p-4 uppercase">Error al conectar con la base de datos</p>`;
    }
};   

window.mostrarSeccionServicios = async function(idSede, nombreSede) {
    // 1. Crear el contenedor del modal volátil
    
        window.sedeActualId = idSede;
    window.sedeActualNombre = nombreSede;
    const modal = document.createElement('div');
    modal.id = 'modal-servicios-cliente';
    modal.className = 'fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300';
    
    modal.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-300 border-2 border-emerald-400">
            
            <div class="bg-emerald-500 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 class="font-black text-xl uppercase tracking-tighter leading-none italic">Nuestros Servicios</h3>
                    <p class="text-[10px] opacity-90 uppercase font-bold mt-1">Sede: ${nombreSede} </p>
                </div>
                <button onclick="this.closest('#modal-servicios-cliente').remove()" class="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="p-6">
                <div id="lista-servicios-cliente" class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    <div class="flex flex-col items-center justify-center py-10 opacity-40">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                        <p class="text-[10px] font-black uppercase tracking-widest">Sincronizando catálogo...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 2. Llamar a la carga de datos inmediatamente
    window.cargarServiciosParaCliente(idSede);
};

window.cargarServiciosParaCliente = async function(sede) {
    const contenedor = document.getElementById('lista-servicios-cliente');
    if (!contenedor) return;

    try {
        const { data: servicios, error } = await sb
            .from('servicios')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        if (!servicios || servicios.length === 0) {
            contenedor.innerHTML = '<p class="text-center text-[10px] font-black uppercase text-slate-400 py-10">No hay servicios disponibles</p>';
            return;
        }
contenedor.innerHTML = '';
        servicios.forEach(srv => {
            const card = document.createElement('div');
            // Diseño de fila horizontal con hover suave
            card.className = 'flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:bg-white hover:border-emerald-200 transition-all group';
            
            card.innerHTML = `
                <div class="flex-1 pr-4">
                    <h4 class="text-[11px] font-black text-slate-800 uppercase italic leading-none">${srv.nombre} </h4>
                    <p class="text-[8px] font-bold text-emerald-500 uppercase italic mt-1">${srv.citas_incluidas || '00'} CITAS DISPONIBLES</p>
                </div>
                
                <div class="flex gap-1.5">
               <button onclick="window.prepararBusquedaEvaluacion('${srv.id}','${srv.nombre}', '${sede}')"
                    class="bg-white border border-emerald-500 text-emerald-600 font-black px-3 py-2 rounded-xl text-[9px] uppercase hover:bg-emerald-500 hover:text-white transition-all active:scale-90 italic shadow-sm">
                    EVAL
                </button>

                 



<button onclick="window.abrirMenuProcedimientos('${srv.nombre}', '${sede === '8f6cfaa9-a71d-446d-9901-4676bf8c1b98' ? 'QUITO' : 'VALLE DE LOS CHILLOS'}', ${srv.citas_incluidas || 0})"
    class="bg-emerald-500 text-white font-black px-3 py-2 rounded-xl text-[9px] uppercase shadow-md hover:bg-emerald-600 transition-all active:scale-90 italic">
    PROC
</button>


                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error("Error:", err);
        contenedor.innerHTML = '<p class="text-center text-red-500 text-[10px] font-black uppercase italic">Error de sincronización</p>';
    }
};

window.activarFaseCalendario = function(servicio, identificacion) {
    const boxCalendario = document.getElementById('box-calendario-proc');
    const btnConfirmar = document.getElementById('btn-confirmar-paciente');

    // 1. Ocultamos el botón de confirmar para evitar doble clic y limpiar la vista
    if (btnConfirmar) btnConfirmar.classList.add('hidden');

    // 2. Inyectamos el input de fecha con estilo profesional
    boxCalendario.innerHTML = `
        <div class="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <label class="text-[10px] font-black uppercase text-gray-500 tracking-widest">Seleccione Fecha de Sesión</label>
            </div>
            
            <div class="relative">
                <input type="date" id="fecha-procedimiento" 
                    class="w-full p-4 bg-gray-50 border-2 border-blue-100 focus:border-blue-500 rounded-2xl font-bold text-gray-700 outline-none transition-all shadow-inner"
                    min="${new Date().toISOString().split('T')[0]}"
                    onchange="window.cargarHorasProcedimiento(this.value, '${servicio}', '${identificacion}')">
            </div>

            <div id="grid-horas-procedimiento" class="grid grid-cols-3 gap-2 hidden pt-2">
                </div>
        </div>
    `;

    // 3. Mostramos el contenedor
    boxCalendario.classList.remove('hidden');
    
    // Hacer scroll suave hacia abajo para ver el calendario
    boxCalendario.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.cargarHorasProcedimiento = async function(fechaSeleccionada, servicio, identificacion) {
    const grid = document.getElementById('grid-horas-procedimiento');
    if (!fechaSeleccionada) return;

    grid.innerHTML = '<p class="col-span-3 text-center text-[10px] font-bold animate-pulse text-blue-500">CONSULTANDO...</p>';
    grid.classList.remove('hidden');

    try {
        const ahora = new Date();
        const fechaHoyStr = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();

        // Obtener día de la semana (0: Domingo, 6: Sábado)
        const fechaObj = new Date(fechaSeleccionada + 'T00:00:00');
        const diaSemana = fechaObj.getDay();

        if (diaSemana === 0) {
            grid.innerHTML = '<p class="col-span-3 text-center text-red-500 font-black text-[10px] uppercase p-4 italic">Domingos no hay atención</p>';
            return;
        }

        // Configuración de Horarios
        let horaInicio = 9;
        // Si es Sábado (6) cierra a las 16, de lo contrario a las 19
        let horaFin = (diaSemana === 6) ? 16 : 19; 

        // CONSULTA DE AGENDAMIENTOS EXISTENTES
        const { data: agendados, error } = await sb
            .from('agendamientos')
            .select('fecha_hora, cliente_cedula')
            .gte('fecha_hora', `${fechaSeleccionada}T00:00:00Z`)
            .lte('fecha_hora', `${fechaSeleccionada}T23:59:59Z`);

        if (error) throw error;

        grid.innerHTML = '';
        
        for (let h = horaInicio; h < horaFin; h++) {
            const horaStr = `${h.toString().padStart(2, '0')}:00`;
            
            // 1. VALIDACIÓN: No mostrar horas pasadas si es hoy
            if (fechaSeleccionada === fechaHoyStr && h <= horaActual) {
                continue; // Salta esta hora porque ya pasó
            }

            // 2. VALIDACIÓN DE CUPOS Y DUPLICADOS
            const citasEnHora = agendados.filter(a => a.fecha_hora.includes(horaStr));
            const numCitas = citasEnHora.length;
            const cuposLibres = 3 - numCitas;
            const clienteDuplicado = citasEnHora.some(a => a.cliente_cedula === identificacion);
            
            const bloqueado = cuposLibres <= 0 || clienteDuplicado;

            grid.innerHTML += `
                <button 
                    ${bloqueado ? 'disabled' : `onclick="window.confirmarCitaFinal('${fechaSeleccionada}', '${horaStr}', '${servicio}', '${identificacion}')"`}
                    class="${bloqueado 
                        ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed' 
                        : 'bg-white border-2 border-blue-100 text-blue-600 hover:border-blue-500 hover:bg-blue-50 active:scale-95 shadow-sm'} 
                        p-3 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center">
                    <span class="text-sm">${horaStr}</span>
                    <span class="text-[8px] mt-1 ${clienteDuplicado ? 'text-red-500' : 'text-emerald-500'}">
                        ${clienteDuplicado ? 'YA AGENDADO' : (cuposLibres <= 0 ? 'LLENO' : `${cuposLibres} CUPOS`)}
                    </span>
                </button>
            `;
        }
        
        if (grid.innerHTML === '') {
            grid.innerHTML = '<p class="col-span-3 text-center text-gray-400 font-bold text-[9px] uppercase p-4">No hay más citas disponibles para hoy</p>';
        }

    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p class="col-span-3 text-center text-red-500 text-[9px] font-bold">ERROR DE CONEXIÓN</p>';
    }
};



// Esta es la función guarda la informacion del botón PROC
window.confirmarCitaFinal = async function(fecha, hora, servicioNombre, identificacion) {
    if (!confirm(`¿CONFIRMAR AGENDAMIENTO DE ${servicioNombre.toUpperCase()}?`)) return;

    try {
        // 1. OBTENER DATOS DEL SERVICIO Y DEL CLIENTE
        const [resServicio, resCliente] = await Promise.all([
            sb.from('servicios').select('id, citas_incluidas').eq('nombre', servicioNombre).maybeSingle(),
            sb.from('clientes').select('sede_id, nombre, telefono').eq('identificacion', identificacion).maybeSingle()
        ]);

        if (resServicio.error) throw resServicio.error;
        if (resCliente.error) throw resCliente.error;

        const sedeReal = resCliente.data?.sede_id || window.sedeSeleccionada;
        const totalCitasServicio = resServicio.data?.citas_incluidas || 1;

        // 2. ACTUALIZAR EL SALDO DEL CLIENTE (Tabla clientes)
        // Esto asegura que en "Seguimiento" aparezca el total correcto
        const { error: errorUpdateCliente } = await sb
            .from('clientes')
            .upsert([{
                identificacion: identificacion,
                nombre: resCliente.data.nombre,
                telefono: resCliente.data.telefono,
                sede_id: sedeReal,
                sesiones_totales: totalCitasServicio // Se actualiza el paquete contratado
            }], { onConflict: 'identificacion' });

        if (errorUpdateCliente) throw errorUpdateCliente;

// 🔥 OBTENER CLIENTE ID
const { data: clienteData } = await sb
    .from('clientes')
    .select('id')
    .eq('identificacion', identificacion)
    .single();

const clienteId = clienteData?.id;

// 🔥 BUSCAR TRATAMIENTO ACTIVO
const { data: tratamientos } = await sb
    .from('cliente_tratamientos')
    .select('id, tratamiento_id')
    .eq('cliente_id', clienteId)
    .eq('estado', 'activo');

let clienteTratamientoId;

const tratamientoExistente = (tratamientos || []).find(t =>
    t.tratamiento_id === resServicio.data?.id
);

if (tratamientoExistente) {
    clienteTratamientoId = tratamientoExistente.id;
} else {
    const { data: nuevoTratamiento } = await sb
        .from('cliente_tratamientos')
        .insert([{
            cliente_id: clienteId,
            sede_id: sedeReal,
            tratamiento_id: resServicio.data.id,
            nombre_tratamiento: servicioNombre,
            sesiones_totales: totalCitasServicio,
            citas_restantes: totalCitasServicio,
            estado: 'activo'
        }])
        .select()
        .single();

    clienteTratamientoId = nuevoTratamiento.id;
}


        // 3. INSERTAR EN AGENDAMIENTOS (Sesión 1)
        const { error: errorAgendamiento } = await sb
            .from('agendamientos')
            .insert([{
                cliente_cedula: identificacion,
                sede_id: sedeReal,
                servicio_id: resServicio.data ? resServicio.data.id : null,
                fecha_hora: `${fecha}T${hora}:00`,
                estado: 'agendada',
                nro_sesion_actual: 1, // Iniciamos consumo
                notas: 'REGISTRO DIRECTO POR MÓDULO PROC - PAQUETE CARGADO',
                cliente_tratamiento_id: clienteTratamientoId
            }]);

        if (errorAgendamiento) throw errorAgendamiento;

        // 4. FEEDBACK Y CIERRE
        alert(`✅ ¡ÉXITO!\nCita agendada (Sesión 1).\nSe han cargado ${totalCitasServicio} sesiones a su cuenta.`);

        const modalProc = document.getElementById('modal-procedimientos');
        if (modalProc) modalProc.remove();

        if (typeof window.mostrarMenuServicios === 'function') {
            window.mostrarMenuServicios();
        }

    } catch (err) {
        console.error("Error en flujo PROC completo:", err);
        alert("⚠️ ERROR: No se pudo actualizar el saldo o registrar la cita.");
    }
};


window.prepararBusquedaEvaluacion = function(servicioId, servicioNombre, sedeNombre) {
    const contenedor = document.getElementById('lista-servicios-cliente');
    if (!contenedor) return;

    // Variables globales para que el sistema recuerde qué estamos agendando
    window.servicioSeleccionado = servicioNombre;
    window.sedeSeleccionada = sedeNombre;
    window.servicioIdSeleccionado = servicioId;

    contenedor.innerHTML = `
        <div class="p-4 space-y-4 animate-in fade-in duration-300">
            <div class="text-center border-b border-slate-100 pb-3">
                <p class="text-[10px] font-black text-emerald-500 uppercase italic">${servicioNombre}</p>
                <h4 class="text-xs font-black text-slate-700 uppercase">Validación de Identidad</h4>
            </div>

            <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase italic ml-2">Cédula del Paciente</label>
                <input type="text" id="eval-dni" placeholder="0000000000" maxlength="10" 
                    oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value.length === 10) window.verificarClienteEvaluacion()"
                    class="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center text-2xl font-black text-slate-700 outline-none focus:border-emerald-500 transition-all">
            </div>

            <div id="campos-manuales-eval" class="hidden space-y-3 pt-3 animate-in slide-in-from-top-2">
                <input type="text" id="eval-nombre" placeholder="Nombre Completo" class="w-full border border-slate-200 rounded-xl p-3 text-[11px] font-bold uppercase">
                <input type="text" id="eval-tel" placeholder="Celular" class="w-full border border-slate-200 rounded-xl p-3 text-[11px] font-bold">
            </div>

            <button id="btn-validar-eval" disabled onclick="window.confirmarCitaEvaluacion()"
                class="w-full bg-slate-100 text-slate-400 p-4 rounded-2xl font-black text-xs uppercase italic transition-all">
                Esperando Cédula...
            </button>
        </div>
    `;
};

window.generarHorasDisponibles = async function(f) {
    const g = document.getElementById('grid-horas'), b = document.getElementById('btn-registrar-final');
    g.innerHTML = `<p class="col-span-3 text-[10px] font-black text-emerald-500 text-center italic p-4">CARGANDO...</p>`;
    
    const { data: res } = await sb.from('evaluaciones').select('hora_evaluacion').eq('fecha_evaluacion', f).eq('sede_id', window.sedeSeleccionada);

    g.innerHTML = ""; 
    const d = new Date(f + "T00:00:00").getDay(), h_actual = new Date().getHours();
    
    if (d === 0) return g.innerHTML = `<p class="col-span-3 text-[10px] font-black text-red-500 text-center p-4">DOMINGOS CERRADO</p>`;

    let inicio = 9, fin = (d === 6) ? 16 : 18; 

    for (let h = inicio; h < fin; h++) {
        // --- MODIFICACIÓN AQUÍ PARA EL PROBLEMA DEL 10 DE MARZO ---
        // Comenta la siguiente línea si quieres ver todas las horas sin importar la hora actual:
        if (f === new Date().toLocaleDateString('sv-SE') && h <= h_actual) continue;
        
        const hora = `${h < 10 ? '0'+h : h}:00`;
        const cupos = 4 - (res ? res.filter(c => c.hora_evaluacion.startsWith(hora)).length : 0);

        if (cupos > 0) {
            const btn = document.createElement('button');
            btn.className = "flex flex-col items-center p-2 bg-white border-2 border-slate-100 rounded-xl hover:border-emerald-500 transition-all";
            btn.innerHTML = `<span class="text-xs font-black text-slate-700">${hora}</span><span class="text-[8px] font-bold text-emerald-500 uppercase">${cupos} Libres</span>`;
            
            btn.onclick = function() {
                document.querySelectorAll('#grid-horas button').forEach(x => x.className = "flex flex-col items-center p-2 bg-white border-2 border-slate-100 rounded-xl");
                this.className = "flex flex-col items-center p-2 bg-emerald-500 text-white rounded-xl shadow-md scale-105 transition-all";
                window.horaSeleccionada = hora;
                
                // --- ASEGÚRATE DE QUE 'b' EXISTE ---
                if (b) {
                    b.disabled = false;
                    b.className = "w-full bg-emerald-500 text-white p-5 rounded-[2.5rem] font-black text-sm uppercase shadow-lg italic transition-all";
                    // IMPORTANTE: El onclick del botón 'b' debe estar definido en tu confirmarCitaEvaluacion
                }
            };
            g.appendChild(btn);
        }
    }
    
    // Si después del bucle el grid está vacío, avisamos al usuario
    if (g.innerHTML === "") {
        g.innerHTML = `<p class="col-span-3 text-[10px] font-black text-slate-400 text-center p-4 italic uppercase">No hay cupos disponibles para hoy</p>`;
    }
};

// PROMOCIONES 


window.finalizarAgendamiento = async function(fecha, hora) {
    // 1. Captura absoluta de datos

  

    const cedula = document.getElementById('input-cedula')?.value.trim();
    const sedeId = window.sedeSeleccionadaId || document.getElementById('select-sedes')?.value;
    const promoTitulo = document.querySelector('#modal-promociones h3')?.innerText || "Promoción";
    const elSesion = document.querySelector('.text-sm.font-black.text-blue-700');
    const nroSesionActual = elSesion ? parseInt(elSesion.innerText.match(/\d+/)[0]) : 1;

      console.log("CEDULA:", cedula);
console.log("SEDE:", sedeId);
console.log("PROMO:", window.promoActual);

    // 2. Validación
    if (!cedula || !sedeId) {
        alert("Error: Datos incompletos (Cédula o Sede).");
        return;
    }

    const btn = event.currentTarget;
    btn.disabled = true;
    btn.innerHTML = "...";

    try {
        // 🔥 1. OBTENER CLIENTE
        const { data: cliente, error: errorCliente } = await sb
            .from('clientes')
            .select('id')
            .eq('identificacion', cedula)
            .single();

        if (errorCliente) throw errorCliente;

        const clienteId = cliente.id;

        // 🔥 2. OBTENER SERVICIO
     const { data: promo, error: errorPromo } = await sb
    .from('promociones')
    .select('id, cantidad_citas')
    .eq('id', window.promoActual)
    .single();

if (errorPromo) throw errorPromo;
// 🔥 SIMULAR SERVICIO (MISMA VARIABLE)
const servicio = {
    id: promo.id,
    citas_incluidas: promo.cantidad_citas
};

        // 🔥 3. BUSCAR TRATAMIENTO EXISTENTE
        const { data: tratamientos, error: errorTratamientos } = await sb
            .from('cliente_tratamientos')
            .select('*')
            .eq('cliente_id', clienteId)
            .eq('estado', 'activo');

        if (errorTratamientos) throw errorTratamientos;

        let clienteTratamientoId;

        const existente = tratamientos.find(t =>
            t.tratamiento_id === servicio.id
        );

        // 🔥 4. CREAR SI NO EXISTE
        if (existente) {
            clienteTratamientoId = existente.id;
        } else {
            const { data: nuevo, error: errorNuevo } = await sb
                .from('cliente_tratamientos')
                .insert([{
                    cliente_id: clienteId,
                    sede_id: sedeId,
                    tratamiento_id: servicio.id,
                    nombre_tratamiento: promoTitulo,
                    sesiones_totales: servicio.citas_incluidas,
                    citas_restantes: servicio.citas_incluidas,
                    estado: 'activo'
                }])
                .select()
                .single();

            if (errorNuevo) throw errorNuevo;

            clienteTratamientoId = nuevo.id;
        }

        // 🔍 DEBUG (puedes quitar luego)
        console.log("✅ clienteTratamientoId:", clienteTratamientoId);

        // 🔥 5. INSERT AGENDAMIENTO (YA CORRECTO)
        const { error: errorAgendamiento } = await sb.from('agendamientos').insert([{
            cliente_cedula: cedula,
            sede_id: sedeId,
            servicio_id: servicio.id,
            fecha_hora: `${fecha} ${hora}:00`,
            estado: 'agendada',
            nro_sesion_actual: nroSesionActual,
            notas: `PROMO: ${promoTitulo}`,
            cliente_tratamiento_id: clienteTratamientoId
        }]);

        
        if (errorAgendamiento) throw errorAgendamiento;

        // 6. Descuento de cita (tu lógica original intacta)
        const { data: cli } = await sb
            .from('clientes')
            .select('citas_restantes')
            .eq('identificacion', cedula)
            .single();

        if (cli) {
            await sb.from('clientes')
                .update({ citas_restantes: Math.max(0, (cli.citas_restantes || 0) - 1) })
                .eq('identificacion', cedula);
        }

        alert("✅ Agendado correctamente.");
        window.location.reload();

    } catch (e) {
        alert("Error: " + e.message);
        btn.disabled = false;
        btn.innerHTML = "REINTENTAR";
    }

    console.log("ENTRANDO AL TRY");
};

window.verificarClienteEvaluacion = async function() {
    const dni = document.getElementById('eval-dni').value.trim();
    const btn = document.getElementById('btn-validar-eval');
    const camposManuales = document.getElementById('campos-manuales-eval');
    
    if (dni.length < 10) return;

    btn.innerText = "BUSCANDO...";
    btn.disabled = true;

    try {
        // 1. BUSQUEDA GLOBAL (Buscamos al cliente en cualquier sede)
        const { data: cliente, error } = await sb
            .from('clientes')
            .select('nombre, telefono, sede_id')
            .eq('identificacion', dni) 
            .maybeSingle();

        if (error) throw error;

        // --- VALIDACIÓN DE REGLA DE ORO: INDEPENDENCIA DE SEDE ---
        if (cliente) {
            // Comparamos la sede del cliente con la sede que el usuario eligió al inicio
            // window.sedeSeleccionada contiene el UUID de la sede actual
            if (cliente.sede_id !== window.sedeSeleccionada) {
                const nombreSedeOrigen = cliente.sede_id === '8f6cfaa9-a71d-446d-9901-4676bf8c1b98' ? 'QUITO' : 'VALLE DE LOS CHILLOS';
                
                alert(`⚠️ ATENCIÓN: Paciente registrado en Sede ${nombreSedeOrigen}.\n\nPara mantener su historial y sesiones, debe ingresar desde el menú de la sede correspondiente.`);
                
                btn.innerText = `PACIENTE DE SEDE ${nombreSedeOrigen}`;
                btn.className = "w-full bg-red-100 text-red-600 p-4 rounded-2xl font-black text-[10px] uppercase italic";
                btn.disabled = true;
                camposManuales.classList.add('hidden');
                return; // BLOQUEO TOTAL: No permitimos seguir si es de otra sede
            }
        }
        // -------------------------------------------------------

        // Si llegamos aquí, es un cliente NUEVO o un CLIENTE DE ESTA SEDE
        camposManuales.classList.remove('hidden');
        const inputNombre = document.getElementById('eval-nombre');
        const inputTel = document.getElementById('eval-tel');

        inputNombre.disabled = false; inputNombre.readOnly = false;
        inputTel.disabled = false; inputTel.readOnly = false;
        btn.className = "w-full bg-emerald-500 text-white p-4 rounded-2xl font-black text-xs uppercase shadow-lg italic transition-all active:scale-95";

        if (cliente) {
            // CASO: CLIENTE EXISTE EN ESTA SEDE
            inputNombre.value = cliente.nombre;
            inputTel.value = cliente.telefono || '';
            inputNombre.readOnly = true; 
            btn.innerText = "CONFIRMAR CITA";
        } else {
            // CASO: CLIENTE NUEVO TOTAL
            inputNombre.value = '';
            inputTel.value = '';
            inputNombre.oninput = function() { this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); };
            btn.innerText = "REGISTRAR Y AGENDAR";
        }

        // VALIDACIÓN CELULAR (Igual que antes)
        inputTel.oninput = function() {
            let v = this.value.replace(/[^0-9]/g, '');
            if (v.length > 0 && !v.startsWith('0')) v = '';
            if (v.length > 1 && !v.startsWith('09')) v = '0';
            if (v.length > 10) v = v.slice(0, 10);
            this.value = v;
        };

        btn.disabled = false;

    } catch (err) {
        console.error("Error:", err);
        btn.innerText = "ERROR DE CONEXIÓN";
        btn.disabled = false;
    }
};


//Guarda datos temporales de servicios en tabla evaluacion 
window.confirmarCitaEvaluacion = function() {
    const btn = document.getElementById('btn-validar-eval');
    const dni = document.getElementById('eval-dni').value.trim();
    const nombre = document.getElementById('eval-nombre').value.trim();
    const telefono = document.getElementById('eval-tel').value.trim();
    const contenedor = document.getElementById('lista-servicios-cliente');

    if (nombre.length < 3 || telefono.length !== 10) {
        alert("Complete los datos correctamente.");
        return;
    }

    btn.innerText = "DATOS VALIDADOS";
    btn.className = "w-full bg-emerald-100 text-emerald-600 p-4 rounded-2xl font-black text-xs uppercase shadow-none italic cursor-default";
    btn.disabled = true;
    
    document.getElementById('eval-nombre').readOnly = true;
    document.getElementById('eval-tel').readOnly = true;
    document.getElementById('eval-dni').readOnly = true;

    if (document.getElementById('seccion-final-cita')) return;

    const seccionCita = document.createElement('div');
    seccionCita.id = "seccion-final-cita";
    seccionCita.className = "mt-6 p-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500";
    
    const hoy = new Date().toISOString().split('T')[0];

    seccionCita.innerHTML = `
        <div class="text-center mb-4">
            <h4 class="text-[11px] font-black text-emerald-500 uppercase italic">ELIJA FECHA Y HORA</h4>
        </div>
        <div class="space-y-4">
            <input type="date" id="fecha-cita" min="${hoy}"
                onchange="window.generarHorasDisponibles(this.value)"
                class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-center text-lg font-bold text-slate-600 outline-none focus:border-emerald-400 transition-all">
            <div id="grid-horas" class="grid grid-cols-3 gap-2"></div>
            
            <button id="btn-registrar-final" disabled 
                onclick="window.finalizarAgendamientoTotal()" 
                class="w-full bg-slate-200 text-slate-400 p-5 rounded-[2.5rem] font-black text-sm uppercase italic">
                CONFIRMAR EVALUACIÓN
            </button>
        </div>
    `;

    contenedor.appendChild(seccionCita);
    seccionCita.scrollIntoView({ behavior: 'smooth' });
};


window.abrirMenuProcedimientos = function(servicio, sedeNombre, citas_incluidas) {
    // Limpieza de sede para evitar el error de objeto en el título
    //const nombreLimpio = (typeof sedeNombre === 'object') ? (sedeNombre.nombre || "SEDE") : sedeNombre;
     window.sedeActualNombre = sedeNombre;
    
    
    const overlay = document.createElement('div');
    overlay.id = 'modal-procedimientos';
    overlay.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[20000] flex items-center justify-center p-4 animate-in fade-in duration-300';
    
    overlay.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-blue-500/20 max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
            <div class="bg-blue-600 p-6 text-white text-center shrink-0">
                <h2 class="text-3xl font-black italic uppercase tracking-tighter">PROCEDIMIENTOS </h2>
                <p class="text-[10px] font-bold opacity-90 uppercase tracking-[4px] mt-1"> ${sedeNombre} </p>
            </div>
            
            <div class="flex-1 overflow-y-auto p-8 pt-4 space-y-6 scrollbar-hide">
                <div class="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
                    <p class="text-[10px] font-black text-blue-600 uppercase italic">
                        TRATAMIENTO: ${servicio} | ${citas_incluidas} SESIONES TOTALES
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-gray-400 ml-2">Identificación del Cliente</label>
                    <div class="flex gap-2">
                        <input type="text" id="input-cedula-proc" placeholder="Ingrese 10 dígitos" maxlength="10"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                            class="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl font-bold outline-none">
                        <button onclick="window.ejecutarBusquedaUnica('${servicio}', ${citas_incluidas})" 
                            class="bg-blue-600 text-white px-5 rounded-2xl font-black text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            BUSCAR
                        </button>
                    </div>
                </div>

                <div id="box-resultado-cliente" class="hidden"></div>
                <div id="box-calendario-proc" class="hidden space-y-4 border-t border-gray-100 pt-4"></div>

                <button onclick="document.getElementById('modal-procedimientos').remove()" 
                    class="w-full py-4 text-gray-400 font-black text-[10px] uppercase border-t border-gray-50 mt-4 hover:text-red-500 transition-colors">
                    ← VOLVER A SERVICIOS
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
};



window.ejecutarBusquedaUnica = async function(servicioNombre, totalCitas) {
    const input = document.getElementById('input-cedula-proc');
    const cedulaInput = input.value.trim();
    const contenedor = document.getElementById('box-resultado-cliente');
    if (!contenedor) {
    console.error("ERROR REAL: #box-resultado-cliente no existe en el DOM");
    alert("Error interno: el contenedor no está cargado. Cierra y abre nuevamente el módulo.");
    return;
}

    if (cedulaInput.length !== 10) {
        return alert("La identificación debe tener exactamente 10 dígitos.");
    }

    // --- SOLUCIÓN AL ERROR UUID ---
    // Si window.sedeSeleccionada falla, buscamos qué sede dice el título del modal
    let sedeID = window.sedeSeleccionadaId;
    console.log("🧪 TODAS LAS SEDES:", {
    sedeSeleccionadaId: window.sedeSeleccionadaId,
    sedeActualId: window.sedeActualId,
    sedeParametro: sedeID
});
    
    if (!sedeID || sedeID === 'undefined') {
        // Mapeo de emergencia si la variable global se perdió
        const tituloSede = document.querySelector('#modal-procedimientos p')?.innerText || "";
        if (tituloSede.includes("QUITO")) {
            sedeID = '8f6cfaa9-a71d-446d-9901-4676bf8c1b98';
        } else if (tituloSede.includes("VALLE")) {
            sedeID = 'f647104c-e8f5-4134-a9c6-ff3cfbc21864';
        }
    }

    if (!sedeID) {
        return alert("Error: No se detectó la sede. Cierre el menú e intente de nuevo.");
    }
    // ------------------------------
console.log("SEDE QUE ENVÍAS:", sedeID);
console.log("SEDE GUARDADA GLOBAL:", window.sedeSeleccionada);
console.log("SEDE QUE PASAS A LA FUNCIÓN:", sedeID);

try {
const { data: cliente, error } = await sb
    .from('clientes')
    .select('*')
    .eq('identificacion', cedulaInput)
    .eq('sede_id', sedeID)
    .maybeSingle();

    console.log("CLIENTE BD:", cliente);

    if (error) throw error;

        if (!cliente) {
            contenedor.innerHTML = `
                <div class="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-200 mt-4 text-center">
                    <p class="text-[10px] font-black text-amber-600 uppercase italic">Cliente no encontrado en esta sede</p>
                    <p class="text-[9px] text-amber-500 font-bold uppercase mt-1">El registro no existe para esta ubicación.</p>
                </div>`;
            contenedor.classList.remove('hidden');
            return;
        }

        contenedor.innerHTML = `
            <div class="bg-blue-900 p-6 rounded-[2rem] text-white shadow-xl mt-4 space-y-3 animate-in zoom-in-95 duration-300 border-2 border-blue-400/30">
                <p class="text-[9px] font-black text-blue-400 uppercase tracking-widest italic mb-1">Paciente Validado</p>
                <div class="space-y-1 text-xs font-bold border-l-2 border-emerald-500 pl-4 uppercase">
                    <p>NOMBRE: <span class="text-white font-black">${cliente.nombre}</span></p>
                    <p>CÉDULA: <span class="text-white font-black">${cliente.identificacion}</span></p>
                </div>
                <button id="btn-confirmar-paciente" 
                    onclick="window.activarFaseCalendario('${servicioNombre}', '${cliente.identificacion}')"
                    class="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] shadow-lg shadow-emerald-900/20 active:scale-95 italic">
                    Confirmar Paciente y Agendar
                </button>
            </div>
        `;
        contenedor.classList.remove('hidden');

    } catch (err) {
        console.error("Error detallado:", err);
        alert("Error de comunicación. Asegúrese de que la sede esté seleccionada correctamente.");
    }
};



// Función auxiliar para no repetir código de diseño
function renderizarTarjeta(nombre, servicio, total, contenedor) {
    contenedor.innerHTML = `
        <div class="bg-blue-900 p-6 rounded-[2rem] text-white shadow-xl mt-4 animate-in zoom-in-95 duration-300">
            <p class="text-[9px] font-bold opacity-50 uppercase tracking-widest">Paciente Validado</p>
            <h4 class="text-xl font-black uppercase leading-tight">${nombre}</h4>
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                <span class="text-[10px] font-bold italic opacity-80">${servicio}</span>
                <span class="bg-emerald-500 px-4 py-1.5 rounded-xl text-[11px] font-black">
                    SESIÓN 1 / ${total}
                </span>
            </div>
        </div>
    `;
    contenedor.classList.remove('hidden');
}

window.consultarClienteProcedimiento = async function(servicioNombre, totalSesiones) {
    const input = document.getElementById('proc-cedula-consulta');
    const cedulaValor = input.value.trim();
    const contenedor = document.getElementById('info-cliente-proc');

    if (cedulaValor.length < 5) return alert("Ingrese una cédula válida.");

    try {
        // Consulta simplificada para evitar el error 400
        const { data: cliente, error } = await sb
            .from('clientes')
            .select('nombre, cedula, citas_asistidas')
            .eq('cedula', cedulaValor)
            .maybeSingle();

        if (error) throw error;

        if (!cliente) {
            alert("❌ Cliente no registrado. Verifique la cédula.");
            return;
        }

        // Éxito: Mostrar tarjeta
        const citaActual = (parseInt(cliente.citas_asistidas) || 0) + 1;
        
        contenedor.innerHTML = `
            <div class="bg-blue-900 p-5 rounded-[2rem] text-white shadow-xl space-y-3 mt-4">
                <p class="text-[9px] font-bold opacity-60 uppercase">Paciente Validado</p>
                <h4 class="text-xl font-black uppercase">${cliente.nombre}</h4>
                <div class="flex justify-between items-center pt-2 border-t border-white/10">
                    <span class="text-[10px] font-bold italic">${servicioNombre}</span>
                    <span class="bg-emerald-500 px-3 py-1 rounded-lg text-[11px] font-black">SESIÓN ${citaActual} / ${totalSesiones}</span>
                </div>
            </div>
            `;
        contenedor.classList.remove('hidden');

    } catch (err) {
        console.error("Error Supabase:", err);
        alert("Error de conexión. Revise la consola.");
    }
};




// 1. Validación en tiempo real para el nombre
window.validarSoloLetras = function(input) {
    const errorNombre = document.getElementById('err-nombre');
    const regex = /[0-9!@#$%^&*(),.?":{}|<>]/g;
    
    if (regex.test(input.value)) {
        errorNombre.innerText = "¡ERROR! No se permiten números ni caracteres especiales.";
        errorNombre.classList.remove('hidden');
        input.value = input.value.replace(regex, '');
    } else {
        errorNombre.classList.add('hidden');
    }
};

// 2. Validación final al presionar el botón
window.validarYConfirmarRegistro = function() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const cedula = document.getElementById('reg-cedula').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();

    // Resetear mensajes
    document.querySelectorAll('[id^="err-"]').forEach(p => p.classList.add('hidden'));

    let esValido = true;

    // Validación de campos vacíos
    if (!nombre) { document.getElementById('err-nombre').innerText = "El nombre es obligatorio."; document.getElementById('err-nombre').classList.remove('hidden'); esValido = false; }
    
    // Validación de Cédula (10 dígitos)
    if (cedula.length < 10) { 
        document.getElementById('err-cedula').innerText = "La cédula debe tener exactamente 10 dígitos."; 
        document.getElementById('err-cedula').classList.remove('hidden'); 
        esValido = false; 
    }

    // Validación de Celular (10 dígitos y que inicie con 09)
    if (celular.length < 10 || !celular.startsWith('09')) { 
        document.getElementById('err-celular').innerText = "El celular debe tener 10 dígitos y empezar con 09."; 
        document.getElementById('err-celular').classList.remove('hidden'); 
        esValido = false; 
    }
    window.validarYConfirmarRegistro = function() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const cedula = document.getElementById('reg-cedula').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();

    // Resetear mensajes
    document.querySelectorAll('[id^="err-"]').forEach(p => p.classList.add('hidden'));

    let esValido = true;

    // 1. Validaciones (Tus reglas originales)
    if (!nombre) { 
        document.getElementById('err-nombre').innerText = "El nombre es obligatorio."; 
        document.getElementById('err-nombre').classList.remove('hidden'); 
        esValido = false; 
    }
    
    if (cedula.length < 10) { 
        document.getElementById('err-cedula').innerText = "La cédula debe tener exactamente 10 dígitos."; 
        document.getElementById('err-cedula').classList.remove('hidden'); 
        esValido = false; 
    }

    if (celular.length < 10 || !celular.startsWith('09')) { 
        document.getElementById('err-celular').innerText = "El celular debe tener 10 dígitos y empezar con 09."; 
        document.getElementById('err-celular').classList.remove('hidden'); 
        esValido = false; 
    }

    // 2. LOGICA DE TRANSICION AL CALENDARIO (Solo si esValido)
if (esValido) {
        // ... (Tu código de bloqueo de inputs sigue igual) ...
        const contenedor = document.getElementById('contenedor-inputs-nuevo');
        
        const areaCalendario = document.createElement('div');
        areaCalendario.id = 'area-calendario-evaluacion';
        areaCalendario.className = 'mt-4 pt-4 border-t-2 border-emerald-100 w-full animate-in fade-in slide-in-from-top-4';
        
        areaCalendario.innerHTML = `
            <div class="space-y-4">
                <div class="text-center px-4">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">1. Seleccione Fecha</label>
                    <input type="date" id="fecha-evaluacion" 
                        class="w-full mt-2 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl font-bold text-emerald-700 outline-none focus:border-emerald-500 transition-all text-sm"
                        min="${new Date().toISOString().split('T')[0]}"
                        onchange="window.mostrarHorasConCupo(this.value)">
                </div>

                <div id="seccion-horas-eval" class="hidden animate-in fade-in duration-500">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-3">2. Seleccione Hora (Cupo: 4 personas)</p>
                    <div id="grid-horas-capacidad" class="grid grid-cols-3 gap-3 p-2">
                        </div>
                </div>
            </div>
        `;
        contenedor.appendChild(areaCalendario);
    }
};

};

window.mostrarHorasConCupo = async function(fechaSeleccionada) {
    const grid = document.getElementById('grid-horas-capacidad');
    const seccion = document.getElementById('seccion-horas-eval');
    if (!grid || !fechaSeleccionada) return;

    // 1. Obtener todas las citas ya agendadas para esa fecha
    const { data: citasAgendadas } = await sb
        .from('citas_evaluacion')
        .select('hora')
        .eq('fecha', fechaSeleccionada);

    // 2. Definir horarios según sede y día (Lógica anterior del Paso 31)
    const sedeTexto = document.body.innerText.toUpperCase();
    const esValle = sedeTexto.includes("VALLE");
    const fechaObj = new Date(fechaSeleccionada + 'T00:00:00');
    const diaSemana = fechaObj.getDay();

    let inicio = (diaSemana === 6) ? 9 : (esValle ? 8 : 9);
    let fin = (diaSemana === 6) ? 16 : (esValle ? 17 : 18);

    grid.innerHTML = '';
    seccion.classList.remove('hidden');

    // 3. Generar botones con cupos REALES
    for (let h = inicio; h < fin; h++) {
        const horaFormateada = `${h.toString().padStart(2, '0')}:00`;
        
        // Contamos cuántas veces aparece esta hora en las citas agendadas
        const ocupados = citasAgendadas ? citasAgendadas.filter(c => c.hora === horaFormateada).length : 0;
        const cuposLibres = 4 - ocupados;

        const btn = document.createElement('button');
        // Si no hay cupos, deshabilitamos el botón
        btn.disabled = cuposLibres <= 0;
        btn.className = `py-4 border-2 rounded-2xl font-black transition-all text-xs shadow-sm active:scale-95 ${
            cuposLibres <= 0 
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
            : "bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white"
        }`;
        
        btn.innerHTML = `
            <div>${horaFormateada}</div>
            <div class="text-[7px] uppercase mt-1">${cuposLibres > 0 ? cuposLibres + ' CUPOS' : 'LLENO'}</div>
        `;
        
        btn.onclick = () => window.confirmarCitaConCupo(fechaSeleccionada, horaFormateada);
        grid.appendChild(btn);
    }
};
// 5. FUNCIÓN DE CONFIRMACIÓN (Para que no de error la consola)
window.confirmarCitaConCupo = async function(fecha, hora) {
    const cedula = document.getElementById('reg-cedula').value;
    const nombre = document.getElementById('reg-nombre').value;
    const celular = document.getElementById('reg-celular').value;
    // Recuperamos la sede y el título de la promo del contexto global
    const sedeId = window.sedeSeleccionadaId;
    const promoTitulo = window.promoActualTitulo || "Evaluación con Cupo";

    try {
        // 1. Validaciones de duplicados y cupos en la NUEVA tabla 'evaluaciones'
        const { data: existente } = await sb.from('evaluaciones')
            .select('id')
            .eq('identificacion', cedula)
            .eq('fecha_evaluacion', fecha)
            .eq('hora_evaluacion', `${hora}:00`);
            
        if (existente && existente.length > 0) { 
            return alert("⚠️ Ya tienes una cita en este horario."); 
        }

        const { data: citas } = await sb.from('evaluaciones')
            .select('id')
            .eq('fecha_evaluacion', fecha)
            .eq('hora_evaluacion', `${hora}:00`);
            
        if (citas && citas.length >= 4) { 
            return alert("❌ Cupo lleno."); 
        }

        // 🔥 BUSCAR EL SERVICIO REAL
const { data: servicio } = await sb
    .from('servicios')
    .select('id')
    .ilike('nombre', `%${promoTitulo.trim()}%`)
    .single();

if (errorServicio || !servicio) {
    alert('❌ No existe ese servicio en la tabla servicios');
    console.error("ERROR BUSCANDO SERVICIO:", errorServicio);
    return;
}

        // 2. Registro en la tabla CORRECTA 'evaluaciones'
        const { error } = await sb.from('evaluaciones').insert([{ 
            nombre: nombre, 
            identificacion: cedula, // Usamos identificacion como en la tabla evaluaciones
            telefono: celular,      // Usamos telefono como en la tabla evaluaciones
            sede_id: sedeId,
            promo_titulo: promoTitulo,
            servicio_id: servicio.id,
            fecha_evaluacion: fecha, // Nombre exacto confirmado por ti
            hora_evaluacion: `${hora}:00`, // Nombre exacto confirmado por ti
            estado: 'PENDIENTE' 
        }]);

        if (!error) {
            alert("✅ REGISTRO CORRECTO\nSu cita ha sido agendada con éxito.");

            // Eliminación de modales
            const modalesActivos = document.querySelectorAll('.fixed.inset-0');
            modalesActivos.forEach(m => m.remove());

            // Detección de sede para regresar
            const contenidoBody = document.body.innerText.toUpperCase();
            let sedeParaRegresar = contenidoBody.includes("VALLE") ? "VALLE DE LOS CHILLOS" : "QUITO NORTE";

            // Renderizado del menú
            if (typeof window.mostrarOpcionesSede === 'function') {
                window.mostrarOpcionesSede(sedeParaRegresar);
            }

        } else { throw error; }

    } catch (err) {
        console.error("Error crítico:", err);
        alert("Error al agendar. Intente nuevamente.");
    }
};



// --- LLAMADA AUTOMÁTICA ---
// Ejecutamos la carga después de un breve delay para que se vea profesional
setTimeout(window.cargarHorariosDisponibles, 800);

// 2.- repeticion dos de la funcion (RENOMBRADA)

window.mostrarMenuPromociones = function(sede) { 
    
    window.sedeActualId = sede.id;      // 🔥 ESTE ES EL IMPORTANTE
    window.sedeSeleccionadaId = sede.id; // (lo dejamos por compatibilidad)
    window.sedeSeleccionada = sede;
    console.log("SEDE ACTUAL:", window.sedeActualId); 
    
    const container = document.getElementById('main-content');
    if (!container) return;

    // ... resto del HTML que ya tienes ...
    
    // 2. Insertamos el HTML con el diseño de tu imagen (image_910555.png)
    container.innerHTML = `
        <div class="flex flex-col items-center animate-in fade-in duration-500 p-4">
            
            <div class="w-full max-w-md flex justify-start mb-6">
                <button onclick="window.cargarSedes()" class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center hover:text-[#0369a1] transition-colors">
                    <span class="mr-1">←</span> CAMBIAR SEDE
                </button>
            </div>

            <div class="text-center mb-10">
                <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">${sede}</h2>
                <div class="h-1 w-12 bg-emerald-400 mx-auto mt-1 rounded-full"></div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Seleccione su requerimiento</p>
            </div>

            <div class="w-full max-w-sm space-y-4">
                
                <button onclick="window.mostrarSeccionServicios('${sede}')" 
                    class="w-full flex items-center bg-white border-2 border-emerald-400 p-4 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all active:scale-95 group">
                    <div class="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center text-white font-black text-xl mr-4 italic shadow-lg shadow-emerald-100">1</div>
                    <div class="text-left">
                        <h3 class="font-black text-emerald-500 text-lg leading-none uppercase italic">Servicios</h3>
                        <p class="text-[10px] font-bold text-slate-400 italic">Evaluación y registro inicial</p>
                    </div>
                </button>

                <button class="w-full flex items-center bg-white border-2 border-slate-700 p-4 rounded-[2.5rem] shadow-sm opacity-60 cursor-not-allowed">
                    <div class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white font-black text-xl mr-4 italic">2</div>
                    <div class="text-left">
                        <h3 class="font-black text-slate-700 text-lg leading-none uppercase italic">Seguimiento</h3>
                        <p class="text-[10px] font-bold text-slate-400 italic">Próximamente</p>
                    </div>
                </button>

                <button class="w-full flex items-center bg-white border-2 border-orange-400 p-4 rounded-[2.5rem] shadow-sm opacity-60 cursor-not-allowed">
                    <div class="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-xl mr-4 italic">3</div>
                    <div class="text-left">
                        <h3 class="font-black text-orange-500 text-lg leading-none uppercase italic">Promociones</h3>
                        <p class="text-[10px] font-bold text-slate-400 italic">Próximamente</p>
                    </div>
                </button>

            </div>
        </div>
    `;

};


// 4. LISTADO DE SERVICIOS (VERSION COMPACTA Y SEGURA)
    window.verServicios = async function(sedeId, tipoElegido, nombreSede) {
        const main = document.getElementById('main-content');
        main.innerHTML = `<p class="text-center py-10 animate-pulse text-slate-400 italic font-bold text-xs uppercase">Consultando servicios...</p>`;
        
        const { data: servicios, error } = await sb.from('servicios')
            .select('*')
            .eq('sede_id', sedeId)
            .eq('tipo', tipoElegido);
        
        main.innerHTML = `
           <div class="fade-in p-4 max-w-[98%] mx-auto">
                <button onclick="window.location.reload()" class="text-teal-600 font-black mb-3 italic text-[10px] flex items-center">← VOLVER AL MENÚ</button>
                
                <h3 class="text-lg font-black text-slate-800 mb-0 uppercase italic leading-none">
                    ${tipoElegido === 'unico' ? 'Servicios' : 'Promociones'}
                </h3>
                <p class="text-teal-600 text-[8px] mb-4 uppercase font-black tracking-[0.2em] italic border-b border-teal-100 pb-2">
                    Sede: ${nombreSede}
                </p>

                <div id="lista-final" class="grid grid-cols-1 gap-2"></div>
                <div id="modulo-registro" class="mt-4 hidden"></div>
            </div>`;

        const contenedor = document.getElementById('lista-final');
        
        if (error || !servicios || servicios.length === 0) {
            contenedor.innerHTML = `<p class="text-slate-400 italic text-center py-6 text-[10px] font-bold uppercase">No hay servicios disponibles.</p>`;
            return;
        }

        servicios.forEach(srv => {
            const card = document.createElement('button');
            // Reducimos padding (p-3) y ajustamos el diseño a horizontal
            card.className = "bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center w-full active:scale-95 transition-all";
            
            card.innerHTML = `
                <div class="text-left">
                    <div class="font-black text-slate-700 uppercase italic text-[11px] leading-tight">${srv.nombre}</div>
                    <div class="text-[8px] text-teal-600 font-bold uppercase italic mt-1">
                        ${srv.citas_incluidas || 0} Sesiones Incluidas
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-teal-600 font-black italic text-base leading-none">$${srv.precio}</div>
                    <span class="text-[7px] text-slate-300 font-black uppercase tracking-widest">Elegir</span>
                </div>
            `;
            
            card.onclick = () => {
                // Ocultamos la lista para mostrar el registro sin scroll excesivo
                document.getElementById('lista-final').classList.add('hidden');
                window.mostrarFormularioRegistro(srv, sedeId, nombreSede);
            };
            contenedor.appendChild(card);
        });
    }

  // 5. MÓDULO DE REGISTRO (ULTRA-COMPACTO)
    window.mostrarFormularioRegistro = function(servicio, sedeId, nombreSede) {
        document.getElementById('lista-final').classList.add('hidden');
        const modulo = document.getElementById('modulo-registro');
        modulo.classList.remove('hidden');
        
        modulo.innerHTML = `
            <div class="bg-white p-4 rounded-2xl border border-teal-500 shadow-md fade-in text-left max-w-sm mx-auto">
                <h4 class="font-black italic text-slate-800 uppercase mb-1 text-center text-sm">Ingreso de Paciente</h4>
                <p class="text-teal-600 text-[9px] text-center mb-4 uppercase font-black italic tracking-widest border-b pb-2">
                    ${nombreSede} | ${servicio.nombre}
                </p>
                
                <div class="space-y-3">
                    <div>
                        <label class="text-[9px] text-slate-400 font-bold uppercase italic ml-1">Nombre Completo</label>
                        <input type="text" id="reg-nombre" placeholder="Nombre y Apellido" 
                            class="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-500 italic font-bold text-xs shadow-sm">
                    </div>

                    <div>
                        <label class="text-[9px] text-slate-400 font-bold uppercase italic ml-1">Cédula (10 dígitos)</label>
                        <input type="text" id="reg-cedula" maxlength="10" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="Ej: 1722334455" 
                            class="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-500 italic font-bold text-xs shadow-sm">
                    </div>

                    <div>
                        <label class="text-[9px] text-slate-400 font-bold uppercase italic ml-1">Celular (09...)</label>
                        <input type="tel" id="reg-telefono" maxlength="10" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="Ej: 0998877665" 
                            class="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-500 italic font-bold text-xs shadow-sm">
                    </div>

              <div>
    <label class="text-[9px] text-teal-600 font-black uppercase italic ml-1"></label>
    <input type="hidden" id="reg-sesiones" min="1" max="99" value="${servicio.citas_incluidas}" 
        oninput="if(this.value.length > 2) this.value = this.value.slice(0,2)"
        class="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-500 italic font-bold text-xs shadow-sm">
</div>

                    
               <button onclick="window.procesarRegistro('${servicio.id}', '${sedeId}', '${servicio.nombre}', '${nombreSede}')" 
        id="btn-registro" 
        class="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase italic text-[12px] py-4 rounded-xl shadow-lg shadow-teal-900/20 active:scale-95 transition-all duration-200 tracking-widest">
    REGISTRAR Y AGENDAR
</button>
                </div>
            </div>`;
    }
    

// 6. PROCESAMIENTO REGISTRO (SOLUCIÓN DEFINITIVA AL BLOQUEO)
    window.procesarRegistro = async function(servicioId, sedeId, nombrePlan, nombreSede) {
    // CAPTURA DINÁMICA: Leemos el valor del input que creamos en el paso anterior
    const sesionesInput = document.getElementById('reg-sesiones');
    const numSesiones = sesionesInput ? (parseInt(sesionesInput.value) || 1) : 1;

    const nombreInput = document.getElementById('reg-nombre')?.value.trim();
    const cedula = document.getElementById('reg-cedula')?.value.trim();
    const telf = document.getElementById('reg-telefono')?.value.trim();
    const btn = document.getElementById('btn-registro');
    const regexNombre = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

    // 1. VALIDACIONES PREVIAS
    if(!nombreInput || !cedula || !telf) return alert("⚠️ Por favor complete todos los campos.");
    if(!regexNombre.test(nombreInput)) return alert("⚠️ El nombre solo debe contener letras.");
    if(cedula.length !== 10) return alert("⚠️ La cédula debe tener 10 dígitos.");
    
    if(telf.length !== 10 || !telf.startsWith('09')) {
        return alert("⚠️ El celular debe tener 10 dígitos y empezar con '09'.");
    }

    try {
        btn.disabled = true;
        btn.innerText = "PROCESANDO...";

        // 3. INSERCIÓN EN BASE DE DATOS
        // Usamos numSesiones para sesiones_totales y para citas_restantes
        console.log("🧪 SEDE AL CREAR CLIENTE:", sedeId);
        const { data: nuevoCliente, error } = await sb.from('clientes').insert([{
            nombre: nombreInput, 
            identificacion: cedula, 
            telefono: telf,
            sede_id: sedeId, 
            sesiones_totales: numSesiones, // El nuevo campo
            citas_restantes: numSesiones,  // Dinámico
            tratamiento_actual: nombrePlan
        }]).select().single();

        if (error) {
            btn.disabled = false;
            btn.innerText = "REGISTRAR Y AGENDAR CITA";
            if (error.code === '23505') {
                return alert("📍 Esta cédula ya está registrada. Por favor use la opción 'SEGUIMIENTO'.");
            } else {
                return alert("❌ Error de conexión: " + error.message);
            }
        }

        if (nuevoCliente) {
            const modulo = document.getElementById('modulo-registro');
            if (modulo) {
                modulo.innerHTML = `
                    <div class="fade-in">
                        <div class="bg-teal-600 p-3 rounded-2xl mb-4 shadow-md border-b-4 border-teal-800 text-center">
                            <p class="text-white text-[10px] font-black uppercase italic leading-tight">
                                ¡REGISTRO EXITOSO!<br>
                                <span class="text-teal-100 text-[8px]">PASO FINAL: SELECCIONE FECHA Y HORA DE SU CITA</span>
                            </p>
                        </div>
                        <div id="calendario-espacio"></div>
                    </div>
                `;
            }

            // Pasamos numSesiones a la agenda para que el sistema sepa cuántas tiene ahora
            window.abrirCalendario(nuevoCliente.id, sedeId, numSesiones, nombreSede);
        }

    } catch (err) {
        console.error("Error crítico:", err);
        alert("⚠️ Ocurrió un error inesperado. Reintente en un momento.");
        btn.disabled = false;
        btn.innerText = "REINTENTAR REGISTRO";
    }
};

window.abrirModuloUsuario = function(sedeId, nombreSede) {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Seteamos la sede global solo para asegurar consistencia en otros módulos
    window.sedeSeleccionada = sedeId; 
    const nombreLimpio = nombreSede.toUpperCase();

    main.innerHTML = `
        <div class="fade-in p-4 text-center max-w-lg mx-auto">
            <button onclick="window.location.reload()" class="text-slate-400 font-black mb-8 flex items-center italic text-[10px] uppercase tracking-widest hover:text-emerald-500 transition-colors">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                Volver al Inicio
            </button>
            
            <div class="mb-8">
                <h2 class="text-2xl font-black uppercase italic text-slate-800 leading-none tracking-tighter text-center">Portal de Usuario</h2>
                <p class="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic text-center">SEDE ${nombreLimpio}</p>
                <div class="h-1 w-8 bg-slate-200 mx-auto mt-3 rounded-full"></div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-left space-y-4">
                <div class="space-y-2">
                    <label class="text-[9px] text-slate-400 font-black uppercase italic ml-2 block italic">Ingrese su Identificación</label>
                    <input type="text" id="input-dni-usuario" maxlength="10" inputmode="numeric" placeholder="0000000000" 
                        oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                        class="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-center text-3xl font-black outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner text-slate-700">
                </div>

                <button onclick="window.accederDashboardUsuario('${sedeId}')" 
                    class="w-full bg-slate-900 text-white p-5 rounded-2xl font-black italic uppercase shadow-xl active:scale-95 transition-all hover:bg-emerald-600 flex items-center justify-center gap-2 tracking-widest text-[11px]">
                    ACCEDER A MI CUENTA
                </button>
            </div>
            <div id="resultado-dashboard" class="mt-8"></div>
        </div>`;
};

window.accederDashboardUsuario = async function(sedeDeEntrada) {
    const dniInput = document.getElementById('input-dni-usuario').value.trim();
    const contenedor = document.getElementById('resultado-dashboard');
    
    // Scroll
    contenedor.style.height = "550px"; 
    contenedor.style.overflowY = "auto";
    contenedor.style.display = "block";
    contenedor.style.paddingRight = "10px";
    
    if (dniInput.length < 9) return alert("⚠️ Ingrese una cédula válida.");

    contenedor.innerHTML = `
        <div class="flex justify-center py-10">
            <div class="w-8 h-8 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    `;

    try {
        // =========================
        // 1. CLIENTE
        // =========================
        const { data: cliente, error: errorCliente } = await sb
            .from('clientes')
            .select('id, nombre, identificacion, citas_restantes, tratamiento_actual, sesiones_totales, sede_id') 
            .eq('identificacion', dniInput)
            .maybeSingle();

        if (errorCliente) throw errorCliente;

        if (!cliente) {
            alert("❌ Usuario no encontrado.");
            contenedor.innerHTML = '';
            return;
        }

        if (cliente.sede_id !== sedeDeEntrada) {
            alert("⚠️ Esta cuenta pertenece a otra sede.");
            contenedor.innerHTML = '';
            return;
        }

        // =========================
        // 2. CITAS
        // =========================
        const { data: agendamientos, error: errorAgendamientos } = await sb
            .from('vista_dashboard_usuarios')
            .select('id, fecha_hora, estado, tratamiento_id, nombre_tratamiento') // ← IMPORTANTE: agrego nombre SIN romper nada
            .eq('cliente_cedula', dniInput)
            .neq('estado', 'cancelada');

        if (errorAgendamientos) throw errorAgendamientos;

        const citasValidas = agendamientos || [];

        // =========================
        // 3. CLIENTE TRATAMIENTOS
        // =========================
        const { data: cliente_tratamientos, error: errorCT } = await sb
            .from('cliente_tratamientos')
         .select('tratamiento_id, sesiones_totales, nombre_tratamiento')
            .eq('cliente_id', cliente.id);

        if (errorCT) throw errorCT;

        // =========================
        // 4. TOTALES (CORRECTO CON IDS)
        // =========================
        
       console.log('DEBUG TRATAMIENTOS:', cliente_tratamientos);
console.log('OBJETO REAL:', JSON.stringify(cliente_tratamientos, null, 2));
        const totales = {};

        (cliente_tratamientos || []).forEach(t => {
            const key = t.tratamiento_id;

            const usadas = citasValidas.filter(c =>
                c.tratamiento_id === key
            ).length;

            const total = t.sesiones_totales || 0;

            totales[key] = {
                totales: total,
                disponibles: Math.max(0, total - usadas),
                nombre: t.nombre_tratamiento
            };
        });

        console.log("DEBUG TOTALES:", totales);
        console.log("DEBUG CITAS:", citasValidas);
        console.log("DEBUG TRATAMIENTOS:", cliente_tratamientos);
       

        // =========================
        // 5. TRATAMIENTO ACTUAL
        // =========================
        if (!cliente.tratamiento_actual && citasValidas.length > 0) {
            cliente.tratamiento_actual = citasValidas[0].nombre_tratamiento || null;
        }

        // =========================
        // 6. RENDER
        // =========================
        window.renderizarDashboard(cliente, citasValidas, totales);

    } catch (err) {
        console.error("ERROR COMPLETO:", err);
        contenedor.innerHTML = `
            <p class="text-center py-4 text-red-500 font-black uppercase text-[10px]">
                Error de conexión
            </p>
        `;
    }
};

window.renderizarDashboard = function(cliente, citas, totales) {
    const contenedor = document.getElementById('resultado-dashboard');
    const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    
    const nombreSedeTxt = window.sedeSeleccionada === '8f6cfaa9-a71d-446d-9901-4676bf8c1b98' ? 'QUITO' : 'VALLE';
    const x_real = 0; 

    console.log("CLIENTE:", cliente);
    console.log("CITAS:", citas);
    console.log("TOTALES:", totales);

    // 🔥 UNIFICAR TRATAMIENTOS
   const tratamientosUnicos = Object.keys(totales);

    const htmlTratamientos = tratamientosUnicos.map(nombre => {

        // 🔥 FILTRAR CITAS DEL TRATAMIENTO
   const lista = citas.filter(c =>
    c.tratamiento_id === nombre
);

        // 🔥 OBTENER O CALCULAR TOTALES
   const dataTratamiento = totales[nombre] || {
    disponibles: 0,
    totales: 0
};
const nombreMostrar = lista[0]?.nombre_tratamiento || 'SIN NOMBRE';

        // 🔥 HTML DE CITAS
        const htmlCitas = lista.map(c => {
            const f = new Date(c.fecha_hora.replace(' ', 'T'));
            const ahora = new Date();
            const diferenciaHoras = f.getTime() ? (f - ahora) / (1000 * 60 * 60) : 0;

            const diaLetras = diasSemana[f.getUTCDay()];
            const fechaFmt = `${diaLetras} ${String(f.getUTCDate()).padStart(2, '0')}/${String(f.getUTCMonth() + 1).padStart(2, '0')}`;
            const horaFmt = String(f.getUTCHours()).padStart(2, '0') + ":00";

            let botonCancelacion = "";

            if (diferenciaHoras >= 24) {
                botonCancelacion = `<button onclick="window.confirmarCancelacion('${c.id}', '${c.fecha_hora}')" class="text-[8px] bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-black hover:bg-red-200 transition-colors border border-red-200">CANCELAR CITA</button>`;
            } else {
                botonCancelacion = `<span class="text-[7px] font-black text-slate-300 uppercase italic">Confirmada</span>`;
            }

            

            return `
                <div class="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-2">
                    <div class="text-[10px]">
                        <p class="font-black italic text-slate-700 uppercase">${fechaFmt}</p>
                        <p class="text-[9px] font-bold text-emerald-500">${horaFmt}</p>
                    </div>
                    ${botonCancelacion}
                </div>
            `;
        }).join('');

        return `
            <div class="border border-slate-100 rounded-2xl p-3 bg-white shadow-sm mb-3">

                <div class="flex justify-between items-center mb-2">
                    <p class="text-[10px] font-black text-slate-700 uppercase italic">
                        ${dataTratamiento.nombre || nombre}
                    </p>

                    <div class="bg-slate-900 px-3 py-1 rounded-xl text-white text-[10px] font-black">
                        ${dataTratamiento.disponibles}
                        <span class="text-slate-400">/</span>
                        <span class="text-slate-400">${dataTratamiento.totales}</span>
                    </div>
                </div>

                <button onclick="window.abrirCalendario(
    '${cliente.id}',
    '${cliente.sede_id}',
    ${dataTratamiento.disponibles},
    '${nombreSedeTxt}',
    '${nombreMostrar}',
    '${nombre}' // 🔥 ESTE ES EL ID REAL
)" 
                    class="w-full bg-emerald-500 text-white p-3 rounded-xl font-black italic uppercase text-[9px] tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md mb-3">
                    + Agendar cita
                </button>

                ${htmlCitas}

            </div>
        `;
    }).join('');

    // 🔥 RENDER FINAL
    contenedor.innerHTML = `
        <div style="height: 500px; overflow-y: auto; padding: 10px;">
            
            <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-sm mx-auto space-y-6 text-left">
                
                <div>
                    <p class="text-[8px] text-emerald-500 font-black uppercase italic tracking-widest">
                        Portal de Paciente ${nombreSedeTxt}
                    </p>
                    <h3 class="text-lg font-black uppercase italic text-slate-800 leading-tight">
                        ${cliente.nombre}
                    </h3>
                </div>

                <div style="padding-right: 5px;">
                    ${htmlTratamientos || `<p class="text-[9px] text-slate-300 italic text-center py-4 uppercase font-bold">No registra tratamientos</p>`}
                </div>

            </div>
        </div>
    `;
};




// AJUSTE PARA EXCEL (Asegúrate de que exportarExcel use window.sedeFiltroActual)
window.exportarExcel = function() {
    const contenedor = document.getElementById('contenedor-admin');
    if (!contenedor) return;

    const filas = Array.from(contenedor.querySelectorAll('div.grid'));
    if (filas.length === 0) return alert("No hay datos para exportar");

    // RECONSTRUCCIÓN DEL FORMATO ORIGINAL SEGÚN TU IMAGEN
    let excelTemplate = `<html><head><meta charset="UTF-8">
    <style>
        /* Tu formato original recuperado */
        .header-verde { background: #0d9488; color: white; font-family: sans-serif; font-size: 16pt; font-weight: bold; text-align: center; }
        .fecha-sub { font-family: sans-serif; font-size: 10pt; text-align: center; }
        .col-titulos { background: #ffffff; color: #000000; font-family: sans-serif; font-size: 11pt; font-weight: bold; border: 0.5pt solid #000000; text-align: center; }
        .celda-datos { border: 0.5pt solid #000000; font-family: sans-serif; font-size: 10pt; padding: 4px; }
        .footer { font-family: sans-serif; font-size: 9pt; color: #666666; font-style: italic; }
    </style>
    </head><body>
    <table>
        <tr><td colspan="7" class="header-verde">REPORTE DE CITAS - CASCADA SPA</td></tr>
        <tr><td colspan="7" class="fecha-sub">Fecha: ${new Date().toLocaleDateString()}</td></tr>
        <tr><td colspan="7"></td></tr>
        
        <tr>
            <th class="col-titulos" style="width: 100pt;">SEDE</th>
            <th class="col-titulos" style="width: 90pt;">FECHA</th>
            <th class="col-titulos" style="width: 70pt;">HORA</th>
            <th class="col-titulos" style="width: 200pt;">PACIENTE</th>
            <th class="col-titulos" style="width: 100pt;">ID/CEDULA</th>
            <th class="col-titulos" style="width: 100pt;">TELEFONO</th>
            <th class="col-titulos" style="width: 90pt;">ESTADO</th>
        </tr>`;

    filas.forEach(f => {
        // Extraemos los datos manteniendo la lógica de las etiquetas ocultas
        const sede = f.querySelector('.ex-sede')?.innerText || "---";
        const fecha = f.querySelector('.ex-fecha')?.innerText || "---";
        const hora = f.querySelector('.ex-hora')?.innerText || "---";
        const paciente = f.querySelector('.ex-paciente')?.innerText || "---";
        const id = f.querySelector('.ex-id')?.innerText || "---";
        const tel = f.querySelector('.ex-tel')?.innerText || "---";
        const estado = f.querySelector('.ex-est')?.innerText || "ACTIVO";

        excelTemplate += `<tr>
            <td class="celda-datos">${sede.toUpperCase()}</td>
            <td class="celda-datos" style="text-align:center;">${fecha}</td>
            <td class="celda-datos" style="text-align:center;">${hora}</td>
            <td class="celda-datos">${paciente.toUpperCase()}</td>
            <td class="celda-datos" style="text-align:center;">${id}</td>
            <td class="celda-datos" style="text-align:center;">${tel}</td>
            <td class="celda-datos" style="text-align:center; font-weight:bold;">${estado.toUpperCase()}</td>
        </tr>`;
    });

    excelTemplate += `
        <tr><td colspan="7"></td></tr>
        <tr><td colspan="7" class="footer">REPORTE GENERADO EL: ${new Date().toLocaleString()}</td></tr>
        <tr><td colspan="7" class="footer">EMITIDO POR: SISTEMA ADMINISTRATIVO CASCADA SPA</td></tr>
    </table></body></html>`;

    // Descarga el archivo
    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reporte_Citas_Cascada.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


window.abrirCalendario = function(clienteId, sedeId, saldo, nombreSede, nombreTratamiento, tratamientoId) {
    console.log("SALDO RECIBIDO:", saldo);
    if (saldo <= 0) return alert("⚠️ No tiene sesiones disponibles.");

    // Validación final: si nombreSede es el ID largo, lo traducimos a texto
    const esCodigo = /^[0-9a-f]{8}-/.test(nombreSede); 
    const sedeNombreReal = (nombreSede && !esCodigo) ? nombreSede : (sedeId === '8f6cfaa9-a71d-446d-9901-4676bf8c1b98' ? 'QUITO' : 'VALLE');

    const main = document.getElementById('main-content');
    const dniActual = document.getElementById('input-dni-usuario').value;
    const hoyEcuador = new Date().toISOString().split('T')[0];

    main.innerHTML = `
        <div class="fade-in p-4 max-w-xl mx-auto text-center">
            <button onclick="location.reload()" class="text-slate-400 font-black mb-6 flex items-center italic text-[10px] uppercase">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                Regresar
            </button>

            <div class="mb-6">
                <h2 class="text-2xl font-black uppercase italic text-slate-800">Nueva Cita</h2>
                <p class="text-emerald-500 text-[10px] font-black uppercase mt-2 italic">Sede ${sedeNombreReal}</p>
            </div>

            <div class="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100">
                <div class="space-y-4">
                    <p class="text-[10px] font-black italic text-slate-400 uppercase">Seleccione una Fecha</p>
                    <input type="date" id="fecha-cita-usuario" 
                        min="${hoyEcuador}"
                        class="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 text-center font-black text-slate-700 outline-none focus:border-emerald-500 transition-all"
                        onchange="window.cargarHorasDisponibles(this.value, '${sedeId}')">
                    
                    <div id="grid-horas" class="grid grid-cols-3 gap-2 mt-6"></div>
                </div>
            </div>
            
            <input type="hidden" id="hidden-cliente-cedula" value="${dniActual}">
            <input type="hidden" id="hidden-saldo" value="${saldo}">
            <input type="hidden" id="hidden-tratamiento-id" value="${tratamientoId}">
        </div>
    `;
};


window.cargarHorasDisponibles = async function(fechaInput, sedeId) {
    const panel = document.getElementById('grid-horas');
    const cedulaCliente = document.getElementById('hidden-cliente-cedula').value;
    const ahora = new Date();
    const hoyEcuadorStr = ahora.toLocaleDateString('en-CA');
    
    const fechaObj = new Date(fechaInput + "T00:00:00");
    const diaSemana = fechaObj.getDay(); 

    // REGLA: DOMINGOS NO SE TRABAJA
    if (diaSemana === 0) {
        panel.innerHTML = `
            <div class="col-span-3 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                <p class="text-slate-400 font-black italic text-[12px] uppercase tracking-tighter">No hay atención los domingos</p>
            </div>`;
        return;
    }

    panel.innerHTML = '<p class="col-span-3 text-center font-black italic text-[10px] text-slate-400 animate-pulse py-10">CONSULTANDO...</p>';
    
    try {
        const { data: ocupadas, error } = await sb.from('agendamientos')
            .select('fecha_hora, cliente_cedula')
            .eq('sede_id', sedeId)
            .neq('estado', 'cancelada')
            .gte('fecha_hora', `${fechaInput}T00:00:00`)
            .lte('fecha_hora', `${fechaInput}T23:59:59`);
        
        if (error) throw error;

        const horaActualDecimal = ahora.getHours() + (ahora.getMinutes() / 60);
        
        // REGLAS DE HORARIO
        let minInicio = (diaSemana === 6) ? 9 * 60 : 10 * 60; // Sábados 9am, resto 10am
        let minFin = (diaSemana === 6) ? 15 * 60 : 18 * 60;   // Sábados hasta las 3pm, L-V hasta las 6pm (18:00)

        panel.innerHTML = '';

        for (let m = minInicio; m <= minFin; m += 60) {
            const h = Math.floor(m / 60);
            const mins = m % 60;
            const horaHHMM = `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
            
            const citasEnHora = (ocupadas || []).filter(r => {
                const d = new Date(r.fecha_hora);
                return `${d.getUTCHours().toString().padStart(2, '0')}:00` === horaHHMM;
            });

            const yaTieneCita = citasEnHora.some(r => String(r.cliente_cedula) === String(cedulaCliente));
            const esHoraPasada = (fechaInput === hoyEcuadorStr && (h + mins/60) <= horaActualDecimal);
            
            const btn = document.createElement('button');
            const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
            const ampm = h >= 12 ? 'PM' : 'AM';
            
            const bloqueado = yaTieneCita || citasEnHora.length >= 3 || esHoraPasada;

            btn.className = bloqueado 
                ? "bg-slate-50 text-slate-300 p-4 rounded-2xl text-[10px] font-black italic border border-slate-100 cursor-not-allowed opacity-60"
                : "bg-white border-2 border-emerald-50 text-emerald-600 p-4 rounded-2xl text-[11px] font-black italic hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95";
            
            let labelMsg = yaTieneCita ? 'YA RESERVADO' : (citasEnHora.length >= 3 ? 'CUPO LLENO' : (esHoraPasada ? 'PASADO' : (3 - citasEnHora.length) + ' DISPONIBLES'));
            
            btn.innerHTML = `<span>${displayH}:${mins.toString().padStart(2, '0')} ${ampm}</span><br><span class="text-[7px]">${labelMsg}</span>`;
            
            if (!bloqueado) {
                btn.onclick = () => window.confirmarReserva(`${fechaInput}T${horaHHMM}:00`, sedeId);
            }
            panel.appendChild(btn);
        }
    } catch (e) {
        panel.innerHTML = '<p class="text-red-500 font-bold text-[9px]">ERROR DE CONEXIÓN</p>';
    }
};


window.confirmarReserva = async function(isoFechaHora, sedeId) {
    const cedula = document.getElementById('hidden-cliente-cedula').value;
    const saldoActual = parseInt(document.getElementById('hidden-saldo').value);

    if (saldoActual <= 0) return alert("❌ No dispone de citas disponibles.");

    if (!confirm("¿Desea confirmar el agendamiento?")) return;

const tratamientoId = document.getElementById('hidden-tratamiento-id').value;

    try {
        // 1. Contar previas para 'nro_sesion_actual'
        const { data: previas } = await sb.from('agendamientos')
            .select('id')
            //.eq('cliente_tratamiento_id', tratamientoExistente.id)
            .eq('cliente_cedula', cedula)
           .in('estado', ['agendada', 'finalizada']);
        
        const nroProxima = (previas ? previas.length : 0) + 1;


let servicio_id = null;
let promocion_id = null;

// 🔍 detectar si es servicio o promo
const { data: esServicio } = await sb
    .from('servicios')
    .select('id')
    .eq('id', tratamientoId)
    .maybeSingle();

if (esServicio) {
    servicio_id = tratamientoId;
} else {
    promocion_id = tratamientoId;
}

// 🔒 VALIDAR SI YA EXISTE CITA EN ESA HORA Y SEDE
const { data: citaExistente } = await sb.from('agendamientos')
    .select('id')
    .eq('sede_id', sedeId)
    .eq('fecha_hora', isoFechaHora)
    .in('estado', ['agendada']);

if (citaExistente && citaExistente.length > 0) {
    return alert("❌ Ya existe una cita agendada en esa hora.");
}

const { error: errorCita } = await sb.from('agendamientos').insert([{
    cliente_cedula: cedula,
    sede_id: sedeId, // 🔥 CRÍTICO
    //servicio_id: servicio ? servicio.id : null,
  servicio_id: servicio_id,
promocion_id: promocion_id,
    fecha_hora: isoFechaHora,
    estado: 'agendada',
    nro_sesion_actual: nroProxima,
    sync_offline: false
}]);

        if (errorCita) throw errorCita;

        // 3. DESCUENTO AUTOMÁTICO EN TABLA CLIENTES
        const { error: errorUpdate } = await sb.from('clientes')
            .update({ citas_restantes: saldoActual - 1 })
            .eq('identificacion', cedula);

        if (errorUpdate) throw errorUpdate;

        alert("✅ Agendamiento exitoso.");
        window.location.reload(); 

    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
};

    document.addEventListener('DOMContentLoaded', cargarSedes);
})();