import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@/_services';
import { ApiClient } from '@/_helpers/ApiClient';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    crypto = require('crypto');

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private apiClient: ApiClient
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            token: ''
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    hashCode(str: string) {
        return str.split('').reduce((prevHash, currVal) =>
          (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
    }
      

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.handleTokenGeneration()

        this.loading = true;
        let response = this.createUser()
        if (response) {
            this.alertService.success('Cadastrado com sucesso', true);
            this.router.navigate(['/login']);
        } else {
            this.alertService.error(`ss`);
            this.loading = false;
        }
        // this.userService.register(this.registerForm.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', true);
        //             this.router.navigate(['/login']);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }

    handleTokenGeneration() {
        let hash = this.crypto.randomBytes(30).toString('hex');
        console.log(hash)
        this.registerForm.patchValue({ token: hash })
        console.log(this.registerForm.value)
    }

    async createUser() {
        return await this.apiClient.createUser(this.registerForm.value)
    }
}
