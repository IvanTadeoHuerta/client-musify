import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist.detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';


const appRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    // },
    { path: '', component: HomeComponent},
    {path: 'mis-datos', component: UserEditComponent },
    {path: 'artist/:page', component: ArtistListComponent },
    {path: 'crear_artista', component: ArtistAddComponent },
    {path: 'editar-artista/:id', component: ArtistEditComponent },
    {path: 'artista/:id', component: ArtistDetailComponent },
    {path: 'crear-album/:artist', component: AlbumAddComponent },
    {path: 'editar-album/:id', component: AlbumEditComponent },
    {path: 'crear-tema/:album', component: SongAddComponent },
    {path: 'editar-tema/:id', component: SongEditComponent },
    {path: 'album/:id', component: AlbumDetailComponent },
    {path: '**', component: HomeComponent },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes); 