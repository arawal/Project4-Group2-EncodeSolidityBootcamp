import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json'

const TOKEN_CONTRACT_ADDRESS = "0x284a7042be8749c1b3a35509f27ebb09c2737956";
const BALLOT_CONTRACT_ADDRESS = "0xEe69666C8670D4C1C632D1d34eba1b803C218479"

// the below format is the same as the claimTokensDTO
/**
 export class claimTokensDTO {
  address: string;
  constructor(address: string) {
      this.address = address;
    }
  }
 */
export class claimTokensDTO {
  constructor(public address: string) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // wallet object
  wallet: ethers.Wallet | undefined;

  // provider object connecting to goerli
  provider: ethers.providers.Provider;

  // token contract object
  tokenContract: ethers.Contract | undefined;

  tokenAddress: string | undefined;
  
  ethBalance: number | string | undefined;
  tokenBalance: number | string | undefined;
  votePower: number | string | undefined;

  backendUrl: string | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;

  tokenRequestPending: boolean;

  constructor(private http: HttpClient) {

    // set the provider object
    this.provider = ethers.getDefaultProvider('goerli');

    // set up the token address
    this.tokenAddress = TOKEN_CONTRACT_ADDRESS;

    // set up token contract object instance
    this.tokenContract = new ethers.Contract(
      this.tokenAddress, 
      tokenJson.abi, 
      this.wallet
      );


    this.backendUrl = "http://localhost:3000"
    this.http.get<any>(`${this.backendUrl}/token-address`).subscribe((ans) => {
      this.tokenContractAddress = ans.result;
    })
    this.tokenRequestPending = false;
  }


  createWallet() {
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    
    if (this.tokenAddress) {
      this.tokenContract = new ethers.Contract(
        this.tokenAddress, 
        tokenJson.abi, 
        this.wallet
      );
    }
    
    this.updateValues();
  }

  updateValues() {
    [this.ethBalance, this.tokenBalance, this.votePower] = [
      'loading...',
      'loading...',
      'loading...'
    ];
    this.wallet?.getBalance().then((balance) => {
      this.ethBalance = parseFloat(ethers.utils.formatEther(balance));
      if (this.tokenContract) {
        this.tokenContract['balanceOf'](this.wallet?.address).then(
          (balanceBN: ethers.BigNumberish) => {
            this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
          }
        );
        this.tokenContract['getVotes'](this.wallet?.address).then(
        (votePowerBN: ethers.BigNumberish) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votePowerBN));
          }
        );
      }
    });
  }
  
  importWallet(privateKey: string) {
    // TODO (optional): make this.wallet to be imported from a privateKey
    this.updateValues();
  }

  connectBallotContract(address: string) {
    // TODO: create ballot contract instance to this address
    // TODO: fetch information of that ballot to be displayed in the page
    this.ballotContractAddress = address;
  }

  requestTokensHundred() {
    // TODO: request 10 tokens to be minted in the backend
    const body = new claimTokensDTO(this.wallet?.address ?? '');
    this.http.post<any>(`${this.backendUrl}/claim-tokens`, body).subscribe((ans) => {
      const txHash = ans.result;
      // const tx = this.provider.getTransaction(txHash);
      // tx.wait()
      // after tx confirms, call updateValues(), or display more things on the page
      console.log(ans);
    })

    this.tokenRequestPending = true;
  }

  requestTokens(amount: string) {
    this.tokenRequestPending = true;
  }

  
}
