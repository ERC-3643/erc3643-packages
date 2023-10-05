import { ContractInterface, Signer, Contract } from 'ethers';
import { Provider } from "@ethersproject/abstract-provider";
import { Service } from 'typedi';

@Service()
export class BaseContract {

  public connect = (
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: Signer | Provider
  ) => {
    return new Contract(
      addressOrName,
      contractInterface,
      signerOrProvider
    );
  }
}