import { Component } from '@angular/core';
import { MenuDrawer } from "../../components/menu-drawer/menu-drawer";
import { Header } from '../../components/header/header';
import { SobreMim } from "../../components/sobre-mim/sobre-mim";

@Component({
  selector: 'app-home',
  imports: [MenuDrawer, Header, SobreMim],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
