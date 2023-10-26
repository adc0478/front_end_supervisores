async function view_info(){
    let vista = `<div id="modal" class="absolute inset-0 top-3 overflow-y-auto bg-white p-8 rounded w-full md:w-1/2 mt-8 mx-auto">
                <a class="absolute p-2 text-red-700 top-1 right-1 ronded-md cursor-pointer hover:shadow-md" onclick="close_window()">x</a>


        </div>
`;
    if (typeof(localStorage.getItem('supervisores')) == "string") {
       let obj = JSON.parse(localStorage.getItem('supervisores')); 
        let url = uriGlobal + "api/info_html?idregistro=" + obj['idregistro'];
        let opt={
            method:"get",
            headers:{
                'content-type':'application/json',
                Authorization:"Bearer " + localStorage.getItem('token')
            }
        }
            let response = await fetch(url,opt);
            if (!response.ok){
                registro_rechazado();
            }else{
                let data = await response.text();
                //let info = window.open();
                //info.document.write(data);
                //info.document.close();
                document.querySelector('#formularios').innerHTML = vista;
                document.querySelector('#modal').innerHTML += data;

            }
    }else{
        alert ("No hay planilla en curso");
    }
}
