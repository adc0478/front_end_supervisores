function view_lista_registros(){
    let vista = `    
        <div id="modal" class="absolute inset-0 top-5 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
            <h2 class="text-xl font-semibold mb-4">Observacion maquinas</h2>
            <form onsubmit="return false" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="mb-4">
                    <label for="desde" class="block font-medium">Desde</label>
                    <input type="date" id="desde" name="desde" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                <div class="mb-4">
                    <label for="hasta" class="block font-medium">Hasta</label>
                    <input type="date" id="hasta" name="hasta" class="w-full border-gray-300 rounded-md shadow-sm py-2 px-3">
                </div>
                              <!-- Otros campos y selects aquí -->
                
                <button type="submit" onclick="update_tabla_registros()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Listar</button>
            </form>

                <a class="absolute p-2 text-red-700 top-1 right-1 ronded-md cursor-pointer hover:shadow-md" onclick="close_window()">x</a>
            <!-- Tabla -->
            <table class="mt-8 w-full">
                <thead class="bg-gray-100 border-b-2 border-fuchsia-600">
                    <tr>
                        <th class="px-4 py-2">Usuario</th>
                        <th class="px-4 py-2">Fecha</th>
                        <th class="px-4 py-2">Turno</th>
                        <th class="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Filas de la tabla aquí -->
                </tbody>
            </table>
        </div>
    `;
        document.querySelector('#container').innerHTML += vista;
    
}
function update_tabla_registros(){
    let desde = document.querySelector("#desde").value;
    let hasta = document.querySelector("#hasta").value;
    let url = uriGlobal + `api/search_registro_by_date?desde=${desde}&hasta=${hasta}`;
    let opt = {
        method:"get",
        headers:{
            "content-type":"application/json",
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    fetch(url,opt)
        .then(response=>response.json())
        .then(function (data){
            if (data['status'] == 1){
                refresh_table(data['data']);
            }else{
                let error = "";
                if (typeof(data['mje']) == "object"){
                    for (const key in data['mje']) {
                        error += data['mje'][key];        
                    }
                }else{
                    error = data['mje'];
                }
                alert (error);
            }
           
        });
}
function refresh_table(lista){
       let tabla = "";
       for (let index = 0; index < lista.length; index++) {
            tabla += `
                <tr>
                    <td class="text-center">${lista[index]['name']}</td>
                    <td class="text-center">${lista[index]['fecha']}</td>
                    <td class="text-center">${lista[index]['turno']}</td>
                   <td> <a onclick="levantar_registro(${lista[index]['idregistro']})" class="w-8 shadow hover:shadow-md  text-center text-white cursor-pointer"><img class="mx-auto" src="img/edit.svg"></a></td>
               </tr>
           `
       } 
        document.querySelector("tbody").innerHTML = tabla;
}
async function levantar_registro(id){
    let data = await search_registro_by_id(id);
    if (typeof(data) == "object"){
        update_local_registro(data);
        close_window();
        view_multilink();
    }else{
        alert ("Up error al levantar el registro");
    }
    
}
