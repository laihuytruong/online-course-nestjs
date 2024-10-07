import { Module } from '@nestjs/common';
import { GoogleAuthenticationService } from './google.service';

@Module({
  providers: [GoogleAuthenticationService],
  exports: [GoogleAuthenticationService],
})
export class GoogleModule {}
