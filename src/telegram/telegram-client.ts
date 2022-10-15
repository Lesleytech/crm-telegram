import { Api, TelegramClient as BaseTelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { Logger } from '@nestjs/common';
import { AddContactDto } from './dto';

interface TelegramClientParams {
  onNewMessage: (event: NewMessageEvent) => void;
  onError: (err: Error) => void | Promise<boolean>;
}

const storeSession = new StoreSession('telegram_session');
const apiId = 16249610;
const apiHash = '98e661530af83ef0a3fef35ff2d92689';

class TelegramClient extends BaseTelegramClient {
  private readonly clientLogger = new Logger(TelegramClient.name);
  private newMessageHandler: TelegramClientParams['onNewMessage'];

  constructor() {
    super(storeSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    this.init();
  }

  private async init() {
    try {
      await this.connect();

      /* A high level request must be called in order for events to work */
      await this.getMe();

      this.addEventHandler((event) => {
        this.newMessageHandler?.(event);
      }, new NewMessage({ incoming: true, outgoing: true }));

      this.clientLogger.log('Telegram client connected successfully');
    } catch (err) {
      this.clientLogger.log(`Telegram client connection error: ${err.message}`);
    }
  }

  set onNewMessage(func: TelegramClientParams['onNewMessage']) {
    this.newMessageHandler = func;
  }

  sendVerificationCode(
    phone: string,
  ): Promise<{ phoneCodeHash: string; isCodeViaApp: boolean }> {
    return this.sendCode({ apiHash, apiId }, phone);
  }

  signIn(
    phone: string,
    code: string,
    { onError }: { onError: TelegramClientParams['onError'] },
  ) {
    return this.signInUser(
      { apiHash, apiId },
      {
        phoneNumber: phone,
        phoneCode: () => Promise.resolve(code),
        onError,
      },
    );
  }

  async addNewContact(contact: AddContactDto) {
    const newContact = new Api.InputPhoneContact({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      clientId: 0 as any,
    });

    await this.invoke(
      new Api.contacts.ImportContacts({ contacts: [newContact] }),
    );
  }

  async logout() {
    await this.invoke(new Api.auth.LogOut());
  }
}

const telegramClient = new TelegramClient();

export default telegramClient;
