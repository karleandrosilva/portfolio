import { Component } from '@angular/core';
import { MenuDrawer } from "../../components/menu-drawer/menu-drawer";
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-home',
  imports: [MenuDrawer, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
