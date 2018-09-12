import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ArtistService } from '../service/artist.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.component.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public titulo: string;
    public identity;
    public token;
    public URL;
    public artist: Artist;
    public alertMesagge;


    constructor(
        private _service: UserService,
        private _artistService: ArtistService,
        private _router: Router
    ) { 
        this.titulo = ' Crear nuevo artista '; 
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.artist = new Artist('','','');
    }

    ngOnInit() {  
        // console.log('Artistas add')
    }

    onSubmit(){
    
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response =>{
               
                if(!response.artist){
                    alert('Error en el servicio')
                }else{
                    this.alertMesagge = "Se ha creado correctamente";
                    this.artist = response.artist;
                    this._router.navigate(['/editar-artista', response.artist._id]);
                }
            },
            error =>{
                var errorMessage = <any>error;

                if (errorMessage != null) {
                  let body = JSON.parse(error._body);
                  this.alertMesagge= body.message;
                }
            }
        );
    }
}