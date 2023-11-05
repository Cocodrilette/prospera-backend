import { Injectable } from '@nestjs/common';
import { UnsafeOperationAdapter } from './adapter/unsafe-operation.adapter';
import { HashAdapter } from './adapter/hash.adapter';

@Injectable()
export class CommonService {
  _hashAdapter: HashAdapter;
  _unsafeOperationsAdapter: UnsafeOperationAdapter;

  get unsafeOperations() {
    const unsafeOperationsAdapter = this._getUnsafeOperationsAdapter();

    return {
      executeOrCatch: unsafeOperationsAdapter.executeOrCatch,
    };
  }

  get crypto() {
    const hashAdapter = this._getHashAdapter();

    return {
      hash: hashAdapter.hash,
      compare: hashAdapter.compare,
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
}
