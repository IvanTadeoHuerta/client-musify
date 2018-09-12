import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ArtistService } from '../service/artist.service';
import { UploadService } from '../service/upload.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.component.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public identity;
    public token;
    public URL;
    public artist: Artist;
    public alertMesagge;
    public is_edit;


    constructor(
        private _service: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {
        this.titulo = ' Editar artista ';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        // console.log('Artistas add')
        this.getArtist();
    }

    getArtist() {
        this._route.paramMap.subscribe(params => {
            let id = params.get('id');
            this._artistService.getArtist(this.token, id).subscribe(
                response => {


                    if (!response.artist) {
                        this.route.navigate(['/']);
                    } else {
                        this.artist = response.artist;
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

            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {

                    if (!response.artist) {
                        alert('Error en el servicio')
                    } else {
                        this.alertMesagge = "Se actualizo correctamente";

                        if (!this.filesToUpload) {
                            this.route.navigate(['/artistas', response.artist._id]);
                        } else {
                            this._uploadService.makeFileRequest(this.URL + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    result => {
                                        this.route.navigate(['/artistas', response.artist._id]);
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

    public filesToUpload: Array<File>;


    fileChangeEvent(fileInput: any): void {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}