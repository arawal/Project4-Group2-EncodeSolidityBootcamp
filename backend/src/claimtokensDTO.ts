export class claimTokensDTO {
    // request voting tokens form API passing my address
    address: string;
    constructor(address: string) {
      this.address = address;
    }
  }