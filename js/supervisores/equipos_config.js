function set_campos(tipo){
    switch (tipo) {
        case 'equipos':
            valores = {'idequipo': document.querySelector("#idequipo").value,
                        'nombre_eq': document.querySelector("#nombre_eq").value,
                        'tipo':'equipos'};        
            break;
        case 'maquinas':
             valores = {'idmaquina': document.querySelector("#idmaquina").value,
                        'detalle': document.querySelector("#detalle").value,
                        'tipo':'maquinas'};  
            break;
        case 'silos':
             valores = {'idsilo': document.querySelector("#idsilo").value,
                        'nombre_silo': document.querySelector("#nombre_silo").value,
                        'tipo':'silos'};  
            break;
            case 'tanques':
             valores = {'idtanque': document.querySelector("#idtanque").value,
                        'nombre_tk': document.querySelector("#nombre_tk").value,
                        'tipo':'tanques'};  
            break;
            case 'productos':
             valores = {'idproducto': document.querySelector("#idproducto").value,
                        'codigo': document.querySelector("#codigo").value,
                        'detalle': document.querySelector("#detalle").value,
                        'vida_util': document.querySelector("#vida_util").value,
                        'tipo':'productos'};  
            break;
            case 'userAdd':
             valores = {'id': document.querySelector("#id").value,
                        'name': document.querySelector("#name").value,
                        'email': document.querySelector("#email").value,
                        'password': document.querySelector("#password").value,
                        'tipo':'userAdd'};
            break;
            case 'userAbility':
             valores = {'id': document.querySelector("#id").value,
                        'user_iduser': document.querySelector("#user_iduser").value,
                        'habilidades': document.querySelector("#habilidades").value,
                        'tipo':'userAbility'};
            break;
        default:
            break;
    }
    return valores;
}
function set_edit_campos(tipo,Dataarray){
    switch (tipo) {
        case "equipos":
            document.querySelector("#idequipo").value = Dataarray[0]; 
            document.querySelector("#nombre_eq").value = Dataarray[1]; 
            break;
        case 'maquinas':
            document.querySelector("#idmaquina").value = Dataarray[0]; 
            document.querySelector("#detalle").value = Dataarray[1]; 
            break;
        case 'silos':
            document.querySelector("#idsilo").value = Dataarray[0]; 
            document.querySelector("#nombre_silo").value = Dataarray[1]; 
            break;
        case 'tanques':
            document.querySelector("#idtanque").value = Dataarray[0]; 
            document.querySelector("#nombre_tk").value = Dataarray[1]; 
            break;
         case 'productos':
            document.querySelector("#idproducto").value = Dataarray[0]; 
            document.querySelector("#codigo").value = Dataarray[1]; 
            document.querySelector("#detalle").value = Dataarray[2]; 
            document.querySelector("#vida_util").value = Dataarray[3]; 
            break;
        case 'userAdd':
            document.querySelector("#id").value = Dataarray[0]; 
            document.querySelector("#name").value = Dataarray[1]; 
            document.querySelector("#email").value = Dataarray[2]; 
            break;
        case 'userAbility':
            document.querySelector("#id").value = Dataarray[0]; 
            document.querySelector("#user_iduser").value = Dataarray[1]; 
            document.querySelector("#habilidades").value = Dataarray[2]; 
            break;
        default:
            break;
    }
}
async function registrar_config(tipo){
    let salida = "";
    let valores = set_campos(tipo); 
    let url = uriGlobal + "api/config_insert";
    let opt = {
        method:"post",
        body: JSON.stringify(valores),
        headers:{
            'content-type':"application/json",
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    let envio = await fetch(url,opt);
    if (!envio.ok){
        alert ("Error en la solicitud");
    }else{
        let data = await envio.json();
        if (data['status'] == 0){
            if (typeof(data['error']) == "object"){
                    for (key in data['error']) {
                           salida += data['error'][key]; 
                    }
            }else{
                salida = data['error'];
            }
            alert (salida);
        }else{
            alert ("Se actualizo el registro");
            modulo();
        }
    }

}
function editar_equipo(tipo,Dataarray){
    set_edit_campos(tipo, Dataarray);
}
async function borrar_config(tipo){
  let salida ="";
  let valores = set_campos(tipo);
  let url = uriGlobal + "api/config_delete";
  let opt = {
      method:"post",
      body: JSON.stringify(valores),
      headers:{
          'content-type':'application/json',
          Authorization: "Bearer " + localStorage.getItem('token')
      }
      
  };
    let envio = await fetch(url,opt);
    if (!envio.ok){
        alert ("Error en la solicitud");
    }else{
        let data = await envio.json();
        if (data['status'] == 0){
            if (typeof(data['error']) == "object"){
                    for (const key in data['error']) {
                           salida += data['error'][key]; 
                    }
            }else{
                salida = data['error'];
            }
            alert (salida);
        }else{
            alert ("Se actualizo el registro");
            modulo();
        }
    }


}
