/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { LightningElement,track, wire } from 'lwc';
import collectUser from '@salesforce/apex/CaseController.collectUser';
import collectCurrentUserInfo from '@salesforce/apex/CaseController.collectCurrentUserInfo';
import collectTaskDependency from '@salesforce/apex/CaseController.collectTaskDependency';
import saveDetails from '@salesforce/apex/CaseController.saveDetails';
import { CurrentPageReference } from 'lightning/navigation';

export default class CaseApp1 extends LightningElement {
    @track newRecord=false;
    @track tasks=[];
    @track CurrentUser=null;
    @track AccountRecord=null;
    @track TaskCount=0;

    @wire(CurrentPageReference) pageRef;

    //@wire(collectCurrentUserInfo) CurrentUser;
    @wire(collectUser) UserMap;
    @wire(collectTaskDependency) TaskData;

    //TO COLLECT CURRENT USER INFORMATION
    collectUserInfo(){
        collectCurrentUserInfo()
        .then(data=>{
            this.CurrentUser=data;
        })
        .catch(er=>{
            let z= this.template.querySelector('[data-id="alertbox"]');
            z.showAlert(''+er,false,5000);
        });
    }

    //TO REFRESH VIEW
    refreshView(){
        // eslint-disable-next-line no-eval
        //eval("$A.get('e.force:refreshView').fire();");
        //this.tasks=[{'taskId':'Task1','Name':'Task1'}];
        this.tasks=[];
        this.AccountRecord=null;
        this.newRecord=false; 

    }
    //ON LOAD FUNCTIONALITY
    connectedCallback(){
        this.collectUserInfo();
    }

    newAccountRecord(){
        this.refreshView();
        this.newRecord=true;
    }
    cancelAccountRecord(){
        this.newRecord=false; 
    }
    addNewTask(){
        if(this.validateData()){
            this.tasks.push({'taskId':'Task'+this.TaskCount+1,'Name':'Task'+(this.tasks.length+1)});
            this.TaskCount+=1;
        }else{
            let z= this.template.querySelector('[data-id="alertbox"]');
            z.showAlert('Please fill the information in Task!!',false,5000);
        }
    }
    validateData(){
        try{
            let validatebol=true;
            this.tasks.forEach(element => {
                let tskcomp=this.template.querySelector('[data-id="'+element.taskId+'"]');
                let bol=tskcomp.validateTask();
                validatebol=validatebol?bol:false;
            });
            return validatebol;
        }catch(ex){
            return false;
        }
    }
    check(){
        let z= this.template.querySelector('[data-id="alertbox"]');
        z.showAlert('ISAAC SHAIKH IS BAAD!!!!',true,5000);
    }
    check1(){
        let z= this.template.querySelector('[data-id="alertbox"]');
        z.showAlert('ISAAC SHAIKH IS BAAD!!!!',false,5000);
    }
    removeTask(event){
        let TempTask=[];
        this.tasks.forEach(element => {
            if(element.taskId!=event.detail){
                TempTask.push(element);
            }
        });
        this.tasks=TempTask;
    }
    saveAccountDetails(){
        let taskValidator=this.validateData();
        //alert(taskValidator);
        let AccountValidator=this.template.querySelector('[data-id="AccountComp"]').validateAccount();
        //alert(AccountValidator);
        if(taskValidator && AccountValidator){
            let AccountData=this.template.querySelector('[data-id="AccountComp"]').acc;
            let TaskDataList=[];
            this.tasks.forEach(element => {
                let tskcomp=this.template.querySelector('[data-id="'+element.taskId+'"]');
                TaskDataList.push(tskcomp.TaskObj);
            });
            this.saveData(AccountData,TaskDataList);
        }else{
            let z= this.template.querySelector('[data-id="alertbox"]');
            z.showAlert('Please fill the information !!',false,5000);
        }
    }
    saveData(acc,tsklist){
        //alert(JSON.stringify(acc));
        //alert(JSON.stringify(tsklist));
        saveDetails({"AccountJson":JSON.stringify(acc),"TaskJsonList":JSON.stringify(tsklist)})
        .then(res=>{
            //alert(res);
            if(res!=null){
                console.log(this.pageRef);
                console.log(JSON.stringify(this.pageRef));
                alert(res);

            }
        })
        .catch(err=>{
            console.log(err);
            let z= this.template.querySelector('[data-id="alertbox"]');
            z.showAlert('Unable to save Information.Please contact your Administrator!!',false,5000);
        });
    }
}