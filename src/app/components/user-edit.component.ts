import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { GLOBAL } from '../service/global';
import { User } from '../models/users';
@Component({
    selector: 'app-user-edit',
    templateUrl: '../views/user-edit.component.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit {
    public filesToUpload: Array<File>;
    public titulo: string;
    public user:User;
    public identity;
    public token;
    public alertUpdate;
    public URL;


    constructor(
        private _service: UserService
    ) { 
        this.titulo = ' Titulo actualizar mis datos '; 
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.user = this.identity;
        this.URL = GLOBAL.url;
    }

    ngOnInit() {  
    }

    update(){
       this._service.update_user(this.user).subscribe(
           response =>{
          

            if(!response.user){
                this.alertUpdate = 'El usuario no se ha actualizado';
            }else{

                document.getElementById('nameUser').innerHTML = this.user.name;
                localStorage.setItem('identity', JSON.stringify(this.user));
                this.alertUpdate = 'Datos actualizados';

                if(!this.filesToUpload){
                    // Redireccion
                }else{
                    this.makeFileRequest(this.URL+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
                        (result:any)=>{

                            this.user.imagen = result.image
                            let path = this.URL+'get-image-user/'+this.user.imagen;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                            document.getElementById('imagen-logged').setAttribute('src',path);

                        }
                    );

                }
             
                
            }
           },
           error =>{
            var errorMessage = <any>error;

            if (errorMessage != null) {
              let body = JSON.parse(error._body);
              this.alertUpdate = body.message;
            }
           }
       );
    }

   
    fileChangeEvvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        let token = this._service.getToken();

        return new Promise(function(resolve, reject){
            let formData:any = new FormData();
            let xhr = new XMLHttpRequest();
         
            for(let i = 0; i < files.length; i++){
                formData.append('imagen', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response))
                    }else{
                        reject(xhr.response)
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }



}
