import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from '@app/app.routes';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebase } from './environments/firebase';
import { getAuth, initializeAuth, provideAuth, debugErrorMap, browserLocalPersistence } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(TuiRootModule, TuiDialogModule, TuiAlertModule),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() => {
        const app = initializeApp(firebase);
        initializeAuth(app, { persistence: browserLocalPersistence, errorMap: debugErrorMap });
        return app;
      }),
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();
        auth.languageCode = 'ru';
        return auth;
      }),
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
  ],
}).catch(err => console.error(err));
