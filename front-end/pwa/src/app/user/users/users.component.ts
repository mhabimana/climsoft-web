import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoleEnum } from 'src/app/core/models/users/user-role.enum';
import { ViewUserModel } from 'src/app/core/models/users/view-user.model';
import { PagesDataService } from 'src/app/core/services/pages-data.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { StringUtils } from 'src/app/shared/utils/string.utils';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users!: ViewUserModel[];

  constructor(
    private pagesDataService: PagesDataService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute) {
    this.pagesDataService.setPageHeader('Users');
    this.usersService.findAll().subscribe(data => {
      this.users = data;
    });


  }

  protected getFormattedUserRole(userRole: UserRoleEnum):string{
    return StringUtils.formatEnumForDisplay(userRole);
  }

  protected onSearchClick() { }

  protected onNewUserClick() {
    this.router.navigate(['user-detail', 'new'], { relativeTo: this.route.parent });
  }

  protected onEditUserClick(viewUser: ViewUserModel) {
    this.router.navigate(['user-detail', viewUser.id], { relativeTo: this.route.parent });
  }
}
