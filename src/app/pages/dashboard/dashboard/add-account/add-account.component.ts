import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AccountData } from '@app/models/account.data';
import { AddAccountFormComponent } from './add-account-form/add-account-form.component';
import { AccountFormData } from './account-form.data';
import { AccountDataConverter } from './account-data-converter';

@Component({
  selector: 'monitraks-add-account',
  standalone: true,
  imports: [CommonModule, AddAccountFormComponent],
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<AccountData, AccountData>,
    private readonly converter: AccountDataConverter,
  ) {
    if (this.context.data) {
      this.model = this.converter.fromModel(this.context.data);
    }
  }

  model: AccountFormData | null = null;

  save(form: AccountFormData) {
    this.context.completeWith(this.converter.toModel(form));
  }

  close() {
    this.context.$implicit.complete();
  }
}
