import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { albumService } from '../service/album.service';
import { UploadService } from '../service/upload.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.component.html',
    providers: [UserService, albumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo_page: string;
    public identity;
    public token;
    public URL;
    public album: Album;
    public alertMesagge;
    public is_edit;


    constructor(
        private _service: UserService,
        private _albumService: albumService,
        private _uploadService: UploadService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {
        this.titulo_page = ' Editar album';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        this.getAlbum();
    }

    getAlbum() {
        this._route.paramMap.subscribe(params => {
            let id = params.get('id');

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                    }
                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = JSON.parse(error._body);

                    }
                }
            );
        });
    }


    onSubmit() {
        this._route.paramMap.subscribe(params => {
            let album_id = params.get('id');
            this._albumService.editAlbum(this.token, album_id, this.album).subscribe(
                response => {

                    if (!response.album) {
                        alert('Error en el servicio')
                    } else {
                        this.alertMesagge = "Se ha editado correctamente";

                        if (!this.filesToUpload) {
                            this.route.navigate(['/artista', response.album.artist]);
                        } else {
                            this._uploadService.makeFileRequest(this.URL + 'upload-image-album/' + album_id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    result => {
                                        this.route.navigate(['/artista', response.album.artist]);
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