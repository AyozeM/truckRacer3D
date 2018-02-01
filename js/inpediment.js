/**
 * Crea los muros
 * @class
 * @extends inpediment
 */
class inpediment extends inpedimentModel{
    /**
     * 
     * @param {ancho del muro} w 
     * @param {alto del muro} h 
     * @param {profundidad del muro} d 
     * @param {color del muro} c 
     * @param {daño que causa el muro} damage 
     */
    constructor(w,h,d,c,damage){
        super(w,h,d,c);
        this.type = "inpediment";
        this.damage = damage;
    }
}