import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
import { ApiClient } from '../_helpers/ApiClient'

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    public currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];

    constructor(private authenticationService: AuthenticationService, private apiClient: ApiClient) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser(id: number) {
        // this.userService.delete(id).pipe(first()).subscribe(() => {
        //     this.loadAllUsers()
        // });
    }

    private async loadAllUsers() {
        this.users = await this.apiClient.getUsers()
    }
}