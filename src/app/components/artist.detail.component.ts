import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ArtistService } from '../service/artist.service';
import { albumService } from '../service/album.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.component.html',
    providers: [UserService, ArtistService, albumService]
})

export class ArtistDetailComponent implements OnInit {

    public identity;
    public token;
    public URL;
    public artist: Artist;
    public alertMesagge;
    public albums: Album[];


    constructor(
        private _service: UserService,
        private _artistService: ArtistService,
        private _albumService: albumService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {

        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;

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

                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response => {

                                if (!response.albums) {
                                    this.alertMesagge = 'Este artista no tiene albums';
                                } else {
                                    this.albums = response.albums;
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

    public confirmado;
    onDeletedConfirm(id) {
        this.confirmado = id;
    }

    onDeletedAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {

                if (!response.albumRemoved) {
                    alert('Error en el servidor')
                }

                this.getArtist();
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    let body = JSON.parse(error._body);
                    // this.alertMesagge = body.message;
                }
            }
        );
    }

    onCancelAlbum() {
        this.confirmado = null;
    }

}