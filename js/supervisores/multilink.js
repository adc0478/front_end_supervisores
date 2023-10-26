

function view_multilink(){
    let vista = `<div class="flex items-center justify-center h-4/5">
  <div class="space-y-4 text-center flex flex-col">
    <a onclick="view_registro()" id="btn_registro" class="relative grid grid-cols-1 shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Alta registro <span class="text-red-700 text-center" id="dato_registro"></span></a>
    <a onclick="view_vencimiento()" class="shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Control vto</a>
    <a onclick="view_lavados()" class="shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Lavados equipos</a>
    <a onclick="view_stock()" class="shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Stock en silos</a>
    <a onclick="view_obs_maquina()" class="shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Observacion maquina</a>
    <a onclick="view_info()" class="shadow-md cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded inline-block">Informe</a>
  </div>
  <div id="formularios"></div>
</div>`;
    if (typeof(localStorage.getItem('user')) == "string") {
        document.querySelector('#container').innerHTML = vista;
        //buscar registro activo para este usuario
        if (typeof(localStorage.getItem('supervisores')) == "string"){
            refresh_registro();
        }else{
            search_registro();
        }
    }else{
        alert ("Debe ingresar como un usuario");
    }
}
