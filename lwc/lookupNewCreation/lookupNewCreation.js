import { LightningElement,api,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveContactDetails from '@salesforce/apex/CaseController.saveContactDetails';

export default class LookupNewCreation extends LightningElement {
    @api contactFirstName;
    @api contactLastName;
    @api contactPhone;
    @api contactMobilePhone;
    @api contactBirthdate;
    @api contactEmail;
    @api contactStreet;
    @api contactCity;
    @api contactState;
    @api contactPostalCode;
    @api contactCountry;

    @track ContactResult;

    cancelWindow(){
        this.dispatchEvent(new CustomEvent('cancelrecord',{'detail':null}));
        
    }

    saveContactRecord(){
    

        if(!this.validateContact()){
            
            this.cssDisplay = true;
               
            console.log(this.ContactResult);
            saveContactDetails({'Payload':JSON.stringify(this.ContactResult)})
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
                            message: 'Contact created',
                            variant: 'success'
                        })
                    );
                    this.dispatchEvent(new CustomEvent('cancelrecord',{'detail':suc}));

                    // Fire the event from c-tile
                    //this.dispatchEvent(new CustomEvent('contactrecord',{'contact':suc}));
                }
                
                //console.log(suc);
                //console.log(suc.length);
                //window.location.replace('/corporate/s/case/Case/00B7F000001ihDmUAI');
                /*if(suc!=null && suc.length===18){
                    //window.location.replace('/corporate/s/case/Case/00B7F000001ihDmUAI');
                    this.dispatchEvent(new CustomEvent('cancelrecord',{'detail':'can'}));
                }*/
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

    @api
    validateContact(){
        let valid     = false;
        this.ContactResult={};
        try{
        if(this.template.querySelector('[data-id="BorrowerContactFirstName"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').setCustomValidity('Please enter Borrower Contact LastName ');
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').reportValidity();
            this.ContactResult.BorrowerContactFirstName=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactFirstName"]').reportValidity();
            this.ContactResult.BorrowerContactFirstName=this.template.querySelector('[data-id="BorrowerContactFirstName"]').value;
        } 
        if(this.template.querySelector('[data-id="BorrowerContactLastName"]').value==''){
            valid=true;
            this.template.querySelector('[data-id="BorrowerContactLastName"]').setCustomValidity('Please enter Borrower Contact LastName ');
            this.template.querySelector('[data-id="BorrowerContactLastName"]').reportValidity();
            this.ContactResult.BorrowerContactLastName=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactLastName"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactLastName"]').reportValidity();
            this.ContactResult.BorrowerContactLastName=this.template.querySelector('[data-id="BorrowerContactLastName"]').value;
        }
        
        if(this.template.querySelector('[data-id="BorrowerContactEmail"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactEmail"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactEmail"]').reportValidity();
            this.ContactResult.BorrowerContactEmail=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactEmail"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactEmail"]').reportValidity();
            this.ContactResult.BorrowerContactEmail=this.template.querySelector('[data-id="BorrowerContactEmail"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactPhone"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPhone"]').reportValidity();
            this.ContactResult.BorrowerContactPhone=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactPhone"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPhone"]').reportValidity();
            this.ContactResult.BorrowerContactPhone=this.template.querySelector('[data-id="BorrowerContactPhone"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactMobile"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactMobile"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactMobile"]').reportValidity();
            this.ContactResult.BorrowerContactMobile=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactMobile"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactMobile"]').reportValidity();
            this.ContactResult.BorrowerContactMobile=this.template.querySelector('[data-id="BorrowerContactMobile"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerBirthDate"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerBirthDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerBirthDate"]').reportValidity();
            this.ContactResult.BorrowerBirthDate=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerBirthDate"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerBirthDate"]').reportValidity();
            this.ContactResult.BorrowerBirthDate=this.template.querySelector('[data-id="BorrowerBirthDate"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactStreet"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactStreet"]').reportValidity();
            this.ContactResult.BorrowerContactStreet=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactStreet"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactStreet"]').reportValidity();
            this.ContactResult.BorrowerContactStreet=this.template.querySelector('[data-id="BorrowerContactStreet"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactCity"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.ContactResult.BorrowerContactCity=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactCity"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.ContactResult.BorrowerContactCity=this.template.querySelector('[data-id="BorrowerContactCity"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactState"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCity"]').reportValidity();
            this.ContactResult.BorrowerContactState=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactState"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactState"]').reportValidity();
            this.ContactResult.BorrowerContactState=this.template.querySelector('[data-id="BorrowerContactState"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactPostalCode"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').reportValidity();
            this.ContactResult.BorrowerContactPostalCode=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactPostalCode"]').reportValidity();
            this.ContactResult.BorrowerContactPostalCode=this.template.querySelector('[data-id="BorrowerContactPostalCode"]').value;
        }

        if(this.template.querySelector('[data-id="BorrowerContactCountry"]').value==''){
            //valid=true;
            this.template.querySelector('[data-id="BorrowerContactCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCountry"]').reportValidity();
            this.ContactResult.BorrowerContactCountry=null;
        }else{
        
            this.template.querySelector('[data-id="BorrowerContactCountry"]').setCustomValidity('');
            this.template.querySelector('[data-id="BorrowerContactCountry"]').reportValidity();
            this.ContactResult.BorrowerContactCountry=this.template.querySelector('[data-id="BorrowerContactCountry"]').value;
        }

    }catch(e){
        alert(e);
    }

        console.log(this.ContactResult);
        if(!valid){
            return false;
        }
        return true;
      

    }
}