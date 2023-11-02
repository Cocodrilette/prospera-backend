import { Injectable } from '@nestjs/common';
import { UnsafeOperationAdapter } from './adapter/unsafe-operation.adapter';

@Injectable()
export class CommonService {
  get unsafeOperations() {
    const unsafeOperationsAdapter = new UnsafeOperationAdapter();

    return {
      executeOrCatch: unsafeOperationsAdapter.executeOrCatch,
    };
  }
}
