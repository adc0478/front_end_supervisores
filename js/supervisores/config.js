function view_config(){
    let vista = `
        <div class="w-full mt-3">
        <div class="p-3 grid grid-cols-1 md:grid-cols-2 w-full md:w-1/2 gap-3 mx-auto shadow-md bg-yellow-100">
                <div class="mb-4 w-full">
                     <label for="tipo" class="block font-medium">Modulo</label>
                     <select id="tipo" name="tipo" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <option value="equipos">Equipos</option>
                        <option value="maquinas">Maquinas</option>
                        <option value="silos">Silos</option>
                        <option value="tanques">Tanques</option>
                        <option value="productos">Productos</option>
                        <option value="userAdd">Crear usuario</option>
                        <option value="userAbility">Configurar habilidades</option>
                    </select>
                </div>

                <button type="button" onclick="modulo()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Abrir</button>
        </div>
        <div id="contenidos"></div>
        </div>
    `;
    document.querySelector('#container').innerHTML = vista;
}
async function modulo(){
    let tipo = document.querySelector('#tipo').value;
    let url = uriGlobal + "api/config_view?tipo=" + tipo;
    let opt ={
        method:"get",
        headers:{
            'content-type':'application/json',
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    let response = await fetch(url,opt);
    if (response.ok){
        let data = await response.text();
        document.querySelector('#contenidos').innerHTML = data;
    }else{
        alert ("No tiene permisos");
    }
}
