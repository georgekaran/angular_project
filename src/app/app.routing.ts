import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { ExpenseComponent } from './expense'
import { CreateExpenseComponent } from './expense/create'

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard],  },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dash/expense', component: ExpenseComponent, canActivate: [AuthGuard] },
    { path: 'expense', component: CreateExpenseComponent, canActivate: [AuthGuard] },
    { path: 'expense/:id', component: CreateExpenseComponent, canActivate: [AuthGuard] },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);