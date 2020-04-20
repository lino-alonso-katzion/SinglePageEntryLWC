@isTest
public class LWCCustomFileUploaderTest {
    @testSetup
    static void buildConfigList() {
        Account account = new Account(name = 'TestAccount Lender');
        account.RecordtypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Finance').getRecordTypeId();
        insert account;

        Contact loanContact = new Contact(LastName = 'TestloanContact');
        insert loanContact;
    }

    /**
    * @method LWCCustomFileUploader
    * @case   When the upload files methods are called from the Lightning Web Components
    * @result then we insert all the files in Salesforce
    */
    @isTest static void test01_LWCCustomFileUploader_TestMethods() {
        ContentVersion contentVersion_1 = new ContentVersion(
        Title = 'Penguins',
        PathOnClient = 'Penguins.jpg',
        VersionData = Blob.valueOf('Test Content')
        );
        
        insert contentVersion_1;

        List<String> fileNameList = new List<String>();
        fileNameList.add('Test File');
        List<String> base64DataList = new List<String> ();
        base64DataList.add('TestBase64');

        LWCCustomFileUploader.saveFile(getLoanContact().Id, 'Test File', 'Test subject', 'TestBase65', fileNameList, base64DataList);
        LWCCustomFileUploader.releatedFiles(getLoanContact().Id);
    }

    /**
    * Helper function to get a particular Lender
    */ 
    private static Contact getLoanContact() {
        return [ SELECT Id
                 FROM   Contact
                 LIMIT 1];
    }
    
    /**
    * Helper function to get a particular Lender
    */ 
    private static Account getLender( String accountName ) {
        return [ SELECT Id, Name
                 FROM   Account
                 WHERE  Name =: accountName ];
    }
}