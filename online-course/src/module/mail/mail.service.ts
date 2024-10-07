import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailForgot } from 'src/interface/mail.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailForgotPassword(options: MailForgot) {
    try {
      const message = {
        to: options.email,
        subject: 'Reset Password',
      };

      const emailSend = await this.mailerService.sendMail({
        ...message,
        template: 'forgot-password',
        context: {
          name: options.name,
          urlRedirect: options.urlRedirect,
        },
      });

      return emailSend;
    } catch (error) {
      console.log('error sending email: ', error);
      throw new Error('Failed to send email');
    }
  }
}
