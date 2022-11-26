export class claimTokensDTO {
    // request voting tokens form API passing my address, open-ended part, put in separate file
    address: string;
    // amount: number;
    // signature: string;
  
    constructor(address: string) {
      this.address = address;
    }
  }