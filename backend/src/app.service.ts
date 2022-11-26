import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const TOKEN_CONTRACT_ADDRESS = "0x284a7042be8749c1b3a35509f27ebb09c2737956";
const BALLOT_CONTRACT_ADDRESS = "0xEe69666C8670D4C1C632D1d34eba1b803C218479"


@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  tokenContract: ethers.Contract;

  // initialized service with common variables used through functions
  constructor(private configService: ConfigService) {
    // use ConfigService when your alchemy key is set up in your .env
    // const alchemyKey = this.configService.get<string>('ALCHEMY_KEY');
    // this.provider = new ethers.providers.AlchemyProvider('goerli', alchemyKey);
    this.provider = ethers.getDefaultProvider('goerli');

    // TODO: build a signer object
    // TODO: build a token contract object connected to the signer
  }

  getTokenContractAddress() {
    return { result: TOKEN_CONTRACT_ADDRESS };
  }
  
  async claimTokens(address: string) {
    // create function from token.mint(address) 
    // await the tx
    return { result: `Tx hash for minting tokens to ${address}` };
  }
}
