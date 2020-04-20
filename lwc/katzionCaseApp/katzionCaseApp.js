import { LightningElement,track } from 'lwc';
import saveCaseDetails from '@salesforce/apex/CaseController.saveCaseDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class KatzionCaseApp extends LightningElement {
    @track ShowCaseWindow=false;
    @track caseActiveTabs=['CaseInformation','BorrowerAccountInformation','BorrowerContactInformation'];
    @track cssDisplay = false; 
    
    newCaseRecord(){
        this.ShowCaseWindow=true;
    }
    showLoading(){

    }
    closeLoading(){

    }
    validateCaseRecord(){
        return this.template.querySelector('[data-id="CaseComp"]').validateCase();

    }
    saveCaseRecord(){

        if(!this.validateCaseRecord()){
            console.log(JSON.stringify(this.template.querySelector('[data-id="CaseComp"]').collectCaseDetails()));
            this.cssDisplay = true;
            saveCaseDetails({'Payload':JSON.stringify(this.template.querySelector('[data-id="CaseComp"]').collectCaseDetails())})
            .then(suc=>{
                //alert(suc);
                console.log(suc);
                console.log(suc.includes("Exception"));
                if(suc.includes("Exception")){
                    this.cssDisplay = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: suc,
                            variant: 'error'
                        })
                    );
                } else {
                    
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Case created',
                            variant: 'success'
                        })
                    );
                }
                
                //console.log(suc);
                //console.log(suc.length);
                //window.location.replace('/corporate/s/case/Case/00B7F000001ihDmUAI');
                if(suc!=null && suc.length===18){
                    //window.location.replace('/corporate/s/case/Case/00B7F000001ihDmUAI');
                    window.location.replace('/corporate/s/case/'+suc);
                }
                //alert('HELLO');
                //alert(suc);
                //window.location.replace('/corporate/s/case/'+suc);
                //this.ShowCaseWindow=false;
                //this.ShowCaseWindow=false;
            })
            .catch(err=>{
                console.log(err);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: err,
                        variant: 'error'
                    })
                );

            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: "Required fields are missing. Please review record details!",
                    variant: 'error'
                })
            );
        }
    }
    cancelCaseRecord(){
        this.ShowCaseWindow=false;
    }

}