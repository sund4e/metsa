import { Component } from '@angular/core';

import { Page1 } from '../page1/page1';
import { ListPage } from '../list/list';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Page1;
  tab2Root: any = ListPage;
  tab3Root: any = SettingsPage;

  constructor() {}

}
