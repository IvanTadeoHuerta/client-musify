import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ArtistService } from '../service/artist.service';
import { GLOBAL } from '../service/global';
import { User } from '../models/users';
import { Artist } from '../models/artist';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.component.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public identity;
    public token;
    public URL;
    public artists: Artist[];
    public next_page;
    public prev_page;


    constructor(
        private _service: UserService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _artistService: ArtistService
    ) {
        this.titulo = ' Artistas ';
        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {
        this.getArtist();
    }

    getArtist() {
        this._route.paramMap.subscribe(params => {
            let page = +params.get('page');

            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }

                this._artistService.getArtists(this.token, page).subscribe(
                    response => {

                        if (!response.artists) {
                            this._router.navigate(['/']);
                        } else {
                            this.artists = response.artists;
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
        });
    }

    public confirmado;

    onDeletedConfirm(id) {
        this.confirmado = id;
    }
    onDeletedArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {

                if (!response.artist) {
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
    onCancelArtist() {
        this.confirmado = null;
    }
}