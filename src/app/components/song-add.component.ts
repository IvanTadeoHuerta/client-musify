import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Song } from '../models/song';
import { songService } from '../service/song.service';
@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.component.html',
    providers: [UserService, songService]
})

export class SongAddComponent implements OnInit {
    public titulo_page: string;
    public identity;
    public token;
    public URL;
    public alertMesagge;
    public song: Song;



    constructor(
        private _service: UserService,
        private _songService: songService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {
        this.titulo_page = ' Crear nueva canción';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');

    }

    ngOnInit() {

    }


    onSubmit() {
        this._route.paramMap.subscribe(params => {
            let album_id = params.get('album');
            this.song.album = album_id;

            this._songService.addSong(this.token, this.song).subscribe(
                response => {

                    if (!response.song) {
                        alert('Error en el servicio')
                    } else {
                        this.alertMesagge = "Se ha creado correctamente";
                        this.song = response.song;
                        this._router.navigate(['/editar-tema', response.song._id]);
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