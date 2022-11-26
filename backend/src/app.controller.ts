import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


export class claimTokensDTO {
  address: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }



  @Get("get-token-contract-address")
  getTokenContractAddress(): any {
    return this.appService.getTokenContractAddress();
  }

  @Get("claim-tokens")
  claimTokens(@Body body: claimTokensDTO) {
    return this.appService.claimTokens(body.address);
  }
}
