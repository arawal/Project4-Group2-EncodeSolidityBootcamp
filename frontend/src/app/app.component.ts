import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json'

const TOKEN_CONTRACT_ADDRESS = "0x284a7042be8749c1b3a35509f27ebb09c2737956";

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
    errorMsg: string | undefined;

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
        this.http.get<any>(`${this.backendUrl}/get-token-contract-address`).subscribe((ans) => {
            this.tokenContractAddress = ans.result;
        })
        this.tokenRequestPending = false;
    }

    setTokenContract(){
        if(this.tokenAddress){
            this.tokenContract = new ethers.Contract(this.tokenAddress, tokenJson.abi, this.wallet); 
        }
    }

    createWallet() {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        if (this.tokenAddress) {
            this.setTokenContract();
            this.updateValues();
        }
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

    importWallet(secret: string, importMethod: string){
        if(importMethod=='mnemonic'){
            this.wallet = ethers.Wallet.fromMnemonic(secret ?? "").connect(this.provider);;
        }else{
            this.wallet = new ethers.Wallet(secret ?? "").connect(this.provider);
        }
        if(this.wallet.address.length == 42){
            this.setTokenContract();
            this.updateValues();
        }else{
            this.errorMsg = 'Could not import wallet, invalid mnumonic or private key';
            console.log(this.errorMsg);
            alert(this.errorMsg); 
        }
    }

    connectBallotContract(address: string) {
    // TODO: create ballot contract instance to this address
    // TODO: fetch information of that ballot to be displayed in the page
    this.ballotContractAddress = address;
    }

    requestTokensTen() {
        // TODO: request 10 tokens to be minted in the backend
        this.tokenRequestPending = true;
    }

    requestTokens(amount: string) {
        this.tokenRequestPending = true;
    }

    delegateTokens(to: string){
        console.log(`you are delegating tokens to ${to}`);
        if(this.tokenContract){
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['delegate'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }    

    transferTokens(to: string, amount: number | string){
        console.log(`you are delegating ${amount} tokens to ${to}`);
        if(this.tokenContract){
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['transfer'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }    

    connectWallet(){
    }

    disconnectWallet() {
        this.wallet = undefined;
    }
}
