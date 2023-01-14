import { Api, TelegramClient as BaseTelegramClient } from 'telegram';
import { StoreSession, StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { Logger } from '@nestjs/common';
import { AddContactDto } from './dto';

interface TelegramClientParams {
  onNewMessage: (event: NewMessageEvent) => void;
  onError: (err: Error) => void | Promise<boolean>;
}

const stringSession = new StoreSession('telegram_session');
const apiId = 24310903;
const apiHash = '4ab50d35b83c0d4e900fc1839b1627e5';

class TelegramClient extends BaseTelegramClient {
  private readonly clientLogger = new Logger(TelegramClient.name);
  private newMessageHandler: TelegramClientParams['onNewMessage'];

  constructor() {
    super(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    this.init();
  }

  private async init() {
    try {
      await this.connect();

      /* A high level request must be called in order for events to work */
      // await this.getDialogs();

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

  async sendVerificationCode(
    phone: string,
  ): Promise<{ phoneCodeHash: string; isCodeViaApp: boolean }> {
    const res = await this.sendCode({ apiHash, apiId }, phone);

    console.log('DEBUG: SendVerificationCode', res);

    return res;
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

    return this.invoke(new Api.users.GetFullUser({ id: newContact.phone }));
  }

  async logout() {
    await this.invoke(new Api.auth.LogOut());
  }
}

const telegramClient = new TelegramClient();

export default telegramClient;

const telegramInstances = [
  {
    accountId: 'someuuuid',
    instance: telegramClient,
  },
];
