/**
 * Crea latas de gasolina
 * @class
 * @extends inpediment
 */
class fuelCan extends inpedimentModel{
    /**
     * Constructor
     * @param {ancho de la lata} w 
     * @param {alto de la lata} h 
     * @param {profundidad de la lata} d 
     * @param {color de la lata}
     * @param {litros que contiene la lata} litres 
     */
    constructor(w,h,d,c,litres){
        super(w,h,d,c);
        this.type =  "petrol";
        this.litres =  litres;
    }
}