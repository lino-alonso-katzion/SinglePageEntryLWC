import { LightningElement,track,api } from 'lwc';

export default class LookupResult extends LightningElement {
    @api record;
    @api
    onClickRecord(){
        //implement fireEvent 

        return this.record;
    }

}