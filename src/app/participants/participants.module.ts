import { Logger, Module, Global } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { Participants } from '@app/models/participants.schema';
import { ParticipantsSchema } from '@app/models/participants.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ParticipantsService } from './participants.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Participants.name, schema: ParticipantsSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, Logger],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
