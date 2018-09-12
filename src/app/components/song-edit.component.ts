import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Song } from '../models/song';
import { songService } from '../service/song.service';
import { UploadService } from '../service/upload.service';
@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.component.html',
    providers: [UserService, songService, UploadService]
})

export class SongEditComponent implements OnInit {
    public titulo_page: string;
    public identity;
    public token;
    public URL;
    public alertMesagge;
    public song: Song;
    public is_edit;



    constructor(
        private _service: UserService,
        private _songService: songService,
        private _uploadService: UploadService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {
        this.titulo_page = ' Editar nueva canción';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = true;

    }

    ngOnInit() {
        this.getSong();
    }

    getSong() {
        this._route.paramMap.subscribe(params => {
            let id = params.get('id');
            this._songService.getSong(this.token, id).subscribe(
                response => {

                    if (!response.song) {
                        this.route.navigate(['/']);
                    } else {
                        this.song = response.song;
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = JSON.parse(error._body);
                        // this.alertMesagge = body.message;
                    }
                }
            );
        });
    }


    onSubmit() {
        this._route.paramMap.subscribe(params => {
            let id = params.get('id');


            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {

                    if (!response.song) {
                        alert('Error en el servicio')
                    } else {
                        this.alertMesagge = "Se ha creado correctamente";

                        if (!this.filesToUpload) {
                            this.route.navigate(['/album', response.song.album]);
                        } else {
                            this._uploadService.makeFileRequest(this.URL + 'upload-song-file/' + id, [], this.filesToUpload, this.token, 'file')
                                .then(
                                    result => {
                                        this.route.navigate(['/album', response.song.album]);
                                    },
                                    error => {
                                        console.log('error')
                                    }
                                );
                        }
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


    public filesToUpload;

    fileChangeEvent(fileInput) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }





}