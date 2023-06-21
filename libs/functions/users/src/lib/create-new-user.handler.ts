import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { AuthService } from '@ngfi/angular';

import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';

export class CreateNewUserHandler extends FunctionHandler<any, void> {
  private _tools: HandlerTools;

  public async execute(userData: any, context: FunctionContext, tools: HandlerTools) {

    this._tools = tools;
    this._tools.Logger.debug(() => `Beginning Execution, Creating a new User`);

    this.userExists(userData.email, userData);
  }

  private async userExists(email: string, userData: any) {
    const user = await admin.auth().getUserByEmail(email)
      .then(async (user) => {

        this._tools.Logger.log(() => `Updating an existing user ${user.uid}`);

        this.addUserToOrg(userData.profile.activeOrg, user.uid);

        const usersRepo = this._tools.getRepository<any>(`users`);
        let existingUser = await usersRepo.getDocumentById(user.uid);
        existingUser.roles[userData.profile.activeOrg] = userData.roles[userData.profile.activeOrg];
        existingUser.profile.orgIds.push(userData.profile.activeOrg);

        usersRepo.update(existingUser);

        })
      .catch(async () => {
        try {

          this._tools.Logger.log(() => `Creating a new user`);

          const newUser = await admin
            .auth()
            .createUser({
              email: userData.email,
              password: this.genRandomPassword(),
              displayName: userData.displayName,
            })
            .then((user) => {
              this._updateUserDetails(user, userData.profile, userData.roles);
            });
        } catch (e) {
          this._tools.Logger.log(() => `Did not create new user due to: ${e}`);
        }
      })
  }

  private async _updateUserDetails(user: any | null, userProfile?: any, roles?: any) {

    try {
      this._tools.Logger.log(() => `Updating user data for ${user.uid}`)
      const usersRef = this._tools.getRepository<any>(`users`);

      const data: any = {}; // Actual Type: User

      if (user.email) data.email = user.email;
      if (user.photoURL) data.photoUrl = user.photoURL;
      if (user.phoneNumber) data.phoneNumber = user.phoneNumber;

      if (user.displayName) data.displayName = user.displayName;

      data.profile = userProfile ? userProfile : {};
      if (user.email) data.profile.email = user.email;

      data.roles = roles ? roles : { access: true, app: true };

      data.uid = user.uid;
      data.id = user.uid;

      data.createdOn = new Date();
      data.createdBy = 'AuthService';
      data.isNew = true;

      usersRef.create(data, user.uid);

      this.sendPasswordResetLink(user.email, userProfile.activeOrg);
      this.addUserToOrg(userProfile.activeOrg, user.uid);

    } catch (error) {
      this._tools.Logger.log(() => `Could not update user because ${error}`)
    }   
  }

  private async addUserToOrg(orgId: string, userId: string) {
    try {

      this._tools.Logger.log(() => `Updating ${userId} on ${orgId}`);

      const orgsRepo = this._tools.getRepository<any>(`orgs`);
      let org = await orgsRepo.getDocumentById(orgId);
      let orgUsers: string[] = org.users;

      orgUsers.push(userId);
      org.users = orgUsers;

      orgsRepo.update(org);

    } catch (error) {
      this._tools.Logger.log(() => `Could not update user on org due to ${error}`);
    }
  }

  private async sendPasswordResetLink(email: string, orgId: string) {
    try {
      await admin.auth().generatePasswordResetLink(email).then((link) => {
        this._tools.Logger.log(() => `Creating email template for password reset`)
  
        let mailRepo = this._tools.getRepository<any>(`orgs/${orgId}/mails`);
        let mail = {
          to : email,
          message: {
            subject: "Reset your password",
            html: `<p> Use this link to reset your password <a href="${link}">Click here</a> <p>`
          }
        };
        mailRepo.create(mail);
      });
    } catch (error) {
      this._tools.Logger.log(() => `Could not send email due to ${error}`);
    }
  }

  genRandomPassword(): string {
    var chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var passwordLength = 12;
    var password = '';
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }
}