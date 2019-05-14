import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from '@/_models/expense';
import { ApiClient } from '../_helpers/ApiClient'

@Component({templateUrl: 'expense.component.html'})
export class ExpenseComponent implements OnInit {
    expenseForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    public expenses: Expense[]
    public headElements: string[]
    moment = require('moment');

    constructor(private apiClient: ApiClient, private router: Router) {
        this.headElements = ['Código', 'Descrição', 'Nota', 'Valor', 'Data']
    }

    ngOnInit() {
        this.loadAllExpenses()
    }

    private async loadAllExpenses() {
        this.expenses = await this.apiClient.getExpenses()
    }

    onSubmit() {

    }

    editExpense(expense: Expense) {
        this.router.navigate([`/expense/${expense.id}`]);
    }

    removeExpense(expense: Expense) {
        this.handleRemoveExpense(expense)
    }

    async handleRemoveExpense(expense: Expense) {
        await this.apiClient.deleteExpense(expense.id)
        await this.loadAllExpenses()
        await this.router.navigate([`/dash/expense`])
    }

    public toMoment(date: Date) {
        let dateFormated = this.moment(date);
        return dateFormated.format('DD/MM/YYYY');
    }
}