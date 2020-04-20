/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,api } from 'lwc';

export default class TaskComp extends LightningElement {
    @api tsk={};
    @api userList;
    @api taskData;
    @api currentUser;
    @api TaskObj;
    connectedCallback(){

    }
    priorityChange(){

    }
    statusChange(){

    }
    @api
    validateTask(){
        try{
            let Subject=this.template.querySelector('[data-id="Subject"]');
            let Status=this.template.querySelector('[data-id="Status"]');
            let Priority=this.template.querySelector('[data-id="Priority"]');
            let Owner=this.template.querySelector('[data-id="AssignTo"]');
            let validate=false;
            if(Subject.value!=undefined && Subject.value.trim().length!=0){
                validate=true;
                Subject.className=Subject.className.replace('slds-has-error','');
            }else{
                validate=false;
                Subject.className+=' slds-has-error';
            }
            if(Status.value!='NONE'){
                validate=validate?true:false;
                Status.className=Status.className.replace('slds-has-error','');
            }else{
                validate=false;
                Status.className+=' slds-has-error';
            }
            if(Priority.value!='NONE'){
                validate=validate?true:false;
                Priority.className=Priority.className.replace('slds-has-error','');
            }else{
                validate=false;
                Priority.className+=' slds-has-error';
            }
            if(Owner.value!=undefined){
                validate=validate?true:false;
                Owner.className=Owner.className.replace('slds-has-error','');
            }else{
                validate=false;
                Owner.className+=' slds-has-error';
            }
            if(validate){
                Subject.className=Subject.className.replace('slds-has-error','');
                Status.className=Status.className.replace('slds-has-error','');
                Priority.className=Priority.className.replace('slds-has-error','');
                Owner.className=Owner.className.replace('slds-has-error','');
                this.TaskObj={'Status':Status.value,'Priority':Priority.value,'OwnerId':Owner.value,'Subject':Subject.value};   
            }else{
                this.TaskObj=null;
            }
            return validate;
        }catch(ex){
            alert(ex);
            alert('Wrong in Data');
            return false;
        }

    }
    removeData(){
        this.dispatchEvent(new CustomEvent('removetaskinfo',{'detail':this.tsk.taskId}));
    }
}