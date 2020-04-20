import { LightningElement,track,wire,api } from 'lwc';
import lookupData from '@salesforce/apex/LookupController.lookupData';

export default class LookupComp extends LightningElement {
    @track selectedRecord;
    @track RecordList=[];
    @track SearchKeyword='';
    @track Message=null;
    @track showList=false;
    @track spinner=false;
    @track LookupNewCreation=false;
    @api displayName='';
    @api objectName='';
    @api filter='';

    @api goData=null;
    @api goBol=false;


    @track alertmsg='';
    @track shwalert=false;
    @track alertStyle='';

    @api lookupCreation=false;

    @api
    getRecordId(){
        return this.selectedRecord.Id;
    }

    @api 
    checkValidity(){
        if(this.selectedRecord!=null){
            
            return true;
        }else {
           
            return false;
        }
    }

    @api 
    reportValidity(){
        if(this.alertmsg==''){
            this.alertStyle='';
            this.shwalert=false;
        }else{
            this.alertStyle='border-color:red';
            this.shwalert=true;
        }
    }

    @api 
    setCustomValidity(msg){
        this.alertmsg=msg;
    }

    onblur(){
        this.RecordList=[];
        this.showList=false;
        this.template.querySelector('[data-id="searchRes"]').className=this.template.querySelector('[data-id="searchRes"]').className.replace('slds-is-close','slds-is-open');
    }
    clear(){
        this.selectedRecord=null;
    }
    onfocus(){
        this.showList=true;
        this.spinner=true;
        
        this.SearchKeyword='';
        if(this.template.querySelector('[data-id="SearchText"]')!=null){
            this.template.querySelector('[data-id="SearchText"]').value='';
        }
        this.collectlookupData();
        
    }
    keyPressController(event){
        this.SearchKeyword= event.target.value;
        this.collectlookupData();
    }

    collectlookupData(){
        console.log(this.SearchKeyword);
        this.showList=true;
        lookupData({'ObjectName':this.objectName,'SearchText':this.SearchKeyword,'ObjectFilter':this.filter})
        .then(suc=>{
            this.RecordList=[];
            if(this.goBol && this.goData!=null){
                this.RecordList=[this.goData];
            }
            console.log(JSON.stringify(suc));
            
            console.log(this.template.querySelector('[data-id="searchRes"]'));
            if(suc!=null){
                if(suc.length>0){
                    this.Message=null;
                    this.RecordList=this.RecordList.concat(suc);

                }else{
                    if(this.goBol && this.goData==null){
                        this.RecordList=[];
                        this.Message='No Result Found...';
                    }
                }

                
            }
            this.spinner=false;
        }).catch(err=>{
            alert('Please Check with Administrator!');
        });
    }
    onselectData(event){
        let itemid=event.target.id.split('-')[0];
        
        // Fire the event from c-tile
        this.dispatchEvent(new CustomEvent('lookupid',{'detail':itemid}));

        console.log(itemid);
        if(this.template.querySelector('[data-id="'+itemid+'"]')!=null){
            this.selectedRecord=this.template.querySelector('[data-id="'+itemid+'"]').onClickRecord();
            this.showList=false;
        }
      
       
    }

    populateNewContact(event){
        let newContact=event.detail;
        console.log('Event details ' + newContact);
        this.selectedRecord= newContact;
        /*let itemid=event.target.id.split('-')[0];
        
        // Fire the event from c-tile
        this.dispatchEvent(new CustomEvent('lookupid',{'detail':itemid}));

        console.log(itemid);
        if(this.template.querySelector('[data-id="'+itemid+'"]')!=null){
            this.selectedRecord=this.template.querySelector('[data-id="'+itemid+'"]').onClickRecord();
            this.showList=false;
        }*/
      
       
    }

    createLookupData(){
        this.showList=false; 
        this.LookupNewCreation=true;
    }
    cancelWindow(event){
        let newContact=event.detail;
        console.log('Event details ' + newContact);
        if(newContact){
            this.selectedRecord= JSON.parse(newContact);
            //console.log(newContact.Name);
        }
        
        this.LookupNewCreation=false;
    }

}