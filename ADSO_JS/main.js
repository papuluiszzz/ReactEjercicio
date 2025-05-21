(()=>{

    let contador = 0;
    const btnIncremento = document.getElementById('btn_IncrementarNumero');
    const textoContador = document.getElementById('textoContador')
    btnIncremento.addEventListener("click",()=>{
        
        contador += 1;
        textoContador.innerHTML = contador;



    })


})()