import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthenticationService } from '@/_services';
import { ApiClient } from '../../_helpers/ApiClient'
import { Expense } from '@/_models/expense';
import { request } from 'http';
import { HttpClient } from '@angular/common/http';

@Component({templateUrl: 'createexpense.component.html'})
export class CreateExpenseComponent implements OnInit {
    createExpenseForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    moment = require('moment');
    editExpense: Expense

    constructor(private apiClient: ApiClient, 
                private formBuilder: FormBuilder,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            const expenseId = params['id'];
            if (expenseId) {
                this.getExpenseById(expenseId)
            }
        });
        this.createExpenseForm = this.formBuilder.group({
            id: 0,
            description: ['', Validators.required],
            note: ['', Validators.required],
            amount: ['', Validators.required],
            createat: Date.now()
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.createExpenseForm.invalid) {
            return;
        }

        this.loading = true;
        let response
        if (this.editExpense) {
            this.handleEditExpense()
        } else {
            this.createExpense()
        }
    }

    async baseResponse(response: any) {
        if (response) {
            this.alertService.success('Despesa adicionada/editada com sucesso!', true);
            this.router.navigate(['/dash/expense']);
        } else {
            this.alertService.error(`ss`);
            this.loading = false;
        }
    }

    async createExpense() {
        let response = await this.apiClient.createExpense(this.createExpenseForm.value)
        if (response) {
            this.alertService.success('Despesa adicionada/editada com sucesso!', true);
            this.router.navigate(['/dash/expense']);
        } else {
            this.alertService.error(`ss`);
            this.loading = false;
        }
    }

    async handleEditExpense() {
        let response = await this.apiClient.updateExpense(this.createExpenseForm.value)
        if (response) {
            this.alertService.success('Despesa adicionada/editada com sucesso!', true);
            this.router.navigate(['/dash/expense']);
        } else {
            this.alertService.error(`ss`);
            this.loading = false;
        }
    }

    async handleUpdateExpense(expense: Expense) {
        return await this.apiClient.updateUser(expense)
    }

    get f() { return this.createExpenseForm.controls; }

    public toMoment(date: Date) {
        let dateFormated = this.moment(date);
        return dateFormated.format('L');
    }

    async getExpenseById(id: number) {
        this.editExpense = await this.apiClient.getExpenseById(id)
        this.createExpenseForm = this.formBuilder.group({
            id: this.editExpense.id,
            description: [this.editExpense == null ? '' : this.editExpense.description, Validators.required],
            note: [this.editExpense == null ? '' : this.editExpense.note, Validators.required],
            amount: [this.editExpense == null ? '' : this.editExpense.amount, Validators.required],
            createat: Date.now()
        });
    }
}