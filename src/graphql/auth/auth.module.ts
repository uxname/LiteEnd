import { Module } from '@nestjs/common';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { CryptoModule } from '@/common/crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AccountModule } from '@/graphql/account/account.module';
import { AccountSessionModule } from '@/graphql/account-session/account-session.module';
import { AuthResolver } from '@/graphql/auth/auth.resolver';
import { EmailModule } from '@/graphql/email/email.module';
import { OneTimeCodeModule } from '@/graphql/one-time-code/one-time-code.module';

import { AuthService } from './auth.service';

@Module({
  imports: [
    EasyconfigModule,
    CryptoModule,
    PrismaModule,
    AccountModule,
    AccountSessionModule,
    OneTimeCodeModule,
    EmailModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthResolver],
})
export class AuthModule {}