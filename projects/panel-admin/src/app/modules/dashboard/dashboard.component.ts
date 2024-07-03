import {
  AsyncPipe,
  CommonModule,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { CustomTabComponent } from '../../shared/components/custom-tab/custom-tab.component';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { DemoComponent } from '../../shared/components/list-item-host-binding/demo/demo.component';
import { CanCopyToClipboardDirective } from '../../shared/directives/can-copy-to-clipboard/can-copy-to-clipboard.directive';
import { CanDisableDirective } from '../../shared/directives/can-disable/can-disable.directive';
import { HideAfterDirective } from '../../shared/directives/hide-after/hide-after.directive';
import { ProductUrlPipe } from '../../shared/pipes/product-url/product-url.pipe';
import { RatingPickerPageComponent } from '../../shared/components/rating-picker-page/rating-picker-page.component';
import { SmartSelecOtionComponent } from '../../shared/components/smart-select-option/smart-select-option.component';
import { UsersComponent } from '../users/components/users.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonComponent,
    ChipComponent,
    CanCopyToClipboardDirective,
    AsyncPipe,
    NgIf,
    CommonModule,
    HideAfterDirective,
    CanDisableDirective,
    ItemCardComponent,
    ProductUrlPipe,
    DemoComponent,
    CustomTabComponent,
    NgTemplateOutlet,
    RatingPickerPageComponent,
    SmartSelecOtionComponent,
    UsersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('templateOne', { static: true }) templateOne!: TemplateRef<any>;
  @ViewChild('templateTwo', { static: true }) templateTwo!: TemplateRef<any>;
  @ViewChild('templateThree', { static: true })
  templateThree!: TemplateRef<any>;
  @ViewChild('templatefour', { static: true }) templatefour!: TemplateRef<any>;
  tabs: {
    id: number;
    title: string;
    template: TemplateRef<any>;
    context?: any;
  }[] = [];

  #route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.#route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      console.log('params', params);
    });
    this.setDataInTabs();
  }

  setDataInTabs() {
    this.tabs = [
      {
        id: 0,
        title: 'Tab 1',
        template: this.templateOne,
        context: { data: 'Data for Tab 1' },
      },
      {
        id: 1,
        title: 'Tab 2',
        template: this.templateTwo,
        context: { data: 'Data for Tab 2' },
      },
      {
        id: 3,
        title: 'Tab 3',
        template: this.templateThree,
        context: { data: 'Data for Tab 3' },
      },
      {
        id: 4,
        title: 'Tab 4',
        template: this.templatefour,
        context: { data: 'Data for Tab 4' },
      },
    ];
  }

  handleTabChange(index: number) {}

  onRemove(e: any) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
