import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { DataService } from '@app/data-layer/data.service';
import { finalize, Observable, switchMap } from 'rxjs';
import { AccountData } from '@app/models/account.data';
import { BankInfoService } from '@app/pages/dashboard/services/bank-info.service';
import { TuiActionModule } from '@taiga-ui/kit';

@Component({
  selector: 'monitraks-account-details',
  standalone: true,
  imports: [CommonModule, TuiLetModule, RouterLink, TuiLinkModule, TuiLoaderModule, TuiActionModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountDetailsComponent {
  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private readonly banks: BankInfoService,
  ) {
    this.accountData$ = this.route.paramMap.pipe(
      switchMap(params =>
        this.data.accounts
          .withId(params.get('id')!)
          .get()
          .pipe(finalize(() => (this.isLoading = false))),
      ),
    );
  }

  accountData$: Observable<AccountData | null>;
  isLoading = true;

  public getName(account: AccountData | null): string {
    return account ? `${account.name} (${this.banks.findById(account.bank)?.name})` : 'Аккаунт не найден';
  }
}
