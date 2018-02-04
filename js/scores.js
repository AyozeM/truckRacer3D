let dbScores;
$(document).ready(function(){
    dbScores = localStorage.getItem("scores");
    if(dbScores != null){
        dbScores = JSON.parse(dbScores);
        interconector($("input[checked]").val());
        $("input:checked").parent().addClass("checked");
        $("input").change(function(){
            $("input").parent().removeClass();
            $("section").children().remove();
            interconector($(this).val());
            $("input:checked").parent().addClass("checked");
        });
    }else{
        alert("no existen puntuaciones previas en este pc")
    }
});
/**
 * Decide que tipo de visualizacion de puntuaciones muestra
 * @param {valor del radio} option 
 */
const interconector = option =>{
    switch (option) {
        case "users":
            Object.keys(dbScores).map(e=>createRegister(e));
            break;
        case "bests":
            let aux = [];
            Object.keys(dbScores).map(e=>{
                dbScores[e].map(y=>{
                    aux.push({name:e,score:y.score});
                })
            });
            createBestScore(aux);
            break;
    }
}
/**
 * Visualiza las puntuaciones separadas por los usuarios
 * @param {usuario} actual 
 */
const createRegister = actual =>{
    dbScores[actual].sort((a,b)=>a.score-b.score).reverse();
    $("<div>").append(
        $(`<h3 class="toUp">${actual}</h3>`).click(function(){
            $(this).siblings("div").slideToggle();
            $(this).toggleClass("toDown");
        })
    ).append(
        $("<div>").append(
            $("<p>").append(
                $("<span>Fecha</span>")
            ).append(
                $("<span>Puntuacion</span>")
            )
        ).append(
        dbScores[actual].map(e=>{
            let fecha = new Date(e.date);
            return $("<p>").append(
                $(`<span>${fecha.toDateString()} ${fecha.getHours()}:${fecha.getMinutes()}</span>`)
            ).append(
                $(`<span>${e.score} kms</span>`)
            )
        })
        )
    ).appendTo("section");
}
/**
 * Muestra las puntuaciones de mejor a peor
 * @param {Lista de puntuaciones} allScore 
 */
const createBestScore = allScore =>{
    allScore.sort((a,b)=>a.score-b.score).reverse();
    $("section").append(
        $("<p>").append(
            $("<span>Nickname</span>")
        ).append(
            $("<span>Puntuacion</span>")
        )
    )
    allScore.map(e=>{
        $("<p>").append(
            $(`<span>${e.name}</span>`)
        ).append(
            $(`<span>${e.score} km</span>`)
        ).appendTo("section");
    });
}