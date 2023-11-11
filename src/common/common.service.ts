import { Injectable } from '@nestjs/common';
import { UnsafeOperationAdapter } from './adapter/unsafe-operation.adapter';
import { HashAdapter } from './adapter/hash.adapter';
import { CryptoAdapter } from './adapter/crypto.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  _hashAdapter: HashAdapter;
  _unsafeOperationsAdapter: UnsafeOperationAdapter;
  _cryptoAdapter: CryptoAdapter;

  constructor(private readonly configService: ConfigService) {}

  get unsafeOperations() {
    const unsafeOperationsAdapter = this._getUnsafeOperationsAdapter();

    return {
      executeOrCatch: unsafeOperationsAdapter.executeOrCatch,
    };
  }

  get crypto() {
    const hashAdapter = this._getHashAdapter();
    const cryptoAdapter = this._getCryptoAdapter();

    return {
      hash: hashAdapter.hash,
      compare: hashAdapter.compare,
      cryptoAdapter,
    };
  }

  private _getHashAdapter() {
    if (!this._hashAdapter) {
      this._hashAdapter = new HashAdapter();
    }

    return this._hashAdapter;
  }

  private _getUnsafeOperationsAdapter() {
    if (!this._unsafeOperationsAdapter) {
      this._unsafeOperationsAdapter = new UnsafeOperationAdapter();
    }

    return this._unsafeOperationsAdapter;
  }

  private async _getCryptoAdapter() {
    await ConfigModule.envVariablesLoaded;

    if (!this._cryptoAdapter) {
      this._cryptoAdapter = new CryptoAdapter(
        this.configService.get<string>('enviroment.signKey'),
      );
    }

    return this._cryptoAdapter;
  }
}
