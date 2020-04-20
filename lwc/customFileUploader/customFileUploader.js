import { LightningElement, track, api } from 'lwc';
import saveFile from '@salesforce/apex/LWCCustomFileUploader.saveFile';
import releatedFiles from '@salesforce/apex/LWCCustomFileUploader.releatedFiles';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const columns = [
    {label: 'Title', fieldName: 'Title'}
];

export default class CustomFileUploader extends LightningElement {
    @api recordId;
    @api subject;
    @track columns = columns;
    @track data;
    @track fileName = '';
    @track fileNameList = [];
    @track fileContentsList = [];
    @track UploadFile = 'Upload File';
    @track showLoadingSpinner = false;
    @track isTrue = false;
    selectedRecords;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    MAX_FILE_SIZE = 1500000;


    connectedCallback() {
        //this.getRelatedFiles();
    }

    // getting file 
    handleFilesChange(event) {
        console.log(event.target.files.length);
        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            var i;
            this.fileName = 'Files to upload: <br/>';
            for (i = 0; i < this.filesUploaded.length; i++) {
                this.fileName += event.target.files[i].name + ' <br/>';
            }
        }
    }

    handleSave() {
        if(this.filesUploaded.length > 0) {
            this.uploadHelper();
        }
        else {
            this.fileName = 'Please select file to upload!!';
        }
    }

    uploadHelper() {
        console.log(this.filesUploaded.length);
        var i;
        for (i = 0; i < this.filesUploaded.length; i++) {
            console.log(i);
            
            this.file = this.filesUploaded[i];
            console.log(this.file.name);
            this.fileNameList.push(this.file.name);
            console.log(this.file);
            if (this.file.size > this.MAX_FILE_SIZE) {
                window.console.log('File Size is to long');
                return ;
            }
            this.showLoadingSpinner = true;
        }
            let promises = [];
            for (let file of this.filesUploaded) {
                let filePromise = new Promise(resolve => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => resolve(reader.result);
                });
                promises.push(filePromise);
            }
            Promise.all(promises).then(fileContents1 => {
                // fileContents will be an array containing
                // the contents of the files, perform the
                // character replacements and other transformations
                // here as needed
                for(i = 0; i < fileContents1.length; i++) {
                    this.fileContents = fileContents1[i];
                    console.log(this.fileContents);
                    //this.fileContentsList.push(encodeURIComponent(this.fileContents));
                    /*let base64 = 'base64,';
                    this.content = this.fileContents.indexOf(base64) + base64.length;
                    this.fileContents = this.fileContents.substring(this.content);
                    console.log(encodeURIComponent(this.fileContents)); */
                    this.fileContents = this.fileContents.substr(this.fileContents.indexOf(',') + 1);
                    console.log(encodeURIComponent(this.fileContents));
                    this.fileContentsList.push(encodeURIComponent(this.fileContents));    
                    console.log(this.fileContentsList.length);
                    console.log(this.filesUploaded.length);
                    
                    if(this.fileContentsList.length == this.filesUploaded.length){
                        // call the uploadProcess method 
                        this.saveToFile();
                    }
                }
            });

            /* create a FileReader object 
            this.fileReader= new FileReader();
            // set onload function of FileReader object  
            this.fileReader.onloadend = (() => {
                this.fileContents = this.fileReader.result;
                let base64 = 'base64,';
                this.content = this.fileContents.indexOf(base64) + base64.length;
                this.fileContents = this.fileContents.substring(this.content);
                console.log(this.fileContents);
                this.fileContentsList.push(encodeURIComponent(this.fileContents));    
                console.log(this.fileContentsList.length);
                console.log(this.filesUploaded.length);
                if(this.fileContentsList.length == this.filesUploaded.length){
                    // call the uploadProcess method 
                    this.saveToFile();
                }

            });

            this.fileReader.readAsDataURL(this.file);*/
        
        
        

        
    }

    // Calling apex class to insert the file
    saveToFile() {

        saveFile({ idParent: this.recordId, strFileName: this.file.name, subject: this.subject, base64Data: encodeURIComponent(this.fileContents), fileNamesList : this.fileNameList, base64DataList : this.fileContentsList})
        .then(result => {
            window.console.log('result ====> ' +result);
            // refreshing the datatable
            //this.getRelatedFiles();

            this.fileName = this.fileName + ' - Uploaded Successfully';
            this.UploadFile = 'File Uploaded Successfully';
            this.isTrue = true;
            this.showLoadingSpinner = false;
            this.fileContentsList = [];
            this.filesUploaded = [];
            this.fileNameList = [];

            // Showing Success message after file insert
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Files - Uploaded Successfully!',
                    variant: 'success',
                }),
            );

        })
        .catch(error => {
            // Showing errors if any while inserting the files
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading File',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }
    
    // Getting releated files of the current record
    getRelatedFiles() {
        releatedFiles({idParent: this.recordId})
        .then(data => {
            this.data = data;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    // Getting selected rows to perform any action
    getSelectedRecords(event) {
        let conDocIds;
        const selectedRows = event.detail.selectedRows;
        conDocIds = new Set();
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            conDocIds.add(selectedRows[i].ContentDocumentId);
        }

        this.selectedRecords = Array.from(conDocIds).join(',');

        window.console.log('selectedRecords =====> '+this.selectedRecords);
    }

}