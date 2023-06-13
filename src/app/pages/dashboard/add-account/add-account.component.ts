import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiButtonModule, TuiDialogContext, TuiErrorModule, TuiGroupModule } from '@taiga-ui/core';
import { AccountData } from '@app/models/account.data';
import {
  TuiCheckboxBlockModule,
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
} from '@taiga-ui/kit';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDay, TuiMonth } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';

@Component({
  selector: 'monitraks-add-account',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputDateModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiCheckboxLabeledModule,
    TuiInputNumberModule,
    TuiCheckboxBlockModule,
    TuiGroupModule,
    TuiTableModule,
  ],
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<AccountData>,
    private readonly fb: FormBuilder
  ) {
    const datesControls = this.accountForm.controls.dates.controls;
    datesControls.openedDate.valueChanges.subscribe(() => {
      datesControls.closingDate.setValue(null, { emitEvent: false });
      datesControls.durationDays.setValue(null, { emitEvent: false });
    });
    datesControls.closingDate.valueChanges.subscribe(date => {
      datesControls.durationDays.setValue(
        date !== null ? TuiDay.lengthBetween(datesControls.openedDate.value, date) : null,
        { emitEvent: false }
      );
    });
    datesControls.durationDays.valueChanges.subscribe(duration => {
      datesControls.closingDate.setValue(
        duration !== null ? datesControls.openedDate.value.append({ day: duration }) : null,
        { emitEvent: false }
      );
    });
  }

  accountForm = this.fb.group({
    id: this.fb.nonNullable.control(''),
    name: this.fb.nonNullable.control('', Validators.required),
    bank: this.fb.group({
      name: this.fb.nonNullable.control('', Validators.required),
      icon: this.fb.nonNullable.control('', Validators.required),
    }),
    dates: this.fb.group({
      openedDate: this.fb.nonNullable.control<TuiDay>(TuiDay.currentLocal()),
      isOpenEnded: this.fb.nonNullable.control(false),
      closingDate: this.fb.control<TuiDay | null>(null),
      durationDays: this.fb.control<number | null>(null),
    }),
    interest: this.fb.nonNullable.array([
      this.fb.group({
        startMonth: this.fb.nonNullable.control(1),
        endMonth: this.fb.control<number | null>(null),
        steps: this.fb.nonNullable.array([
          this.fb.group({
            rangeStart: this.fb.nonNullable.control(0),
            rangeEnd: this.fb.control<number | null>(null),
            rate: this.fb.nonNullable.control(10),
          }),
        ]),
      }),
    ]),
    canWithdraw: this.fb.nonNullable.control(false),
    canContribute: this.fb.nonNullable.control(false),
    interestIsCapitalized: this.fb.nonNullable.control(false),
  });

  banks = ['Сбер', 'ВТБ', 'Тинькофф'];

  depositMaxDurationDays = 2000;
  openMinDate = TuiDay.currentLocal().append({ year: -2 });
  openMaxDate = TuiDay.currentLocal().append({ month: 1 });
  closingMaxDate = TuiDay.currentLocal().append({ day: this.depositMaxDurationDays });

  interestColumns = [
    'ranges',
    ...this.accountForm.controls.interest.getRawValue().map(month => `month-${month.startMonth}-${month.endMonth}`),
  ];

  getMonthRangeHeader(number: number): string {
    const control = this.accountForm.controls.interest.controls[number].getRawValue();
    if (!control.endMonth) {
      return `${control.startMonth}+ мес.`;
    }

    return `${control.startMonth} – ${control.endMonth} мес.`;
  }

  getRangeHeader(range: { rangeStart: number; rangeEnd: number | null }): string {
    if (!range.rangeEnd) {
      return `${range.rangeStart}+ руб.`;
    }

    return `${range.rangeStart} – ${range.rangeEnd} руб.`;
  }

  saveForm(): void {
    console.log(this.accountForm.getRawValue());
    this.context.completeWith(this.getModel());
  }

  close(): void {
    this.context.$implicit.complete();
  }

  private getModel(): AccountData {
    return {} as AccountData;
  }
}
