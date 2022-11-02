import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { YearnContractFactory, YearnStakedYCrv } from '../contracts';

@PositionTemplate()
export class EthereumYearnStakedYCrvTokenTokenFetcher extends AppTokenTemplatePositionFetcher<YearnStakedYCrv> {
  groupLabel = 'Staked yCRV';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnStakedYCrv {
    return this.contractFactory.yearnStakedYCrv({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return ['0x27b5739e22ad9033bcbf192059122d163b60349d'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<YearnStakedYCrv>) {
    return contract.token();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<YearnStakedYCrv>): Promise<number> {
    const pricePerShareRaw = await contract.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return pricePerShare;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<YearnStakedYCrv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<YearnStakedYCrv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}