import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { groupBy } from 'lodash';
import { NavItem } from '../../../shared/models/nav-items';
import { NavItemsService } from '../../services/nav-items.service';
import { Menu } from '../types/navItem';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../auth/models/user';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'side-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    RouterLink,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    HeaderComponent,
    FooterComponent,
    AsyncPipe,
    RouterLinkActive
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({
          transform: 'translateY(-20%)',
        }),
        animate(
          '900ms ease',
          style({
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class SideBarComponent implements OnInit, OnDestroy {
  menuItem: NavItem[] = [];
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = true;
  groupedData: any = {};
  menuMap: { [key: string]: MatMenu } = {};
  hasBackdrop = new FormControl(null as null | boolean);
  position = new FormControl('start' as 'start' | 'end');
  expandedMenus: { [key: string]: boolean } = {};
  private ngUnsubscribe: Subject<any> = new Subject();
  username!: User;
  firstWord: string = '';

  #cookieService = inject(CookieService);

  constructor(
    private navService: NavItemsService,
    private router: Router,
    private observer: BreakpointObserver
  ) {
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private breakpointObserver = inject(BreakpointObserver);
  rootRoutes = routes.filter(r=>r.path);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  ngOnInit(): void {
    this.getNavItems();
    this.observer
      .observe(['max-with:800px'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(screenSize => {
        if (screenSize.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });

    this.getUserDataFromLocalStorage();
  }

  getUserDataFromLocalStorage() {

  }

  getFirstWord(username: string): string {
    return username.charAt(0);
  }

  getNavItems() {
    this.navService.getNavItems().subscribe({
      next: (res: any) => {
        this.groupedData = this.groupByMenu(res.data, 'menu_name');
      },
      error: e => console.error(e),
      complete: () => {},
    });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  groupByMenu(data: Menu[], key: string) {
    return groupBy(data, key);
  }

  getMenuNames() {
    return Object.keys(this.groupedData);
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Ensure each item has a unique identifier
  }

  getMenuIcon(menuName: string): string {
    return this.groupedData[menuName][0]?.icon || 'folder';
  }

  toggleMenuItem(menuName: string) {
    const sub = this.groupedData[menuName][0].submenus;
    const path = this.groupedData[menuName][0].path;
    if (sub) {
      this.expandedMenus[menuName] = !this.expandedMenus[menuName];
      this.router.navigate([path]);
    } else {
    }
  }

  isMenuItemExpanded(menuName: string): boolean {
    return !!this.expandedMenus[menuName];
  }

  logout() {
    this.router.navigate(['login']);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
