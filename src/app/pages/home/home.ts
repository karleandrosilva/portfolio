import { Component } from '@angular/core';
import { MenuDrawer } from "../../components/menu-drawer/menu-drawer";
import { Header } from '../../components/header/header';
import { SobreMim } from "../../components/sobre-mim/sobre-mim";
import { MinhasSkills } from "../../components/minhas-skills/minhas-skills";

@Component({
  selector: 'app-home',
  imports: [MenuDrawer, Header, SobreMim, MinhasSkills],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
