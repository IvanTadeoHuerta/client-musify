import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ArtistService } from '../service/artist.service';
import { albumService } from '../service/album.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.component.html',
    providers: [UserService, ArtistService, albumService]
})

export class AlbumAddComponent implements OnInit {
    public titulo_page: string;
    public identity;
    public token;
    public URL;
    public artist: Artist;
    public album: Album;
    public alertMesagge;



    constructor(
        private _service: UserService,
        private _artistService: ArtistService,
        private _albumService: albumService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {
        this.titulo_page = ' Crear album';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '');

    }

    ngOnInit() {
      
    }


    onSubmit(){
        this._route.paramMap.subscribe(params => {
            let artist_id = params.get('artist');
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {

                    if (!response.album) {
                        alert('Error en el servicio')
                    } else {
                        this.alertMesagge = "Se ha creado correctamente";
                        this.album = response.album;
                        this._router.navigate(['/editar-album', response.album._id]);
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = JSON.parse(error._body);
                        this.alertMesagge = body.message;
                    }
                }
            );
        });
    }





}